import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, updateProfile } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import type { City, Doctor, Specialty } from '@/data/mock';
import { auth, db } from '@/lib/firebase';

export type Role = 'mother' | 'specialist';
export type Stage = 'Expecting' | 'New mom';
export type YesNo = 'yes' | 'no';

/** Everything a mother tells us during sign-up; fields for the other stage stay undefined. */
export type MotherDetails = {
  stage: Stage;
  week?: number;
  dueDate?: string;
  firstPregnancy?: YesNo;
  carrying?: 'one' | 'twins';
  conditions?: string[];
  postpartumWeeks?: number;
  delivery?: 'normal' | 'csection';
  feeding?: 'breast' | 'formula' | 'both';
  firstBaby?: YesNo;
  needs: string[];
};

/** The public listing a specialist publishes; this is what mothers see in the doctor directory. */
export type SpecialistDetails = {
  fullName: string;
  specialty: Specialty;
  city: City;
  hospital: string;
  years: number;
  fee: string;
  pmdc: string;
  credentials: string;
  bio: string;
};

export type Account = { uid: string; role: Role; fullName: string; email: string; myDoctorId?: string } & Partial<MotherDetails>;

const need = <T>(v: T | undefined): T => {
  if (!v) throw new Error('Firebase is not configured');
  return v;
};

export async function registerMother(email: string, password: string, fullName: string, details: MotherDetails): Promise<Account> {
  const cred = await createUserWithEmailAndPassword(need(auth), email, password);
  await updateProfile(cred.user, { displayName: fullName });
  const account: Account = { uid: cred.user.uid, role: 'mother', fullName, email, ...details };
  await setDoc(doc(need(db), 'users', cred.user.uid), { ...account, createdAt: serverTimestamp() });
  return account;
}

/** The user doc and the public listing are written together; the rules only accept a listing whose owner is a specialist. */
export async function registerSpecialist(email: string, password: string, details: SpecialistDetails): Promise<Account> {
  const cred = await createUserWithEmailAndPassword(need(auth), email, password);
  await updateProfile(cred.user, { displayName: details.fullName });
  const uid = cred.user.uid;
  const account: Account = { uid, role: 'specialist', fullName: details.fullName, email };
  const batch = writeBatch(need(db));
  batch.set(doc(need(db), 'users', uid), { ...account, createdAt: serverTimestamp() });
  batch.set(doc(need(db), 'specialists', uid), { ...details, uid, createdAt: serverTimestamp() });
  await batch.commit();
  return account;
}

export async function signInWithEmail(email: string, password: string): Promise<Account> {
  const cred = await signInWithEmailAndPassword(need(auth), email, password);
  const snap = await getDoc(doc(need(db), 'users', cred.user.uid));
  const data = snap.data() as Account | undefined;
  return data ?? { uid: cred.user.uid, role: 'mother', fullName: cred.user.displayName ?? '', email };
}

export const signOutFirebase = () => (auth ? fbSignOut(auth) : Promise.resolve());

export const saveMyDoctor = (uid: string, myDoctorId: string | null) => updateDoc(doc(need(db), 'users', uid), { myDoctorId });

/** Live list of every registered specialist; returns the unsubscribe function. */
export function subscribeSpecialists(onChange: (list: Doctor[]) => void, onError?: (e: Error) => void) {
  return onSnapshot(
    collection(need(db), 'specialists'),
    (snap) => onChange(snap.docs.map((d) => specialistToDoctor(d.id, d.data() as SpecialistDetails))),
    onError,
  );
}

const initialsOf = (name: string) =>
  name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Specialists type their profile in one language, so it reads the same in English and Urdu. */
export function specialistToDoctor(id: string, s: SpecialistDetails): Doctor {
  const same = (v: string) => ({ en: v, ur: v });
  // Only medical specialties get an automatic "Dr."; psychologists and yoga teachers keep the name they gave.
  const medical = s.specialty === 'Gynecologist' || s.specialty === 'Pediatrician';
  const name = /^dr\.?\s/i.test(s.fullName) || !medical ? s.fullName : `Dr. ${s.fullName}`;
  return {
    id,
    name: same(name),
    initials: same(initialsOf(s.fullName)),
    hospital: same(s.hospital),
    city: s.city,
    specialty: s.specialty,
    years: s.years,
    fee: s.fee,
    rating: 'New',
    reviews: 0,
    credentials: same([s.credentials, s.pmdc && `PMDC ${s.pmdc}`].filter(Boolean).join(' • ')),
    next: { en: 'Book to see times', ur: 'وقت دیکھنے کے لیے بُک کریں' },
    bio: same(s.bio),
    tone: 'sage',
  };
}

export async function getSpecialist(uid: string) {
  const snap = await getDoc(doc(need(db), 'specialists', uid));
  return snap.exists() ? (snap.data() as SpecialistDetails) : null;
}

export const updateSpecialist = (uid: string, details: SpecialistDetails) =>
  updateDoc(doc(need(db), 'specialists', uid), { ...details, uid, updatedAt: serverTimestamp() });

/* ------------------------------------------------------------ appointments */

export type AppointmentStatus = 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled';

/** A booking request. The mother's stage is copied in so the doctor sees where she is without reading her private profile. */
export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  motherId: string;
  motherName: string;
  motherStage: Stage;
  motherWeek?: number;
  postpartumWeeks?: number;
  conditions?: string[];
  day: string;
  time: string;
  mode: 'online' | 'clinic';
  reason: string;
  status: AppointmentStatus;
  createdAt: number;
};

export type AppointmentDraft = Omit<Appointment, 'id' | 'status' | 'createdAt'>;

export async function bookAppointment(draft: AppointmentDraft) {
  const ref = await addDoc(collection(need(db), 'appointments'), { ...draft, status: 'pending', createdAt: Date.now() });
  return ref.id;
}

export const setAppointmentStatus = (id: string, status: AppointmentStatus) => updateDoc(doc(need(db), 'appointments', id), { status });

/** Live list of the appointments this account is part of, newest first. */
export function subscribeAppointments(uid: string, role: Role, onChange: (list: Appointment[]) => void, onError?: (e: Error) => void) {
  const q = query(collection(need(db), 'appointments'), where(role === 'specialist' ? 'doctorId' : 'motherId', '==', uid));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ ...(d.data() as Omit<Appointment, 'id'>), id: d.id })).sort((a, b) => b.createdAt - a.createdAt)),
    onError,
  );
}

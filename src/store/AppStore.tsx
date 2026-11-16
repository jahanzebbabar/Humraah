import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  doctors,
  initialCare,
  initialContacts,
  initialPlanner,
  initialSupplements,
  type CareTask,
  type Contact,
  type Doctor,
  type PlannerItem,
  type Supplement,
} from '@/data/mock';
import type { Loc } from '@/i18n';
import {
  bookAppointment as bookRemote,
  saveMyDoctor,
  setAppointmentStatus as setStatusRemote,
  signOutFirebase,
  specialistToDoctor,
  subscribeAppointments,
  subscribeSpecialists,
  updateSpecialist,
  type Appointment,
  type AppointmentDraft,
  type AppointmentStatus,
  type MotherDetails,
  type Role,
  type SpecialistDetails,
  type Stage,
} from '@/lib/accounts';
import { firebaseReady } from '@/lib/firebase';

type User = Omit<MotherDetails, 'stage' | 'week' | 'needs'> & {
  uid?: string;
  role: Role;
  firstName: Loc;
  fullName: Loc;
  email: string;
  week: number;
  stage: Stage;
  needs: string[];
  nickname: Loc;
  myDoctorId?: string;
};

type PlannerDraft = Omit<PlannerItem, 'id' | 'done' | 'title'> & { id?: string; title: string };

type Store = {
  user: User;
  updateUser: (patch: Partial<User>) => void;
  signedIn: boolean;
  signIn: (patch?: Partial<User>) => void;
  signOut: () => void;
  kicks: number;
  addKick: () => void;
  care: CareTask[];
  toggleCare: (id: string) => void;
  planner: PlannerItem[];
  togglePlanner: (id: string) => void;
  removePlanner: (id: string) => void;
  restorePlanner: () => void;
  savePlanner: (draft: PlannerDraft) => void;
  contacts: Contact[];
  addContact: (name: string, phone: string) => void;
  removeContact: (id: string) => void;
  readNotifications: string[];
  markRead: (ids: string[]) => void;
  supplements: Supplement[];
  toggleSupplement: (id: string) => void;
  /** Only doctors who registered as specialists through the app. */
  specialists: Doctor[];
  addLocalSpecialist: (doctor: Doctor) => void;
  setMyDoctor: (id: string | null) => void;
  /** Bookings this account is part of: a mother's own, or every request sent to a specialist. */
  appointments: Appointment[];
  bookAppointment: (draft: AppointmentDraft) => Promise<void>;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  /** A specialist's own editable listing. */
  myListing: SpecialistDetails | null;
  setMyListing: (listing: SpecialistDetails | null) => void;
  saveListing: (listing: SpecialistDetails) => Promise<void>;
};

const AppStoreContext = createContext<Store | null>(null);

/** A name typed by the user is the same in both languages. */
export const same = (s: string): Loc => ({ en: s, ur: s });

const defaultUser: User = {
  firstName: { en: 'Maryam', ur: 'مریم' },
  fullName: { en: 'Maryam Khan', ur: 'مریم خان' },
  email: 'maryam@humraah.pk',
  role: 'mother',
  week: 32,
  stage: 'Expecting',
  needs: [],
  nickname: { en: 'Chotu', ur: 'چھوٹو' },
};

const tones = ['lavender', 'mint', 'sage', 'sky', 'peach'] as const;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(defaultUser);
  const [signedIn, setSignedIn] = useState(false);
  const [kicks, setKicks] = useState(7);
  const [care, setCare] = useState(initialCare);
  const [planner, setPlanner] = useState(initialPlanner);
  const [lastRemoved, setLastRemoved] = useState<{ item: PlannerItem; index: number } | null>(null);
  const [contacts, setContacts] = useState(initialContacts);
  const [readNotifications, setRead] = useState<string[]>([]);
  const [supplements, setSupplements] = useState(initialSupplements);
  // Without Firebase keys the sample doctors stand in for registered specialists, and new sign-ups join them in memory.
  const [specialists, setSpecialists] = useState<Doctor[]>(firebaseReady ? [] : doctors);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [myListing, setMyListing] = useState<SpecialistDetails | null>(null);

  useEffect(() => {
    if (!firebaseReady || !signedIn || !user.uid) return;
    return subscribeAppointments(user.uid, user.role, setAppointments, (e) => console.warn('[appointments]', e.message));
  }, [signedIn, user.uid, user.role]);

  useEffect(() => {
    if (!firebaseReady || !signedIn) return;
    return subscribeSpecialists(setSpecialists, (e) => console.warn('[specialists]', e.message));
  }, [signedIn]);

  const updateUser = useCallback((patch: Partial<User>) => setUser((u) => ({ ...u, ...patch })), []);
  const signIn = useCallback((patch?: Partial<User>) => {
    if (patch) setUser((u) => ({ ...u, ...patch }));
    setSignedIn(true);
  }, []);
  const signOut = useCallback(() => {
    setSignedIn(false);
    setAppointments([]);
    setMyListing(null);
    signOutFirebase().catch(() => {});
  }, []);
  const addKick = useCallback(() => setKicks((k) => k + 1), []);
  const toggleCare = useCallback(
    (id: string) => setCare((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [],
  );
  const togglePlanner = useCallback(
    (id: string) => setPlanner((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [],
  );
  const removePlanner = useCallback(
    (id: string) => {
      const index = planner.findIndex((t) => t.id === id);
      if (index < 0) return;
      setLastRemoved({ item: planner[index], index });
      setPlanner((list) => list.filter((t) => t.id !== id));
    },
    [planner],
  );
  const restorePlanner = useCallback(() => {
    if (!lastRemoved) return;
    setPlanner((list) => [...list.slice(0, lastRemoved.index), lastRemoved.item, ...list.slice(lastRemoved.index)]);
    setLastRemoved(null);
  }, [lastRemoved]);
  const savePlanner = useCallback(({ id, title, ...fields }: PlannerDraft) => {
    setPlanner((list) =>
      id
        ? list.map((t) =>
            t.id === id ? { ...t, ...fields, title: t.title.en === title || t.title.ur === title ? t.title : same(title) } : t,
          )
        : [{ id: `p${Date.now()}`, done: false, title: same(title), ...fields }, ...list],
    );
  }, []);
  const addContact = useCallback((name: string, phone: string) => {
    setContacts((list) => [...list, { id: `k${Date.now()}`, name: same(name), phone, tone: tones[list.length % tones.length] }]);
  }, []);
  const removeContact = useCallback((id: string) => setContacts((list) => list.filter((c) => c.id !== id)), []);
  const markRead = useCallback((ids: string[]) => setRead((r) => [...new Set([...r, ...ids])]), []);
  const toggleSupplement = useCallback(
    (id: string) => setSupplements((list) => list.map((s) => (s.id === id ? { ...s, taken: !s.taken } : s))),
    [],
  );
  const addLocalSpecialist = useCallback((doctor: Doctor) => setSpecialists((list) => [doctor, ...list.filter((d) => d.id !== doctor.id)]), []);
  const setMyDoctor = useCallback(
    (id: string | null) => {
      setUser((u) => ({ ...u, myDoctorId: id ?? undefined }));
      if (firebaseReady && user.uid) saveMyDoctor(user.uid, id).catch((e) => console.warn('[my doctor]', e.message));
    },
    [user.uid],
  );

  const bookAppointment = useCallback(async (draft: AppointmentDraft) => {
    if (firebaseReady) await bookRemote(draft);
    // Firestore streams the booking back in; demo mode keeps it in memory so the specialist side can be tried too.
    else setAppointments((list) => [{ ...draft, id: `a${Date.now()}`, status: 'pending', createdAt: Date.now() }, ...list]);
  }, []);
  const setAppointmentStatus = useCallback(async (id: string, status: AppointmentStatus) => {
    if (firebaseReady) await setStatusRemote(id, status);
    else setAppointments((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);
  const saveListing = useCallback(
    async (listing: SpecialistDetails) => {
      if (!user.uid) return;
      if (firebaseReady) await updateSpecialist(user.uid, listing);
      else setSpecialists((list) => list.map((d) => (d.id === user.uid ? specialistToDoctor(user.uid!, listing) : d)));
      setMyListing(listing);
      setUser((u) => ({ ...u, fullName: same(listing.fullName), firstName: same(listing.fullName.split(' ')[0]) }));
    },
    [user.uid],
  );

  const value = useMemo(
    () => ({
      user,
      updateUser,
      signedIn,
      signIn,
      signOut,
      kicks,
      addKick,
      care,
      toggleCare,
      planner,
      togglePlanner,
      removePlanner,
      restorePlanner,
      savePlanner,
      contacts,
      addContact,
      removeContact,
      readNotifications,
      markRead,
      supplements,
      toggleSupplement,
      specialists,
      addLocalSpecialist,
      setMyDoctor,
      appointments,
      bookAppointment,
      setAppointmentStatus,
      myListing,
      setMyListing,
      saveListing,
    }),
    [user, updateUser, signedIn, signIn, signOut, kicks, addKick, care, toggleCare, planner, togglePlanner, removePlanner, restorePlanner, savePlanner, contacts, addContact, removeContact, readNotifications, markRead, supplements, toggleSupplement, specialists, addLocalSpecialist, setMyDoctor, appointments, bookAppointment, setAppointmentStatus, myListing, saveListing],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider');
  return ctx;
}

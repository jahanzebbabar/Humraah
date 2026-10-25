import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  initialCare,
  initialContacts,
  initialPlanner,
  initialSupplements,
  type CareTask,
  type Contact,
  type PlannerItem,
  type Supplement,
} from '@/data/mock';
import type { Loc } from '@/i18n';

type User = { firstName: Loc; fullName: Loc; email: string; week: number; stage: string; nickname: Loc };

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
};

const AppStoreContext = createContext<Store | null>(null);

/** A name typed by the user is the same in both languages. */
export const same = (s: string): Loc => ({ en: s, ur: s });

const defaultUser: User = {
  firstName: { en: 'Maryam', ur: 'مریم' },
  fullName: { en: 'Maryam Khan', ur: 'مریم خان' },
  email: 'maryam@humraah.pk',
  week: 32,
  stage: 'Expecting',
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

  const updateUser = useCallback((patch: Partial<User>) => setUser((u) => ({ ...u, ...patch })), []);
  const signIn = useCallback((patch?: Partial<User>) => {
    if (patch) setUser((u) => ({ ...u, ...patch }));
    setSignedIn(true);
  }, []);
  const signOut = useCallback(() => setSignedIn(false), []);
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
    }),
    [user, updateUser, signedIn, signIn, signOut, kicks, addKick, care, toggleCare, planner, togglePlanner, removePlanner, restorePlanner, savePlanner, contacts, addContact, removeContact, readNotifications, markRead, supplements, toggleSupplement],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider');
  return ctx;
}

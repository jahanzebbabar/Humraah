import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, ur, type StringKey } from './strings';

export type Lang = 'en' | 'ur';
/** A piece of content that exists in both languages. */
export type Loc = { en: string; ur: string };

const STORAGE_KEY = 'humraah.language';
const tables = { en, ur } as const;

type I18n = {
  lang: Lang;
  isRTL: boolean;
  ready: boolean;
  setLang: (lang: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
  /** Pick the current language from a bilingual value. */
  L: (value: Loc) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'ur') setLangState(saved);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const value = useMemo<I18n>(() => {
    const table = tables[lang];
    return {
      lang,
      isRTL: lang === 'ur',
      ready,
      setLang,
      t: (key, vars) => {
        let s = table[key] ?? en[key];
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
        return s;
      },
      L: (v) => v[lang],
    };
  }, [lang, ready, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
  return ctx;
}

export type { StringKey };

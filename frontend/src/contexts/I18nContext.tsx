import { createContext, useContext, useState, type ReactNode } from 'react';
import fr, { type TranslationKeys } from '@/i18n/fr';
import en from '@/i18n/en';

type Locale = 'fr' | 'en';

const translations: Record<Locale, Record<TranslationKeys, string>> = { fr, en };

interface I18nContextValue {
  locale: Locale;
  t: (key: TranslationKeys) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    return saved === 'en' ? 'en' : 'fr';
  });

  const t = (key: TranslationKeys) => translations[locale][key] ?? key;

  const toggleLocale = () => {
    setLocale((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('locale', next);
      return next;
    });
  };

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

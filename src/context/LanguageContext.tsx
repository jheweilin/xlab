"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Locale, translations, TranslationKey } from "@/lib/i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationValue = string | ((...args: any[]) => string);

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => TranslationValue;
  /** Pick localized field from a data object. e.g. localized(product, "name") returns nameEn or name */
  localized: (obj: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("xlab-locale") as Locale | null;
    if (saved && (saved === "zh" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("xlab-locale", newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey): TranslationValue => translations[locale][key] as TranslationValue,
    [locale]
  );

  const localized = useCallback(
    (obj: any, field: string): string => {
      if (!obj) return "";
      if (locale === "en") {
        const enField = field + "En";
        if (obj[enField]) return obj[enField];
      }
      return obj[field] || "";
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, localized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

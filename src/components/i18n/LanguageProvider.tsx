"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  Language,
  translations,
} from "@/data/translations";

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("en");

  useEffect(() => {
    const saved =
      localStorage.getItem("gram-udyam-language");

    if (
      saved === "en" ||
      saved === "hi" ||
      saved === "mr"
    ) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "gram-udyam-language",
      language
    );

    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: TranslationKey) => {
    return (
      translations[language][key] ??
      translations.en[key] ??
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
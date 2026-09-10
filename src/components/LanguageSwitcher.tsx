"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "./i18n/LanguageProvider";
import type { Language } from "@/data/translations";

const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: "en", label: "EN", nativeName: "English" },
  { code: "hi", label: "हिंदी", nativeName: "हिंदी" },
  { code: "mr", label: "मराठी", nativeName: "मराठी" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/90 p-1 text-xs shadow-xs"
      role="group"
      aria-label={t("language")}
    >
      <div className="flex items-center pl-1.5 pr-0.5 text-slate-500" title={t("language")}>
        <Globe size={14} />
      </div>
      {LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`rounded-lg px-2.5 py-1.5 font-semibold transition-all duration-150 ${
              isActive
                ? "bg-white text-slate-950 shadow-xs font-bold ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
            aria-pressed={isActive}
            title={lang.nativeName}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
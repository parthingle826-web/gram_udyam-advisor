"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg relative">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold text-emerald-600"
          >
            Gram Udyam Advisor
          </Link>

          <h1 className="mt-8 text-2xl font-bold text-slate-900">
            {t("welcomeBack")}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {t("loginSubtitle")}
          </p>
        </div>

        <div className="mt-8">
          <label className="text-sm font-medium text-slate-800">
            {t("mobileNumber")}
          </label>

          <input
            type="tel"
            placeholder={t("enterMobilePlaceholder")}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button className="mt-5 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 transition">
            {t("sendOtp")}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          {t("authDisclaimer")}
        </p>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:underline inline-flex items-center gap-1"
          >
            ← {t("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
"use client";

import Navbar from "@/components/Navbar";
import AssessmentForm from "@/components/AssessmentForm";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function AssessmentPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles size={14} />
            {t("assessmentStepBadge")}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {t("assessmentPageTitle")}
          </h1>

          <p className="mt-2 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t("assessmentPageSubtitle")}
          </p>
        </div>

        <AssessmentForm />
      </main>
    </div>
  );
}
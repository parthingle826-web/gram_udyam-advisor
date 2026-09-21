"use client";

import Link from "next/link";
import {
  Brain,
  Calculator,
  MapPin,
  ShieldCheck,
  Languages,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/50 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <Brain size={18} />
            {t("heroBadge")}
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-6xl text-slate-900 dark:text-white">
            {t("heroTitle")}
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {t("startAssessment")}
              <TrendingUp size={21} />
            </Link>
          </div>
        </div>
      </section>

      
      <section className="bg-slate-50 dark:bg-slate-900/60 px-6 py-20 border-y border-slate-100 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t("features")}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {t("featuresSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              icon={<Brain />}
              title={t("aiAdvisor")}
              text={t("aiAdvisorDesc")}
            />

            <Feature
              icon={<Calculator />}
              title={t("financialPlanning")}
              text={t("financialPlanningDesc")}
            />

            <Feature
              icon={<MapPin />}
              title={t("marketInsights")}
              text={t("marketInsightsDesc")}
            />

            <Feature
              icon={<Languages />}
              title={t("language")}
              text={t("multilingualDesc")}
            />

            <Feature
              icon={<ShieldCheck />}
              title={t("responsibleAi")}
              text={t("responsibleAiDesc")}
            />

            <Feature
              icon={<TrendingUp />}
              title={t("actionPlanTitle")}
              text={t("actionPlanDesc")}
            />
          </div>
        </div>
      </section>

     
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
            {t("howItWorks")}
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <Step
              number="01"
              title={t("step1Title")}
              text={t("step1Desc")}
            />

            <Step
              number="02"
              title={t("step2Title")}
              text={t("step2Desc")}
            />

            <Step
              number="03"
              title={t("step3Title")}
              text={t("step3Desc")}
            />

            <Step
              number="04"
              title={t("step4Title")}
              text={t("step4Desc")}
            />
          </div>
        </div>
      </section>

     
      <section className="bg-emerald-600 dark:bg-emerald-700 px-6 py-20 text-center text-white">
        <h2 className="text-3xl font-bold">
          {t("ctaTitle")}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-emerald-50 dark:text-emerald-100">
          {t("ctaSubtitle")}
        </p>

        <Link
          href="/assessment"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
        >
          {t("startAssessment")}
        </Link>
      </section>


      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Gram Udyam Advisor</p>
        <p className="mt-1">
          {t("footerTagline")}
        </p>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>

      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 font-bold text-white shadow">
        {number}
      </div>

      <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}
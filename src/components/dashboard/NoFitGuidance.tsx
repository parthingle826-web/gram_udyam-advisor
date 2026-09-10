"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Download, Check, HelpCircle, Sparkles } from "lucide-react";
import type { SchemeAlternative } from "@/lib/finance/scheme-router";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface NoFitGuidanceProps {
  title?: string;
  reason: string;
  guidance: string[];
  alternatives?: SchemeAlternative[];
  projectCost?: number;
  isZeroData?: boolean;
}

export default function NoFitGuidance({
  title,
  reason,
  guidance,
  alternatives = [],
  projectCost,
  isZeroData = false,
}: NoFitGuidanceProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const displayTitle = title || t("noFitTitle");

  function handleExportGuidance() {
    const lines = [
      "==================================================",
      "GRAM UDYAM ADVISOR — NO-FIT ACTIONABLE GUIDANCE",
      "==================================================",
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      projectCost ? `Estimated Project Cost: ₹${projectCost.toLocaleString("en-IN")}` : "",
      "",
      "1. PRIMARY REASON:",
      reason,
      "",
      "2. STRATEGIC GUIDANCE:",
      ...guidance.map((g, i) => `  ${i + 1}. ${g}`),
      "",
      alternatives.length > 0 ? "3. CONCRETE ALTERNATIVE PATHWAYS:" : "",
      ...alternatives.map(
        (alt, i) =>
          `  [${i + 1}] ${alt.title}\n      Details: ${alt.description}\n      Action: ${alt.action}\n`
      ),
      "==================================================",
      "Verify final eligibility with your local Gram Panchayat,",
      "Block Development Officer (BDO), or District Industries Centre (DIC).",
      "==================================================",
    ].filter(Boolean);

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Gram_Udyam_NoFit_Guidance.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    const summary = [
      `Gram Udyam Guidance:`,
      `Reason: ${reason}`,
      `Key Steps:`,
      ...guidance.map((g) => `- ${g}`),
    ].join("\n");

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            {isZeroData ? <HelpCircle size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                {t("fallbackEngineBadge")}
              </span>
              <span className="text-xs text-amber-800">Module 3</span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {displayTitle}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Sparkles size={14} />}
            {copied ? t("copied") : t("copyAdvice")}
          </button>

          <button
            type="button"
            onClick={handleExportGuidance}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-950"
          >
            <Download size={14} />
            {t("exportGuidance")}
          </button>
        </div>
      </div>

      {/* Primary Reason */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
          {t("whyNoFitTitle")}
        </p>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-800">
          {reason}
        </p>
      </div>

      {/* Guidance Points */}
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
          {t("practicalRecommendations")}
        </p>
        <ul className="mt-2 space-y-2">
          {guidance.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Concrete Alternative Pathways */}
      {alternatives.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
            {t("alternativePathwaysTitle")}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-xl border border-amber-200/70 bg-white p-4 transition hover:border-amber-400 hover:shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{alt.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {alt.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-xs font-semibold text-amber-800">
                  <ArrowRight size={13} className="shrink-0 text-amber-600" />
                  <span>{alt.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

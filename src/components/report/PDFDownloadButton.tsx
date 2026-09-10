"use client";

import React, { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BusinessReportPDF, {
  BusinessReportData,
} from "./BusinessReportPDF";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface PDFDownloadButtonProps {
  data: BusinessReportData;
  fileName?: string;
}

export default function PDFDownloadButton({
  data,
  fileName = "gram-udyam-business-report",
}: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white opacity-60"
      >
        <Loader2 size={18} className="animate-spin" />
        {t("preparingPdf")}
      </button>
    );
  }

  const safeFileName = `${(data.assessment.businessName || fileName)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")}-report.pdf`;

  return (
    <PDFDownloadLink
      document={<BusinessReportPDF data={data} language={language} />}
      fileName={safeFileName}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
    >
      {({ loading }) => (
        <>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {t("generatingPdf")}
            </>
          ) : (
            <>
              <Download size={18} />
              {t("downloadOfficialPdf")}
            </>
          )}
        </>
      )}
    </PDFDownloadLink>
  );
}

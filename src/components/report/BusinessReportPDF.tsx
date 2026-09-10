import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { BusinessAssessment } from "@/types/business";
import type { RepaymentQuarter } from "@/lib/finance/schedule";
import type { ViabilityFactorBreakdown } from "@/lib/viability/score";
import type { Language } from "@/data/translations";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
    borderBottomStyle: "solid",
    paddingBottom: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6366f1",
    marginTop: 2,
    fontFamily: "Helvetica-Bold",
  },
  dateText: {
    fontSize: 9,
    color: "#64748b",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderBottomStyle: "solid",
    textTransform: "uppercase",
  },
  gridTwo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  gridCol: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  subValue: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: "#e0e7ff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#3730a3",
  },
  scoreSub: {
    fontSize: 9,
    color: "#4338ca",
    fontFamily: "Helvetica-Bold",
  },
  table: {
    width: "100%",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    borderBottomStyle: "solid",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  colQ: { width: "12%", fontSize: 8, fontFamily: "Helvetica-Bold" },
  colNum: { width: "22%", textAlign: "right", fontSize: 8 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    borderTopStyle: "solid",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
  disclaimerBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fef3c7",
    borderStyle: "solid",
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  disclaimerText: {
    fontSize: 8,
    color: "#92400e",
    lineHeight: 1.3,
  },
});

function formatINR(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return "₹0";
  return "₹" + Math.round(val).toLocaleString("en-IN");
}

export interface BusinessReportData {
  assessment: Partial<BusinessAssessment>;
  viability: {
    score: number;
    rating: string;
    recommendation: string;
    factors?: ViabilityFactorBreakdown;
  };
  finance: {
    projectCost: number;
    loanAmount: number;
    marginCapital?: number;
    monthlyEMI: number;
    scheme: {
      name: string;
      interestRate: number;
      tenureYears: number;
      moratoriumMonths: number;
      suitable: boolean;
      description?: string;
    };
  };
  schedule?: RepaymentQuarter[];
  aiAdvisory?: {
    recommendation?: string;
    headline?: string;
    summary?: string;
    keyReasons?: string[];
    actions?: string[];
  };
}

export default function BusinessReportPDF({
  data,
  language = "en",
}: {
  data: BusinessReportData;
  language?: Language;
}) {
  const { assessment, viability, finance, schedule, aiAdvisory } = data;
  const scheduleRows = (schedule || []).slice(0, 12); // First 12 quarters fits nicely

  const locationStr = [
    assessment.village,
    assessment.block,
    assessment.district,
    assessment.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document title={`${assessment.businessName || "Business"} Report - Gram Udyam`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Gram Udyam Advisor</Text>
            <Text style={styles.headerSubtitle}>
              Micro-Enterprise Viability & Financial Advisory
            </Text>
          </View>
          <Text style={styles.dateText}>
            Generated: {new Date().toLocaleDateString("en-IN")}
          </Text>
        </View>

        {/* Enterprise Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Enterprise Profile</Text>
          <View style={styles.gridTwo}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Business Name</Text>
              <Text style={styles.value}>
                {assessment.businessName || "Proposed Business"}
              </Text>
              <Text style={styles.subValue}>Category: {assessment.category || "General"}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{locationStr || "Rural cluster"}</Text>
              <Text style={styles.subValue}>
                Founder Experience: {assessment.experienceYears ?? 1} yr(s) | Premises:{" "}
                {assessment.hasLandOrShop ? "Ready" : "To be arranged"}
              </Text>
            </View>
          </View>
        </View>

        {/* Viability & Pillars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Viability Score & 5 Pillars</Text>
          <View style={styles.gridTwo}>
            <View style={[styles.gridCol, { flex: 0.8, alignItems: "center", justifyContent: "center" }]}>
              <Text style={styles.scoreText}>{viability.score} / 100</Text>
              <Text style={styles.scoreSub}>{viability.rating} VIABILITY</Text>
            </View>
            <View style={[styles.gridCol, { flex: 1.2 }]}>
              <Text style={styles.label}>Assessment Summary</Text>
              <Text style={{ fontSize: 9, color: "#334155" }}>
                {viability.recommendation || "Feasibility calculated across local market factors."}
              </Text>
            </View>
          </View>

          {viability.factors && (
            <View style={[styles.gridTwo, { marginTop: 4 }]}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Market Saturation & Demand (20%)</Text>
                <Text style={styles.value}>
                  {viability.factors.marketSaturation.score}/100 ({viability.factors.marketSaturation.rating})
                </Text>
                <Text style={styles.subValue}>{viability.factors.marketSaturation.description}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Competitor Density (20%)</Text>
                <Text style={styles.value}>
                  {viability.factors.competitorDensity.score}/100 ({viability.factors.competitorDensity.rating})
                </Text>
                <Text style={styles.subValue}>{viability.factors.competitorDensity.description}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Financial Structure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Financing Structure & Scheme Terms</Text>
          <View style={styles.gridTwo}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Total Project Cost</Text>
              <Text style={styles.value}>{formatINR(finance.projectCost)}</Text>
              <Text style={styles.subValue}>
                Margin Money: {formatINR(finance.marginCapital ?? finance.projectCost - finance.loanAmount)}
              </Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Loan Requirement & EMI</Text>
              <Text style={styles.value}>{formatINR(finance.loanAmount)}</Text>
              <Text style={styles.subValue}>Monthly EMI: ~{formatINR(finance.monthlyEMI)}</Text>
            </View>
          </View>

          <View style={styles.gridTwo}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Recommended Scheme</Text>
              <Text style={styles.value}>{finance.scheme.name}</Text>
              <Text style={styles.subValue}>
                Interest: {finance.scheme.interestRate}% p.a. | Tenure: {finance.scheme.tenureYears} yrs | Moratorium:{" "}
                {finance.scheme.moratoriumMonths} mos
              </Text>
            </View>
          </View>
        </View>

        {/* Repayment Schedule Table */}
        {scheduleRows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Quarter-by-Quarter Amortization (Years 1-3)</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colQ}>Quarter</Text>
                <Text style={styles.colNum}>Opening</Text>
                <Text style={styles.colNum}>Principal</Text>
                <Text style={styles.colNum}>Interest</Text>
                <Text style={styles.colNum}>Closing</Text>
              </View>
              {scheduleRows.map((q) => (
                <View key={q.quarter} style={styles.tableRow}>
                  <Text style={styles.colQ}>Q{q.quarter}</Text>
                  <Text style={styles.colNum}>{formatINR(q.openingPrincipal)}</Text>
                  <Text style={styles.colNum}>{formatINR(q.principalPaid)}</Text>
                  <Text style={styles.colNum}>{formatINR(q.interestPaid)}</Text>
                  <Text style={styles.colNum}>{formatINR(q.closingPrincipal)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Guidance */}
        {aiAdvisory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Strategic Guidance & Recommended Actions</Text>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 4 }}>
              {aiAdvisory.headline || "Action Plan"}
            </Text>
            {aiAdvisory.summary && (
              <Text style={{ fontSize: 8.5, color: "#475569", marginBottom: 6 }}>
                {aiAdvisory.summary}
              </Text>
            )}
            {aiAdvisory.actions && aiAdvisory.actions.length > 0 && (
              <View style={{ marginTop: 4 }}>
                {aiAdvisory.actions.slice(0, 3).map((act, i) => (
                  <Text key={i} style={{ fontSize: 8, color: "#334155", marginBottom: 2 }}>
                    • {act}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Notice: Gram Udyam Advisor provides advisory and decision-support estimates. Actual bank interest rates,
            subsidy limits, and loan approvals are determined by the lending bank and government nodal agencies.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gram Udyam Advisor — Rural Business Feasibility System</Text>
          <Text>Confidential — For Entrepreneur & Banking Guidance</Text>
        </View>
      </Page>
    </Document>
  );
}

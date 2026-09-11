# 🌾 Gram Udyam Advisor

**AI-driven hyper-local business advisory and financial structuring assistant for rural micro-entrepreneurs.**

🔗 **Live Demo:** [gram-udyam-advisor-bggiokqbl-parthingle826-2567s-projects.vercel.app](https://gram-udyam-advisor-bggiokqbl-parthingle826-2567s-projects.vercel.app/)

Gram Udyam Advisor helps first-time rural entrepreneurs applying for government concessional-credit schemes (margin-money model) make data-backed business decisions — instead of relying on anecdotal success stories and guesswork. It combines a hyper-local market feasibility engine, a deterministic loan/scheme calculator, and a guided fallback path so no user is ever left without an answer.

Built for **SIH 2026** and the **AI for Sustainability (1M1B × IBM)** internship program.

---

## 🎯 Problem Statement

Rural entrepreneurs receiving concessional credit (10% beneficiary margin / 90% agency loan under Micro Finance & Term Loan schemes) frequently choose business activities based on anecdotal success rather than data, and struggle to calculate their exact capital eligibility, applicable scheme, and repayment obligations. There is no accessible tool that democratizes institutional-grade business consulting for this audience.

## ✅ Solution

An NLP-powered, multilingual AI Business Advisory Assistant that takes three simple inputs — **location, available margin capital, and business category** — and returns a complete feasibility study and financial structuring plan before the user applies for funding.

---

## ✨ Features

### 📊 Module 1 — Hyper-Local Business Feasibility Report
- Market reach estimation within a 5–10km radius
- Opportunity analysis for underserved niches
- Budget-tier-specific SWOT analysis
- Local threat identification (supply chain, seasonality, buyer concentration)
- Competitor density mapping via PostGIS radius queries
- Localized pricing guidance based on regional purchasing power
- Interactive OpenStreetMap/Leaflet catchment map with filterable competitor, supplier, market, and bank/govt-office pins across 2/5/10km rings

### 💰 Module 2 — Smart Financial Calculator & Scheme Router
- Deterministic Project Cost and Max Loan Amount calculation (Margin Capital ÷ 10%)
- Automatic scheme routing:
  | Project Cost | Scheme | Interest | Tenure | Moratorium |
  |---|---|---|---|---|
  | ≤ ₹1.40 lakh | Micro Finance Scheme | 6.5% p.a. | 3 years | 3 months |
  | ₹1.40 lakh – ₹50 lakh | Term Loan Scheme | 8% p.a. | 7 years | 6 months |
- Full quarter-by-quarter repayment schedule with correct moratorium handling
- Viability score (0–100) with a visible, explainable factor breakdown
- Downloadable PDF business feasibility & financial report

### 🧭 Module 3 — No-Fit Guidance Engine
Ensures the assistant never leaves a user without a response — if the project cost falls outside scheme limits or local data is unavailable, the user still receives a clear reason, a concrete alternative path, and exportable guidance.

### 🌐 Multilingual
Full UI, form validation, AI-generated report content, and PDF export available in English and Hindi (generated natively per language, not machine-translated after the fact).

### 🔐 Auth
OTP-based mobile number login.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes / Server Actions |
| Database | Supabase (PostgreSQL) with PostGIS |
| Maps & Geocoding | Leaflet + OpenStreetMap, Nominatim (with village → block → district fallback) |
| AI / LLM | IBM watsonx.ai (Granite model) — primary; OpenAI API — fallback, behind a shared provider interface |
| Auth | Supabase Auth (OTP / mobile) |
| PDF Export | React PDF |
| i18n | next-intl |
| Testing | Vitest / Jest (unit), Playwright (end-to-end) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Live App
Try it here: **https://gram-udyam-advisor-bggiokqbl-parthingle826-2567s-projects.vercel.app/**

### Prerequisites
- Node.js 18+
- A Supabase project (with PostGIS extension enabled)
- IBM watsonx.ai API credentials (and/or an OpenAI API key)

### Installation

```bash
git clone https://github.com/parthingle826-web/gram_udyam-advisor
cd gram-udyam-advisor
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider
AI_PROVIDER=watsonx        # or "openai"
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=
OPENAI_API_KEY=

# Geocoding
NOMINATIM_USER_AGENT="GramUdyamAdvisor/1.0 (contact@example.com)"
```

### Database Setup

```bash
npx supabase db push
```

This applies the migrations for `users`, `assessments`, `scheme_results`, `repayment_schedule`, `local_businesses`, `feasibility_reports`, and `geocode_cache`, and enables the PostGIS extension.

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Run Tests

```bash
npm run test        # unit tests (financial calculator)
npm run test:e2e    # Playwright end-to-end flow
```

---

## 📁 Project Structure

```
gram-udyam-advisor/
├── app/                    # Next.js App Router pages & API routes
│   ├── (assessment)/       # Intake form flow
│   ├── (results)/          # Feasibility report + repayment schedule
│   └── api/                # geocoding, AI provider, PDF export routes
├── components/             # UI components (form, map, report, tables)
├── lib/
│   ├── calculator/         # deterministic financial & scheme logic
│   ├── ai/                 # watsonx / OpenAI provider abstraction
│   └── geocoding/          # Nominatim client + fallback ladder
├── supabase/
│   └── migrations/         # DB schema incl. PostGIS setup
├── messages/                # i18n translation files (en, hi)
└── tests/
```

---

## 🌍 SDG Alignment

| SDG | How the project contributes |
|---|---|
| **SDG 1 — No Poverty** | Directly supports margin-money credit beneficiaries in building viable livelihoods |
| **SDG 8 — Decent Work & Economic Growth** | Enables formal, sustainable micro-enterprise creation in rural economies |
| **SDG 9 — Industry, Innovation & Infrastructure** | Brings AI-driven advisory infrastructure to underserved geographies |
| **SDG 10 — Reduced Inequalities** | Closes the institutional advisory gap between rural and urban entrepreneurs |

---

## 🤖 IBM Tool Usage

The core feasibility report — market reach, opportunity analysis, SWOT, and pricing guidance — is generated using **IBM watsonx.ai with a Granite foundation model**, selected via the `AI_PROVIDER` environment variable. An OpenAI-based provider is included behind the same interface as a fallback.

---

## 📄 License

This project is submitted for SIH 2026 and the 1M1B × IBM AI for Sustainability internship program. License TBD — add one (e.g. MIT) before public release if applicable.


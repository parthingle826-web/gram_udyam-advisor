# 🌾 Gram Udyam Advisor

**AI-driven hyper-local business advisory and financial structuring assistant for rural micro-entrepreneurs.**

🔗 **Live Demo:** [gram-udyam-advisor.vercel.app](https://gram-udyam-advisor.vercel.app/)

Gram Udyam Advisor helps first-time rural entrepreneurs applying for government concessional-credit schemes (margin-money model) make data-backed business decisions — instead of relying on anecdotal success stories and guesswork. It combines a hyper-local market feasibility engine, a deterministic loan/scheme calculator, an AI advisory chat agent, and a guided fallback path so no user is ever left without an answer.

Built for **SIH 2026** and the **AI for Sustainability (1M1B × IBM)** internship program.

---

## 🎯 Problem Statement

Rural entrepreneurs receiving concessional credit (10% beneficiary margin / 90% agency loan under Micro Finance & Term Loan schemes) frequently choose business activities based on anecdotal success rather than data, and struggle to calculate their exact capital eligibility, applicable scheme, and repayment obligations. There is no accessible tool that democratizes institutional-grade business consulting for this audience.

## ✅ Solution

An NLP-powered, multilingual AI Business Advisory Assistant that takes an applicant's personal and business details — **age, location, available margin capital, and business category** — and returns a complete feasibility study, financial structuring plan, and a conversational AI advisor to answer follow-up questions, before the user applies for funding.

---

## ✨ Features

### 📊 Module 1 — Hyper-Local Business Feasibility Report
- Market reach estimation within a 5–10km radius
- Opportunity analysis for underserved niches
- Budget-tier-specific SWOT analysis
- Local threat identification (supply chain, seasonality, buyer concentration)
- Competitor density mapping via PostGIS radius queries
- Localized pricing guidance based on regional purchasing power
- Interactive OpenStreetMap/Leaflet catchment map with filterable competitor, supplier, market, and bank/govt-office pins across 2/5/10km rings, driven by live geocoding of the applicant's entered location

### 💰 Module 2 — Smart Financial Calculator & Scheme Router
- Deterministic Project Cost and Max Loan Amount calculation (Margin Capital ÷ 10%)
- Automatic scheme routing, freely derived from the applicant's entered capital — no manual scheme selection:
  | Project Cost | Scheme | Interest | Tenure | Moratorium |
  |---|---|---|---|---|
  | ≤ ₹1.40 lakh | Micro Finance Scheme | 6.5% p.a. | 3 years | 3 months |
  | ₹1.40 lakh – ₹50 lakh | Term Loan Scheme | 8% p.a. | 7 years | 6 months |
- Full quarter-by-quarter repayment schedule with correct moratorium handling
- Viability score (0–100) with a visible, explainable factor breakdown (market saturation, competitor density, income-to-EMI ratio, seasonality risk, founder experience)
- Downloadable PDF business feasibility & financial report

### 🧭 Module 3 — No-Fit Guidance Engine
Ensures the assistant never leaves a user without a response — if the project cost falls outside scheme limits, the applicant doesn't meet age eligibility, or local data is unavailable, the user still receives a clear reason, a concrete alternative path, and exportable guidance.

### 🔞 Age Eligibility Check
Applicants must be 18 or older to independently apply, consistent with real-world margin-money credit scheme rules. Applicants above a configurable upper age threshold are routed to the No-Fit Guidance Engine with a note that upper limits vary by lending agency. Education qualification is intentionally **not** collected — eligibility is age-based, not education-based.

### 💬 Conversational AI Advisor
A two-way, multi-turn chat agent grounded in the applicant's own assessment data (location, category, scheme, viability score breakdown, EMI, etc.), so users can ask follow-up questions like *"why is my viability score only this much?"* or *"explain my loan scheme & monthly EMI"* and get specific, grounded answers rather than generic responses. Supports typed input as well as microphone dictation into the chat box (Web Speech API), and responds in the applicant's selected language.

### 🌐 Multilingual
Full UI, form validation, AI-generated report content, the conversational advisor, and PDF export available in **English, Hindi, and Marathi**, generated natively per language rather than machine-translated after the fact.

### 🌗 Dark / Light Mode
Theme toggle with persisted preference, respecting system preference by default.

### 🔐 Auth & History
OTP-based mobile number login. Logged-in users' assessments are stored against their profile, with a Dashboard and History view to revisit past feasibility reports.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes / Server Actions |
| Database | Supabase (PostgreSQL) with PostGIS, Row Level Security |
| Maps & Geocoding | Leaflet + OpenStreetMap, Nominatim (with village → block → district fallback) |
| AI / LLM | IBM watsonx.ai (Granite model) — primary; OpenAI API — fallback, behind a shared provider interface. Powers the feasibility report generation and the conversational AI advisor |
| Voice Input | Web Speech API (SpeechRecognition) for dictating into the chat advisor |
| Auth | Supabase Auth (OTP / mobile) |
| PDF Export | React PDF |
| i18n | next-intl (English, Hindi, Marathi) |
| Testing | Vitest / Jest (unit), Playwright (end-to-end) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Live App
Try it here: **https://gram-udyam-advisor.vercel.app/**

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

This applies the migrations for `users`, `assessments` (incl. `age` and `address`), `scheme_results`, `repayment_schedule`, `local_businesses`, `feasibility_reports`, `geocode_cache`, and `chat_messages`, and enables the PostGIS extension.

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Run Tests

```bash
npm run test
npm run test:e2e
```

---

## 📁 Project Structure

```
gram-udyam-advisor/
├── app/                    # Next.js App Router pages & API routes
│   ├── (assessment)/       # Intake form flow
│   ├── (results)/          # Feasibility report + repayment schedule + AI chat advisor
│   ├── (dashboard)/        # Dashboard & assessment history
│   └── api/                # geocoding, AI provider, chat, PDF export routes
├── components/             # UI components (form, map, report, tables, chat, theme toggle)
├── lib/
│   ├── calculator/         # deterministic financial & scheme logic
│   ├── ai/                 # watsonx / OpenAI provider abstraction (report + chat agent)
│   ├── geocoding/          # Nominatim client + fallback ladder
│   └── eligibility/        # age eligibility rules
├── supabase/
│   └── migrations/         # DB schema incl. PostGIS setup, RLS policies
├── messages/                # i18n translation files (en, hi, mr)
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

**IBM watsonx.ai with a Granite foundation model** powers two core AI elements of the app:
1. The feasibility report generation — market reach, opportunity analysis, SWOT, and pricing guidance
2. The conversational AI Advisor — grounded, multi-turn answers to applicant follow-up questions, using the applicant's own assessment data as context

Both are selected via the shared `AI_PROVIDER` environment variable, with an OpenAI-based provider included behind the same interface as a fallback.

---

## 📄 License

This project is submitted for SIH 2026 and the 1M1B × IBM AI for Sustainability internship program. License TBD — add one (e.g. MIT) before public release if applicable.
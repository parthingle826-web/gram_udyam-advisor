import { GoogleGenAI } from "@google/genai";
import { callWatsonxText } from "./ibm";
import { callOpenAIChatText } from "./openai";
import type { SupportedLanguage } from "@/lib/utils/constants";
import { formatCurrency } from "@/lib/utils/currency";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatContext {
  assessment: any;
  result: any;
}

export interface GenerateChatResponseParams {
  messages: ChatMessage[];
  context: ChatContext;
  language?: SupportedLanguage | string;
}

export interface ChatResponse {
  message: string;
  provider: "watsonx" | "openai" | "gemini" | "deterministic";
}

/**
 * Builds the comprehensive grounded system prompt containing all user, financial,
 * viability, and market data.
 */
function buildGroundedSystemPrompt(
  context: ChatContext,
  language: SupportedLanguage
): string {
  const { assessment = {}, result = {} } = context;
  const finance = result.finance || {};
  const viability = result.viability || {};
  const scheme = finance.scheme || {};

  const rawFactors = viability.factors || {};
  const factorsList = Array.isArray(rawFactors)
    ? rawFactors
    : Object.values(rawFactors);

  const factorsSummary = factorsList
    .map(
      (f: any) =>
        `- ${f.label || f.name || "Viability Pillar"}: ${f.score ?? 0}/100${
          f.weight !== undefined ? ` (Weight: ${Math.round(f.weight * 100)}%)` : ""
        } — ${f.description || ""}`
    )
    .join("\n");

  const projectCost =
    finance.projectCost ||
    (assessment.marginCapital ? assessment.marginCapital * 10 : 0);
  const loanAmount =
    finance.loanAmount ||
    (projectCost > 0 ? projectCost * 0.9 : 0);
  const marginCapital =
    finance.marginCapital ||
    assessment.marginCapital ||
    (projectCost > 0 ? projectCost * 0.1 : 0);
  const monthlyEMI = finance.monthlyEMI || 0;
  const schemeName =
    scheme.name ||
    (projectCost > 140000 ? "Term Loan Scheme" : "Micro Finance Scheme");

  const langInstruction =
    language === "hi"
      ? "You MUST respond entirely in Hindi (हिंदी, Devanagari script). Even if the user asks in English or Romanized Hindi (Hinglish), your response must be in clear, respectful, natural Hindi."
      : language === "mr"
      ? "You MUST respond entirely in Marathi (मराठी, Devanagari script). Even if the user asks in English or Romanized Marathi, your response must be in clear, respectful, natural Marathi."
      : "You MUST respond entirely in clear, professional, accessible English.";

  return `You are Gram Udyam AI Advisor (ग्राम उद्यम एआई सलाहकार), a pragmatic and supportive rural enterprise mentor in India.
Your mission is to help the user understand their Business Feasibility Report, loan scheme eligibility, viability score, and actionable next steps.

LANGUAGE INSTRUCTION:
${langInstruction}

CURRENT APPLICANT & BUSINESS PROFILE (Grounded Truth):
- Applicant Name: ${assessment.fullName || "Entrepreneur"}
- Applicant Age: ${assessment.age || "Not specified"} years
- Location: Village: ${assessment.village || "Rural"}, Block: ${
    assessment.block || "Local"
  }, District: ${assessment.district || "District"}, State: ${
    assessment.state || "State"
  }
- Business Name: ${assessment.businessName || "Proposed Enterprise"}
- Business Category: ${assessment.category || "Rural Enterprise"}
- Prior Experience: ${assessment.experienceYears || 0} years
- Has Shop/Land: ${assessment.hasLandOrShop ? "Yes" : "No"}

DETERMINISTIC FINANCIAL FORMULA & SCHEME DETAILS:
- Available Margin Capital (Borrower Equity): ${formatCurrency(marginCapital)}
- Total Project Cost: ${formatCurrency(
    projectCost
  )} (calculated deterministically as Margin Capital ÷ 0.10)
- Auto-Derived Loan Amount (90%): ${formatCurrency(loanAmount)}
- Derived Scheme Name: ${schemeName}
- Interest Rate: ${scheme.interestRate || 6.5}% p.a.
- Loan Tenure: ${scheme.tenureYears || 3} years
- Moratorium Period: ${scheme.moratoriumMonths || 3} months
- Estimated Monthly Installment (EMI): ~${formatCurrency(monthlyEMI)} / month
- Scheme Reason: ${
    scheme.reason ||
    "Auto-selected based strictly on project cost and 10% margin requirement."
  }

VIABILITY EVALUATION & FACTORS:
- Overall Viability Score: ${viability.score || 70} / 100 (${
    viability.rating || "MEDIUM"
  } Viability)
- Viability Recommendation: ${
    viability.recommendation || "Feasible with prudent local marketing."
  }
- Overall Decision: ${result.decision || "FEASIBLE"}
- Detailed Score Factors:
${factorsSummary || "Factors evaluated based on local demand and costs."}

GUARDRAILS & BOUNDARIES:
1. Ground your answers strictly in the figures above. Do NOT contradict the Project Cost (${formatCurrency(
    projectCost
  )}), Loan Amount (${formatCurrency(
    loanAmount
  )}), or Scheme (${schemeName}).
2. Do NOT invent new subsidy schemes, bank grants, or promise assured loan sanctions. Always clarify that bank sanctions require credit appraisal by the local branch manager.
3. If the user asks how to improve a low score, focus on: increasing equity, reducing seasonal dependence, identifying local bulk buyers, and leveraging existing land/shop.
4. Keep responses structured, concise (2 to 4 short paragraphs or bulleted recommendations), and easy to read for a rural entrepreneur.`;
}

/**
 * Intelligent deterministic offline fallback engine that generates grounded responses
 * in English, Hindi, or Marathi based on user queries and assessment metrics.
 */
function generateDeterministicChatResponse(
  params: GenerateChatResponseParams
): string {
  const { messages, context, language = "en" } = params;
  const lastUserMsg = (
    messages.filter((m) => m.role === "user").pop()?.content || ""
  ).toLowerCase();

  const { assessment = {}, result = {} } = context;
  const finance = result.finance || {};
  const viability = result.viability || {};
  const scheme = finance.scheme || {};
  const score = viability.score || 70;
  const projectCostStr = formatCurrency(finance.projectCost || 0);
  const loanStr = formatCurrency(finance.loanAmount || 0);
  const marginStr = formatCurrency(
    finance.marginCapital || assessment.marginCapital || 0
  );
  const emiStr = formatCurrency(finance.monthlyEMI || 0);
  const businessName = assessment.businessName || "your business";
  const category = assessment.category || "enterprise";
  const schemeName = scheme.name || "Micro Finance Scheme";

  const isViabilityQuestion =
    lastUserMsg.includes("score") ||
    lastUserMsg.includes("viability") ||
    lastUserMsg.includes("कम") ||
    lastUserMsg.includes("स्कोर") ||
    lastUserMsg.includes("गुण") ||
    lastUserMsg.includes("why");

  const isLoanOrSchemeQuestion =
    lastUserMsg.includes("scheme") ||
    lastUserMsg.includes("loan") ||
    lastUserMsg.includes("emi") ||
    lastUserMsg.includes("interest") ||
    lastUserMsg.includes("ब्याज") ||
    lastUserMsg.includes("ऋण") ||
    lastUserMsg.includes("कर्ज") ||
    lastUserMsg.includes("योजना");

  const isRiskOrCompetitionQuestion =
    lastUserMsg.includes("risk") ||
    lastUserMsg.includes("competition") ||
    lastUserMsg.includes("competitor") ||
    lastUserMsg.includes("जोखिम") ||
    lastUserMsg.includes("स्पर्धा") ||
    lastUserMsg.includes("मार्केट");

  const isBankQuestion =
    lastUserMsg.includes("document") ||
    lastUserMsg.includes("bank") ||
    lastUserMsg.includes("branch") ||
    lastUserMsg.includes("दस्तावेज़") ||
    lastUserMsg.includes("दस्तावेज") ||
    lastUserMsg.includes("कागदपत्रे") ||
    lastUserMsg.includes("कागदपत्र") ||
    lastUserMsg.includes("बँक") ||
    lastUserMsg.includes("बैंक");

  // HINDI RESPONSES
  if (language === "hi") {
    if (isViabilityQuestion) {
      return `आपके व्यवसाय **${businessName}** का व्यवहार्यता स्कोर **${score}/100** है। 

यह स्कोर 5 मुख्य कारकों पर आधारित है:
1. **स्थानीय बाजार मांग और प्रतिस्पर्धा:** आपके गाँव/ब्लॉक में ${category} की वर्तमान मांग और स्थानीय दुकानों की संख्या।
2. **ऋण पुनर्भुगतान क्षमता (DSCR):** परियोजना लागत (${projectCostStr}) के सापेक्ष अपेक्षित मासिक लाभ और ईएमआई (${emiStr}) का अनुपात।
3. **मौसमी जोखिम और अनुभव:** कृषि/त्योहार चक्रों का प्रभाव और आपका पूर्व अनुभव (${assessment.experienceYears || 0} वर्ष)।

**स्कोर सुधारने के सुझाव:**
- अपनी प्रारंभिक मार्जिन पूंजी (${marginStr}) को थोड़ा बढ़ाएं जिससे ऋण भार कम हो।
- स्थानीय ग्राहकों और स्वयं सहायता समूहों (SHG) के साथ पूर्व-आदेश अनुबंध करें।`;
    }

    if (isLoanOrSchemeQuestion) {
      return `आपकी उपलब्ध मार्जिन पूंजी **${marginStr}** के आधार पर, स्वचालित वित्तीय फॉर्मूले (मार्जिन पूंजी ÷ 0.10) के अनुसार आपकी कुल परियोजना लागत **${projectCostStr}** निर्धारित हुई है।

इसके तहत आपको **${schemeName}** की अनुशंसा की गई है:
- **अधिकतम ऋण राशि (90%):** ${loanStr}
- **ब्याज दर:** ${scheme.interestRate || 6.5}% वार्षिक (रियायती)
- **ऋण अवधि:** ${scheme.tenureYears || 3} वर्ष (${scheme.moratoriumMonths || 3} महीने की छूट/मोरेटोरियम के साथ)
- **अनुमानित मासिक EMI:** लगभग ${emiStr} प्रति माह

बैंक शाखा प्रबंधक को आवेदन देते समय अपनी विस्तृत 'व्यावसायिक व्यवहार्यता रिपोर्ट' (PDF) संलग्न करें।`;
    }

    if (isRiskOrCompetitionQuestion) {
      return `**${businessName} (${category})** के लिए जोखिम नियंत्रण रणनीतियाँ:

1. **प्रतिस्पर्धा प्रबंधन:** अपने निकटतम प्रतिस्पर्धियों की तुलना में बेहतर गुणवत्ता, उचित मूल्य और घर-पहुंच या उधारी नियंत्रण पर ध्यान दें।
2. **कार्यशील पूंजी सुरक्षा:** कम से कम 2 महीने के परिचालन खर्च का आरक्षित कोष अलग रखें।
3. **मौसमी उतार-चढ़ाव:** मंदी के महीनों में वैकल्पिक पूरक उत्पादों या सेवाओं की योजना बनाएं।`;
    }

    if (isBankQuestion) {
      return `**बैंक शाखा आवेदन के लिए आवश्यक दस्तावेज़ चेकलिस्ट:**

1. **पहचान और पता प्रमाण:** आधार कार्ड, पैन कार्ड, वोटर आईडी अथवा निवास प्रमाण पत्र।
2. **ग्राम उद्यम व्यवहार्यता रिपोर्ट:** इस पोर्टल से डाउनलोड की गई PDF रिपोर्ट।
3. **कार्यस्थल का प्रमाण:** दुकान/जमीन का 7/12 उतारा, किरायानामा अथवा ग्राम पंचायत एनओसी।
4. **वित्तीय विवरण:** पिछले 6 महीने का बैंक पासबुक/स्टेटमेंट एवं मशीनरी/उपकरणों का कोटेशन।
5. **मार्जिन पूंजी प्रमाण:** आपके बैंक खाते में उपलब्ध मार्जिन राशि (${marginStr}) का विवरण।`;
    }

    return `नमस्ते! मैं आपका **ग्राम उद्यम एआई सलाहकार** हूँ। 

आपकी योजना **${businessName}** के लिए कुल लागत **${projectCostStr}** और अनुशंसित ऋण **${loanStr}** (${schemeName}) है। आपका व्यवहार्यता स्कोर **${score}/100** है।

आप मुझसे निम्नलिखित के बारे में पूछ सकते हैं:
- व्यवहार्यता स्कोर कैसे बढ़ाया जाए?
- ईएमआई (${emiStr}) और ब्याज शर्तों का विवरण
- स्थानीय बाजार में जोखिम कम करने के उपाय
- बैंक आवेदन के लिए आवश्यक दस्तावेज`;
  }

  // MARATHI RESPONSES
  if (language === "mr") {
    if (isViabilityQuestion) {
      return `तुमच्या **${businessName}** व्यवसायाचा व्यवहार्यता स्कोअर **${score}/100** आहे.

हा स्कोअर खालील घटकांवरून ठरवला गेला आहे:
1. **स्थानिक बाजारपेठेतील मागणी:** तुमच्या गावातील ${category} क्षेत्रातील ग्राहकांची गरज आणि प्रतिस्पर्धी.
2. **कर्ज परतफेड क्षमता:** मासिक उत्पन्न आणि हप्ता (${emiStr}) यांचा ताळमेळ.
3. **हंगामी जोखीम आणि अनुभव:** तुमचा व्यावसायिक अनुभव (${assessment.experienceYears || 0} वर्षे).

**स्कोअर वाढवण्यासाठी उपाय:**
- स्वतःचे मार्जिन भांडवल (${marginStr}) थोडे वाढवा जेणेकरून कर्जावरील व्याजाचा बोजा कमी होईल.
- थेट स्थानिक ग्राहक आणि बचत गटांशी जोडले जा.`;
    }

    if (isLoanOrSchemeQuestion) {
      return `तुमच्याकडील उपलब्ध मार्जिन भांडवल **${marginStr}** च्या आधारे (मार्जिन ÷ 0.10 सूत्रानुसार), एकूण प्रकल्प खर्च **${projectCostStr}** ठरवला गेला आहे.

यासाठी **${schemeName}** ची शिफारस केली आहे:
- **कर्ज रक्कम (90%):** ${loanStr}
- **व्याजदर:** ${scheme.interestRate || 6.5}% वार्षिक
- **मुदत:** ${scheme.tenureYears || 3} वर्षे (${scheme.moratoriumMonths || 3} महिने मोरॅटोरियम)
- **अंदाजे मासिक हप्ता (EMI):** ~${emiStr} / महिना

बँक मंजुरीसाठी तुमच्या अहवालाची (PDF) प्रिंटआउट सोबत ठेवा.`;
    }

    if (isRiskOrCompetitionQuestion) {
      return `**${businessName}** मधील जोखीम व्यवस्थापनासाठी महत्त्वाचे मुद्दे:
1. **स्थानिक स्पर्धा:** शेजारच्या दुकानांपेक्षा दर्जेदार माल आणि वेळेवर सेवा द्या.
2. **खर्च नियंत्रण:** नफा मिळवण्यासोबत दैनंदिन खर्चावर कडक लक्ष ठेवा.
3. **हंगामी बदल:** व्यवसायातील मंदीच्या काळात पूरक उत्पादने विक्रीसाठी ठेवा.`;
    }

    if (isBankQuestion) {
      return `**बँक शाखेत अर्ज करताना आवश्यक कागदपत्रे:**

1. **ओळख आणि पत्त्याचा पुरावा:** आधार कार्ड, पॅन कार्ड, मतदान ओळखपत्र.
2. **ग्राम उद्यम व्यवसाय व्यवहार्यता अहवाल:** डाऊनलोड केलेली अधिकृत PDF प्रत.
3. **जागेचा पुरावा:** जागेचा 7/12 उतारा, भाडेकरार अथवा ग्रामपंचायत ना-हरकत प्रमाणपत्र (NOC).
4. **आर्थिक नोंदी:** मागील 6 महिन्यांचे बँक स्टेटमेंट आणि मशिनरी/मालाचे अधिकृत कोटेशन.
5. **मार्जिन भांडवल पुरावा:** तुमच्या बँक खात्यात उपलब्ध रक्कम (${marginStr}) चा पुरावा.`;
    }

    return `नमस्कार! मी तुमचा **ग्राम उद्यम AI सल्लागार** आहे.

तुमच्या **${businessName}** प्रकल्पाचा एकूण खर्च **${projectCostStr}** असून **${loanStr}** च्या ${schemeName} ची शिफारस करण्यात आली आहे. तुमचा व्यवहार्यता स्कोअर **${score}/100** आहे.

तुम्ही मला विचारू शकता:
- व्यवहार्यता स्कोअर कसा सुधारावा?
- हप्ता (${emiStr}) आणि बँक योजनेच्या अटी
- व्यवसायातील जोखीम कमी करण्याचे मार्ग
- बँकेत जाताना कोणती कागदपत्रे सोबत ठेवावीत?`;
  }

  // ENGLISH RESPONSES (Default)
  if (isViabilityQuestion) {
    return `Your proposed enterprise **${businessName}** has received a Viability Score of **${score}/100** (${viability.rating || "MEDIUM"}).

**Key factors determining this score:**
1. **Market Demand & Competition:** Evaluates local resident density and existing competitor saturation for ${category} in ${assessment.village || "your area"}.
2. **Debt Service Coverage Ratio (DSCR):** The relationship between your projected operating income and the estimated monthly EMI (${emiStr}).
3. **Experience & Asset Availability:** Incorporating your ${assessment.experienceYears || 0} years of sector experience and whether you operate from your own shop/land.

**How to improve your score:**
- Consider increasing your margin equity (${marginStr}) slightly to reduce debt servicing strain.
- Secure advance supplier agreements or village institutional bulk orders prior to launch.`;
  }

  if (isLoanOrSchemeQuestion) {
    return `Based on your available margin capital of **${marginStr}**, the deterministic financial formula (Margin ÷ 0.10) sets your total Project Cost at **${projectCostStr}**.

Under the institutional criteria, you are matched with the **${schemeName}**:
- **Concessional Loan (90%):** ${loanStr}
- **Borrower Margin (10%):** ${marginStr}
- **Interest Rate:** ${scheme.interestRate || 6.5}% p.a.
- **Tenure:** ${scheme.tenureYears || 3} Years (with a ${scheme.moratoriumMonths || 3}-month repayment holiday)
- **Estimated EMI:** ~${emiStr} / month

These figures are pre-configured to meet state channelising agency guidelines. Present this Feasibility PDF at your local bank branch for formal sanction.`;
  }

  if (isRiskOrCompetitionQuestion) {
    return `**Risk & Competition Mitigation for ${businessName}:**

1. **Competitor Differentiation:** Focus on consistent stock availability, transparent digital receipts (UPI), and personalized customer relationships.
2. **Cash Flow Buffer:** Keep at least 45 to 60 days of operating expenses as an emergency reserve before drawing owner profits.
3. **Seasonal Resilience:** If agricultural cycles impact local spending, introduce essential non-perishable goods during lean months.`;
  }

  if (isBankQuestion) {
    return `**Checklist of Documents for Bank Branch Loan Application:**

1. **Identity & Address Verification:** KYC documents (Aadhaar Card, PAN Card, Voter ID).
2. **Gram Udyam Feasibility Report:** Printed copy of your downloaded PDF Business Feasibility & Financial Advisory Report.
3. **Business Premise Documentation:** Property ownership deed / 7/12 extract, registered lease agreement, or Gram Panchayat NOC.
4. **Financial Documents:** Last 6 months bank statement along with pro-forma invoices or quotations for required equipment and initial inventory.
5. **Borrower Equity Evidence:** Proof of available margin capital (${marginStr}) in your savings account.`;
  }

  return `Hello! I am your **Gram Udyam AI Advisor**.

I am grounded in your feasibility assessment for **${businessName}** (${category}) in ${assessment.village || "your village"}. Your project cost is **${projectCostStr}** with an eligible loan of **${loanStr}** under the **${schemeName}**, and an overall Viability Score of **${score}/100**.

Feel free to ask me:
- *"Why is my viability score ${score}/100?"*
- *"Can you explain my ${schemeName} and monthly EMI of ${emiStr}?"*
- *"How can I lower risks against local competitors?"*
- *"What should I prepare before visiting the bank branch?"*`;
}

export { generateDeterministicChatResponse };

/**
 * Main chat completion handler supporting Watsonx (IBM Granite), OpenAI, Gemini,
 * and deterministic grounded fallback.
 */
export async function generateChatResponse(
  params: GenerateChatResponseParams
): Promise<ChatResponse> {
  const preferred = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  const language = (params.language || "en") as SupportedLanguage;

  const systemPrompt = buildGroundedSystemPrompt(params.context, language);

  const formattedMessages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [
    { role: "system", content: systemPrompt },
    ...params.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const fullPromptForTextGen = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${params.messages
    .map(
      (m) => `${m.role === "user" ? "User" : "Gram Udyam Advisor"}: ${m.content}`
    )
    .join("\n")}\n\nGram Udyam Advisor:`;

  const providersToTry: Array<"watsonx" | "openai" | "gemini"> = [];
  if (preferred === "gemini") {
    providersToTry.push("gemini", "watsonx", "openai");
  } else if (preferred === "watsonx") {
    providersToTry.push("watsonx", "gemini", "openai");
  } else if (preferred === "openai") {
    providersToTry.push("openai", "gemini", "watsonx");
  } else {
    providersToTry.push("gemini", "watsonx", "openai");
  }

  for (const prov of providersToTry) {
    try {
      if (prov === "watsonx") {
        if (
          (process.env.WATSONX_API_KEY || process.env.IBM_CLOUD_API_KEY) &&
          process.env.WATSONX_PROJECT_ID
        ) {
          const reply = await callWatsonxText(fullPromptForTextGen);
          if (reply && reply.length > 5) {
            return { message: reply, provider: "watsonx" };
          }
        }
      } else if (prov === "openai") {
        if (process.env.OPENAI_API_KEY) {
          const reply = await callOpenAIChatText(formattedMessages);
          if (reply && reply.length > 5) {
            return { message: reply, provider: "openai" };
          }
        }
      } else if (prov === "gemini") {
        const geminiKey =
          process.env.GEMINI_API_KEY ||
          (process.env.OPENAI_API_KEY?.startsWith("AQ.")
            ? process.env.OPENAI_API_KEY
            : undefined);
        if (geminiKey) {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
          const res = await ai.models.generateContent({
            model,
            contents: fullPromptForTextGen,
            config: { temperature: 0.3 },
          });
          const reply = res.text;
          if (reply && reply.length > 5) {
            return { message: reply.trim(), provider: "gemini" };
          }
        }
      }
    } catch (err) {
      console.warn(`[AI Chat Provider ${prov}] failed:`, err);
    }
  }

  // Graceful deterministic fallback grounded in actual report metrics
  const fallbackMessage = generateDeterministicChatResponse(params);
  return {
    message: fallbackMessage,
    provider: "deterministic",
  };
}

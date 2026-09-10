import { GoogleGenAI } from "@google/genai";
import type { AIAdvisory, AdvisoryRecommendation } from "@/types/advisory";
import type { SupportedLanguage } from "@/lib/utils/constants";
import { buildAdvisoryPrompt } from "./prompts";
import { generateWatsonxAdvisory } from "./ibm";
import { generateOpenAIAdvisory } from "./openai";

export interface GenerateAdvisoryParams {
  assessment: any;
  finance: any;
  market?: any;
  language?: SupportedLanguage | string;
}

export interface AdvisoryResponse {
  advisory: AIAdvisory;
  provider: "watsonx" | "openai" | "gemini" | "deterministic";
}

function cleanArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

function sanitizeAdvisory(parsed: any): AIAdvisory {
  const recommendation: AdvisoryRecommendation = [
    "START",
    "START_SMALL",
    "REVIEW",
    "AVOID",
  ].includes(parsed?.recommendation)
    ? parsed.recommendation
    : "REVIEW";

  const confidence = Math.max(
    0,
    Math.min(100, Math.round(Number(parsed?.confidence) || 70))
  );

  return {
    headline: String(parsed?.headline || "Business Viability Advisory"),
    summary: String(
      parsed?.summary ||
        "Practical business advisory generated for rural enterprise planning."
    ),
    recommendation,
    confidence,
    keyReasons: cleanArray(parsed?.keyReasons),
    actions: cleanArray(parsed?.actions),
    warnings: cleanArray(parsed?.warnings),
    swot: {
      strengths: cleanArray(parsed?.swot?.strengths),
      weaknesses: cleanArray(parsed?.swot?.weaknesses),
      opportunities: cleanArray(parsed?.swot?.opportunities),
      threats: cleanArray(parsed?.swot?.threats),
    },
    pricingInsight: {
      strategy: String(
        parsed?.pricingInsight?.strategy ||
          "Cost-plus pricing with local benchmark alignment"
      ),
      factors: cleanArray(parsed?.pricingInsight?.factors),
    },
    businessPlan: {
      targetCustomers: String(
        parsed?.businessPlan?.targetCustomers ||
          "Local village residents, weekly haat shoppers, and neighboring panchayats"
      ),
      productsOrServices: String(
        parsed?.businessPlan?.productsOrServices ||
          "Standardized, high-demand local goods and services"
      ),
      marketingStrategy: String(
        parsed?.businessPlan?.marketingStrategy ||
          "Word-of-mouth, village WhatsApp groups, and display boards at central panchayat points"
      ),
      operations: String(
        parsed?.businessPlan?.operations ||
          "Direct sourcing from nearby wholesale markets with 15-day inventory buffer"
      ),
    },
  };
}

async function callGemini(prompt: string): Promise<AIAdvisory> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.25,
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text);
}

export function generateDeterministicAdvisory(
  params: GenerateAdvisoryParams
): AIAdvisory {
  const { assessment, finance, market, language = "en" } = params;

  const bName = assessment?.businessName || "Your Enterprise";
  const cat = assessment?.category || "Rural Enterprise";
  const cost = finance?.projectCost || 100000;
  const loan = finance?.loanAmount || 80000;
  const emi = finance?.monthlyEMI || 2500;
  const suitable = finance?.scheme?.suitable !== false;
  const compCount = market?.competitorCount ?? 2;
  const isHindi = language === "hi";
  const isMarathi = language === "mr";

  let rec: AdvisoryRecommendation = "START_SMALL";
  if (suitable && compCount <= 3) {
    rec = "START";
  } else if (!suitable || compCount > 8) {
    rec = "REVIEW";
  }

  if (isHindi) {
    return {
      headline: `${bName} - ग्रामीण उद्यम सलाहकार मार्गदर्शन`,
      summary: `${cat} क्षेत्र में व्यवसाय शुरू करने के लिए अनुमानित लागत ₹${cost.toLocaleString(
        "en-IN"
      )} और मासिक ईएमआई ₹${emi.toLocaleString("en-IN")} है।`,
      recommendation: rec,
      confidence: 82,
      keyReasons: [
        `स्थानीय बाजार में लगभग ${compCount} सक्रिय प्रतिस्पर्धी हैं।`,
        suitable
          ? `प्रस्तावित सरकारी ऋण योजना (${finance?.scheme?.name || "योजना"}) इस बजट के अनुकूल है।`
          : "परियोजना की लागत वर्तमान मानक योजनाओं की सीमा से अधिक या कम है।",
        "मासिक नकदी प्रवाह का प्रबंधन शुरुआत में सबसे महत्वपूर्ण होगा।",
      ],
      actions: [
        "निकटतम बैंक या सीएससी केंद्र पर योजना के आवश्यक दस्तावेजों की जांच करें।",
        "स्थानीय साप्ताहिक हाट और दुकानों से कच्चे माल की आपूर्ति दरें सत्यापित करें।",
        "कम से कम 2 महीने के कार्यशील पूंजी (वर्किंग कैपिटल) का बैकअप रखें।",
      ],
      warnings: [
        "बिना लिखित बहीखाता रखे उधारी पर सामान न बेचें।",
        "अंतिम ऋण स्वीकृति से पहले गैर-वापसी योग्य अग्रिम खर्च न करें।",
      ],
      swot: {
        strengths: [
          "स्थानीय ग्राहकों तक सीधी पहुंच",
          "कम परिवहन और परिचालन लागत",
        ],
        weaknesses: [
          "सीमित प्रारंभिक कार्यशील पूंजी",
          "ऋण स्वीकृति में समय लग सकता है",
        ],
        opportunities: [
          "आसपास के 2-3 गांवों में सेवा विस्तार",
          "डिजिटल यूपीआई भुगतान से तेजी से बिक्री",
        ],
        threats: [
          "त्योहारों या मौसम के अनुसार मांग में उतार-चढ़ाव",
          "कच्चे माल के थोक दामों में अप्रत्याशित वृद्धि",
        ],
      },
      pricingInsight: {
        strategy: "प्रतिस्पर्धी लागत-आधारित मूल्य निर्धारण (Cost-plus strategy)",
        factors: [
          "कच्चे माल की खरीद लागत",
          "स्थानीय बाजार की औसत दरें",
          "ग्राहक की दैनिक क्रय शक्ति",
        ],
      },
      businessPlan: {
        targetCustomers: "ग्राम पंचायत के निवासी, स्थानीय किसान और दैनिक उपभोक्ता",
        productsOrServices: `${cat} से संबंधित गुणवत्तापूर्ण उत्पाद और त्वरित सेवाएं`,
        marketingStrategy: "मुख प्रचार (Word of Mouth) और ग्राम WhatsApp समूह",
        operations: "सप्ताह में 6 दिन खुली दुकान/सेवा, शनिवार को स्टॉक रीफिल",
      },
    };
  }

  if (isMarathi) {
    return {
      headline: `${bName} - ग्राम उद्योग सल्लागार मार्गदर्शन`,
      summary: `${cat} व्यवसायासाठी अंदाजे प्रकल्प खर्च ₹${cost.toLocaleString(
        "en-IN"
      )} आणि मासिक हप्ता ₹${emi.toLocaleString("en-IN")} आहे.`,
      recommendation: rec,
      confidence: 80,
      keyReasons: [
        `स्थानिक भागात सुमारे ${compCount} व्यावसायिक आधीच कार्यरत आहेत.`,
        suitable
          ? "निवडलेली शासकीय योजना या प्रकल्पासाठी योग्य ठरते."
          : "प्रकल्पाचा आकार उपलब्ध योजनेच्या मर्यादेशी जुळवून घेणे आवश्यक आहे.",
        "सुरुवातीच्या काळात खेळत्या भांडवलाची काळजीपूर्वक बचत करा.",
      ],
      actions: [
        "योजनेच्या अटी व कागदपत्रांची स्थानिक बँकेत खात्री करा.",
        "स्थानिक आठवडी बाजारातून कच्च्या मालाचे दर तपासा.",
        "ग्राहकांशी संपर्क वाढवून विक्रीचे नियोजन करा.",
      ],
      warnings: [
        "सुरुवातीला जास्त उधारी देण्याचे टाळा.",
        "योजना मंजुरीपूर्वी मोठी रक्कम गुंतवू नका.",
      ],
      swot: {
        strengths: ["स्थानिक ग्राहकांशी थेट संवाद", "कमी वाहतूक खर्च"],
        weaknesses: ["मर्यादित भांडवल", "हंगामी चढ-उतार"],
        opportunities: ["शेजारील गावांमध्ये सेवा वाढवणे", "यूपीआय आधारित व्यवहार"],
        threats: ["इतर विक्रेत्यांची स्पर्धा", "कच्च्या मालाचे वाढते दर"],
      },
      pricingInsight: {
        strategy: "स्थानिक बाजारभावाशी सुसंगत दर निश्चिती",
        factors: ["खरेदी खर्च", "स्पर्धकांचे दर", "ग्राहकांची क्षमता"],
      },
      businessPlan: {
        targetCustomers: "गावातील कुटुंब, शेतकरी आणि दैनिक ग्राहक",
        productsOrServices: `${cat} संबंधित दर्जेदार उत्पादने`,
        marketingStrategy: "तोंडी प्रसिद्धी आणि ग्राम व्हॉट्सअ‍ॅप ग्रुप",
        operations: "नियमित दुकानाचे कामकाज आणि स्थानिक पुरवठादार",
      },
    };
  }

  // English default
  return {
    headline: `${bName} - Rural Enterprise Advisory`,
    summary: `For ${cat}, the estimated project cost is ₹${cost.toLocaleString(
      "en-IN"
    )} with an estimated loan requirement of ₹${loan.toLocaleString(
      "en-IN"
    )} and monthly EMI of ₹${emi.toLocaleString("en-IN")}.`,
    recommendation: rec,
    confidence: 85,
    keyReasons: [
      `Local competitor presence indicates ${compCount} competing business${
        compCount === 1 ? "" : "es"
      } in the trade area.`,
      suitable
        ? `Financing option (${finance?.scheme?.name || "Govt Scheme"}) fits this capital scale.`
        : "Project scale requires realignment or phased deployment to match scheme caps.",
      "Cash flow stability during first 90 days will be the deciding viability factor.",
    ],
    actions: [
      "Confirm mandatory documents (Aadhaar, PAN, Land/Rent agreement, Bank statement) with the target branch.",
      "Negotiate supplier terms for bulk raw material purchase in the nearest commercial mandi.",
      "Set aside an emergency 60-day operational buffer before purchasing non-core equipment.",
    ],
    warnings: [
      "Avoid extending loose credit to customers during the pilot quarter.",
      "Do not commit to unrecoverable store leases prior to formal loan sanction.",
    ],
    swot: {
      strengths: [
        "Immediate proximity to local rural demand cluster",
        "Low fixed infrastructure and rent overheads",
      ],
      weaknesses: [
        "Initial dependence on external credit lines",
        "Susceptible to agricultural income seasonality",
      ],
      opportunities: [
        "Expansion into adjacent 2-3 gram panchayats",
        "Adoption of QR-code/UPI instant payments to improve liquidity",
      ],
      threats: [
        "Wholesale price spikes in essential raw materials",
        "Aggressive price discounting by entrenched competitors",
      ],
    },
    pricingInsight: {
      strategy: "Cost-plus with local parity pricing",
      factors: [
        "Input wholesale acquisition cost",
        "15-20% sustainable gross margin target",
        "Prevailing weekly haat rate benchmarks",
      ],
    },
    businessPlan: {
      targetCustomers:
        "Village households, weekly haat visitors, and nearby rural micro-establishments",
      productsOrServices: `High-turnover, essential ${cat} products delivered with high reliability`,
      marketingStrategy:
        "Local word-of-mouth, sample demonstrations, and village WhatsApp announcements",
      operations:
        "6-day retail and fulfillment cycle with weekly Monday inventory replenishment",
    },
  };
}

export async function generateAdvisory(
  params: GenerateAdvisoryParams
): Promise<AdvisoryResponse> {
  const preferred = (process.env.AI_PROVIDER || "watsonx").toLowerCase();
  const language = (params.language || "en") as SupportedLanguage;

  const prompt = buildAdvisoryPrompt({
    assessment: params.assessment,
    finance: params.finance,
    market: params.market,
    language,
  });

  const providersToTry: Array<"watsonx" | "openai" | "gemini"> = [];

  if (preferred === "watsonx") {
    providersToTry.push("watsonx", "gemini", "openai");
  } else if (preferred === "openai") {
    providersToTry.push("openai", "watsonx", "gemini");
  } else if (preferred === "gemini") {
    providersToTry.push("gemini", "watsonx", "openai");
  } else {
    providersToTry.push("watsonx", "gemini", "openai");
  }

  for (const prov of providersToTry) {
    try {
      if (prov === "watsonx") {
        if (
          (process.env.WATSONX_API_KEY || process.env.IBM_CLOUD_API_KEY) &&
          process.env.WATSONX_PROJECT_ID
        ) {
          const raw = await generateWatsonxAdvisory(prompt);
          return {
            advisory: sanitizeAdvisory(raw),
            provider: "watsonx",
          };
        }
      } else if (prov === "openai") {
        if (process.env.OPENAI_API_KEY) {
          const raw = await generateOpenAIAdvisory(prompt);
          return {
            advisory: sanitizeAdvisory(raw),
            provider: "openai",
          };
        }
      } else if (prov === "gemini") {
        if (process.env.GEMINI_API_KEY) {
          const raw = await callGemini(prompt);
          return {
            advisory: sanitizeAdvisory(raw),
            provider: "gemini",
          };
        }
      }
    } catch (err) {
      console.warn(`[AI Provider: ${prov}] failed:`, err);
      // Continue to next provider
    }
  }

  // Fallback to deterministic generator
  return {
    advisory: generateDeterministicAdvisory(params),
    provider: "deterministic",
  };
}

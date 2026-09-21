import { describe, it, expect } from "vitest";
import { generateChatResponse } from "@/lib/ai/chat";

describe("Conversational AI Agent", () => {
  const mockContext = {
    assessment: {
      fullName: "Ramesh Patel",
      age: 34,
      businessName: "Patel Dairy Centre",
      category: "Dairy & Animal Husbandry",
      village: "Ralegan Siddhi",
      block: "Parner",
      district: "Ahmednagar",
      state: "Maharashtra",
      marginCapital: 25000,
      experienceYears: 4,
      hasLandOrShop: true,
    },
    result: {
      finance: {
        projectCost: 250000,
        loanAmount: 225000,
        marginCapital: 25000,
        monthlyEMI: 4500,
        scheme: {
          name: "Term Loan Scheme",
          interestRate: 8.0,
          tenureYears: 5,
          moratoriumMonths: 6,
          reason: "Project Cost > ₹1,40,000 mandates Term Loan Scheme.",
        },
      },
      viability: {
        score: 76,
        rating: "HIGH",
        recommendation: "Strong local demand for daily milk collection.",
        factors: [
          { name: "Market Demand", score: 80, weight: 0.25 },
          { name: "Competitor Density", score: 70, weight: 0.2 },
          { name: "Financial DSCR", score: 85, weight: 0.25 },
        ],
      },
      decision: "RECOMMENDED",
    },
  };

  it("responds to viability score question with grounded context in English", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "Why is my viability score 76 out of 100?",
        },
      ],
      context: mockContext,
      language: "en",
    });

    expect(res.message).toBeTruthy();
    expect(res.message).toContain("Patel Dairy Centre");
    expect(res.message).toContain("76");
  });

  it("responds to loan scheme question with exact financial figures", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "Can you explain my loan scheme and EMI?",
        },
      ],
      context: mockContext,
      language: "en",
    });

    expect(res.message).toBeTruthy();
    expect(res.message).toContain("Term Loan Scheme");
    
    expect(res.message).toMatch(/2,50,000|250000/);
    expect(res.message).toMatch(/2,25,000|225000/);
  });

  it("responds in Hindi when Hindi is selected", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "मेरा स्कोर कैसा है?",
        },
      ],
      context: mockContext,
      language: "hi",
    });

    expect(res.message).toBeTruthy();
   
    expect(res.message).toMatch(/व्यवहार्यता|स्कोर|76/);
  });

  it("responds in Marathi when Marathi is selected", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "माझा कर्ज हप्ता किती असेल?",
        },
      ],
      context: mockContext,
      language: "mr",
    });

    expect(res.message).toBeTruthy();
    
    expect(res.message).toMatch(/कर्ज|भांडवल|प्रकल्प/);
  });

  it("handles viability.factors as an object (as returned by calculateViabilityScore) without crashing", async () => {
    const contextWithObjectFactors = {
      ...mockContext,
      result: {
        ...mockContext.result,
        viability: {
          ...mockContext.result.viability,
          factors: {
            marketSaturation: { name: "Market Saturation", score: 80, weight: 0.25, description: "Strong demand" },
            competitorDensity: { name: "Competitor Density", score: 70, weight: 0.2, description: "Moderate competition" },
            incomeToEmiRatio: { name: "Financial DSCR", score: 85, weight: 0.25, description: "Safe EMI coverage" },
          } as any,
        },
      },
    };

    const res = await generateChatResponse({
      messages: [{ role: "user", content: "Explain my loan scheme & monthly EMI" }],
      context: contextWithObjectFactors,
      language: "en",
    });

    expect(res.message).toBeTruthy();
    expect(res.message).not.toContain("higher than normal network traffic");
  });

  it("answers 'What documents should I take to the bank branch?' with a real checklist", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "What documents should I take to the bank branch?",
        },
      ],
      context: mockContext,
      language: "en",
    });

    expect(res.message).toBeTruthy();
    expect(res.message).toMatch(/document|kyc|aadhaar|report|statement/i);
    expect(res.message).not.toContain("higher than normal network traffic");
  });

  it("answers 'How can I reduce risks in my village?' with actionable risk reduction strategies", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "How can I reduce risks in my village?",
        },
      ],
      context: mockContext,
      language: "en",
    });

    expect(res.message).toBeTruthy();
    expect(res.message).toMatch(/risk|competitor|differentiation|reserve|buffer/i);
    expect(res.message).not.toContain("higher than normal network traffic");
  });

  it("handles multi-turn conversation history gracefully", async () => {
    const res = await generateChatResponse({
      messages: [
        {
          role: "user",
          content: "Why is my viability score 76?",
        },
        {
          role: "assistant",
          content: "Your score is 76 because of strong market demand.",
        },
        {
          role: "user",
          content: "What should I do first to prepare for the bank?",
        },
      ],
      context: mockContext,
      language: "en",
    });

    expect(res.message).toBeTruthy();
  });
});


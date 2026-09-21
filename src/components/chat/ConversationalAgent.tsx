"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  User,
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
  Volume2,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { formatCurrency } from "@/lib/utils/currency";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ConversationalAgentProps {
  assessment: any;
  result: any;
}


function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={i}
          className="font-semibold text-slate-900 dark:text-white"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}


function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="my-2 ml-4 list-disc space-y-1 text-slate-700 dark:text-slate-200"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol
          key={`list-${elements.length}`}
          className="my-2 ml-4 list-decimal space-y-1 text-slate-700 dark:text-slate-200"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm leading-relaxed">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      elements.push(<div key={`blank-${i}`} className="h-1.5" />);
      continue;
    }

   
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numberMatch[2]);
      continue;
    }

   
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-1 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100"
      >
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-0.5">{elements}</div>;
}

export default function ConversationalAgent({
  assessment,
  result,
}: ConversationalAgentProps) {
  const { t, language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const businessName = assessment?.businessName || "Your Enterprise";
  const viabilityScore = result?.viability?.score || 70;
  const schemeName = result?.finance?.scheme?.name || "Micro Finance Scheme";
  const projectCost =
    result?.finance?.projectCost ||
    (assessment?.marginCapital ? assessment.marginCapital * 10 : 0);
  const monthlyEMI = result?.finance?.monthlyEMI || 0;

 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting =
        language === "hi"
          ? `नमस्ते ${assessment?.fullName ? assessment.fullName + " जी" : ""}! मैं आपका **ग्राम उद्यम एआई सलाहकार** हूँ। आपके **${businessName}** प्रोजेक्ट (लागत: ${formatCurrency(projectCost)}, व्यवहार्यता स्कोर: ${viabilityScore}/100) के आधार पर मैं आपकी सहायता के लिए तैयार हूँ। आप नीचे दिए गए सुझाव चुन सकते हैं या बोलकर/लिखकर प्रश्न पूछ सकते हैं:`
          : language === "mr"
          ? `नमस्कार ${assessment?.fullName ? assessment.fullName : ""}! मी तुमचा **ग्राम उद्यम AI सल्लागार** आहे. तुमच्या **${businessName}** प्रकल्पासाठी (प्रकल्प खर्च: ${formatCurrency(projectCost)}, स्कोअर: ${viabilityScore}/100) मी सर्व प्रश्नांची उत्तरे देण्यासाठी सज्ज आहे. खालील पर्याय निवडा किंवा तुमचा प्रश्न टाईप/माईकद्वारे विचारू शकता:`
          : `Hello ${assessment?.fullName || "there"}! I am your **Gram Udyam AI Advisor**. Grounded in your **${businessName}** report (Project Cost: ${formatCurrency(projectCost)}, Viability Score: ${viabilityScore}/100, Scheme: ${schemeName}), I am here to assist you. Choose a prompt below or type/dictate your question:`;

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: initialGreeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, businessName, viabilityScore, projectCost, schemeName, assessment?.fullName]);


  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  
  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const speechLang =
        language === "hi"
          ? "hi-IN"
          : language === "mr"
          ? "mr-IN"
          : "en-IN";

      recognition.lang = speechLang;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0]?.transcript)
          .join("");
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition could not start:", err);
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const apiMessages = newHistory
        .filter((m) => m.id !== "welcome") 
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            assessment,
            result,
          },
          language,
        }),
      });

      const data = await res.json();

      if (data?.message) {
        const assistantMessage: Message = {
          id: `ast_${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Empty response received.");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(
        language === "hi"
          ? "एआई सलाहकार से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।"
          : language === "mr"
          ? "AI सल्लागाराशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा."
          : "Unable to connect to AI Advisor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const initialGreeting =
      language === "hi"
        ? `नमस्ते! मैं आपका **ग्राम उद्यम एआई सलाहकार** हूँ। आप अपने **${businessName}** प्रोजेक्ट (स्कोर: ${viabilityScore}/100) के बारे में कोई भी प्रश्न पूछ सकते हैं:`
        : language === "mr"
        ? `नमस्कार! मी तुमचा **ग्राम उद्यम AI सल्लागार** आहे. तुम्ही तुमच्या **${businessName}** प्रकल्पाबाबत (स्कोअर: ${viabilityScore}/100) कोणताही प्रश्न विचारू शकता:`
        : `Hello! I am your **Gram Udyam AI Advisor**. Grounded in your assessment for **${businessName}** (Viability: ${viabilityScore}/100), ask me anything:`;

    setMessages([
      {
        id: "welcome_reset",
        role: "assistant",
        content: initialGreeting,
        timestamp: new Date(),
      },
    ]);
    setError(null);
    setInput("");
  };

  const starterChips = [
    {
      id: "score",
      text: t("askScoreChip") || `Why is my viability score only ${viabilityScore}%?`,
    },
    {
      id: "scheme",
      text:
        t("askSchemeChip") ||
        `Explain my ${schemeName} and monthly EMI of ~${formatCurrency(monthlyEMI)}`,
    },
    {
      id: "risks",
      text: t("askRisksChip") || "How can I reduce local business risks?",
    },
    {
      id: "bank",
      text: t("askBankChip") || "What documents should I take to the bank branch?",
    },
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-indigo-700 p-3.5 sm:px-5 sm:py-3.5 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer"
          aria-label="Open AI Advisor Chat"
        >
          <div className="relative">
            <Bot size={22} className="animate-pulse text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              {t("chatAdvisorTitle") || "Gram Udyam AI"}
              <Sparkles size={11} className="text-amber-300" />
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">
              {t("chatAdvisorSubtitle") || "Ask about your report"}
            </span>
          </div>
        </button>
      )}

     
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[94vw] sm:w-[440px] h-[600px] max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Conversational AI Advisor"
        >
          
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-indigo-700 px-4 py-3 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white border border-white/20">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-700" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">
                    {t("chatAdvisorTitle") || "Gram Udyam AI Advisor"}
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider rounded-md bg-white/20 px-1.5 py-0.5 font-bold">
                    AI Mentor
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 truncate max-w-[210px]">
                  {businessName} • {viabilityScore}% Viability
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title={t("clearChat") || "Reset Chat"}
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <RotateCcw size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={t("closeChat") || "Close"}
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/50">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                      <Bot size={16} />
                    </div>
                  )}

                  
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-xs break-words ${
                      isUser
                        ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-tr-xs"
                        : "bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-xs"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}
                  </div>

                  
                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

           
            {messages.length <= 1 && (
              <div className="mt-2 pt-2">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" />
                  Suggested Questions:
                </p>
                <div className="flex flex-col gap-1.5">
                  {starterChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleSend(chip.text)}
                      className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800/80 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 transition shadow-2xs cursor-pointer"
                    >
                      💡 {chip.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            
            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 dark:text-slate-400 text-xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800 px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-2xs">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {t("chatThinking") || "Analyzing your report..."}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

         
          {isListening && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-950/60 border-t border-red-200 dark:border-red-900/40 flex items-center justify-between text-xs text-red-700 dark:text-red-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="font-semibold">
                  {language === "hi"
                    ? "सुन रहा हूँ... बोलिए (बोलना बंद करने पर माईक पर टैप करें)"
                    : language === "mr"
                    ? "ऐकत आहे... बोला (थांबवण्यासाठी माईकवर टॅप करा)"
                    : "Listening... speak your question into the chat box"}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="text-[11px] font-bold underline cursor-pointer hover:text-red-800"
              >
                Stop
              </button>
            </div>
          )}

         
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isListening
                      ? language === "hi"
                        ? "सुन रहा हूँ..."
                        : language === "mr"
                        ? "ऐकत आहे..."
                        : "Listening..."
                      : t("chatPlaceholder") ||
                        "Ask about your score, scheme, EMI, or risks..."
                  }
                  disabled={loading}
                  className={`w-full rounded-xl border ${
                    isListening
                      ? "border-red-500 ring-2 ring-red-500/20 bg-red-50/30"
                      : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  } pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:opacity-50`}
                />

                
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={loading}
                    title={
                      isListening
                        ? "Stop listening"
                        : "Dictate question via microphone"
                    }
                    className={`absolute right-2 p-1.5 rounded-lg transition cursor-pointer ${
                      isListening
                        ? "bg-red-600 text-white animate-pulse"
                        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
              </div>

              
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-600 transition shadow-xs cursor-pointer"
                aria-label="Send Message"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Gram Udyam AI Advisor provides grounded institutional guidance from your report.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { fetchAiStatus, sendAiMessage } from "../../api/ai";
import { useToast } from "../../context/ToastContext";
import Button from "../../ui/Button";

const QUICK_PROMPTS = [
  "I have a fever and headache",
  "How do I book an appointment?",
  "Where are my prescriptions?",
  "Find a cardiologist",
];

const urgencyStyles = {
  emergency: "border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800",
  high: "border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800",
  medium: "border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800",
};

const formatReply = (text) => {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
};

const AiAssistant = ({ user }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState({ configured: false, provider: "fallback" });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchAiStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus({ configured: false, provider: "fallback" }));
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const apiMessages = nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const data = await sendAiMessage(apiMessages);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            urgency: data.urgency,
            suggested_specialty: data.suggested_specialty,
            actions: data.actions || [],
            provider: data.provider,
          },
        ]);

        if (data.urgency === "emergency") {
          addToast("If this is an emergency, call 108 immediately.", "error");
        }
      } catch (err) {
        addToast(err.message || "AI assistant unavailable", "error");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that right now. Please try again or use the app menu to navigate.",
            urgency: "none",
            actions: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, addToast]
  );

  const handleAction = (action, assistantMsg) => {
    if (action.type === "navigate" && action.path) {
      setOpen(false);
      let path = action.path;
      if (path.startsWith("/doctors") && assistantMsg?.suggested_specialty) {
        path = `/doctors?search=${encodeURIComponent(assistantMsg.suggested_specialty)}`;
      }
      navigate(path);
    }
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed z-[60] bottom-24 right-4 lg:bottom-6 lg:right-6 w-[min(100vw-2rem,400px)] h-[min(70vh,560px)] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="MediLink Health Assistant"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-health-600 to-health-700 text-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">Health Assistant</p>
                  <p className="text-[11px] text-health-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {aiStatus.configured ? "AI powered" : "Demo mode"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-health-100 dark:bg-health-950/50 flex items-center justify-center mb-3">
                    <Stethoscope className="w-7 h-7 text-health-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Hi {firstName}! How can I help?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-4">
                    Ask about symptoms, booking, or navigating MediLink. Not a substitute for medical advice.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 px-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-health-400 hover:text-health-700 dark:hover:text-health-400 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-health-600 text-white rounded-br-md"
                        : `bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border rounded-bl-md shadow-sm ${
                            urgencyStyles[msg.urgency] || "border-slate-200 dark:border-slate-700"
                          }`
                    }`}
                  >
                    {msg.role === "assistant" && msg.urgency === "emergency" && (
                      <p className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Emergency — call 108
                      </p>
                    )}
                    <p
                      className="whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: msg.role === "assistant" ? formatReply(msg.content) : msg.content,
                      }}
                    />
                    {msg.role === "assistant" && msg.suggested_specialty && (
                      <p className="text-xs mt-2 text-health-700 dark:text-health-400 font-medium">
                        Suggested: {msg.suggested_specialty}
                      </p>
                    )}
                    {msg.role === "assistant" && msg.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {msg.actions.map((action, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => handleAction(action, msg)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-health-50 dark:bg-health-950/40 text-health-700 dark:text-health-300 border border-health-200 dark:border-health-800 hover:bg-health-100 dark:hover:bg-health-900/40 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-health-600" />
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe symptoms or ask a question…"
                  disabled={loading}
                  maxLength={2000}
                  className="health-input flex-1 py-2.5 text-sm"
                  aria-label="Message to health assistant"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || loading}
                  icon={Send}
                  iconOnly
                  aria-label="Send message"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center leading-tight">
                AI guidance only — not medical advice. Emergencies: call 108.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        className={`fixed z-[59] bottom-24 left-4 lg:bottom-6 lg:left-auto lg:right-[4.75rem] w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-colors ${
          open
            ? "bg-slate-700 text-white"
            : "bg-gradient-to-br from-health-600 to-health-700 text-white hover:from-health-700 hover:to-health-800"
        }`}
        aria-label={open ? "Close health assistant" : "Open health assistant"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default AiAssistant;

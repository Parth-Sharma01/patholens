'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  MessageCircle, X, Send, Trash2, Bot, User, PhoneCall,
  Sparkles, ShieldAlert, RefreshCw, ChevronDown
} from 'lucide-react';

const PRESET_PROMPTS = [
  '🚨 Emergency hospital contacts & ambulance near Shoolini',
  'What should a critical risk household do immediately?',
  'Which village has the highest food poisoning risk?',
  'What % of households use untreated water?',
  'Safe food handling without refrigeration?',
  'What are the symptoms of E. coli vs. Salmonella?',
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-brand-400 rounded-full"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
        isUser ? 'bg-brand-600 text-white' : 'bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-brand-700 dark:text-brand-400'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
        isUser
          ? 'bg-brand-600 text-white rounded-tr-sm shadow-md'
          : 'bg-slate-100 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-700/60 text-slate-900 dark:text-gray-100 rounded-tl-sm shadow-sm'
      }`}>
        {isUser ? (
          <p className="leading-relaxed">{msg.content}</p>
        ) : (
          <div className="prose-chat text-xs sm:text-sm leading-relaxed space-y-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 dark:border-white/5">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
            {msg.provider ? `Engine: ${msg.provider}` : ''}
          </span>
          <span className={`text-[10px] ${isUser ? 'text-brand-200/70' : 'text-slate-500 dark:text-gray-500'}`}>
            {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

const WELCOME_MSG = {
  role: 'assistant',
  content: `👋 **Hello! I'm PathoLens RAG AI.**
I am an epidemiological and rural community health assistant powered by:
- 📊 **Live Survey Cohort Data** across 20+ villages near Shoolini University (Solan, HP)
- 🧫 **Microbiological Pathogen Knowledge** (E. coli, Salmonella, Bacillus cereus, etc.)
- 🏥 **Solan District Hospital Emergency Directory** & Ambulance Helplines (108 / 104)

*Tap any quick question below or ask me about water safety, food hygiene, or emergency contacts!*`,
  ts: Date.now(),
  provider: 'rag-engine',
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter(m => m !== WELCOME_MSG)
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content }] }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.content,
          ts: Date.now(),
          provider: data.provider || 'rag-engine',
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Network interruption. Reconnecting to local RAG engine. Please try again.',
          ts: Date.now(),
          provider: 'offline',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MSG]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open
            ? 'bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-300'
            : 'bg-gradient-to-tr from-brand-600 to-emerald-500 text-white shadow-emerald-500/25 border border-emerald-400/40'
        }`}
        aria-label="Toggle PathoLens AI Chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative">
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-950" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Drawer / Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[calc(100vh-96px)] bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border border-slate-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-gray-800/80 bg-slate-50/80 dark:bg-gray-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center text-white dark:text-gray-950 font-bold shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">PathoLens RAG AI</h3>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                      Active RAG
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400">Rural Surveillance & Hospital Triage Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Emergency Shortcut */}
                <a
                  href="tel:108"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800/80 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                  title="Call Emergency 108"
                >
                  <PhoneCall className="w-3 h-3 text-red-600 dark:text-red-400" /> 108
                </a>
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m, idx) => (
                <ChatMessage key={idx} msg={m} />
              ))}
              {loading && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-100 dark:bg-gray-800/80 rounded-2xl rounded-tl-sm px-3 py-2 border border-slate-200 dark:border-gray-700/50">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 border-t border-slate-200 dark:border-gray-800/60 bg-slate-50/70 dark:bg-gray-900/40">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-gray-800/80 hover:bg-brand-50 dark:hover:bg-brand-900/40 hover:text-brand-700 dark:hover:text-brand-300 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700/60 hover:border-brand-300 dark:hover:border-brand-500/40 transition-all truncate max-w-[260px] shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about village risks, boiling, hospitals..."
                  className="flex-1 bg-slate-50 dark:bg-gray-900/90 border border-slate-300 dark:border-gray-700/70 focus:border-brand-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none transition-all"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:hover:bg-brand-500 text-white dark:text-gray-950 flex items-center justify-center transition-all flex-shrink-0 font-bold shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createConversationState, createDeterministicResponse, initialSuggestions } from '../assistant/deterministic';
import { requestAssistant } from '../assistant/api';
import { BOOKING_URL, PORTFOLIO_SERVICES, buildWhatsAppUrl } from '../data/portfolioExperience';

const OPEN_CHAT_EVENT = 'portfolio-chat:open';
const welcome = {
  id: 0,
  role: 'assistant',
  text: "Hi — ask me about Shaikh's services, skills, process, or documented projects. I can also understand your project needs and help you book a meeting."
};
const directWhatsAppUrl = buildWhatsAppUrl('Hi Shaikh, I visited your portfolio and would like to discuss a project.');

export function openPortfolioChat(serviceId) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { serviceId } }));
}

function MessageActions({ actions = [] }) {
  if (!actions.length) return null;
  return (
    <div className="mt-3 grid gap-2">
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg border px-3 py-2 text-center text-[10px] font-semibold transition-colors ${action.tone === 'green' ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20' : 'border-purple-400/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20'}`}
        >
          {action.label} →
        </a>
      ))}
    </div>
  );
}

export default function PortfolioChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcome]);
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationState, setConversationState] = useState(createConversationState);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const launcherRef = useRef(null);
  const previousFocusRef = useRef(null);
  const nextId = useRef(1);
  const abortRef = useRef(null);

  const closeChat = () => {
    abortRef.current?.abort();
    setIsOpen(false);
    window.setTimeout(() => (previousFocusRef.current?.isConnected ? previousFocusRef.current : launcherRef.current)?.focus(), 0);
  };

  const openChat = (serviceId) => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    if (serviceId) {
      const service = PORTFOLIO_SERVICES.find((item) => item.id === serviceId);
      if (service) window.setTimeout(() => sendMessage(`Tell me about ${service.title}`), 0);
    }
  };

  useEffect(() => {
    const handler = (event) => openChat(event.detail?.serviceId);
    window.addEventListener(OPEN_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handler);
  }, []);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (rawValue) => {
    const value = String(rawValue || '').trim();
    if (!value || loading) return;
    const userMessage = { id: nextId.current++, role: 'user', text: value };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setLoading(true);
    setSuggestions([]);
    const fallback = createDeterministicResponse(value, conversationState);
    abortRef.current = new AbortController();
    let result = fallback;
    try {
      result = await requestAssistant(value, history, conversationState, abortRef.current.signal);
    } catch (error) {
      if (error.name === 'AbortError') return;
      result = fallback;
    } finally {
      setLoading(false);
    }
    setMessages((current) => [
      ...current,
      {
        id: nextId.current++,
        role: 'assistant',
        text: result.reply,
        entries: result.entries || [],
        actions: result.actions || [],
        mode: result.mode || 'deterministic'
      }
    ]);
    setConversationState(result.state || conversationState);
    setSuggestions(result.suggestions || []);
  };

  const reset = () => {
    abortRef.current?.abort();
    nextId.current = 1;
    setMessages([welcome]);
    setSuggestions(initialSuggestions);
    setInput('');
    setLoading(false);
    setConversationState(createConversationState());
  };

  const handleKeys = (event) => {
    if (event.key === 'Escape') return closeChat();
    if (event.key !== 'Tab' || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')];
    if (!items.length) return;
    if (event.shiftKey && document.activeElement === items[0]) {
      event.preventDefault();
      items.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
      event.preventDefault();
      items[0].focus();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="portfolio-chat-title" onKeyDown={handleKeys} initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} className="mb-3 flex h-[min(720px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#0B1020]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_50px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:w-[420px]">
            <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/40 text-xs font-black text-cyan-200">AA</div>
                <div><h2 id="portfolio-chat-title" className="text-sm font-semibold text-white">AI Assistant + Project Agent</h2><p className="mt-0.5 text-[10px] text-emerald-300">Grounded in this portfolio · fallback always available</p></div>
              </div>
              <div><button type="button" onClick={reset} className="rounded-lg px-2 py-2 text-[10px] text-gray-400 hover:text-white">Reset</button><button type="button" onClick={closeChat} aria-label="Close assistant" className="h-8 w-8 rounded-lg text-gray-400 hover:text-white">×</button></div>
            </header>

            <div ref={messagesRef} aria-live="polite" className="portfolio-chat-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-2xl px-3.5 py-3 ${message.role === 'user' ? 'rounded-br-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'rounded-bl-md border border-gray-800 bg-[#151B2C] text-gray-300'}`}>
                    <p className="text-xs leading-relaxed">{message.text}</p>
                    {message.entries?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{message.entries.slice(0, 3).map((entry) => <a key={entry.id} href={entry.href} onClick={closeChat} className="rounded-full border border-cyan-500/25 px-2.5 py-1 text-[9px] text-cyan-200">View {entry.title}</a>)}</div>}
                    <MessageActions actions={message.actions} />
                  </div>
                </div>
              ))}
              {loading && <div className="animate-pulse text-[10px] text-cyan-300">Checking the portfolio knowledge…</div>}
            </div>

            <div className="border-t border-gray-800 bg-[#0E1322] px-4 py-3">
              {suggestions.length > 0 && <div className="portfolio-chat-suggestions flex gap-2 overflow-x-auto pb-3">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-full border border-gray-700 bg-[#151B2C] px-3 py-1.5 text-[10px] text-gray-300 hover:border-cyan-500/40 hover:text-cyan-200">{suggestion}</button>)}</div>}
              <form onSubmit={(event) => { event.preventDefault(); sendMessage(input); }} className="flex gap-2"><label htmlFor="portfolio-chat-input" className="sr-only">Ask the portfolio assistant</label><input ref={inputRef} id="portfolio-chat-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} placeholder="Ask about services or describe your project…" className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-[#141B2D] px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500" /><button disabled={!input.trim() || loading} className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40">Send</button></form>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-purple-400/30 bg-purple-500/10 px-2 py-2 text-center text-[10px] font-semibold text-purple-200 hover:bg-purple-500/20">Google Calendar</a>
                <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2 py-2 text-center text-[10px] font-semibold text-emerald-200 hover:bg-emerald-500/20">WhatsApp +966511493209</a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <button ref={launcherRef} type="button" onClick={isOpen ? closeChat : () => openChat()} aria-label={isOpen ? 'Close portfolio assistant' : 'Open AI portfolio assistant'} aria-expanded={isOpen} className="group flex items-center gap-3 rounded-full border border-cyan-400/30 bg-[#0E1322]/95 p-2 pr-4 text-white shadow-[0_14px_45px_rgba(0,0,0,0.42),0_0_24px_rgba(34,211,238,0.12)] backdrop-blur-xl"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/50 text-xs font-black text-cyan-100">AI</span><span className="text-left"><span className="block text-xs font-semibold">Ask Shaikh's assistant</span><span className="mt-0.5 block text-[9px] text-cyan-300">Questions · Projects · Contact</span></span></button>
    </div>
  );
}

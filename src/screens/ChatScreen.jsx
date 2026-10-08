import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useMedication } from '../context/MedicationContext';
import { SUGGESTED_PROMPTS, getBotResponse } from '../utils/chatEngine';

export default function ChatScreen() {
  const { user, medicines, schedule } = useMedication();
  const messagesEndRef = useRef(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm Pill Check AI. I can explain what your medicines (Amoxicillin, Ibuprofen, Pantoprazole) are used for, clarify the safety alert, check your next dose timing, or provide general guidance. What would you like to know?`,
      time: 'Just now',
      type: 'info',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate intelligent AI response with slight delay
    setTimeout(() => {
      const response = getBotResponse(query, { medicines, schedule });
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        type: response.type,
        disclaimer: response.disclaimer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init-1',
        sender: 'bot',
        text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm Pill Check AI. I can explain what your medicines (Amoxicillin, Ibuprofen, Pantoprazole) are used for, clarify the safety alert, check your next dose timing, or provide general guidance. What would you like to know?`,
        time: 'Just now',
        type: 'info',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(84vh-3rem)] max-w-2xl mx-auto">
      {/* Bot Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                Pill Check AI
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Your unified medication & safety assistant
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 pb-2">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const isEmergency = msg.type === 'emergency';
          const isWarning = msg.type === 'warning';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-2xs ${
                  isBot
                    ? isEmergency
                      ? 'bg-red-50 text-red-950 border-2 border-red-300'
                      : isWarning
                      ? 'bg-amber-50 text-amber-950 border border-amber-200'
                      : 'bg-white text-slate-800 border border-slate-200'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                {/* Formatted Text */}
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.disclaimer && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
                    ℹ️ {msg.disclaimer}
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] text-right ${
                    isBot ? 'text-slate-400' : 'text-indigo-200'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-10">
            <div className="flex gap-1 py-2 px-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>Pill Check AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Quick Chips */}
      <div className="py-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[11px] font-bold text-slate-400 pl-1">Ask:</span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs transition-all active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-2xs shrink-0 mt-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about side effects, food instructions, alerts..."
            className="flex-1 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white transition-colors"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Safety Disclaimer Footer */}
      <p className="text-[11px] text-slate-400 text-center mt-2 px-4 leading-tight shrink-0">
        General medication reference only • Does not diagnose or prescribe • In emergency call 911
      </p>
    </div>
  );
}

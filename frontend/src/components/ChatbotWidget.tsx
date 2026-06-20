"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'SYSTEM_ONLINE. How can I assist you with the trading platform today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Don't show chatbot on the admin pages to prevent UI clash
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'ERR: CONNECTION_FAILED. Could not reach AI engine.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'ERR: NETWORK_FAULT. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#00E676] hover:bg-[#00c968] text-[#09090b] p-4 rounded-full shadow-lg shadow-[#00E676]/20 transition-transform hover:scale-105 flex items-center justify-center"
          title="Launch AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] max-h-[80vh] bg-[#131316] border border-[#27272a] shadow-2xl flex flex-col rounded-sm overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Header */}
          <div className="bg-[#1a1a1f] border-b border-[#27272a] p-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              <span className="text-xs font-bold text-[#e0e0e0] tracking-widest uppercase">LAAL_AI_ASSISTANT</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#71717a] hover:text-[#e0e0e0] p-1 transition"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090b]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#27272a] text-[#e0e0e0] rounded-l-sm rounded-tr-sm' 
                    : 'bg-[#131316] border border-[#27272a] text-[#a1a1aa] rounded-r-sm rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#131316] border border-[#27272a] p-3 rounded-r-sm rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-3 h-3 text-[#00E676] animate-spin" />
                  <span className="text-[10px] text-[#71717a]">COMPUTING...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#131316] border-t border-[#27272a] shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="TYPE QUERY..."
                className="flex-1 bg-[#09090b] border border-[#27272a] text-[#e0e0e0] text-xs px-3 py-2 outline-none focus:border-[#00E676] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-[#00E676] text-[#09090b] px-3 py-2 hover:bg-[#00c968] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center rounded-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

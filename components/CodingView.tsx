import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, IndianLanguage } from '../types';
import { streamChatResponse } from '../services/geminiService';

const CodingView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: '// Pin Ai Coding Assistant Initialized...\n// Ready to help you write code.' }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<IndianLanguage>(IndianLanguage.ENGLISH);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      let fullText = '';
      await streamChatResponse(
        history, 
        userMsg.text, 
        (chunk) => {
          fullText += chunk;
          setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg));
        },
        [], // Empty images array
        true, // isCodingMode
        language
      );
    } catch (error) {
      setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: "// Error: Could not generate code.", isError: true } : msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden font-mono">
      <div className="p-3 border-b border-slate-700 bg-[#252526] flex items-center justify-between">
        <div className="flex items-center gap-2">
           <i className="fas fa-code text-pin-teal"></i>
           <span className="font-bold text-slate-300">Pin Ai DevStudio</span>
        </div>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
          className="bg-[#333] border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-pin-teal"
        >
          {Object.values(IndianLanguage).map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-pin-teal/20 text-pin-teal border border-pin-teal/30' : 'bg-[#2d2d2d] text-slate-300 border border-slate-700'
            }`}>
              <pre className="whitespace-pre-wrap font-mono text-sm">{msg.text}</pre>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-pin-teal animate-pulse">_ Generating code ({language})...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#252526] border-t border-slate-700">
        <div className="flex gap-2">
           <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Describe the code you need..."
            className="flex-1 bg-[#1e1e1e] text-slate-300 p-2 rounded border border-slate-600 focus:border-pin-teal outline-none resize-none h-20"
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-pin-teal hover:bg-pin-accent text-white px-4 rounded transition-colors">
            Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingView;
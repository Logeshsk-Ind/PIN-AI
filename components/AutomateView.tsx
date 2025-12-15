import React, { useState } from 'react';
import { SocialPlatform, ReplyTone, IndianLanguage } from '../types';
import { generateAutomatedReply } from '../services/geminiService';

const AutomateView: React.FC = () => {
  const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.WHATSAPP);
  const [tone, setTone] = useState<ReplyTone>(ReplyTone.CASUAL);
  const [language, setLanguage] = useState<IndianLanguage>(IndianLanguage.ENGLISH);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutomate = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const generated = await generateAutomatedReply(message, platform, tone, language);
      setReply(generated);
    } catch (error) {
      console.error(error);
      setReply("Error generating reply.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <i className="fas fa-bolt"></i> Automate
        </h2>
        <span className="text-xs text-slate-500">Social Media Reply Assistant</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left: Input */}
        <div className="flex-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(SocialPlatform).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all truncate ${
                    platform === p 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <i className={`fab fa-${p.toLowerCase()} mr-1`}></i> {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value as ReplyTone)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              >
                {Object.values(ReplyTone).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              >
                {Object.values(IndianLanguage).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Incoming Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste the message you received here..."
              className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none min-h-[120px]"
            />
          </div>

          <button
            onClick={handleAutomate}
            disabled={loading || !message}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
            Generate Reply
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex-1 bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 flex flex-col relative h-[300px] lg:h-auto">
           <label className="block text-sm font-medium text-slate-300 mb-4 flex justify-between">
             <span>Generated Reply ({language})</span>
             {reply && (
                <button onClick={copyToClipboard} className="text-blue-400 hover:text-blue-300 text-xs">
                  <i className="fas fa-copy mr-1"></i> Copy
                </button>
             )}
           </label>
           
           <div className="flex-1 bg-slate-900/50 rounded-lg p-4 text-slate-200 whitespace-pre-wrap leading-relaxed overflow-y-auto border border-slate-800 font-sans">
             {reply ? reply : <span className="text-slate-600 italic">Result will appear here...</span>}
           </div>
           
           <div className="mt-4 pt-4 border-t border-slate-700">
             <div className="flex items-center gap-2 text-xs text-slate-500">
               <i className="fas fa-shield-alt"></i>
               <span>Securely processed. No data stored.</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AutomateView;
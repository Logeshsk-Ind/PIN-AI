import React, { useState } from 'react';
import { generateRawResponse } from '../services/geminiService';

const RawModeView: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI.');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const result = await generateRawResponse(systemPrompt, userPrompt);
      setResponse(result);
    } catch (error: any) {
      setResponse(`Error: ${error.message || 'Execution failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-xl border-2 border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.1)] overflow-hidden font-mono text-green-500">
      {/* Header */}
      <div className="p-3 border-b border-red-900/30 bg-red-950/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fas fa-terminal text-red-500 animate-pulse"></i>
          <span className="font-bold text-red-500 tracking-widest uppercase text-sm">Pin Ai :: Raw Mode :: Root Access</span>
        </div>
        <div className="text-[10px] text-red-800">SECURE_CONNECTION_ESTABLISHED</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* System Instruction Injection */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-red-400 opacity-70">
            <i className="fas fa-microchip mr-2"></i>System Instruction Injection
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-black border border-red-900/50 rounded p-4 text-sm text-green-400 focus:border-red-500 focus:outline-none focus:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all min-h-[100px]"
            spellCheck="false"
          />
        </div>

        {/* User Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-red-400 opacity-70">
            <i className="fas fa-user-secret mr-2"></i>Raw Prompt Payload
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Enter raw payload..."
            className="w-full bg-black border border-red-900/50 rounded p-4 text-sm text-green-400 focus:border-red-500 focus:outline-none focus:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all min-h-[100px]"
            spellCheck="false"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-end">
          <button
            onClick={handleExecute}
            disabled={loading || !userPrompt}
            className="px-8 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-800 text-red-500 uppercase font-bold tracking-widest text-xs transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-play"></i>}
            Execute Payload
          </button>
        </div>

        {/* Console Output */}
        <div className="mt-8 border-t border-red-900/30 pt-6">
          <label className="text-xs uppercase tracking-widest text-red-400 opacity-70 mb-4 block">
            <i className="fas fa-desktop mr-2"></i>Console Output
          </label>
          <div className="bg-[#050505] border border-red-900/20 p-4 rounded min-h-[150px] relative">
            {response ? (
              <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">
                <span className="text-green-500 opacity-50 select-none">{'> '}</span>
                {response}
              </pre>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-red-900/40 text-sm animate-pulse">
                WAITING_FOR_INPUT...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawModeView;
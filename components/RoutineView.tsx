import React, { useState } from 'react';
import { generatePlan } from '../services/geminiService';
import { IndianLanguage } from '../types';

const RoutineView: React.FC = () => {
  const [details, setDetails] = useState('');
  const [language, setLanguage] = useState<IndianLanguage>(IndianLanguage.ENGLISH);
  const [routine, setRoutine] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    try {
      const result = await generatePlan('routine', details, language);
      setRoutine(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <i className="fas fa-calendar-check text-orange-400"></i>
           <h2 className="text-xl font-bold text-orange-400">Daily Routine</h2>
        </div>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-orange-400"
        >
          {Object.values(IndianLanguage).map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
           <label className="block text-slate-300 mb-2 text-sm">Describe your typical day (Wake up time, work hours, hobbies, etc.)</label>
           <div className="flex gap-2">
             <input 
               type="text" 
               className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-white"
               placeholder="e.g. Wake up 6am, Office 9-5, want to read books..."
               value={details}
               onChange={e => setDetails(e.target.value)}
             />
             <button 
               onClick={handleGenerate}
               disabled={loading}
               className="bg-orange-600 hover:bg-orange-500 text-white px-6 rounded font-bold"
             >
               {loading ? '...' : 'Optimize'}
             </button>
           </div>
        </div>

        <div className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700 overflow-y-auto">
          {routine ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-sm">
              {routine}
            </div>
          ) : (
            <div className="text-center text-slate-500 mt-20">
              <i className="fas fa-clock text-4xl mb-2"></i>
              <p>Get a productive daily schedule tailored to you.</p>
              {language !== IndianLanguage.ENGLISH && <p className="text-xs mt-2 text-orange-400">Output will be in {language}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutineView;
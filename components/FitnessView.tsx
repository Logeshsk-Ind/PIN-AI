import React, { useState } from 'react';
import { generatePlan } from '../services/geminiService';
import { IndianLanguage } from '../types';

const FitnessView: React.FC = () => {
  const [formData, setFormData] = useState({ age: '', weight: '', goal: 'Weight Loss', preference: 'Vegetarian' });
  const [language, setLanguage] = useState<IndianLanguage>(IndianLanguage.ENGLISH);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!formData.age || !formData.weight) return;
    setLoading(true);
    try {
      const details = `Age: ${formData.age}, Weight: ${formData.weight}, Goal: ${formData.goal}, Diet: ${formData.preference}`;
      const result = await generatePlan('fitness', details, language);
      setPlan(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <i className="fas fa-dumbbell text-green-400"></i>
            <h2 className="text-xl font-bold text-green-400">Fitness & Health</h2>
        </div>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 outline-none focus:border-green-400"
        >
          {Object.values(IndianLanguage).map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="text-white font-bold mb-4">Your Stats</h3>
            <input 
              type="number" placeholder="Age" 
              className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2 text-white"
              onChange={e => setFormData({...formData, age: e.target.value})}
            />
            <input 
              type="text" placeholder="Weight (kg)" 
              className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2 text-white"
              onChange={e => setFormData({...formData, weight: e.target.value})}
            />
            <select 
              className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2 text-white"
              onChange={e => setFormData({...formData, goal: e.target.value})}
              value={formData.goal}
            >
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Endurance</option>
              <option>Flexibility</option>
            </select>
            <select 
              className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2 text-white"
              onChange={e => setFormData({...formData, preference: e.target.value})}
              value={formData.preference}
            >
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
              <option>Eggetarian</option>
            </select>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition-colors"
            >
              {loading ? 'Generating Plan...' : 'Generate Plan'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700 overflow-y-auto">
          {plan ? (
            <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-sm">
              {plan}
            </div>
          ) : (
            <div className="text-center text-slate-500 mt-20">
              <i className="fas fa-heartbeat text-4xl mb-2"></i>
              <p>Enter your details to get a personalized fitness & diet plan.</p>
              {language !== IndianLanguage.ENGLISH && <p className="text-xs mt-2 text-green-400">Output will be in {language}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessView;
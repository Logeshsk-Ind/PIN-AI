import React, { useState, useEffect } from 'react';
import { getLatestNews } from '../services/geminiService';
import { NewsItem, IndianLanguage } from '../types';

const NewsView: React.FC = () => {
  const [topic, setTopic] = useState('Top Headlines India');
  const [language, setLanguage] = useState<IndianLanguage>(IndianLanguage.ENGLISH);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const result = await getLatestNews(topic, language);
      setNews(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [language]); // Re-fetch if language changes

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <i className="fas fa-newspaper text-red-400"></i>
          <h2 className="text-xl font-bold text-red-400">Daily News</h2>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as IndianLanguage)}
            className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-red-400"
          >
            {Object.values(IndianLanguage).map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <input 
            type="text" 
            value={topic} 
            onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white"
            placeholder="Search topic..."
          />
          <button onClick={fetchNews} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
           <div className="flex justify-center items-center h-full flex-col gap-2">
             <i className="fas fa-spinner fa-spin text-4xl text-red-400"></i>
             <p className="text-slate-500 text-xs">Finding news in {language}...</p>
           </div>
        ) : news ? (
           <div className="space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
               <div className="prose prose-invert max-w-none whitespace-pre-wrap mb-4 font-sans leading-relaxed">
                 {news.text}
               </div>
               {news.sources.length > 0 && (
                 <div className="border-t border-slate-700 pt-4">
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Sources</h4>
                   <div className="flex flex-wrap gap-2">
                     {news.sources.map((source, idx) => (
                       <a 
                        key={idx} 
                        href={source.web?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-slate-700 text-blue-400 text-xs px-2 py-1 rounded border border-slate-600 truncate max-w-[200px]"
                       >
                         {source.web?.title || 'Source Link'}
                       </a>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           </div>
        ) : null}
      </div>
    </div>
  );
};

export default NewsView;
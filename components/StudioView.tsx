import React, { useState } from 'react';
import { generateImage, generateVideo, generateSpeech } from '../services/geminiService';
import { GeneratedMedia, VideoAspectRatio } from '../types';

const StudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<GeneratedMedia[]>([]);
  const [videoAspectRatio, setVideoAspectRatio] = useState<VideoAspectRatio>('16:9');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    
    try {
      let url = '';
      if (activeTab === 'image') {
        url = await generateImage(prompt);
      } else if (activeTab === 'video') {
        url = await generateVideo(prompt, videoAspectRatio);
      } else {
        url = await generateSpeech(prompt);
      }
      
      setGallery(prev => [{ type: activeTab, url, prompt }, ...prev]);
    } catch (error) {
      console.error(error);
      alert(`Failed to generate ${activeTab}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/80">
        <h2 className="text-xl font-bold text-pin-gold flex items-center gap-2 mb-2">
          <i className="fas fa-magic"></i> Creative Studio
        </h2>
        <div className="flex space-x-2 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'image' ? 'bg-pin-gold text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-image mr-2"></i>Image
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'video' ? 'bg-pin-gold text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-video mr-2"></i>Video
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'audio' ? 'bg-pin-gold text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <i className="fas fa-music mr-2"></i>Music/Audio
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {activeTab === 'audio' ? 'Enter text to convert to speech/song lyrics' : 'Describe what you want to create'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeTab === 'image' ? "A futuristic cyberpunk city..." : activeTab === 'video' ? "A neon cat running..." : "Write a poem about rain and read it..."}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-pin-gold focus:outline-none min-h-[100px]"
            />
            
            {/* Video Options */}
            {activeTab === 'video' && (
              <div className="mt-4 flex gap-4">
                 <div className="flex items-center gap-2">
                   <label className="text-sm text-slate-300">Aspect Ratio:</label>
                   <select 
                     value={videoAspectRatio} 
                     onChange={(e) => setVideoAspectRatio(e.target.value as VideoAspectRatio)}
                     className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-pin-gold outline-none"
                   >
                     <option value="16:9">Landscape (16:9)</option>
                     <option value="9:16">Portrait (9:16)</option>
                   </select>
                 </div>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                {activeTab === 'image' ? 'Gemini Flash Image' : activeTab === 'video' ? 'Veo 3 (Key Req)' : 'Gemini TTS'}
              </span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  isGenerating 
                    ? 'bg-slate-700 cursor-wait text-slate-400' 
                    : 'bg-gradient-to-r from-pin-gold to-yellow-600 text-slate-900 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                }`}
              >
                {isGenerating ? (
                  <><i className="fas fa-spinner fa-spin"></i> Generating...</>
                ) : (
                  <><i className="fas fa-wand-magic-sparkles"></i> Create {activeTab}</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <h3 className="text-lg font-semibold text-white mb-4 pl-2 border-l-4 border-pin-gold">Your Creations</h3>
        {gallery.length === 0 ? (
          <div className="text-center py-20 text-slate-600 border-2 border-dashed border-slate-700 rounded-xl">
            <i className="fas fa-photo-video text-4xl mb-4"></i>
            <p>Your generated content will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg group hover:border-pin-gold transition-colors animate-fade-in">
                <div className="aspect-square bg-slate-900 relative flex items-center justify-center">
                   {item.type === 'image' ? (
                     <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                   ) : item.type === 'video' ? (
                     <video src={item.url} controls className="w-full h-full object-cover" />
                   ) : (
                     <audio src={item.url} controls className="w-11/12" />
                   )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-[10px] uppercase tracking-wider font-bold text-pin-gold border border-pin-gold px-1 rounded">{item.type}</span>
                     <a href={item.url} download={`pin-ai-${Date.now()}.${item.type === 'image' ? 'png' : item.type === 'video' ? 'mp4' : 'wav'}`} className="text-slate-400 hover:text-white">
                       <i className="fas fa-download"></i>
                     </a>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2" title={item.prompt}>{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioView;
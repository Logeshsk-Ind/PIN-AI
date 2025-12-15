import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ImageAttachment, ViewType } from '../types';
import { streamChatResponse } from '../services/geminiService';

interface ChatViewProps {
  onNavigate?: (view: ViewType, subTab?: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am Pin Ai. I can see images and speak Indian languages. Try uploading a photo or asking me something!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<ImageAttachment[]>([]);
  const [useFastModel, setUseFastModel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachments]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = (event.target.result as string).split(',')[1];
          setAttachments(prev => [...prev, { mimeType: file.type, data: base64String }]);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: textToSend,
      images: [...attachments] 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

    try {
      const history = messages.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.images) {
          m.images.forEach(img => {
            parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
          });
        }
        return { role: m.role, parts };
      });

      let fullText = '';
      await streamChatResponse(
        history, 
        userMsg.text, 
        (chunk) => {
          fullText += chunk;
          setMessages(prev => 
            prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg)
          );
        },
        userMsg.images,
        false, // not coding mode
        undefined, // default language
        useFastModel
      );
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(msg => msg.id === modelMsgId ? { ...msg, text: "I encountered an error. Please try again.", isError: true } : msg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/80">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-pin-teal flex items-center gap-2">
            <i className="fas fa-robot"></i> Chatbot
          </h2>
          <div className="flex items-center bg-slate-800 rounded-lg p-1 ml-4 border border-slate-700">
             <button 
               onClick={() => setUseFastModel(false)}
               className={`px-3 py-1 rounded text-xs font-medium transition-all ${!useFastModel ? 'bg-pin-teal text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
             >
               Standard
             </button>
             <button 
               onClick={() => setUseFastModel(true)}
               className={`px-3 py-1 rounded text-xs font-medium transition-all ${useFastModel ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
             >
               <i className="fas fa-bolt mr-1"></i>Fast
             </button>
          </div>
        </div>
        <span className="text-xs text-slate-500 uppercase tracking-widest hidden md:block">
           {attachments.length > 0 ? 'Vision Mode Active' : useFastModel ? 'Flash Lite Active' : 'Pin Ai Core'}
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-pin-teal to-pin-accent text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-brain'}`}></i>
                <span>{msg.role === 'user' ? 'You' : 'Pin Ai'}</span>
              </div>
              
              {/* Display Images if present */}
              {msg.images && msg.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={`data:${img.mimeType};base64,${img.data}`} 
                      alt="uploaded" 
                      className="w-32 h-32 object-cover rounded-lg border border-white/20"
                    />
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* Feature Discovery Grid (Visible when conversation is new) */}
        {messages.length === 1 && (
          <div className="mt-8 px-2 md:px-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Featured Capabilities</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Feature 1: Video */}
              <button 
                onClick={() => onNavigate && onNavigate(ViewType.STUDIO, 'video')}
                className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-pin-gold hover:bg-slate-800 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-video text-pin-gold"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-200">Video Gen</h4>
                <p className="text-[10px] text-slate-400 mt-1">Prompt to Video with Veo 3</p>
              </button>

              {/* Feature 2: Fast Mode */}
              <button 
                onClick={() => setUseFastModel(!useFastModel)}
                className={`bg-slate-800/60 p-4 rounded-xl border transition-all text-left group ${useFastModel ? 'border-yellow-500 bg-yellow-900/10' : 'border-slate-700 hover:border-yellow-500 hover:bg-slate-800'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-bolt text-yellow-500"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-200">Fast Responses</h4>
                <p className="text-[10px] text-slate-400 mt-1">{useFastModel ? 'Enabled (Flash Lite)' : 'Enable Flash Lite'}</p>
              </button>

              {/* Feature 3: Image Analysis */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-pin-teal hover:bg-slate-800 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-expand text-pin-teal"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-200">Analyze Images</h4>
                <p className="text-[10px] text-slate-400 mt-1">Gemini 3 Pro Vision</p>
              </button>

               {/* Feature 4: TTS */}
              <button 
                onClick={() => onNavigate && onNavigate(ViewType.STUDIO, 'audio')}
                className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:border-pink-500 hover:bg-slate-800 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <i className="fas fa-music text-pink-500"></i>
                </div>
                <h4 className="font-bold text-sm text-slate-200">Generate Speech</h4>
                <p className="text-[10px] text-slate-400 mt-1">Text to Audio</p>
              </button>
            </div>
          </div>
        )}
        
        {/* Language Suggestions */}
        {messages.length === 1 && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 px-2 md:px-6">
              <button onClick={() => handleSend("வணக்கம்! எப்படி இருக்கிறீர்கள்?")} className="p-3 bg-slate-800/30 border border-slate-700/50 hover:border-pin-teal rounded-xl text-left transition-all group">
                <span className="text-xs text-slate-500 block mb-1">Tamil</span>
                <span className="text-sm text-slate-300 font-medium group-hover:text-pin-teal">வணக்கம்!</span>
              </button>
              <button onClick={() => handleSend("నమస్కారం! మీరు ఎలా ఉన్నారు?")} className="p-3 bg-slate-800/30 border border-slate-700/50 hover:border-pin-teal rounded-xl text-left transition-all group">
                <span className="text-xs text-slate-500 block mb-1">Telugu</span>
                <span className="text-sm text-slate-300 font-medium group-hover:text-pin-teal">నమస్కారం!</span>
              </button>
              <button onClick={() => handleSend("നമസ്കാരം! സുഖമാണോ?")} className="p-3 bg-slate-800/30 border border-slate-700/50 hover:border-pin-teal rounded-xl text-left transition-all group">
                <span className="text-xs text-slate-500 block mb-1">Malayalam</span>
                <span className="text-sm text-slate-300 font-medium group-hover:text-pin-teal">നമസ്കാരം!</span>
              </button>
              <button onClick={() => handleSend("ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?")} className="p-3 bg-slate-800/30 border border-slate-700/50 hover:border-pin-teal rounded-xl text-left transition-all group">
                <span className="text-xs text-slate-500 block mb-1">Kannada</span>
                <span className="text-sm text-slate-300 font-medium group-hover:text-pin-teal">ನಮಸ್ಕಾರ!</span>
              </button>
           </div>
        )}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex justify-start animate-pulse">
             <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700">
               <span className="flex gap-1">
                 <span className="w-2 h-2 bg-pin-teal rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-pin-teal rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-pin-teal rounded-full animate-bounce delay-200"></span>
               </span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-700">
        
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            {attachments.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={`data:${img.mimeType};base64,${img.data}`} 
                  className="h-16 w-16 object-cover rounded-lg border border-pin-teal/50" 
                  alt="preview"
                />
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-slate-800 rounded-xl p-2 border border-slate-600 focus-within:border-pin-teal transition-colors">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-pin-teal transition-colors"
            title="Upload Image"
          >
            <i className="fas fa-image"></i>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachments.length > 0 ? "Ask about this image..." : "Ask Pin Ai anything..."}
            className="w-full bg-transparent text-slate-100 p-2 focus:outline-none resize-none max-h-32 min-h-[44px]"
            rows={1}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="mb-1 p-2 bg-pin-teal hover:bg-pin-accent text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <div className="text-center mt-2 flex justify-between px-2">
            <span className="text-[10px] text-slate-600">
                {useFastModel ? 'Running on Gemini Flash Lite' : 'Running on Gemini Flash 2.5'}
            </span>
            <span className="text-[10px] text-slate-600">
                AI can make mistakes. Verify important info.
            </span>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import ChatView from './components/ChatView';
import StudioView from './components/StudioView';
import AutomateView from './components/AutomateView';
import CodingView from './components/CodingView';
import FitnessView from './components/FitnessView';
import RoutineView from './components/RoutineView';
import NewsView from './components/NewsView';
import RawModeView from './components/RawModeView';
import LockScreen from './components/LockScreen';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.CHAT);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Security State
  const [isLocked, setIsLocked] = useState(true);
  
  // Navigation State for Studio (default tab)
  const [studioInitialTab, setStudioInitialTab] = useState<'image' | 'video' | 'audio'>('image');

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (view: ViewType, subTab?: string) => {
    if (view === ViewType.STUDIO && subTab) {
      setStudioInitialTab(subTab as 'image' | 'video' | 'audio');
    }
    setCurrentView(view);
    if (isMobile) setSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.CHAT: return <ChatView onNavigate={handleNavigate} />;
      case ViewType.STUDIO: return <StudioView initialTab={studioInitialTab} />;
      case ViewType.AUTOMATE: return <AutomateView />;
      case ViewType.CODING: return <CodingView />;
      case ViewType.FITNESS: return <FitnessView />;
      case ViewType.ROUTINE: return <RoutineView />;
      case ViewType.NEWS: return <NewsView />;
      case ViewType.RAW: return <RawModeView />;
      default: return <ChatView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
      
      {/* Security Overlay */}
      {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}
      
      {/* Prominent Website Link (Floating Top Right) */}
      <a 
        href="https://logeshsk-ind.github.io/Web/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 bg-slate-900/80 border border-pin-gold/30 text-pin-gold px-3 py-1 rounded-full text-xs font-bold hover:bg-pin-gold hover:text-slate-900 transition-all flex items-center gap-2 shadow-lg animate-fade-in"
      >
        <span>logeshsk-ind.github.io</span>
        <i className="fas fa-external-link-alt"></i>
      </a>

      {isMobile && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-20 flex items-center justify-between px-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pin-gold to-yellow-700 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                   <span className="font-bold text-pin-gold text-sm">P</span>
                </div>
             </div>
             <span className="text-lg font-bold text-white">Pin Ai</span>
           </div>
           <button onClick={() => setSidebarOpen(true)} className="text-slate-200 p-2 hover:bg-slate-800 rounded-lg mr-8">
             <i className="fas fa-bars text-xl"></i>
           </button>
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 shadow-2xl border-r border-slate-700' : 'relative z-10 border-r border-slate-800'} ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out bg-slate-900 flex flex-col ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        {!isMobile && (
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-6 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-700 text-xs hover:text-white z-50">
            <i className={`fas fa-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        )}

        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pin-gold to-yellow-700 p-0.5 shadow-lg shadow-pin-gold/20 flex-shrink-0">
               <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <span className="font-bold text-pin-gold text-lg">P</span>
               </div>
            </div>
            {isSidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pin-gold to-white">Pin Ai</h1>
                <p className="text-[10px] text-slate-500">Personal Indian Ai</p>
              </div>
            )}
          </div>
          {isMobile && (
             <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-2">
               <i className="fas fa-times"></i>
             </button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon="fa-comments" label="Chatbot" isActive={currentView === ViewType.CHAT} onClick={() => handleNavigate(ViewType.CHAT)} isOpen={isSidebarOpen} />
          <NavItem icon="fa-code" label="Coding" isActive={currentView === ViewType.CODING} onClick={() => handleNavigate(ViewType.CODING)} isOpen={isSidebarOpen} />
          <NavItem icon="fa-layer-group" label="Studio" isActive={currentView === ViewType.STUDIO} onClick={() => handleNavigate(ViewType.STUDIO)} isOpen={isSidebarOpen} />
          <NavItem icon="fa-robot" label="Automate" isActive={currentView === ViewType.AUTOMATE} onClick={() => handleNavigate(ViewType.AUTOMATE)} isOpen={isSidebarOpen} />
          <div className="my-2 border-t border-slate-800"></div>
          <NavItem icon="fa-dumbbell" label="Fitness" isActive={currentView === ViewType.FITNESS} onClick={() => handleNavigate(ViewType.FITNESS)} isOpen={isSidebarOpen} />
          <NavItem icon="fa-calendar-check" label="Routine" isActive={currentView === ViewType.ROUTINE} onClick={() => handleNavigate(ViewType.ROUTINE)} isOpen={isSidebarOpen} />
          <NavItem icon="fa-newspaper" label="Daily News" isActive={currentView === ViewType.NEWS} onClick={() => handleNavigate(ViewType.NEWS)} isOpen={isSidebarOpen} />
          <div className="my-2 border-t border-slate-800"></div>
          <NavItem icon="fa-lock" label="Raw Mode" isActive={currentView === ViewType.RAW} onClick={() => handleNavigate(ViewType.RAW)} isOpen={isSidebarOpen} isDanger={true} />
        </nav>

        <div className="p-4 border-t border-slate-800">
           {isSidebarOpen ? (
             <div className="text-xs text-slate-500">
               <p>Founder: <span className="text-pin-teal">Logesh</span></p>
             </div>
           ) : (
             <div className="flex justify-center text-slate-500"><i className="fas fa-info-circle"></i></div>
           )}
        </div>
      </aside>

      <main className={`flex-1 p-4 md:p-6 overflow-hidden relative z-0 flex flex-col ${isMobile ? 'pt-20' : ''}`}>
        {renderView()}
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isOpen: boolean;
  isDanger?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isOpen, isDanger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? isDanger 
          ? 'bg-red-900/20 text-red-500 border-l-2 border-red-500'
          : 'bg-gradient-to-r from-pin-teal/20 to-transparent text-pin-teal border-l-2 border-pin-teal' 
        : isDanger
          ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/10'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <i className={`fas ${icon} w-5 text-center ${isActive ? (isDanger ? 'text-red-500' : 'text-pin-teal') : ''}`}></i>
    {isOpen && <span className="font-medium animate-fade-in">{label}</span>}
  </button>
);

export default App;
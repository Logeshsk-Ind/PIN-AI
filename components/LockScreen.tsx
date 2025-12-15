import React, { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  
  // Hardcoded PIN for demo - ideally strictly personal
  const CORRECT_PIN = '1234';

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center text-white font-sans">
      <div className="mb-10 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pin-gold to-yellow-700 p-0.5 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
           <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center">
              <span className="font-bold text-pin-gold text-4xl">P</span>
           </div>
        </div>
        <h1 className="text-2xl font-bold tracking-widest text-pin-teal uppercase">Pin Ai</h1>
        <p className="text-xs text-slate-500 mt-2 tracking-[0.2em] uppercase">Identity Verification</p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border border-slate-700 transition-all duration-300 ${
              pin.length > i 
                ? error ? 'bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-pin-gold border-pin-gold shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-[300px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handlePress(num.toString())}
            className="w-16 h-16 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-pin-teal/50 text-xl font-medium transition-all active:scale-95 flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <div className="flex items-center justify-center">
            {/* Empty space or back */}
        </div>
        <button
            onClick={() => handlePress('0')}
            className="w-16 h-16 rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-pin-teal/50 text-xl font-medium transition-all active:scale-95 flex items-center justify-center"
          >
            0
        </button>
        <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full text-slate-400 hover:text-white transition-all active:scale-95 flex items-center justify-center"
          >
            <i className="fas fa-backspace"></i>
        </button>
      </div>

      <p className="mt-12 text-slate-600 text-xs">Default Security PIN: 1234</p>
    </div>
  );
};

export default LockScreen;
import React from 'react';
import { Trophy } from 'lucide-react';

// 1. The Full Page "Sonar" Loader
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring - Slow Pulse */}
        <div className="absolute h-32 w-32 rounded-full border-4 border-emerald-100 opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        {/* Middle Ring - Faster Pulse */}
        <div className="absolute h-24 w-24 rounded-full border-4 border-emerald-200 opacity-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_200ms]"></div>
        
        {/* Inner Solid Circle */}
        <div className="relative h-16 w-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50 animate-bounce">
          <Trophy className="text-white drop-shadow-md" size={24} />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-1">
        <span className="text-emerald-800 font-black tracking-widest text-lg animate-pulse">TURF WAR</span>
        <span className="text-xs font-semibold text-emerald-600/70 uppercase tracking-widest">Scouting the field...</span>
      </div>
    </div>
  );
};

// 2. The Button "Ring" Loader
export const ButtonLoader = ({ color = "text-white", size = 20 }) => {
  return (
    <svg className={`animate-spin ${color}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};
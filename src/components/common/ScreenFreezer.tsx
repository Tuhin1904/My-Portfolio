import React from 'react';

interface ScreenFreezerProps {
  message?: string;
}

const ScreenFreezer: React.FC<ScreenFreezerProps> = ({ message = "Processing, please wait..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950/75 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center p-8 rounded-2xl max-w-xs w-full text-center">
        {/* Glow effect in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
        
        {/* Modern Spinner */}
        <div className="relative w-16 h-16 mb-6">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          {/* Spinning Gradient Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500/40 animate-spin" />
          {/* Inner Pulsing Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-violet-400/20 animate-pulse" />
        </div>
        
        {/* Animated Message */}
        <p className="text-white text-base font-medium tracking-wide animate-pulse">
          {message}
        </p>
        
        {/* Micro-subtext */}
        <p className="text-gray-500 text-xs mt-2 font-light">
          Securing your session
        </p>
      </div>
    </div>
  );
};

export default ScreenFreezer;

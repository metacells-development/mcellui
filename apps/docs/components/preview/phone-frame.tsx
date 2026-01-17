'use client';

import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}

export function PhoneFrame({ children, dark = false, className = '' }: PhoneFrameProps) {
  return (
    <div className={`flex justify-center py-8 px-4 ${className}`}>
      <div className="relative">
        {/* Phone outer frame with subtle shadow and glow */}
        <div
          className={`relative w-[375px] h-[680px] rounded-[3rem] border-[14px] overflow-hidden transition-all duration-300 ${
            dark
              ? 'border-zinc-800 shadow-2xl shadow-black/40'
              : 'border-zinc-200 shadow-2xl shadow-zinc-400/20'
          }`}
          style={{
            background: dark
              ? 'linear-gradient(145deg, #1a1a1a, #0a0a0a)'
              : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          }}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center justify-center w-[126px] h-[37px] bg-black rounded-[20px]">
              {/* Camera dot */}
              <div className="absolute right-4 w-[12px] h-[12px] rounded-full bg-zinc-800 border-2 border-zinc-700">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-violet-500/30 to-blue-500/30" />
              </div>
            </div>
          </div>

          {/* Screen content area */}
          <div
            className={`w-full h-full overflow-auto transition-colors duration-300 ${
              dark ? 'bg-zinc-950' : 'bg-white'
            }`}
          >
            {/* Safe area padding for notch */}
            <div className="pt-14">
              {children}
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`w-[134px] h-[5px] rounded-full transition-colors duration-300 ${
                dark ? 'bg-zinc-600' : 'bg-zinc-300'
              }`}
            />
          </div>
        </div>

        {/* Reflection effect */}
        <div
          className="absolute inset-0 rounded-[3rem] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>
    </div>
  );
}

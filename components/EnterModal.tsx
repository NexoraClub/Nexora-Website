"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface EnterModalProps {
  isOpen: boolean;
  onChoice: (withMusic: boolean) => void;
}

export default function EnterModal({ isOpen, onChoice }: EnterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white p-6 sm:p-9 rounded-[32px] sm:rounded-[36px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 items-center max-w-lg w-full mx-4 text-center select-none transform transition-all duration-300 animate-in zoom-in-95">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-sky-400 text-xs font-mono tracking-widest uppercase">
            <span>●</span> Nexora ISE Technical Club
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Welcome to Nexora
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-medium max-w-sm mx-auto">
            Experience the departmental showcase with immersive cyber ambient sound.
          </p>
        </div>

        <div className="flex flex-row gap-3 sm:gap-4 w-full justify-center flex-wrap pt-2">
          <button
            onClick={() => onChoice(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 sm:px-7 sm:py-3.5 rounded-full border-2 border-black hover:bg-[#38bdf8] hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-bold text-xs sm:text-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            Enter with Music
          </button>

          <button
            onClick={() => onChoice(false)}
            className="flex items-center gap-2 bg-white text-black px-5 py-3 sm:px-7 sm:py-3.5 rounded-full border-2 border-black hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-bold text-xs sm:text-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
          >
            <VolumeX className="w-4 h-4" />
            Enter without Music
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-gray-500 tracking-wide italic">
          music&apos;s fun, immerse in the cyber experience!
        </p>
      </div>
    </div>
  );
}

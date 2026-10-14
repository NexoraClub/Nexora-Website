"use client";

import { useEffect, useState } from "react";
import localFont from "next/font/local";

const bartle = localFont({
  src: "../public/fonts/BBHBartle-Regular.ttf",
  display: "swap",
  fallback: ["sans-serif"],
});

interface PreloaderProps {
  onFinish?: () => void;
}

export default function Preloader({ onFinish }: PreloaderProps) {
  const [complete, setComplete] = useState(false);
  const [hide, setHide] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);

  const text = "NEXORA'26";

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const duration = 3000; // 3 seconds linear count
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.round(progress * 100);

      setDisplayCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Ensure all letters are fully lit
        setDisplayCount(100);

        // Small delay to let user see the full lit text
        setTimeout(() => {
          setComplete(true);
          setTimeout(() => {
            document.body.style.overflow = "";
            setHide(true);
            if (onFinish) onFinish();
          }, 1000); // Duration for sliding up
        }, 800);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = "";
    };
  }, [onFinish]);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black text-white transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] select-none ${
        complete ? "-translate-y-full rounded-b-[50%]" : "translate-y-0 rounded-b-none"
      }`}
    >
      {/* Smooth Progress Bar at Top */}
      <div
        className="absolute top-0 left-0 h-1 bg-white transition-all duration-75 ease-linear"
        style={{ width: `${displayCount}%` }}
      />

      {/* Lit Characters Animation */}
      <div className={`flex tracking-wider sm:tracking-widest ${bartle.className}`}>
        {text.split("").map((char, index) => {
          const threshold = (index / text.length) * 100;
          const isLit = displayCount > threshold;

          return (
            <span
              key={index}
              className={`text-[8vw] sm:text-[6vw] font-bold leading-none inline-block transition-all duration-300 ${
                isLit
                  ? "text-white opacity-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-glitch"
                  : "text-gray-800 opacity-20 blur-[1px]"
              }`}
              style={{
                minWidth: char === " " ? "1.5vw" : "auto",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes glitch {
          0% { transform: translate(0); opacity: 1; }
          2% { transform: translate(-2px, 2px); opacity: 0.8; }
          4% { transform: translate(2px, -2px); opacity: 1; }
          6% { transform: translate(0); opacity: 1; }
          8% { transform: translate(0); opacity: 0.5; }
          10% { transform: translate(0); opacity: 1; }
          12% { transform: translate(-2px, 0); opacity: 0.8; }
          14% { transform: translate(0); opacity: 1; }
          50% { transform: translate(1px, 1px); opacity: 0.9; }
          100% { transform: translate(0); opacity: 1; }
        }
        .animate-glitch {
          animation: glitch 0.4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}} />
    </div>
  );
}

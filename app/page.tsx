"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { useAudio } from "@/components/AudioProvider";

export default function HomePage() {
  const [preloaderFinished, setPreloaderFinished] = useState<boolean | null>(null);
  const [introStarted, setIntroStarted] = useState(false);
  const { initializeAudio } = useAudio();

  useEffect(() => {
    // Check sessionStorage on mount to determine whether preloader should show
    const hasSeenPreloader =
      typeof window !== "undefined" &&
      sessionStorage.getItem("preloaderShown") === "true";

    queueMicrotask(() => {
      setPreloaderFinished(hasSeenPreloader);
      if (hasSeenPreloader) {
        initializeAudio(true);
        setIntroStarted(true);
      }
    });
  }, [initializeAudio]);

  const handlePreloaderFinish = () => {
    setPreloaderFinished(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("preloaderShown", "true");
    }
    initializeAudio(true);
    setIntroStarted(true);
  };

  // Show dark background while checking sessionStorage to prevent layout flash
  if (preloaderFinished === null) {
    return <div className="min-h-screen bg-[var(--theme-bg-main,#060913)]" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--theme-bg-hero,#dce6ef)] text-white">
      {/* Starting UI Animation ("NEXORA") */}
      {preloaderFinished === false && (
        <Preloader onFinish={handlePreloaderFinish} />
      )}

      <main className="relative min-h-screen w-full bg-[var(--theme-bg-hero,#dce6ef)] text-white">
        <Navbar />
        <Hero introStarted={introStarted} />
        <Footer />
      </main>
    </div>
  );
}
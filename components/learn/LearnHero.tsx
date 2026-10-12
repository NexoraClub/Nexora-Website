"use client";

import React from "react";
import { Search } from "./Icons";

interface LearnHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuickFilter?: (filter: string) => void;
}

export default function LearnHero({
  searchQuery,
  onSearchChange,
  onSelectQuickFilter,
}: LearnHeroProps) {
  const quickLinks = [
    { label: "Study Materials", target: "#study-materials", filter: "notes" },
    { label: "Exam Corner", target: "#upcoming-exams", filter: "exams" },
    { label: "Skill Development", target: "#skill-development", filter: "skills" },
    { label: "Latest Updates", target: "#latest-updates", filter: "updates" },
  ];

  return (
    <section className="relative flex w-full flex-col items-center justify-center pt-28 pb-14 px-4 text-center sm:px-6 lg:px-8">
      {/* Background glow circle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-[130px] sm:h-[450px] sm:w-[450px]"
      />

      {/* Badge / Pill */}
      <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/40 px-4 py-1.5 text-xs font-semibold tracking-wider text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
        NEXORA ACADEMIC & SKILL PORTAL
      </div>

      {/* Main Heading */}
      <h1 className="relative z-10 font-jersey text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
        Learn Something New<span className="text-sky-400">.</span>
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 mt-4 max-w-2xl text-base sm:text-lg text-sky-100/70 font-sans leading-relaxed">
        Your space for academic resources, exam updates and skill development.
      </p>

      {/* Search Input Box */}
      <div className="relative z-10 mt-8 w-full max-w-2xl">
        <div className="group relative flex items-center rounded-2xl border border-sky-400/40 bg-black/70 px-4 py-3 shadow-[0_0_25px_rgba(56,189,248,0.15)] backdrop-blur-md transition-all duration-300 focus-within:border-sky-400 focus-within:shadow-[0_0_30px_rgba(56,189,248,0.35)]">
          <label htmlFor="learn-search" className="sr-only">
            Search notes, subjects, resources
          </label>
          <Search className="h-5 w-5 text-sky-400 shrink-0 transition-transform duration-200 group-focus-within:scale-110" />
          <input
            id="learn-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes, subjects, resources..."
            className="ml-3 w-full bg-transparent text-sm sm:text-base text-white placeholder-sky-200/40 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="ml-2 rounded-full bg-white/10 p-1 text-xs text-sky-300 hover:bg-white/20 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span className="text-white/40 font-medium mr-1">Quick Jump:</span>
        {quickLinks.map((item) => (
          <a
            key={item.label}
            href={item.target}
            onClick={() => onSelectQuickFilter && onSelectQuickFilter(item.filter)}
            className="rounded-full border border-sky-500/20 bg-sky-950/20 px-3.5 py-1.5 font-medium text-sky-200/80 transition-all duration-200 hover:border-sky-400 hover:bg-sky-500/10 hover:text-white hover:shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Neon divider accent */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-12 h-px w-48 bg-gradient-to-r from-transparent via-sky-400/80 to-transparent shadow-[0_0_10px_rgba(56,189,248,0.8)]"
      />
    </section>
  );
}

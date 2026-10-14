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
      {/* Badge / Pill */}
      <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--theme-primary,#84C87F)]/40 bg-[var(--theme-primary,#84C87F)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--theme-primary,#84C87F)] font-terminal shadow-[0_0_15px_rgba(132,200,127,0.2)]">
        <span className="h-2 w-2 rounded-full bg-[var(--theme-primary,#84C87F)] animate-pulse" />
        NEXORA ACADEMIC &amp; SKILL PORTAL
      </div>

      {/* Main Heading */}
      <h1 className="relative z-10 font-clash font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[var(--theme-bg-hero,#c2e0a5)]">
        Learn Something New<span className="text-[var(--theme-primary,#84C87F)]">.</span>
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 mt-4 max-w-2xl text-base sm:text-lg text-[var(--theme-primary,#84C87F)]/80 font-cabinet leading-relaxed">
        Your space for academic resources, VTU question papers, exam updates, and engineering skill tracks.
      </p>

      {/* Search Input Box */}
      <div className="relative z-10 mt-8 w-full max-w-2xl">
        <div className="group relative flex items-center rounded-2xl border border-[var(--theme-primary,#84C87F)]/40 bg-[#03080a] px-4 py-3 shadow-[0_0_25px_rgba(132,200,127,0.15)] backdrop-blur-md transition-all duration-300 focus-within:border-[var(--theme-primary,#84C87F)] focus-within:shadow-[0_0_30px_rgba(132,200,127,0.35)]">
          <label htmlFor="learn-search" className="sr-only">
            Search notes, subjects, resources
          </label>
          <Search className="h-5 w-5 text-[var(--theme-primary,#84C87F)] shrink-0 transition-transform duration-200 group-focus-within:scale-110" />
          <input
            id="learn-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes, subjects, resources, lab manuals..."
            className="ml-3 w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 focus:outline-none font-cabinet"
          />
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.target}
            data-cursor={link.label}
            onClick={() => onSelectQuickFilter?.(link.filter)}
            className="rounded-full border border-[var(--theme-primary,#84C87F)]/30 bg-[#03080a] px-4 py-1.5 text-xs font-clash font-bold uppercase tracking-wider text-[var(--theme-bg-hero,#c2e0a5)] transition-all duration-200 hover:bg-[var(--theme-primary,#84C87F)] hover:text-[var(--theme-bg-main,#064928)] shadow-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

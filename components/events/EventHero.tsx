'use client';

import React from 'react';
import { ArrowDown, Calendar, Sparkles, Terminal } from 'lucide-react';

export default function EventHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative w-full pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background Neon Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 -z-10 h-72 w-72 sm:h-[450px] sm:w-[450px] rounded-full bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-indigo-600/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-40 -z-10 h-60 w-60 rounded-full bg-sky-400/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/40 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.25)]">
          <Terminal className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
          <span className="font-jersey text-xs tracking-[0.2em] uppercase text-sky-300">
            NEXORA | INFORMATION SCIENCE &amp; ENGINEERING
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          <span className="block drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Where Ideas Become
          </span>
          <span className="mt-2 block bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
            Innovation.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-sky-100/75 leading-relaxed font-normal">
          Explore the events, workshops, hackathons, and competitions that bring technology, creativity, and collaboration together.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => scrollToSection('events-grid')}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full border border-sky-300/60 bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:from-sky-400 hover:to-cyan-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.65)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
            <span>Explore Events</span>
            <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform duration-300" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('past-events')}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-sky-400/40 bg-black/60 px-7 py-3.5 text-sm font-semibold text-sky-200 backdrop-blur-md transition-all duration-300 hover:border-sky-400 hover:bg-sky-400/10 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-sky-400" />
            <span>Past Events</span>
          </button>
        </div>

        {/* Tech stats bar */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-3 divide-x divide-sky-500/20 rounded-2xl border border-sky-500/20 bg-slate-950/40 p-4 sm:p-5 backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.1)]">
          <div className="px-2 text-center">
            <p className="font-jersey text-2xl sm:text-3xl text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">6</p>
            <p className="text-[11px] sm:text-xs text-sky-100/60 uppercase tracking-wider mt-0.5">Event Tracks</p>
          </div>
          <div className="px-2 text-center">
            <p className="font-jersey text-2xl sm:text-3xl text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">100%</p>
            <p className="text-[11px] sm:text-xs text-sky-100/60 uppercase tracking-wider mt-0.5">Hands-On Tech</p>
          </div>
          <div className="px-2 text-center">
            <p className="font-jersey text-2xl sm:text-3xl text-indigo-300 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">ISE</p>
            <p className="text-[11px] sm:text-xs text-sky-100/60 uppercase tracking-wider mt-0.5">Student Community</p>
          </div>
        </div>

        {/* Bottom glowing separator */}
        <div
          aria-hidden="true"
          className="mx-auto mt-16 h-px w-48 sm:w-72 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_rgba(56,189,248,0.8)]"
        />
      </div>
    </section>
  );
}

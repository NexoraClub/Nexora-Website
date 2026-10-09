import React from 'react';

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-sky-500/20 bg-[#050610]/60 px-5 py-12 backdrop-blur-md sm:px-8 lg:px-16">
      {/* Top neon glow on border */}
      <div 
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[1px] w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.6)]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-4 md:gap-8 lg:gap-12">
        
        {/* Column 1: Brand & Description */}
        <div className="flex flex-col md:col-span-1">
          <h2 className="font-jersey text-2xl tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            NEXORA
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sky-100/60">
            Department of Information Science and Engineering. Fostering innovation, building the future, and empowering the next generation of tech leaders.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm text-sky-200/60">
            <li><a href="#home" className="transition-colors hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">Our Vision</a></li>
            <li><a href="#" className="transition-colors hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">Upcoming Events</a></li>
            <li><a href="#" className="transition-colors hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">Projects & Hacks</a></li>
            <li><a href="#" className="transition-colors hover:text-sky-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">Join the Club</a></li>
          </ul>
        </div>

        {/* Column 3: Contact & Info */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-sky-200/60">
            <li><span className="text-white/40">Email:</span> <a href="mailto:contact@nexora.club" className="transition-colors hover:text-sky-400">contact@nexora.club</a></li>
            <li><span className="text-white/40">Location:</span> Tech Hub, Main Campus</li>
            <li><span className="text-white/40">Hours:</span> Mon - Fri, 9AM - 5PM</li>
          </ul>
        </div>

        {/* Column 4: Legal & Social */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <span className="text-xs text-sky-400">X</span>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <span className="text-xs text-sky-400">in</span>
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]">
              <span className="text-xs text-sky-400">gh</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-xs text-white/40">
          &copy; 2026 Nexora Club. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-white/40">
          <a href="#" className="transition-colors hover:text-sky-400">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-sky-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

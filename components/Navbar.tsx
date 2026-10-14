"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "@/components/AudioProvider";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "NOTICE", href: "/notices" },
  { name: "EVENTS", href: "/events" },
  { name: "ACHIEVEMENTS", href: "/achievements" },
  { name: "ABOUT US", href: "/about" },
  { name: "LEARN", href: "/learn" },
  { name: "PRACTICE", href: "/practice" },
  { name: "ATS", href: "/ats" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { musicPlaying, audioInitialized, toggleMusic } = useAudio();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-40 px-3 pt-3 pb-2 sm:px-8 sm:pt-6 transition-all duration-300">
      <nav className="relative mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between rounded-full border border-sky-400/50 bg-black/85 px-4 sm:px-8 lg:px-12 text-white shadow-[0_0_12px_2px_rgba(56,189,248,0.35),0_0_30px_5px_rgba(56,189,248,0.18)] backdrop-blur-md">
        {/* College Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/aj.webp"
            alt="AJIET logo"
            width={200}
            height={200}
            priority
            className="h-auto w-32 xs:w-36 sm:w-48 lg:w-64 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden z-20 items-center gap-6 md:flex lg:gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative whitespace-nowrap cursor-pointer py-2 text-xs font-semibold
                  transition-colors duration-300 ease-in-out lg:text-sm
                  hover:text-sky-400
                  ${active ? "text-sky-400" : "text-gray-200"}`}
              >
                {link.name}

                {/* Animated Underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[3px] rounded-full
                    bg-sky-400 transition-all duration-300 ease-in-out
                    ${active ? "w-full opacity-100" : "w-0 opacity-0"}`}
                />
              </Link>
            );
          })}
        </div>

        {/* Music Control Button */}
        {audioInitialized && (
          <button
            onClick={toggleMusic}
            aria-label={musicPlaying ? "Pause music" : "Play music"}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full
              border border-sky-400/40 text-sky-400 transition-all duration-300
              hover:bg-sky-400/10 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {musicPlaying ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M5 3.868v16.264a1 1 0 001.574.832l12.198-8.132a1 1 0 000-1.664L6.574 3.036A1 1 0 005 3.868z" />
              </svg>
            )}
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-2 rounded-xl border border-sky-400/40 p-2
            text-sky-400 transition duration-300
            hover:bg-sky-400/10 md:hidden cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation Dropdown & Backdrop */}
        {menuOpen && (
          <>
            {/* Backdrop overlay to close when tapping outside */}
            <div
              className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-xs md:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <div
              className="absolute left-2 right-2 top-[calc(100%+10px)]
                z-50 rounded-2xl border border-sky-400/40 bg-[#070b16]/95 p-3
                shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-xl md:hidden max-h-[calc(100vh-85px)] overflow-y-auto"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold
                        transition-all duration-200
                        ${
                          active
                            ? "bg-sky-500/20 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                            : "text-white hover:bg-sky-400/10 hover:text-sky-300 active:bg-sky-400/20"
                        }`}
                    >
                      <span>{link.name}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
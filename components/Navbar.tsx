"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "HOME", href: "#home" },
  { name: "NOTICE", href: "#notice" },
  { name: "ACHIEVEMENTS", href: "#achievements" },
  { name: "ABOUT US", href: "#about" },
  { name: "LEARN", href: "#learn" },
  { name: "ATS", href: "#learn" },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("HOME");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full absolute top-0 left-0 z-30  px-4 pt-3 pb-3 sm:px-8 sm:pt-8">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-sky-400/50 bg-black px-5 text-white shadow-[0_0_12px_2px_rgba(56,189,248,0.35),0_0_30px_5px_rgba(56,189,248,0.18)] sm:px-8 lg:px-12" >
        {/* College Logo */}
        <Link
          href="#home"
          onClick={() => {
            setActiveLink("HOME");
            setMenuOpen(false);
          }}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/aj.webp"
            alt="AJIET logo"
            width={200}
            height={200}
            priority
            className="h-auto w-40 object-contain sm:w-48 lg:w-56"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden z-20 items-center gap-6 md:flex lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.name)}
              className={`relative whitespace-nowrap cursor-pointer py-2 text-xs font-semibold
                transition-colors duration-300 ease-in-out lg:text-sm
                hover:text-sky-400
                ${
                  activeLink === link.name
                    ? "text-sky-400"
                    : "text-gray-200"
                }`}
            >
              {link.name}

              {/* Animated Underline */}
              <span
                className={`absolute bottom-0 left-0 h-[3px] rounded-full
                  bg-sky-400 transition-all duration-300 ease-in-out
                  ${
                    activeLink === link.name
                      ? "w-full opacity-100"
                      : "w-0 opacity-0"
                  }`}
              />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-3 rounded-lg border border-sky-400/40 p-2
            text-sky-400 transition duration-300
            hover:bg-sky-400/10 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+14px)]
              z-50 rounded-2xl border border-sky-400/40 bg-black p-4
              shadow-[0_0_20px_rgba(56,189,248,0.2)] md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.name);
                    setMenuOpen(false);
                  }}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold
                    transition-colors duration-300
                    hover:bg-sky-400/10 hover:text-sky-400
                    ${
                      activeLink === link.name
                        ? "text-sky-400"
                        : "text-white"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { List } from '@phosphor-icons/react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { useAudio } from '@/components/AudioProvider';
import { useLenis } from '@/components/SmoothScroll';
import { emit } from '@/hooks/useEventBus';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/notices', label: 'Notices' },
  { href: '/learn', label: 'Learning Hub' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/about', label: 'About' },
];

/* ──────────── Terminal-style mobile menu ──────────── */
function TerminalMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div
      className="relative flex h-full flex-col px-7 font-terminal text-[var(--theme-bg-hero,#c2e0a5)]
        pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]
        pb-[calc(env(safe-area-inset-bottom,0px)+1.75rem)]"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        data-cursor="Close"
        className="-mr-1 shrink-0 self-end px-1 py-2 text-lg tracking-[0.35em] text-[var(--theme-primary,#84C87F)]
          transition-colors hover:text-[var(--theme-bg-hero,#c2e0a5)]"
      >
        [&thinsp;X&thinsp;]
      </button>

      {/* Navigation routes */}
      <nav
        data-lenis-prevent
        className="terminal-scroll -mx-7 mt-9 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-7 pb-4"
      >
        {NAV_LINKS.map((r, i) => {
          const active = pathname === r.href;
          return (
            <Link
              key={r.href}
              href={r.href}
              onClick={onClose}
              data-cursor={r.label}
              className="group relative py-3.5"
            >
              {/* Active left bar */}
              <span
                aria-hidden
                className={`absolute -left-7 top-0 h-full w-[3px] bg-[var(--theme-primary,#84C87F)] transition-opacity duration-200 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span
                className={`block font-clash text-[2.1rem] font-bold lowercase leading-[1.04] tracking-tight
                  transition-transform duration-200 group-hover:translate-x-1.5 sm:text-[2.6rem] ${
                    active ? 'text-[var(--theme-primary,#84C87F)]' : 'text-[var(--theme-bg-hero,#c2e0a5)]'
                  }`}
              >
                {r.label}
              </span>
              <span className="mt-1 block text-[11px] tracking-wide text-[var(--theme-primary,#84C87F)]/35">
                {String(i + 1).padStart(2, '0')} &nbsp; cd&nbsp;~{r.href}
                {active && <span className="terminal-cursor ml-1 text-[var(--theme-primary,#84C87F)]">_</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Terminal footer */}
      <div className="shrink-0 pt-6 border-t border-[var(--theme-primary,#84C87F)]/15">
        <p className="text-xs font-mono text-[var(--theme-primary,#84C87F)]/70">
          <span className="text-[var(--theme-primary,#84C87F)]">nexora-shell:~$</span>{' '}
          <span className="terminal-cursor text-[var(--theme-primary,#84C87F)]">▋</span>
        </p>
        <p className="mt-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          Department of ISE · AJIET Mangaluru
        </p>
      </div>
    </div>
  );
}

/* ──────────── Main Navbar ──────────── */
const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const { musicPlaying, audioInitialized, toggleMusic } = useAudio();

  /* ─── GSAP menu open / close ─── */
  const openMenu = () => {
    setMenuOpen(true);
    gsap.fromTo(
      menuPanelRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.28, ease: 'power2.out', pointerEvents: 'auto' }
    );
  };

  const closeMenu = () => {
    gsap.set(menuPanelRef.current, { pointerEvents: 'none' });
    gsap.to(menuPanelRef.current, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => setMenuOpen(false),
    });
  };

  /* ─── Lock scroll when menu is open ─── */
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  /* ─── IntersectionObserver → emit collapse event ─── */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) closeMenu();
        emit('navbar:collapsed', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(nav);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Escape key closes menu ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Background color per pathname ─── */
  useEffect(() => {
    const color = pathname === '/' ? 'var(--theme-bg-hero, #c2e0a5)' : 'var(--theme-bg-main, #064928)';
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
  }, [pathname]);

  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  /* ─── GSAP link hover animations ─── */
  const handleMouseEnter = (index: number) => {
    const link = linkRefs.current[index];
    if (!link) return;
    const bar = link.querySelector<HTMLElement>('.nav-bar');
    if (!bar) return;
    gsap.killTweensOf(bar);
    gsap.fromTo(bar, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(link, { color: 'var(--theme-primary, #84C87F)', duration: 0.2, ease: 'power1.out' });
  };

  const handleMouseLeave = (index: number) => {
    const link = linkRefs.current[index];
    if (!link) return;
    const bar = link.querySelector<HTMLElement>('.nav-bar');
    if (!bar) return;
    gsap.killTweensOf(bar);
    gsap.to(bar, { scaleX: 0, transformOrigin: 'right center', duration: 0.25, ease: 'power2.in' });
    gsap.to(link, { color: '#ffffff', duration: 0.2, ease: 'power1.in' });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="relative z-50 mx-auto mt-3 sm:mt-5 w-[calc(100%-24px)]
          xl:w-[88%] xl:max-w-[1320px]
          flex items-center justify-between bg-[var(--theme-bg-main,#064928)] text-white shadow-xl
          py-3 md:py-5 px-4 xl:px-8 rounded-xl xl:rounded-2xl"
      >
        {/* ── Brand ── */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Link
            href="/"
            onClick={() => menuOpen && closeMenu()}
            data-cursor="Home"
            className="flex items-center gap-2.5 shrink-0 select-none group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--theme-primary,#84C87F)] text-[var(--theme-bg-main,#064928)] font-clash font-extrabold text-base shadow-[0_0_15px_var(--theme-primary,#84C87F)]">
              N
            </div>
            <span className="font-clash font-bold whitespace-nowrap text-white group-hover:text-[var(--theme-primary,#84C87F)] transition-colors duration-200
              text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide">
              Nexora
            </span>
          </Link>
          <span
            aria-hidden
            className="shrink-0 w-[3px] h-4 sm:h-5 rounded-full bg-gradient-to-b from-white/80 via-[var(--theme-bg-hero,#c2e0a5)] to-[var(--theme-primary,#84C87F)] hidden sm:block"
          />
          <span className="text-[9px] font-mono tracking-wider text-[var(--theme-primary,#84C87F)]/70 hidden sm:inline uppercase">
            ISE · AJIET
          </span>
        </div>

        {/* ── Desktop Links ── */}
        <div className="hidden xl:flex items-center gap-4 lg:gap-5">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              data-cursor={link.label}
              className="relative text-white font-semibold uppercase cursor-pointer
                text-sm tracking-wide lg:text-base lg:tracking-wider"
              style={{ textDecoration: 'none' }}
            >
              {link.label}
              <span
                className="nav-bar absolute left-0 -bottom-1 w-full h-[2px] bg-[var(--theme-primary,#84C87F)]"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left center', display: 'block' }}
              />
            </a>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2.5">
          {/* Music Control Button */}
          {audioInitialized && (
            <button
              type="button"
              onClick={toggleMusic}
              data-cursor={musicPlaying ? 'Mute' : 'Play'}
              aria-label={musicPlaying ? 'Pause background music' : 'Play background music'}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--theme-primary,#84C87F)]/40 bg-[var(--theme-primary,#84C87F)]/10 text-[var(--theme-primary,#84C87F)] shadow-[0_0_12px_rgba(132,200,127,0.25)] transition-all duration-200 hover:scale-105 hover:bg-[var(--theme-primary,#84C87F)]/25 active:scale-95 cursor-pointer"
            >
              {musicPlaying ? (
                <span className="flex items-end gap-[2.5px] h-3.5 px-0.5">
                  <span className="w-1 bg-[var(--theme-primary,#84C87F)] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-full" />
                  <span className="w-1 bg-[var(--theme-primary,#84C87F)] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_200ms] h-2.5" />
                  <span className="w-1 bg-[var(--theme-primary,#84C87F)] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_400ms] h-3.5" />
                </span>
              ) : (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
                  <path d="M5 3.868v16.264a1 1 0 001.574.832l12.198-8.132a1 1 0 000-1.664L6.574 3.036A1 1 0 005 3.868z" />
                </svg>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="xl:hidden -mr-1 p-1.5 text-[var(--theme-primary,#84C87F)] transition-colors hover:text-[var(--theme-bg-hero,#c2e0a5)]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <List size={28} />
          </button>
        </div>
      </nav>

      {/* ── Full-screen terminal mobile menu ── */}
      <div
        ref={menuPanelRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 310,
          opacity: 0,
          pointerEvents: 'none',
        }}
        className="xl:hidden bg-[var(--theme-bg-main,#064928)]"
      >
        <div aria-hidden className="terminal-scanlines opacity-[0.12]" />
        <TerminalMenu
          pathname={pathname}
          onClose={closeMenu}
        />
      </div>
    </>
  );
};

export default Navbar;
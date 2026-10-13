import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Bell, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden text-white items-center px-4 pb-16 pt-24 sm:px-8 sm:pt-32 lg:pt-36"
    >
      {/* Background neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-28 z-[1]
          h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/15
          blur-[130px] sm:h-[420px] sm:w-[420px]"
      />

      {/* Department heading */}
      <div className="relative z-10 w-full text-center">
        <h1
          className="font-jersey text-xs sm:text-lg md:text-xl lg:text-2xl font-medium uppercase
            leading-relaxed tracking-wider text-slate-300 px-2"
        >
          Department of Information Science and Engineering
        </h1>

        {/* Presents */}
        <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-3 sm:gap-5">
          <span className="h-[2px] w-6 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />

          <p
            className="font-jersey text-sm tracking-[0.3em] text-sky-400
              drop-shadow-[0_0_12px_rgba(56,189,248,0.65)]
              sm:text-lg md:text-xl"
          >
            PRESENTS
          </p>

          <span className="h-[2px] w-6 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />
        </div>
      </div>

      {/* Club collaboration showcase */}
      <div
        className="relative z-10 mx-auto mt-6 sm:mt-10 flex w-full max-w-4xl
          items-center justify-center gap-3 sm:gap-8 lg:gap-14"
      >
        {/* Nexora Club Badge */}
        <div
          className="group relative flex aspect-square w-28 xs:w-32 items-center
            justify-center sm:w-44 md:w-56 lg:w-64"
        >
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-sky-500/20
              opacity-60 blur-2xl transition-opacity duration-500
              group-hover:opacity-100"
          />

          <Image
            src="/nexora.jpeg"
            alt="Nexora - The Next Aura Club"
            width={500}
            height={500}
            priority
            className="relative h-full w-full object-contain
              drop-shadow-[0_0_14px_rgba(56,189,248,0.25)]
              transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Collaboration X */}
        <div className="flex shrink-0 items-center justify-center">
          <span
            className="font-sans text-3xl font-black italic text-sky-300
              drop-shadow-[0_0_16px_rgba(56,189,248,0.7)]
              sm:text-5xl md:text-6xl lg:text-7xl"
          >
            X
          </span>
        </div>

        {/* Heka Club Badge */}
        <div
          className="group relative flex aspect-square w-28 xs:w-32 items-center
            justify-center sm:w-44 md:w-56 lg:w-64"
        >
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-sky-500/15
              opacity-60 blur-2xl transition-opacity duration-500
              group-hover:opacity-100"
          />

          <Image
            src="/heika.jpeg"
            alt="Heka - For Unique"
            width={500}
            height={500}
            priority
            className="relative h-full w-full object-contain
              drop-shadow-[0_0_14px_rgba(56,189,248,0.25)]
              transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Core Club Pillars: THINK / BUILD / INNOVATE */}
      <div
        className="relative z-10 mx-auto mt-6 sm:mt-10 flex flex-wrap
          items-center justify-center gap-4 sm:gap-8 lg:gap-14 text-center"
      >
        <p
          className="font-jersey text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black
            tracking-[0.12em] text-white transition duration-300 hover:text-sky-400"
        >
          THINK
        </p>

        <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-sky-400/50" />

        <p
          className="font-jersey text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black
            tracking-[0.12em] text-sky-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]
            transition duration-300 hover:scale-105"
        >
          BUILD
        </p>

        <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-sky-400/50" />

        <p
          className="font-jersey text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black
            tracking-[0.08em] text-white transition duration-300 hover:text-sky-400"
        >
          INNOVATE
        </p>
      </div>

      {/* Quick Action Navigation Links for Mobile & Desktop */}
      <div className="relative z-10 mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:brightness-110 active:scale-95"
        >
          <Calendar className="h-4 w-4" />
          <span>Explore Events</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        <Link
          href="/notices"
          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/30 bg-[#090d1a]/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-sky-200 transition-all hover:border-sky-400 hover:bg-sky-500/10 active:scale-95"
        >
          <Bell className="h-4 w-4 text-sky-400" />
          <span>Notice Board</span>
        </Link>

        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-xl border border-sky-400/30 bg-[#090d1a]/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-sky-200 transition-all hover:border-sky-400 hover:bg-sky-500/10 active:scale-95"
        >
          <BookOpen className="h-4 w-4 text-sky-400" />
          <span>Study & Skills</span>
        </Link>
      </div>

      {/* Bottom neon accent divider */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-10 h-px w-40 sm:w-64
          bg-gradient-to-r from-transparent via-sky-400 to-transparent
          shadow-[0_0_12px_rgba(56,189,248,0.7)] sm:mt-14"
      />
    </section>
  );
}

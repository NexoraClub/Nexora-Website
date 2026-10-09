
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-96px)] w-full flex-col
        items-center overflow-hidden bg-black px-5 pb-10 pt-8 text-white
        sm:px-8 sm:pt-10 lg:pt-8"
    >
      {/* Background neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-36
          h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/10
          blur-[120px] sm:h-96 sm:w-96"
      />

      {/* Department heading */}
      <div className="relative z-10 mt-4 w-full text-center sm:mt-6">
        <h1
          className="font-serif text-base font-medium uppercase
            leading-relaxed tracking-wide text-white
            sm:text-xl md:text-2xl lg:text-3xl"
        >
          Department of Information Science and Engineering
        </h1>

        {/* Presents */}
        <div className="mt-3 flex items-center justify-center gap-4 sm:mt-5">
          <span className="h-[2px] w-8 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />

          <p className="text-base font-bold tracking-[0.3em] text-sky-400
            drop-shadow-[0_0_12px_rgba(56,189,248,0.65)]
            sm:text-xl md:text-2xl"
          >
            PRESENTS
          </p>

          <span className="h-[2px] w-8 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />
        </div>
      </div>

      {/* Club collaboration */}
      <div
        className="relative z-10 mx-auto mt-8 grid w-full max-w-5xl
          grid-cols-1 items-center justify-items-center gap-5
          sm:mt-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-6
          lg:mt-12 lg:gap-12"
      >
        {/* Nexora */}
        <div className="group relative flex aspect-square w-48 items-center
          justify-center sm:w-44 md:w-56 lg:w-72"
        >
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-sky-500/20
              opacity-60 blur-3xl transition-opacity duration-500
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
        <div className="flex items-center justify-center">
          <span
            className="font-sans text-5xl font-black italic text-sky-300
              drop-shadow-[0_0_18px_rgba(56,189,248,0.7)]
              sm:text-6xl md:text-7xl lg:text-8xl"
          >
            X
          </span>
        </div>

        {/* Heka */}
        <div className="group relative flex aspect-square w-48 items-center
          justify-center sm:w-44 md:w-56 lg:w-72"
        >
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-sky-500/15
              opacity-60 blur-3xl transition-opacity duration-500
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

      {/* THINK / BUILD / INNOVATE */}
      <div
        className="relative z-10 mx-auto mt-10 grid w-full max-w-6xl
          grid-cols-1 items-center gap-5 text-center
          sm:mt-12 sm:grid-cols-3 sm:gap-3 lg:mt-14"
      >
        <p
          className="font-mono text-3xl font-black tracking-[0.12em]
            text-white sm:text-xl md:text-2xl lg:text-4xl"
        >
          THINK
        </p>

        <p
          className="font-mono text-3xl font-black tracking-[0.12em]
            text-sky-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]
            sm:text-xl md:text-2xl lg:text-4xl"
        >
          BUILD
        </p>

        <p
          className="font-mono text-3xl font-black tracking-[0.08em]
            text-white sm:text-xl md:text-2xl lg:text-4xl"
        >
          INNOVATE
        </p>
      </div>

      {/* Bottom neon accent */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-10 h-px w-40
          bg-gradient-to-r from-transparent via-sky-400 to-transparent
          shadow-[0_0_12px_rgba(56,189,248,0.7)] sm:mt-12"
      />
    </section>
  );
}


export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden text-white flex-col items-center px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:pt-8"
    >
      {/* Background neon glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-36 z-[1]
          h-64 w-64 -translate-x-1/2 rounded-full bg-sky-500/10
          blur-[120px] sm:h-96 sm:w-96"
      />

      {/* Department heading */}
      <div className="relative z-10 mt-4 pt-18 w-full text-center sm:mt-6">
        <h1
          className="font-jersey text-base font-medium uppercase
            leading-relaxed tracking-wide text-white
            sm:text-xl md:text-2xl lg:text-3xl"
        >
          Department of Information Science and Engineering
        </h1>

        {/* Presents */}
        <div className="mt-3 flex items-center justify-center gap-4 sm:mt-5">
          <span className="h-[2px] w-8 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />

          <p
            className="font-jersey text-base tracking-[0.3em] text-sky-400
              drop-shadow-[0_0_12px_rgba(56,189,248,0.65)]
              sm:text-xl md:text-2xl"
          >
            PRESENTS
          </p>

          <span className="h-[2px] w-8 bg-sky-400 shadow-[0_0_10px_#38bdf8] sm:w-16" />
        </div>
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

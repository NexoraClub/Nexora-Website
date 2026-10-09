import Image from "next/image";
import {GridScan} from "./GridScan";
import GlowCursor from "./GlowCursor";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050610] text-white"
    >
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
        className="flex flex-col items-center px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:pt-8 w-full h-full min-h-screen"
      >
        {/* Full-screen GridScan background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            gridScale={0.1}
            scanColor="#9ff1ff"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            lineJitter={0.1}
            scanGlow={0.5}
            scanSoftness={2}
            enableWebcam={false}
            showPreview={false}
          />
        </div>

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

        {/* Club collaboration */}
        <div
          className="relative z-10 mx-auto mt-8 grid w-full max-w-5xl
            grid-cols-1 items-center justify-items-center gap-5
            sm:mt-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-6
            lg:mt-12 lg:gap-12"
        >
          {/* Nexora */}
          <div
            className="group relative flex aspect-square w-48 items-center
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
          <div
            className="group relative flex aspect-square w-48 items-center
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
            className="cursor-pointer font-jersey text-3xl font-black
              tracking-[0.12em] text-white transition duration-300
              ease-in-out hover:scale-105 hover:text-sky-400
              sm:text-xl md:text-2xl lg:text-7xl"
          >
            THINK
          </p>

          <p
            className="cursor-pointer font-jersey text-3xl font-black
              tracking-[0.12em] text-sky-400
              drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]
              transition duration-300 ease-in-out hover:scale-105
              sm:text-xl md:text-2xl lg:text-7xl"
          >
            BUILD
          </p>

          <p
            className="cursor-pointer font-jersey text-3xl font-black
              tracking-[0.08em] text-white transition duration-300
              ease-in-out hover:scale-105 hover:text-sky-400
              sm:text-xl md:text-2xl lg:text-7xl"
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
      </GlowCursor>
    </section>
  );
}

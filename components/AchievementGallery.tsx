"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Achievement = {
  category: string;
  title: string;
  description: string;
  event: string;
  date: string;
  image?: string;
};

const achievements: Achievement[] = [
  {
    category: "Technical competition",
    title: "Technical Competition Placeholder",
    description: "Sample placeholder: Add a verified competition result or team highlight here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
  {
    category: "Hackathon",
    title: "Hackathon Placeholder",
    description: "Sample placeholder: Add a verified hackathon project or result here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
  {
    category: "Project exhibition",
    title: "Project Exhibition Placeholder",
    description: "Sample placeholder: Add a verified project showcase or exhibition highlight here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
  {
    category: "Coding contest",
    title: "Coding Contest Placeholder",
    description: "Sample placeholder: Add a verified coding contest result or team highlight here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
  {
    category: "Workshop",
    title: "Workshop Placeholder",
    description: "Sample placeholder: Add a verified workshop milestone or learning outcome here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
  {
    category: "Club accomplishment",
    title: "Club Accomplishment Placeholder",
    description: "Sample placeholder: Add a verified club initiative or accomplishment here.",
    event: "Sample event name",
    date: "Sample date / year",
  },
];

export default function AchievementGallery() {
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const cards = gallery.querySelectorAll<HTMLElement>(".achievement-reveal");
    document.documentElement.classList.add("achievement-motion-ready");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.setAttribute("data-visible", "true"));
      return () => document.documentElement.classList.remove("achievement-motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("achievement-motion-ready");
    };
  }, []);

  return (
    <section
      ref={galleryRef}
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-40 lg:px-12"
    >
      <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          Nexora · ISE
        </p>
        <h1
          id="achievements-title"
          className="font-jersey text-5xl tracking-wide text-white drop-shadow-[0_0_18px_rgba(56,189,248,0.24)] sm:text-6xl md:text-7xl"
        >
          Our Achievements
        </h1>
        <p className="mt-5 text-base leading-relaxed text-sky-100/70 sm:text-lg">
          Celebrating innovation, excellence, and milestones.
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-px w-36 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.65)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {achievements.map((achievement, index) => (
          <article
            key={achievement.category}
            className="achievement-reveal group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border border-sky-300/15 bg-[#090d1a]/85 p-6 shadow-[0_12px_38px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/50 hover:shadow-[0_16px_44px_rgba(14,165,233,0.12)] sm:p-7"
            style={{ transitionDelay: `${(index % 3) * 100}ms` }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl transition duration-500 group-hover:bg-sky-400/20"
            />
            {achievement.image ? (
              <div className="relative mb-6 h-40 overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ) : null}
            <div className="relative flex items-center justify-between gap-3">
              <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.07] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sky-200">
                {achievement.category}
              </span>
              <span className="shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-violet-200/75">
                Sample
              </span>
            </div>
            <h2 className="relative mt-6 text-xl font-semibold leading-snug text-white sm:text-2xl">
              {achievement.title}
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed text-slate-300/75">
              {achievement.description}
            </p>
            <div className="relative mt-auto flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-300/70 sm:flex-row sm:items-center sm:justify-between">
              <span>{achievement.event}</span>
              <span className="text-sky-200/80">{achievement.date}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

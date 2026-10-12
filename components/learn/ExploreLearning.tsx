"use client";

import React from "react";
import { BookOpen, CalendarDays, Laptop, BellRing, ArrowRight } from "./Icons";

interface ExploreLearningProps {
  onCardClick?: (sectionId: string) => void;
  materialsCount?: number;
  examsCount?: number;
  skillsCount?: number;
  announcementsCount?: number;
}

export default function ExploreLearning({
  onCardClick,
  materialsCount = 6,
  examsCount = 5,
  skillsCount = 6,
  announcementsCount = 3,
}: ExploreLearningProps) {
  const cards = [
    {
      id: "study-materials",
      title: "Study Materials",
      description: "Notes, PDFs and question papers.",
      details: "Browse subject notes, past VTU question papers, and lab manuals organized by semester.",
      icon: BookOpen,
      countLabel: `${materialsCount} Resources`,
      actionLabel: "Browse Materials",
      accent: "from-sky-500/20 to-blue-600/10",
      borderGlow: "hover:border-sky-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]",
    },
    {
      id: "upcoming-exams",
      title: "Exam Corner",
      description: "Timetables and exam notices.",
      details: "Official Internal Assessments & Semester-End timetables, hall allocations, and exam regulations.",
      icon: CalendarDays,
      countLabel: `${examsCount} Scheduled`,
      actionLabel: "View Schedules",
      accent: "from-cyan-500/20 to-teal-600/10",
      borderGlow: "hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]",
    },
    {
      id: "skill-development",
      title: "Skill Development",
      description: "Courses, coding and tutorials.",
      details: "Hands-on tracks for Full-Stack, Cloud & Supabase, DSA roadmaps, UI/UX systems, and Open Source.",
      icon: Laptop,
      countLabel: `${skillsCount} Learning Tracks`,
      actionLabel: "Start Learning",
      accent: "from-indigo-500/20 to-purple-600/10",
      borderGlow: "hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(129,140,248,0.35)]",
    },
    {
      id: "latest-updates",
      title: "Latest Updates",
      description: "Academic announcements.",
      details: "Real-time notices, exam alerts, workshop registrations, and official department circulars.",
      icon: BellRing,
      countLabel: `${announcementsCount} Recent`,
      actionLabel: "Read Notices",
      accent: "from-amber-500/20 to-orange-600/10",
      borderGlow: "hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.35)]",
    },
  ];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <h2 className="font-jersey text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white">
          Explore Learning
        </h2>
        <p className="mt-2 text-sm sm:text-base text-sky-100/60 max-w-xl">
          Everything you need for semester excellence and technical career growth in one structured hub.
        </p>
      </div>

      {/* 2-Column Grid on Tablet/Desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => {
                const element = document.getElementById(card.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
                onCardClick?.(card.id);
              }}
              className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br ${card.accent} bg-black/60 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 ${card.borderGlow}`}
            >
              {/* Subtle neon gradient shimmer */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-400/10 blur-2xl transition-all duration-300 group-hover:bg-sky-400/20"
              />

              <div>
                {/* Card Top: Icon & Counter Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/40 bg-black/70 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:text-sky-200">
                    <Icon className="h-6 w-6" size={24} />
                  </div>
                  <span className="rounded-full border border-sky-400/30 bg-sky-950/60 px-3 py-1 text-xs font-medium text-sky-300">
                    {card.countLabel}
                  </span>
                </div>

                {/* Card Title & Main Description */}
                <h3 className="mt-5 text-xl font-semibold tracking-wide text-white transition-colors duration-200 group-hover:text-sky-300">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-sky-200/90">
                  {card.description}
                </p>

                {/* Detailed description */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-sky-100/60">
                  {card.details}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs sm:text-sm font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                  {card.actionLabel}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-400/30 bg-black/50 text-sky-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:border-sky-400">
                  <ArrowRight className="h-4 w-4" size={16} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

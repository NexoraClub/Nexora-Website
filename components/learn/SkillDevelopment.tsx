"use client";

import React, { useState, useMemo } from "react";
import { SkillResource } from "./learnData";
import { Laptop, ExternalLink, Sparkles } from "./Icons";

interface SkillDevelopmentProps {
  skills: SkillResource[];
  searchQuery?: string;
}

export default function SkillDevelopment({
  skills,
  searchQuery = "",
}: SkillDevelopmentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "Programming",
    "Web Development",
    "UI/UX Design",
    "AI & Data Science",
    "Communication & Soft Skills",
  ];

  const filteredSkills = useMemo(() => {
    return skills.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner":
        return "text-emerald-400 border-emerald-400/30 bg-emerald-950/40";
      case "Intermediate":
        return "text-cyan-400 border-cyan-400/30 bg-cyan-950/40";
      case "Advanced":
        return "text-purple-400 border-purple-400/30 bg-purple-950/40";
      default:
        return "text-sky-400 border-sky-400/30 bg-sky-950/40";
    }
  };

  return (
    <section id="skill-development" className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400">
            <Laptop className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Future-Ready Skills
            </span>
          </div>
          <h2 className="mt-1 font-jersey text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Skill Development & Tracks
          </h2>
          <p className="mt-1 text-sm text-sky-100/70">
            Curated industry roadmaps for web architecture, cloud engineering, UI/UX, and competitive programming.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-300">
          <Sparkles className="h-4 w-4" />
          <span>Handpicked by Nexora Mentors</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                : "border border-white/10 bg-black/40 text-white/70 hover:border-indigo-400/50 hover:text-white"
            }`}
          >
            {cat === "all" ? "All Skill Domains" : cat}
          </button>
        ))}
      </div>

      {/* Grid of Skill Tracks */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-black/40 py-16 text-center">
            <Laptop className="mx-auto h-12 w-12 text-indigo-400/40" />
            <h3 className="mt-4 text-base font-semibold text-white">
              No skill tracks match your current filter.
            </h3>
            <p className="mt-1 text-xs text-sky-100/60">
              Select another domain or clear your search to explore all tracks.
            </p>
          </div>
        ) : (
          filteredSkills.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-indigo-400/20 bg-black/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getDifficultyColor(
                      item.difficulty
                    )}`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-sky-100/70">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                  <span className="text-sky-300/80 font-medium">By {item.provider}</span>
                  {item.estimatedTime && (
                    <>
                      <span>•</span>
                      <span>Est. {item.estimatedTime}</span>
                    </>
                  )}
                </div>

                {item.tags && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-indigo-950/40 px-2 py-0.5 text-[10px] text-indigo-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40">Free Academic Resource</span>
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { LearningResource } from "./learnData";
import { BookOpen, Download, ExternalLink, Filter, FileText } from "./Icons";

interface StudyMaterialsSectionProps {
  resources: LearningResource[];
  searchQuery: string;
}

export default function StudyMaterialsSection({
  resources,
  searchQuery,
}: StudyMaterialsSectionProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const semesters = useMemo(() => {
    const list = Array.from(
      new Set(resources.map((r) => (r.semester ? String(r.semester) : "")).filter(Boolean))
    );
    return list.sort();
  }, [resources]);

  const categories = [
    { key: "all", label: "All Formats" },
    { key: "notes", label: "Notes & Lectures" },
    { key: "question_papers", label: "Question Papers" },
    { key: "tutorials", label: "Tutorials" },
  ];

  // Filtering based on search query, semester, and category
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));

      const matchSemester =
        selectedSemester === "all" ||
        (item.semester && String(item.semester) === selectedSemester);

      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchSearch && matchSemester && matchCategory;
    });
  }, [resources, searchQuery, selectedSemester, selectedCategory]);

  return (
    <section id="study-materials" className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Academic Library
            </span>
          </div>
          <h2 className="mt-1 font-jersey text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Recently Added Resources
          </h2>
          <p className="mt-1 text-sm text-sky-100/70">
            Notes, syllabus breakdowns, solved model papers, and VTU reference material.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-sky-200/80">
          <span className="font-semibold text-white">{filteredResources.length}</span>{" "}
          available items
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-500/20 bg-black/40 p-3 sm:p-4">
        {/* Semester selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-sky-200/70 mr-1">
            <Filter className="h-3.5 w-3.5" /> Semester:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSemester("all")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              selectedSemester === "all"
                ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                : "border border-white/10 text-white/70 hover:border-sky-400/50 hover:text-white"
            }`}
          >
            All
          </button>
          {semesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemester(sem)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                selectedSemester === sem
                  ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                  : "border border-white/10 text-white/70 hover:border-sky-400/50 hover:text-white"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                selectedCategory === cat.key
                  ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                  : "border border-white/10 text-white/70 hover:border-sky-400/50 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="mt-8">
        {filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-sky-400/40" />
            <h3 className="mt-4 text-base font-semibold text-white">
              No study resources match your search or filter criteria.
            </h3>
            <p className="mt-1 text-xs text-sky-100/60 max-w-md mx-auto">
              Try adjusting your search keywords, clearing filters, or exploring different semesters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-sky-400/20 bg-black/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-sky-400 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]"
              >
                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-sky-400/30 bg-sky-950/60 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                      {item.semester ? `Semester ${item.semester}` : "General"}
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-sky-200">
                      {item.fileType || "PDF"}
                    </span>
                  </div>

                  {/* Subject Name */}
                  <p className="mt-3 text-xs font-medium uppercase tracking-wider text-sky-400">
                    {item.subject}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-sky-100/70 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-sky-950/50 px-1.5 py-0.5 text-[10px] text-sky-300/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/40">
                    Added {new Date(item.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.fileUrl || "#"}
                      target={item.fileUrl && item.fileUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-all hover:bg-sky-400 hover:text-black hover:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { AcademicAnnouncement } from "./learnData";
import { BellRing, CalendarDays } from "./Icons";

interface LatestUpdatesProps {
  announcements: AcademicAnnouncement[];
}

export default function LatestUpdates({ announcements }: LatestUpdatesProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AcademicAnnouncement | null>(null);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "border-red-400/40 bg-red-950/60 text-red-300";
      case "high":
        return "border-amber-400/40 bg-amber-950/60 text-amber-300";
      default:
        return "border-sky-400/40 bg-sky-950/60 text-sky-300";
    }
  };

  return (
    <section id="latest-updates" className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <BellRing className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Department Bulletin
            </span>
          </div>
          <h2 className="mt-1 font-jersey text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Latest Academic Updates
          </h2>
          <p className="mt-1 text-sm text-sky-100/70">
            Timely circulars, exam notifications, and college announcements.
          </p>
        </div>

        <div className="text-xs text-white/50">
          Official notifications from ISE Board
        </div>
      </div>

      {/* Announcements List */}
      <div className="mt-8">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 py-16 text-center">
            <BellRing className="mx-auto h-12 w-12 text-amber-400/40" />
            <h3 className="mt-4 text-base font-semibold text-white">
              No recent announcements.
            </h3>
            <p className="mt-1 text-xs text-sky-100/60">
              Check back soon for upcoming department circulars and event notifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-amber-500/20 bg-black/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority || "Notice"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-sky-100/70">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <CalendarDays className="h-3 w-3 text-amber-400" />
                    {new Date(item.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncement(item)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
                  >
                    Read Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal / Dialog for complete announcement details */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-400/40 bg-[#090b14] p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                  {selectedAnnouncement.category} Circular
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">
                  {selectedAnnouncement.title}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  Published on {new Date(selectedAnnouncement.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-sky-100/80">
              <p>{selectedAnnouncement.description}</p>
              {selectedAnnouncement.details && (
                <p className="mt-3 rounded-lg border border-sky-400/20 bg-sky-950/30 p-3 text-xs text-sky-200">
                  {selectedAnnouncement.details}
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

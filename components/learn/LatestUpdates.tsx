"use client";

import React, { useState } from "react";
import { AcademicAnnouncement } from "./learnData";
import { Bell, CalendarDays } from "./Icons";

interface LatestUpdatesProps {
  announcements: AcademicAnnouncement[];
}

export default function LatestUpdates({ announcements }: LatestUpdatesProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AcademicAnnouncement | null>(null);

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "border-rose-400/40 text-rose-300";
      case "high":
        return "border-amber-400/40 text-amber-300";
      default:
        return "border-[var(--theme-primary,#00f0ff)]/30 text-[var(--theme-primary,#00f0ff)]";
    }
  };

  return (
    <section id="latest-updates" className="relative mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 py-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-[var(--theme-primary,#00f0ff)]/20">
        <div>
          <div className="flex items-center gap-2 text-[var(--theme-primary,#00f0ff)]">
            <Bell className="h-4 w-4" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-primary,#00f0ff)]/70">
              Department Bulletin
            </span>
          </div>
          <h2 className="mt-2 font-clash font-bold text-3xl sm:text-4xl text-[var(--theme-bg-hero,#dce6ef)] tracking-tight">
            Latest Academic Updates<span className="text-[var(--theme-primary,#00f0ff)]">.</span>
          </h2>
          <p className="mt-1 font-cabinet font-medium text-sm text-white/70">
            Timely circulars, exam notifications, and college announcements.
          </p>
        </div>

        <div className="font-mono text-xs text-white/50">
          ISE Examination &amp; Academic Cell
        </div>
      </div>

      {/* Announcements Ledger Feed */}
      <div className="mt-4">
        {announcements.length === 0 ? (
          <div className="py-16 text-center border border-[var(--theme-primary,#00f0ff)]/15 bg-[#060a14]">
            <Bell className="mx-auto h-8 w-8 text-[var(--theme-primary,#00f0ff)]/40" />
            <h3 className="mt-3 font-clash font-bold text-base text-[var(--theme-bg-hero,#dce6ef)]">
              No recent announcements.
            </h3>
            <p className="mt-1 font-cabinet text-xs text-white/50">
              Check back soon for upcoming department circulars and event notifications.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--theme-primary,#00f0ff)]/15 border-b border-[var(--theme-primary,#00f0ff)]/15">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-5 items-start md:items-center hover:bg-[var(--theme-primary,#00f0ff)]/5 px-3 transition-colors"
              >
                {/* Date & Category Column */}
                <div className="col-span-1 md:col-span-3">
                  <p className="font-mono text-xs text-white/50 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-[var(--theme-primary,#00f0ff)]" />
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--theme-primary,#00f0ff)] border border-[var(--theme-primary,#00f0ff)]/30 px-1.5 py-0.5">
                      {item.category}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase font-bold tracking-wider border px-1.5 py-0.5 ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority || "Notice"}
                    </span>
                  </div>
                </div>

                {/* Content Column */}
                <div className="col-span-1 md:col-span-7">
                  <h3
                    onClick={() => setSelectedAnnouncement(item)}
                    className="font-clash font-bold text-base sm:text-lg text-[var(--theme-bg-hero,#dce6ef)] hover:text-[var(--theme-primary,#00f0ff)] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 font-cabinet text-xs sm:text-sm text-white/65 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Action Column */}
                <div className="col-span-1 md:col-span-2 md:text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncement(item)}
                    className="inline-flex items-center gap-1 border border-[var(--theme-primary,#00f0ff)]/30 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--theme-primary,#00f0ff)] hover:bg-[var(--theme-primary,#00f0ff)] hover:text-[var(--theme-bg-main,#060913)] transition-all"
                  >
                    <span>Read Circular</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog for Complete Announcement Details */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg border border-[var(--theme-primary,#00f0ff)]/40 bg-[#060a14] p-6 sm:p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary,#00f0ff)] border border-[var(--theme-primary,#00f0ff)]/30 px-2 py-0.5">
                  {selectedAnnouncement.category} Circular
                </span>
                <h3 className="mt-2.5 font-clash font-bold text-xl text-[var(--theme-bg-hero,#dce6ef)]">
                  {selectedAnnouncement.title}
                </h3>
                <p className="font-mono text-xs text-white/50 mt-1">
                  Published on {new Date(selectedAnnouncement.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="border border-white/20 px-2 py-1 font-mono text-xs text-white/70 hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                [X]
              </button>
            </div>

            <div className="mt-4 border-t border-[var(--theme-primary,#00f0ff)]/15 pt-4 font-cabinet text-sm leading-relaxed text-white/70">
              <p>{selectedAnnouncement.description}</p>
              {selectedAnnouncement.details && (
                <div className="mt-3.5 border-l-2 border-[var(--theme-primary,#00f0ff)] bg-[var(--theme-primary,#00f0ff)]/5 p-3.5 font-cabinet text-xs sm:text-sm text-[var(--theme-primary,#00f0ff)]/90 leading-relaxed">
                  {selectedAnnouncement.details}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="border border-[var(--theme-primary,#00f0ff)]/40 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-[var(--theme-primary,#00f0ff)] hover:bg-[var(--theme-primary,#00f0ff)] hover:text-[var(--theme-bg-main,#060913)] transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

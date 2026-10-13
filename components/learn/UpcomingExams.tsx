"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ExamSchedule } from "./learnData";
import { CalendarDays, Filter, Clock } from "./Icons";

interface UpcomingExamsProps {
  exams: ExamSchedule[];
}

export default function UpcomingExams({ exams }: UpcomingExamsProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const semesters = useMemo(() => {
    const list = Array.from(new Set(exams.map((e) => String(e.semester))));
    return list.sort();
  }, [exams]);

  const examTypes = useMemo(() => {
    return Array.from(new Set(exams.map((e) => e.examType)));
  }, [exams]);

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSem =
        selectedSemester === "all" || String(exam.semester) === selectedSemester;
      const matchType =
        selectedType === "all" || exam.examType === selectedType;
      return matchSem && matchType;
    });
  }, [exams, selectedSemester, selectedType]);

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  // Compute countdown for nearest published exam
  const nextExam = useMemo(() => {
    if (!now) return null;
    const valid = exams
      .filter((e) => e.isPublished && new Date(e.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return valid.length > 0 ? valid[0] : null;
  }, [exams, now]);

  const getDaysRemaining = (targetDateStr: string) => {
    if (!now) return "Upcoming";
    const target = new Date(targetDateStr).getTime();
    const diff = target - now;
    if (diff <= 0) return "Today / In Progress";
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? "day" : "days"} away`;
  };

  return (
    <section id="upcoming-exams" className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-400">
            <CalendarDays className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
              Department Schedule
            </span>
          </div>
          <h2 className="mt-1 font-jersey text-3xl sm:text-4xl uppercase tracking-wider text-white">
            Upcoming Exams
          </h2>
          <p className="mt-1 text-sm text-sky-100/70">
            Official dates, halls, and timing verified by the ISE examination board.
          </p>
        </div>

        {/* Timetable Overview Card & Quick Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-sky-400/30 bg-black/60 px-4 py-2.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Exam Timetable</p>
              <p className="text-[11px] text-sky-200/60">View schedules by semester and subject</p>
            </div>
            <a
              href="#upcoming-exams"
              className="inline-flex items-center rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-sky-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            >
              View Timetable
            </a>
          </div>
        </div>
      </div>

      {/* Featured Nearest Exam Banner (if available) */}
      {nextExam && (
        <div className="mt-6 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-sky-950/60 via-black/80 to-sky-950/60 p-5 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-cyan-400/50 bg-cyan-950/80 p-2.5 text-cyan-300">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                    Next Upcoming Session
                  </span>
                  <span className="text-xs text-cyan-100/60">
                    Semester {nextExam.semester} • {nextExam.subjectCode}
                  </span>
                </div>
                <h4 className="mt-1 text-base sm:text-lg font-bold text-white">
                  {nextExam.title}
                </h4>
                <p className="text-xs text-sky-200/80">
                  {new Date(nextExam.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  | {nextExam.time} {nextExam.venue ? `• ${nextExam.venue}` : ""}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-black/70 px-4 py-2 text-right">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-300">
                  {getDaysRemaining(nextExam.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-500/20 bg-black/40 p-3 sm:p-4">
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
            All Semesters
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

        {/* Examination Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-sky-200/70 mr-1">Type:</span>
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              selectedType === "all"
                ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                : "border border-white/10 text-white/70 hover:border-sky-400/50 hover:text-white"
            }`}
          >
            All Types
          </button>
          {examTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                selectedType === type
                  ? "bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                  : "border border-white/10 text-white/70 hover:border-sky-400/50 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Items Table / Grid */}
      <div className="mt-6">
        {filteredExams.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 py-16 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-sky-400/40" />
            <h3 className="mt-4 text-base font-semibold text-white">
              No upcoming exams have been announced yet.
            </h3>
            <p className="mt-1 text-xs text-sky-100/60 max-w-md mx-auto">
              Any updates to internal tests, lab exams, or VTU schedules will be posted here as soon as verified by the department.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="group relative flex flex-col justify-between rounded-xl border border-sky-400/20 bg-black/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/60 hover:bg-black/70 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-sky-400/30 bg-sky-950/60 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                      Sem {exam.semester} • {exam.examType}
                    </span>
                    <span className="font-mono text-xs text-sky-400/80">
                      {exam.subjectCode}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {exam.title}
                  </h3>

                  <div className="mt-3 flex flex-col gap-1 text-xs text-sky-100/70">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-sky-400" />
                      <span>
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-sky-400" />
                      <span>{exam.time}</span>
                    </div>
                    {exam.venue && (
                      <div className="flex items-center gap-2 text-white/50">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
                        <span>{exam.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Verified Schedule
                  </span>
                  <span className="text-white/40">ISE Exam Cell</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

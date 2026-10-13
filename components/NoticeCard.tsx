"use client";

import React from "react";

export type NoticeCategory = "Urgent" | "Projects" | "Events" | "General";

export interface NoticeAttachment {
  name: string;
  url: string;
  type: "pdf" | "figma" | "doc" | "link";
  size?: string;
}

export interface NoticeAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NoticeCategory;
  isPinned: boolean;
  isUrgentHero?: boolean;
  postedAt: string;
  date: string;
  author: NoticeAuthor;
  attachment?: NoticeAttachment;
  tags?: string[];
}

interface NoticeCardProps {
  notice: Notice;
  onReadMore: (notice: Notice) => void;
  viewMode?: "grid" | "list";
}

export function getCategoryBadgeStyles(category: NoticeCategory) {
  switch (category) {
    case "Urgent":
      return {
        badge: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
        dot: "bg-rose-400 shadow-[0_0_8px_#f43f5e]",
      };
    case "Projects":
      return {
        badge: "bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        dot: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
      };
    case "Events":
      return {
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        dot: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
      };
    case "General":
    default:
      return {
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        dot: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
      };
  }
}

export function AttachmentIcon({ type, className = "w-3.5 h-3.5" }: { type: string; className?: string }) {
  if (type === "pdf") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }
  if (type === "figma") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

export default function NoticeCard({ notice, onReadMore, viewMode = "grid" }: NoticeCardProps) {
  const categoryStyles = getCategoryBadgeStyles(notice.category);

  if (viewMode === "list") {
    return (
      <article
        aria-labelledby={`notice-title-${notice.id}`}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-sky-500/20 bg-[#070b16]/75 p-5 backdrop-blur-md transition-all duration-300 hover:border-sky-400/60 hover:bg-[#0c1222]/90 hover:shadow-[0_0_24px_rgba(56,189,248,0.18)]"
      >
        <div className="flex-1 min-w-0">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryStyles.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles.dot}`} />
              {notice.category}
            </span>

            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                </svg>
                PINNED
              </span>
            )}

            <span className="text-xs text-sky-200/50 flex items-center gap-1 ml-auto sm:ml-0">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {notice.postedAt}
            </span>
          </div>

          {/* Title */}
          <h3
            id={`notice-title-${notice.id}`}
            className="text-base sm:text-lg font-bold text-white transition-colors duration-200 group-hover:text-sky-300 line-clamp-1"
          >
            {notice.title}
          </h3>

          {/* Summary */}
          <p className="mt-1 text-xs sm:text-sm text-slate-300/80 line-clamp-2 leading-relaxed">
            {notice.summary}
          </p>

          {/* Attachment chip and author */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {notice.attachment && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-950/40 px-2.5 py-1 text-xs text-sky-300">
                <AttachmentIcon type={notice.attachment.type} />
                <span className="truncate max-w-[160px]">{notice.attachment.name}</span>
                {notice.attachment.size && <span className="text-sky-400/60">({notice.attachment.size})</span>}
              </span>
            )}

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-sky-400/50 hidden sm:inline-block" />
              <span>By <strong className="text-slate-200 font-medium">{notice.author.name}</strong> • {notice.author.role}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          <button
            type="button"
            onClick={() => onReadMore(notice)}
            aria-label={`Read full notice: ${notice.title}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 transition-all duration-300 hover:border-sky-400 hover:bg-sky-500/25 hover:shadow-[0_0_16px_rgba(56,189,248,0.35)] active:scale-95 cursor-pointer"
          >
            <span>Read Details</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </article>
    );
  }

  // Grid Card View (Default)
  return (
    <article
      aria-labelledby={`notice-title-${notice.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/60 hover:bg-[#0c1222]/95 hover:shadow-[0_0_28px_rgba(56,189,248,0.22)]"
    >
      {/* Top ambient highlight on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/0 to-transparent transition-opacity duration-300 group-hover:via-sky-400/60"
      />

      <div>
        {/* Card Header: Badges & Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryStyles.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles.dot}`} />
              {notice.category}
            </span>

            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                </svg>
                PINNED
              </span>
            )}
          </div>

          <span className="text-xs text-sky-200/50 flex items-center gap-1 shrink-0">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {notice.postedAt}
          </span>
        </div>

        {/* Title */}
        <h3
          id={`notice-title-${notice.id}`}
          className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-sky-300 line-clamp-2 leading-snug"
        >
          {notice.title}
        </h3>

        {/* Description / Summary */}
        <p className="mt-2.5 text-sm text-slate-300/80 line-clamp-3 leading-relaxed">
          {notice.summary}
        </p>

        {/* Attachment Chip (if present) */}
        {notice.attachment && (
          <div className="mt-4">
            <a
              href={notice.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 max-w-full rounded-lg border border-sky-400/20 bg-sky-950/40 px-3 py-1.5 text-xs text-sky-200 transition-colors hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white"
            >
              <AttachmentIcon type={notice.attachment.type} />
              <span className="truncate">{notice.attachment.name}</span>
              {notice.attachment.size && (
                <span className="text-sky-400/60 font-mono text-[11px]">
                  ({notice.attachment.size})
                </span>
              )}
            </a>
          </div>
        )}

        {/* Tags */}
        {notice.tags && notice.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {notice.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-sky-200/60 border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Author + Read More CTA */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        {/* Author Details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 text-xs font-bold text-black shadow-[0_0_10px_rgba(56,189,248,0.4)]">
            {notice.author.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-200">
              {notice.author.name}
            </p>
            <p className="truncate text-[11px] text-sky-200/50">
              {notice.author.role}
            </p>
          </div>
        </div>

        {/* Read More Trigger */}
        <button
          type="button"
          onClick={() => onReadMore(notice)}
          aria-label={`Read full notice: ${notice.title}`}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-all duration-300 hover:border-sky-400 hover:bg-sky-500/25 hover:shadow-[0_0_14px_rgba(56,189,248,0.35)] cursor-pointer"
        >
          <span>Read More</span>
          <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}

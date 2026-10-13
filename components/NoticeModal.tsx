"use client";

import React, { useEffect, useState } from "react";
import { Notice, getCategoryBadgeStyles, AttachmentIcon } from "./NoticeCard";

interface NoticeModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export default function NoticeModal({ notice, onClose }: NoticeModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on ESC key and prevent body background scroll
  useEffect(() => {
    if (!notice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [notice, onClose]);

  if (!notice) return null;

  const categoryStyles = getCategoryBadgeStyles(notice.category);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-notice-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-sky-400/40 bg-[#070b16] p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(56,189,248,0.25)] z-10 my-8 max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Glow ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-500/15 blur-[90px]"
        />

        {/* Header with Badges and Close button */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${categoryStyles.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryStyles.dot}`} />
              {notice.category}
            </span>

            {notice.isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="17" x2="12" y2="22" />
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                </svg>
                PINNED
              </span>
            )}

            <span className="text-xs text-sky-200/60 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {notice.date} ({notice.postedAt})
            </span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notice modal"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 py-5 space-y-5 flex-1">
          <h2
            id="modal-notice-title"
            className="text-xl sm:text-2xl font-bold leading-snug text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
          >
            {notice.title}
          </h2>

          {/* Author Block */}
          <div className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-sky-950/25 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 font-bold text-black shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              {notice.author.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white">{notice.author.name}</p>
              <p className="text-xs text-sky-300/70">{notice.author.role}</p>
            </div>
          </div>

          {/* Main Notice Content */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
            {notice.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Attachment Box (if present) */}
          {notice.attachment && (
            <div className="rounded-xl border border-sky-400/30 bg-gradient-to-r from-sky-950/50 to-[#070b16] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  <AttachmentIcon type={notice.attachment.type} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-sky-300/70 uppercase tracking-wider font-semibold">Attached Resource</p>
                  <p className="text-sm font-semibold text-white truncate">{notice.attachment.name}</p>
                  {notice.attachment.size && (
                    <p className="text-xs text-slate-400">{notice.attachment.size}</p>
                  )}
                </div>
              </div>

              <a
                href={notice.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/50 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 transition-all hover:bg-sky-500/35 hover:text-white hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] shrink-0"
              >
                <span>Download / Open</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}

          {/* Tags */}
          {notice.tags && notice.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Keywords:</span>
              {notice.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 text-xs text-sky-300/70 hover:text-sky-300 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-sky-500/35 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
}

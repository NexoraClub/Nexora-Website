import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export default function SampleDisclaimerBanner() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="relative overflow-hidden rounded-2xl border border-sky-400/25 bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-indigo-950/40 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.12)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-sky-400/10 text-sky-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <span>Sample Event Concepts</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              </p>
              <p className="mt-0.5 text-xs text-sky-100/70 leading-relaxed">
                The six event cards below are sample club concepts for preview and demonstration purposes. Official dates, schedules, and confirmed venues will be announced by the Nexora ISE Club committee.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-300/80 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
              <Info className="h-3 w-3" />
              Preview Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

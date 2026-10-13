'use client';

import React from 'react';
import Image from 'next/image';
import {
  Code,
  Cpu,
  BrainCircuit,
  Globe,
  ShieldCheck,
  Lightbulb,
  Calendar,
  MapPin,
  ArrowRight,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { EventItem } from '@/lib/types';

interface EventCardProps {
  event: EventItem;
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

const ICON_MAP = {
  Code: Code,
  Cpu: Cpu,
  BrainCircuit: BrainCircuit,
  Globe: Globe,
  ShieldCheck: ShieldCheck,
  Lightbulb: Lightbulb,
};

export default function EventCard({ event, onViewDetails, onRegister }: EventCardProps) {
  const IconComponent = ICON_MAP[event.iconName] || Code;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-sky-500/25 bg-slate-950/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-sky-400/70 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]">
      {/* Top glowing edge line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Event Cover Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={event.imageUrl}
          alt={`${event.title} cover image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-sky-950/20 mix-blend-overlay group-hover:bg-sky-950/0 transition-colors" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between gap-2">
          {/* Category Badge with Icon */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <IconComponent className="h-3.5 w-3.5 text-sky-400" />
            <span>{event.category}</span>
          </span>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Upcoming</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="mt-2.5 text-sm text-sky-100/70 leading-relaxed line-clamp-3">
            {event.description}
          </p>

          {/* Date & Venue meta */}
          <div className="mt-5 space-y-2 border-t border-sky-500/15 pt-4 text-xs text-sky-200/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-sky-400" />
              <span className="truncate">{event.dateDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-400" />
              <span className="truncate">{event.venueDisplay}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-sky-500/15 flex items-center gap-3">
          {/* View Details */}
          <button
            type="button"
            onClick={() => onViewDetails(event)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-950/40 py-2.5 px-3 text-xs font-semibold text-sky-200 backdrop-blur-sm transition-all duration-200 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white cursor-pointer active:scale-[0.98]"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          {/* Register Now (if open) */}
          {event.registrationOpen && (
            <button
              type="button"
              onClick={() => onRegister(event)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-300/50 bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 px-3 text-xs font-semibold text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-200 hover:from-sky-400 hover:to-cyan-400 hover:shadow-[0_0_22px_rgba(56,189,248,0.55)] cursor-pointer active:scale-[0.98]"
            >
              <UserCheck className="h-3.5 w-3.5 text-slate-950" />
              <span>Register Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

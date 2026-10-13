'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, Tag } from 'lucide-react';
import { CATEGORIES } from '@/lib/events-data';
import { EventCategory } from '@/lib/types';

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: EventCategory | 'All Events';
  onCategoryChange: (category: EventCategory | 'All Events') => void;
  totalFilteredCount: number;
  totalCount: number;
  onReset: () => void;
}

export default function EventFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalFilteredCount,
  totalCount,
  onReset,
}: EventFiltersProps) {
  const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== 'All Events';

  return (
    <div className="w-full space-y-6">
      {/* Top Search & Results Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sky-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            id="event-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-full border border-sky-400/30 bg-slate-950/70 py-3 pl-11 pr-11 text-sm text-white placeholder-sky-200/40 backdrop-blur-md transition-all duration-300 focus:border-sky-400 focus:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-sky-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Counter & Clear Filter indicator */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <div className="flex items-center gap-2 text-sky-200/70">
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-400" />
            <span>
              Showing <span className="font-semibold text-sky-300">{totalFilteredCount}</span> of{' '}
              <span className="font-semibold text-white">{totalCount}</span> events
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/20 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sky-500/20">
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-sky-400 font-semibold uppercase tracking-wider pl-1 pr-2">
          <Tag className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Track:</span>
        </div>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border border-sky-300 bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.5)] font-bold'
                  : 'border border-sky-500/20 bg-slate-950/60 text-sky-100/70 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

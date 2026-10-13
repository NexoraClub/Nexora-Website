'use client';

import React, { useState, useMemo } from 'react';
import { SearchX, RefreshCcw } from 'lucide-react';
import EventHero from './EventHero';
import EventFilters from './EventFilters';
import EventCard from './EventCard';
import EventModal from './EventModal';
import RegistrationModal from './RegistrationModal';
import PastEventsSection from './PastEventsSection';
import CtaSection from './CtaSection';
import { EventItem, EventCategory } from '@/lib/types';
import { filterEvents } from '@/lib/events-data';

interface EventsPageContentProps {
  initialEvents: EventItem[];
}

export default function EventsPageContent({ initialEvents }: EventsPageContentProps) {
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All Events'>('All Events');

  // Modals state
  const [detailsEvent, setDetailsEvent] = useState<EventItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Hydrate events dynamically from PostgreSQL database via API
  React.useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          const mapped: EventItem[] = data.events.map((e: any) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            category: e.category,
            description: e.description,
            fullDescription: e.fullDescription || e.description,
            imageUrl: e.imageUrl || '/events/code-wars.svg',
            iconName: e.iconName || 'Code',
            eventDate: e.startDate || null,
            dateDisplay: e.dateDisplay || 'To be announced (TBA)',
            startTime: e.startDate ? new Date(e.startDate).toLocaleTimeString() : null,
            endTime: e.endDate ? new Date(e.endDate).toLocaleTimeString() : null,
            venue: e.venue || null,
            venueDisplay: e.venueDisplay || 'Campus Tech Hub (TBA)',
            status: 'upcoming',
            registrationOpen: e.registrationOpen,
            registrationUrl: e.registrationUrl || null,
            eligibility: e.eligibility || 'Open to all students',
            organizer: e.organizer || 'Nexora ISE Club',
            tags: e.tags || [],
            isSample: false,
          }));
          setEventsList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Filter events client-side using single source of truth logic
  const filteredEvents = useMemo(() => {
    return filterEvents(eventsList, selectedCategory, searchQuery);
  }, [eventsList, selectedCategory, searchQuery]);

  const handleOpenDetails = (event: EventItem) => {
    setDetailsEvent(event);
    setIsDetailsOpen(true);
  };

  const handleOpenRegister = (event: EventItem) => {
    setRegisterEvent(event);
    setIsRegisterOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Events');
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <EventHero />

      {/* 2. Main Events Grid Section */}
      <section id="events-grid" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Section Heading & Subtitle */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-jersey text-xs tracking-[0.25em] uppercase text-sky-400">
                ACTIVE TRACKS &amp; COMPETITIONS
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Featured Department Events
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-sky-200/60 max-w-md">
              Choose your track, connect with mentors, and collaborate on cutting-edge engineering projects.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="mt-8">
            <EventFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              totalFilteredCount={filteredEvents.length}
              totalCount={initialEvents.length}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* 6-Card Event Grid or Empty State */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={handleOpenDetails}
                onRegister={handleOpenRegister}
              />
            ))}
          </div>
        ) : (
          /* Friendly Empty State */
          <div className="rounded-3xl border border-sky-500/25 bg-slate-950/60 p-12 text-center backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.1)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <SearchX className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-white">No Matching Events Found</h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-sky-100/70 leading-relaxed">
              We couldn&apos;t find any events matching your search keyword &quot;{searchQuery}&quot; in the &quot;{selectedCategory}&quot; category.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/20 px-5 py-2.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/30 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. Past Events Section */}
      <PastEventsSection />

      {/* 5. Call To Action Section */}
      <CtaSection />

      {/* Accessible Event Details Modal */}
      <EventModal
        event={detailsEvent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenRegister={handleOpenRegister}
      />

      {/* Accessible Event Registration Modal */}
      <RegistrationModal
        event={registerEvent}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

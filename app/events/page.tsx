import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventsPageContent from '@/components/events/EventsPageContent';
import { getAllEvents } from '@/lib/events-data';

export const metadata: Metadata = {
  title: 'Events | Nexora ISE Club',
  description:
    'Explore hackathons, technical symposiums, AI workshops, cybersecurity competitions, and project exhibitions hosted by the Nexora Information Science and Engineering Club.',
  keywords: [
    'Nexora',
    'ISE Club',
    'Events',
    'Hackathon',
    'Code Wars',
    'TechNova',
    'AI Unleashed',
    'WebCraft',
    'Cyber Quest',
    'InnovateX',
  ],
  openGraph: {
    title: 'Events | Nexora ISE Club',
    description:
      'Where Ideas Become Innovation. Explore the upcoming student technical events at Nexora ISE Club.',
    type: 'website',
  },
};

export default function EventsPage() {
  // Centralized single source of truth for the 6 configured events
  const events = getAllEvents();

  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white selection:bg-sky-500/30 selection:text-sky-200">
      {/* Ambient background cyber grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* Existing Header / Navbar exactly as specified */}
      <Navbar />

      {/* Events Page Content */}
      <div className="relative z-10">
        <EventsPageContent initialEvents={events} />
      </div>

      {/* Existing Footer exactly as specified */}
      <Footer />
    </main>
  );
}

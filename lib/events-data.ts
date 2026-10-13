import { EventItem, EventCategory } from './types';

/**
 * NEXORA ISE CLUB - CENTRALIZED EVENTS DATASET
 * 
 * IMPORTANT NOTICE:
 * These six event cards represent initial sample event concepts designed for
 * the Nexora Information Science & Engineering Club. They serve as sample content
 * until the official club committee confirms the scheduled dates, venues,
 * and exact syllabi.
 * 
 * Single source of truth:
 * Edit the event details below to update event cards, modals, and default API responses.
 */
export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 'code-wars-2026',
    title: 'Code Wars',
    slug: 'code-wars',
    category: 'Hackathon',
    description: 'Collaborate with fellow developers, solve challenging programming problems, and build innovative solutions.',
    fullDescription: 'Step into the arena of algorithmic excellence and rapid product prototyping. Code Wars brings together developers, designers, and problem solvers for an intense hackathon experience. Teams tackle real-world problem statements, build working prototypes, and pitch their solutions before an industry panel. Mentorship and code reviews provided throughout the sprint.',
    imageUrl: '/events/code-wars.svg',
    iconName: 'Code',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'Campus Tech Hub / Online Arena (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'Open to all undergraduate students interested in coding and rapid software prototyping.',
    organizer: 'Nexora ISE Technical Committee',
    tags: ['Coding', 'Hackathon', 'Algorithms', 'Team Sprint'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'technova-2026',
    title: 'TechNova',
    slug: 'technova',
    category: 'Technical Fest',
    description: 'Explore emerging technologies, demonstrate technical skills, and experience the creativity of the engineering community.',
    fullDescription: 'TechNova is the flagship annual technical symposium celebrating student ingenuity and emerging technology. Featuring keynote lightning talks from industry alumni, hands-on tech demos, competitive coding rounds, and hardware project showcases, TechNova is the nexus where curiosity meets engineering execution.',
    imageUrl: '/events/technova.svg',
    iconName: 'Cpu',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'ISE Auditorium & Seminar Hall (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'Open to engineering and science students across all branches.',
    organizer: 'Nexora ISE Club Executive Board',
    tags: ['Fest', 'Innovation', 'Keynotes', 'Tech Demonstrations'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'ai-unleashed-2026',
    title: 'AI Unleashed',
    slug: 'ai-unleashed',
    category: 'Artificial Intelligence',
    description: 'Discover AI concepts, explore intelligent applications, and participate in activities focused on emerging AI technologies.',
    fullDescription: 'Explore the frontier of Generative AI, machine learning pipelines, and agentic workflows. In this interactive session and challenge track, participants build practical AI applications using modern foundation model APIs, prompt engineering frameworks, and neural network fundamentals. No prior deep learning experience required—curiosity is the only prerequisite.',
    imageUrl: '/events/ai-unleashed.svg',
    iconName: 'BrainCircuit',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'AI & Data Science Computing Lab (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'All students interested in Artificial Intelligence, Machine Learning, and Agentic Systems.',
    organizer: 'Nexora ISE AI Special Interest Group',
    tags: ['Artificial Intelligence', 'LLMs', 'Machine Learning', 'GenAI'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'webcraft-2026',
    title: 'WebCraft',
    slug: 'webcraft',
    category: 'Workshop',
    description: 'Learn modern web development concepts and explore how to build responsive and interactive websites.',
    fullDescription: 'From responsive flexboxes to modern full-stack architectures, WebCraft is a hands-on technical workshop taking students from foundational HTML/CSS/JavaScript through modern Next.js and Tailwind CSS development. Attendees follow an instructor-led build session, deploy a live web app, and gain portfolio-ready development skills.',
    imageUrl: '/events/webcraft.svg',
    iconName: 'Globe',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'Software Systems Lab 3 (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'Beginners to intermediate web enthusiasts with a laptop.',
    organizer: 'Nexora ISE Web & Systems Wing',
    tags: ['Web Dev', 'React', 'Next.js', 'Tailwind', 'Hands-on'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'cyber-quest-2026',
    title: 'Cyber Quest',
    slug: 'cyber-quest',
    category: 'Cybersecurity',
    description: 'Test your problem-solving skills through cybersecurity challenges and learn about digital security.',
    fullDescription: 'Enter the realm of ethical hacking, defensive security, and digital forensics. Cyber Quest features a capture-the-flag (CTF) tournament designed for aspiring security analysts and ethical hackers. Solve realistic challenges spanning cryptography, web application security vulnerabilities, network packet analysis, and reverse engineering.',
    imageUrl: '/events/cyber-quest.svg',
    iconName: 'ShieldCheck',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'Networks & Cybersecurity Lab (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'Individual participants and teams of two interested in security and CTF challenges.',
    organizer: 'Nexora ISE Cybersecurity SIG',
    tags: ['Cybersecurity', 'CTF', 'Cryptography', 'Network Defense'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'innovatex-2026',
    title: 'InnovateX',
    slug: 'innovatex',
    category: 'Project Exhibition',
    description: 'Showcase innovative projects, exchange ideas, and explore creative solutions to real-world problems.',
    fullDescription: 'The premier student project expo where final-year and pre-final-year scholars exhibit their engineering capstone projects, software prototypes, IoT devices, and research papers. Judged by distinguished faculty and industry guests, InnovateX offers peer feedback, recognition, and award trophies for top innovative contributions.',
    imageUrl: '/events/innovatex.svg',
    iconName: 'Lightbulb',
    eventDate: null,
    dateDisplay: 'To be announced (TBA)',
    startTime: null,
    endTime: null,
    venue: null,
    venueDisplay: 'College Main Quadrangle / Exhibition Hall (TBA)',
    status: 'upcoming',
    registrationOpen: true,
    registrationUrl: null,
    eligibility: 'Open to student project teams with a functional hardware or software prototype.',
    organizer: 'Nexora ISE Research & Project Mentorship Cell',
    tags: ['Exhibition', 'Prototypes', 'Innovation', 'Research Showcase'],
    isSample: true,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
];

export const CATEGORIES: (EventCategory | 'All Events')[] = [
  'All Events',
  'Hackathon',
  'Technical Fest',
  'Artificial Intelligence',
  'Workshop',
  'Cybersecurity',
  'Project Exhibition',
];

/**
 * Return all 6 configured events.
 */
export function getAllEvents(): EventItem[] {
  return [...SAMPLE_EVENTS];
}

/**
 * Find an event by its ID or slug.
 */
export function getEventByIdOrSlug(identifier: string): EventItem | undefined {
  const normalized = identifier.toLowerCase().trim();
  return SAMPLE_EVENTS.find(
    (e) => e.id.toLowerCase() === normalized || e.slug.toLowerCase() === normalized
  );
}

/**
 * Filter events by category and search keyword.
 */
export function filterEvents(
  events: EventItem[],
  category?: string | null,
  search?: string | null
): EventItem[] {
  let filtered = [...events];

  if (category && category !== 'All Events') {
    const targetCat = category.toLowerCase().trim();
    filtered = filtered.filter((event) => {
      // Allow matching 'Workshop' against 'Workshop' or 'Web Development Workshop'
      const eventCat = event.category.toLowerCase();
      return eventCat === targetCat || eventCat.includes(targetCat) || targetCat.includes(eventCat);
    });
  }

  if (search && search.trim().length > 0) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter((event) => {
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.fullDescription.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }

  return filtered;
}

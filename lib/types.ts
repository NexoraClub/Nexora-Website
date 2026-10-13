export type EventCategory =
  | 'Hackathon'
  | 'Technical Fest'
  | 'Artificial Intelligence'
  | 'Workshop'
  | 'Cybersecurity'
  | 'Project Exhibition';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  fullDescription: string;
  imageUrl: string;
  iconName: 'Code' | 'Cpu' | 'BrainCircuit' | 'Globe' | 'ShieldCheck' | 'Lightbulb';
  eventDate: string | null; // null or ISO date string
  dateDisplay: string; // "Date: TBA (Announced soon)"
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  venueDisplay: string; // "Venue: ISE Department Labs (TBA)"
  status: EventStatus;
  registrationOpen: boolean;
  registrationUrl?: string | null;
  eligibility: string;
  organizer: string;
  tags: string[];
  isSample: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationPayload {
  event_id: string;
  full_name: string;
  email: string;
  phone?: string;
  college?: string;
}

export interface RegistrationRecord {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  college?: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  total?: number;
}

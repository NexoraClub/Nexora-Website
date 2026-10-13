"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NoticeCard, {
  Notice,
  NoticeCategory,
  getCategoryBadgeStyles,
  AttachmentIcon,
} from "@/components/NoticeCard";
import NoticeModal from "@/components/NoticeModal";

// Local Mock Data (No backend database, Prisma, or Supabase)
const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice-urgent-1",
    title: "Internal Hackathon 2026: Team Registration Closes Tonight at 11:59 PM",
    summary:
      "Final call for teams participating in the Nexora 36-Hour Hackathon. Ensure your GitHub repo and team roster of 3-4 members are locked in before the deadline.",
    content:
      "Attention all ISE Department students!\n\nTeam registration for the upcoming Nexora 36-Hour Hackathon will officially close tonight at 11:59 PM IST. No extensions will be granted under any circumstances as cloud compute instances, GPU nodes, and mentor slots are being provisioned overnight.\n\nKey Submission Rules:\n• Team Size: Strictly 3 to 4 members (inter-year collaborations are welcome).\n• Project Domains: AI/ML Systems, Distributed Cloud Architectures, Web3, or Cyber-Physical IoT.\n• Repository Requirement: Every team must submit a GitHub repository containing a detailed README outlining the proposed problem statement, architecture diagram, and tech stack.\n\nPlease refer to the attached official rulebook for evaluation criteria, judging benchmarks, and code submission guidelines.",
    category: "Urgent",
    isPinned: true,
    isUrgentHero: true,
    postedAt: "2 hours ago",
    date: "Oct 12, 2026",
    author: {
      name: "Dr. Rajesh K.",
      role: "Faculty Advisor • ISE Dept",
    },
    attachment: {
      name: "Hackathon_Rulebook_2026.pdf",
      url: "#",
      type: "pdf",
      size: "2.4 MB",
    },
    tags: ["hackathon", "deadline", "urgent", "teams"],
  },
  {
    id: "notice-events-1",
    title: "Nexora DevCon 2026: Keynote on Distributed AI & Systems Engineering",
    summary:
      "Join us for our annual flagship technical symposium featuring keynote talks from senior engineers at Google and NVIDIA, hands-on workshops, and project exhibitions.",
    content:
      "We are thrilled to unveil the speaker lineup for Nexora DevCon 2026!\n\nThis year's flagship technical symposium will be held on Friday, November 6th at the Main Auditorium. The event brings together industry pioneers, researchers, and student builders.\n\nFeatured Highlights:\n• Keynote on 'Scalable LLM Inference Systems' by Dr. Ananya Sen (Staff Systems Engineer).\n• Interactive panel discussion: 'Transitioning from College to High-Scale Tech Companies'.\n• Live demonstration of autonomous robotics systems built by Nexora's hardware division.\n\nSeats are limited to 300 attendees. Registered members will receive their digital entry badges via email.",
    category: "Events",
    isPinned: true,
    isUrgentHero: false,
    postedAt: "5 hours ago",
    date: "Oct 12, 2026",
    author: {
      name: "Aarav Sharma",
      role: "Club President",
    },
    attachment: {
      name: "DevCon_Schedule_and_Track_Details.pdf",
      url: "#",
      type: "pdf",
      size: "1.8 MB",
    },
    tags: ["devcon", "conference", "ai", "keynote"],
  },
  {
    id: "notice-projects-1",
    title: "Nexora Open Source Initiative: Call for Project Contributors & Mentors",
    summary:
      "Contribute to Nexora's production open-source tools including our campus event scheduler, automated grading assistant, and department portal.",
    content:
      "The Nexora Technical Committee is opening applications for student contributors and module mentors for the Fall semester.\n\nWhether you are a seasoned developer or looking to make your very first Git pull request, this initiative pairs you with experienced seniors to build production-grade software used across the campus.\n\nActive Repositories:\n• Nexora-Core: Campus Event Orchestration Platform (Next.js, TypeScript, PostgreSQL)\n• Automata-Bench: Code execution sandbox for lab assignments\n• Nexora UI System: Official club design library and component kit in Figma & Tailwind\n\nContributors will receive official department certificates and recommendation letters.",
    category: "Projects",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "1 day ago",
    date: "Oct 11, 2026",
    author: {
      name: "Kavya Menon",
      role: "Technical Lead",
    },
    attachment: {
      name: "Nexora_Design_System.figma",
      url: "#",
      type: "figma",
      size: "14.2 MB",
    },
    tags: ["opensource", "github", "projects", "mentorship"],
  },
  {
    id: "notice-urgent-2",
    title: "High-Performance Compute Server Scheduled Maintenance & Downtime",
    summary:
      "The ISE GPU cluster (nodes 01 through 08) will be taken offline for driver updates and kernel patches on Saturday from 2:00 AM to 8:00 AM.",
    content:
      "Notice to all student researchers and project teams utilizing the Nexora GPU Cluster:\n\nScheduled maintenance has been slated for Saturday, October 17th, between 02:00 AM and 08:00 AM IST. All running Slurm jobs and training runs will be paused or checkpointed prior to reboot.\n\nActions Required:\n1. Save model checkpoints and intermediate weights before 01:30 AM.\n2. Ensure Jupyter kernel sessions are safely closed.\n3. Verify remote storage volumes are synchronized to cold storage.\n\nIf you have long-running research experiments that cannot be interrupted, please reach out to the Systems Lab Admin immediately.",
    category: "Urgent",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "1 day ago",
    date: "Oct 11, 2026",
    author: {
      name: "Prof. Sudhir Rao",
      role: "Systems Administrator",
    },
    attachment: {
      name: "GPU_Cluster_Maintenance_Log.pdf",
      url: "#",
      type: "pdf",
      size: "640 KB",
    },
    tags: ["gpu", "server", "cluster", "maintenance"],
  },
  {
    id: "notice-events-2",
    title: "Hands-on Workshop: Building High-Performance Web Apps with Next.js",
    summary:
      "Master modern web development, server components, edge caching, and dynamic animation systems in this intensive 3-hour code-along session.",
    content:
      "Ready to level up your full-stack engineering skills? Nexora's Web Development wing is hosting a deep-dive workshop covering Next.js App Router architecture.\n\nPrerequisites:\n• Laptop with Node.js 20+ installed and VS Code or Cursor\n• Familiarity with modern JavaScript (ES6+) and React primitives\n\nCurriculum:\n• Module 1: React Server Components & Streaming SSR\n• Module 2: Tailwind CSS v4 and fluid responsive layouts\n• Module 3: Client-side state orchestration and offline resilience\n\nParticipants will build and deploy a working web application during the workshop.",
    category: "Events",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "2 days ago",
    date: "Oct 10, 2026",
    author: {
      name: "Rohan V.",
      role: "Web Dev Lead",
    },
    attachment: {
      name: "Workshop_Starter_Pack.pdf",
      url: "#",
      type: "pdf",
      size: "1.1 MB",
    },
    tags: ["workshop", "nextjs", "react", "tailwindcss"],
  },
  {
    id: "notice-general-1",
    title: "Executive Committee Elections: Call for 2026-2027 Core Nominations",
    summary:
      "Applications are now open for core student leadership positions in Nexora including Vice President, Tech Head, Design Lead, and Event Coordinators.",
    content:
      "Nexora is inviting passionate 2nd and 3rd year Information Science students to step up and lead the department club for the 2026-2027 academic tenure.\n\nOpen Positions:\n• Vice President (1 Post)\n• Technical Head (Software & Systems) (2 Posts)\n• Design & Creative Director (1 Post)\n• Competitive Programming Lead (1 Post)\n• Operations & Logistics Lead (2 Posts)\n\nEligibility:\n• Minimum CGPA: 7.5\n• Proven contribution to club events or technical repositories\n• Statement of purpose outlining your vision for Nexora\n\nInterviews with the faculty board and outgoing committee will be conducted next week.",
    category: "General",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "3 days ago",
    date: "Oct 9, 2026",
    author: {
      name: "Dr. Rajesh K.",
      role: "Faculty Advisor • ISE Dept",
    },
    attachment: {
      name: "Nomination_Form_and_Eligibility.pdf",
      url: "#",
      type: "pdf",
      size: "480 KB",
    },
    tags: ["elections", "leadership", "nominations", "core-team"],
  },
  {
    id: "notice-projects-2",
    title: "IoT & Embedded Systems Lab: Sensor Kits & Microcontrollers Available",
    summary:
      "ESP32-S3 boards, LoRa transceivers, LiDAR modules, and camera sensors are now available for checkout at Lab 304 for approved semester capstone projects.",
    content:
      "The Department has procured new hardware toolkits to support IoT and embedded intelligence projects for ISE students.\n\nAvailable Hardware Inventory:\n• ESP32-S3 Dual-Core SoC development boards with Wi-Fi & BLE 5.0\n• Raspberry Pi 5 (8GB) boards with active cooling cases\n• LoRa SX1262 long-range telemetry modules\n• VL53L1X Time-of-Flight LiDAR distance sensors\n\nCheckout Rules:\n• Hardware can be borrowed for a period of up to 4 weeks with faculty approval.\n• Proper ESD handling procedures must be followed in the lab.\n• Damaged components must be reported within 24 hours.",
    category: "Projects",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "4 days ago",
    date: "Oct 8, 2026",
    author: {
      name: "Pooja Hegde",
      role: "Hardware & IoT Head",
    },
    attachment: {
      name: "Hardware_Kit_Inventory.pdf",
      url: "#",
      type: "pdf",
      size: "890 KB",
    },
    tags: ["iot", "hardware", "esp32", "lab"],
  },
  {
    id: "notice-general-2",
    title: "Academic Digital Subscriptions: IEEE Xplore & ACM Digital Library Access",
    summary:
      "Institutional proxy credentials and off-campus VPN profiles have been refreshed for the new semester. Access millions of peer-reviewed papers freely.",
    content:
      "All registered Nexora club members and ISE students have institutional access to top-tier computer science research journals and conference proceedings.\n\nEnabled Portals:\n• IEEE Xplore Digital Library\n• ACM Digital Library\n• SpringerLink Computer Science Collections\n• ScienceDirect Computer Science Journals\n\nHow to Access from Home:\n1. Download the campus OpenVPN profile from the intranet portal.\n2. Connect using your student USN and institutional email.\n3. Navigate to ieeexplore.ieee.org or dl.acm.org — your session will automatically reflect institutional licensing.\n\nFor support configuring proxy settings on Linux or macOS, contact the Nexora sysadmin team.",
    category: "General",
    isPinned: false,
    isUrgentHero: false,
    postedAt: "5 days ago",
    date: "Oct 7, 2026",
    author: {
      name: "Nexora Academic Committee",
      role: "Research Wing",
    },
    tags: ["research", "ieee", "acm", "library"],
  },
];

type CategoryFilter = "All" | NoticeCategory;

const CATEGORIES: CategoryFilter[] = ["All", "Urgent", "Projects", "Events", "General"];

export default function NoticesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Distinct Pinned / Urgent Hero Card Notice (Top priority)
  const heroNotice = useMemo(() => {
    return INITIAL_NOTICES.find((n) => n.isUrgentHero) || INITIAL_NOTICES[0];
  }, []);

  // Filter and search logic
  const filteredNotices = useMemo(() => {
    let result = [...INITIAL_NOTICES];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((notice) => notice.category === selectedCategory);
    }

    // Real-time Search by title, summary, content, author, or tags
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (notice) =>
          notice.title.toLowerCase().includes(q) ||
          notice.summary.toLowerCase().includes(q) ||
          notice.content.toLowerCase().includes(q) ||
          notice.author.name.toLowerCase().includes(q) ||
          notice.author.role.toLowerCase().includes(q) ||
          notice.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sort Order
    if (sortOrder === "oldest") {
      result.reverse();
    }

    return result;
  }, [selectedCategory, searchQuery, sortOrder]);

  // Category counts for pill badges
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      All: INITIAL_NOTICES.length,
      Urgent: 0,
      Projects: 0,
      Events: 0,
      General: 0,
    };
    INITIAL_NOTICES.forEach((n) => {
      counts[n.category] = (counts[n.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Check if Hero card matches current search/filter
  const showHeroBanner = useMemo(() => {
    if (!heroNotice) return false;
    if (selectedCategory !== "All" && heroNotice.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      return (
        heroNotice.title.toLowerCase().includes(q) ||
        heroNotice.summary.toLowerCase().includes(q) ||
        heroNotice.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  }, [heroNotice, selectedCategory, searchQuery]);

  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white selection:bg-sky-500 selection:text-white">
      {/* Background ambient neon glow matching Nexora theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] sm:w-[900px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-40 h-[400px] w-[500px] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute -bottom-20 left-10 h-[350px] w-[450px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Global Navbar */}
      <Navbar />

      {/* Main Noticeboard Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER */}
        {/* ========================================================================= */}
        <section className="text-center mb-10 sm:mb-14">
          
          {/* Department Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md shadow-[0_0_12px_rgba(56,189,248,0.25)] mb-4">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span className="tracking-wider uppercase">ISE Department Bulletin</span>
          </div>

          {/* Main Title */}
          <h1 className="font-jersey text-4xl sm:text-5xl md:text-6xl tracking-wide text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.4)]">
            NEXORA <span className="text-sky-400 drop-shadow-[0_0_16px_rgba(56,189,248,0.7)]">NOTICEBOARD</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-sky-100/70 max-w-2xl mx-auto leading-relaxed">
            Official announcements, team updates, and urgent alerts.
          </p>

          {/* Decorative Divider */}
          <div
            aria-hidden="true"
            className="mt-6 mx-auto h-[1px] w-32 sm:w-48 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.8)]"
          />
        </section>

        {/* ========================================================================= */}
        {/* 2. PINNED / URGENT HERO CARD */}
        {/* ========================================================================= */}
        {showHeroBanner && heroNotice && (
          <section className="mb-10 sm:mb-12" aria-label="Urgent Announcement">
            <div className="relative overflow-hidden rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-[#0a0e1c] to-[#070b16] p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(244,63,94,0.2)] transition-all duration-300 hover:border-rose-500/70 hover:shadow-[0_0_45px_rgba(244,63,94,0.3)]">
              {/* Background ambient beacon glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-rose-500/15 blur-[80px]"
              />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3.5 flex-1">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Live Urgency Pulse */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                      </span>
                      <span>CRITICAL ANNOUNCEMENT</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="17" x2="12" y2="22" />
                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                      </svg>
                      PINNED HERO
                    </span>

                    <span className="text-xs text-rose-200/60 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {heroNotice.postedAt}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {heroNotice.title}
                  </h2>

                  {/* Summary */}
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                    {heroNotice.summary}
                  </p>

                  {/* Attachment and Author info */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {heroNotice.attachment && (
                      <a
                        href={heroNotice.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-950/40 px-3.5 py-1.5 text-xs font-semibold text-rose-200 transition-colors hover:border-rose-400 hover:bg-rose-500/20 hover:text-white"
                      >
                        <AttachmentIcon type={heroNotice.attachment.type} />
                        <span>{heroNotice.attachment.name}</span>
                        {heroNotice.attachment.size && (
                          <span className="text-rose-300/60">({heroNotice.attachment.size})</span>
                        )}
                      </a>
                    )}

                    <span className="text-xs text-slate-400">
                      Issued by <strong className="text-slate-200 font-semibold">{heroNotice.author.name}</strong> ({heroNotice.author.role})
                    </span>
                  </div>
                </div>

                {/* Hero CTA Button */}
                <div className="shrink-0 flex sm:flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(heroNotice)}
                    aria-label={`View urgent announcement: ${heroNotice.title}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/50 bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300 hover:from-rose-500 hover:to-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] active:scale-95 cursor-pointer"
                  >
                    <span>Read Urgent Notice</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE CONTROLS BAR (Search, Filters, View Modes) */}
        {/* ========================================================================= */}
        <section className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Real-time Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sky-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices by keyword, title, tag, or author..."
                className="w-full rounded-2xl border border-sky-500/30 bg-[#070b16]/90 pl-11 pr-11 py-3 text-sm text-white placeholder-sky-200/40 backdrop-blur-md outline-none transition-all duration-200 focus:border-sky-400 focus:bg-[#0c1222] focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                aria-label="Search noticeboard announcements"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              {/* Sort Order Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-200/50 hidden sm:inline-block">Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                  className="rounded-xl border border-sky-500/30 bg-[#070b16] px-3 py-2 text-xs font-medium text-sky-200 outline-none focus:border-sky-400 cursor-pointer"
                  aria-label="Sort notices by date"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center rounded-xl border border-sky-500/30 bg-[#070b16] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid layout view"
                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-sky-500/20 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List layout view"
                  className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-sky-500/20 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none" role="tablist" aria-label="Notice categories">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoryCounts[cat];

              // Custom category active styles
              let activeBadgeClass = "border-sky-400 bg-sky-500/25 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]";
              if (cat === "Urgent") {
                activeBadgeClass = "border-rose-400 bg-rose-500/25 text-white shadow-[0_0_16px_rgba(244,63,94,0.4)]";
              } else if (cat === "Projects") {
                activeBadgeClass = "border-sky-400 bg-sky-500/25 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]";
              } else if (cat === "Events") {
                activeBadgeClass = "border-emerald-400 bg-emerald-500/25 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)]";
              } else if (cat === "General") {
                activeBadgeClass = "border-amber-400 bg-amber-500/25 text-white shadow-[0_0_16px_rgba(245,158,11,0.4)]";
              }

              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? activeBadgeClass
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-white"
                  }`}
                >
                  {/* Category dot */}
                  {cat !== "All" && (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        cat === "Urgent"
                          ? "bg-rose-400"
                          : cat === "Projects"
                          ? "bg-sky-400"
                          : cat === "Events"
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />
                  )}
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[11px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Summary Bar */}
          {(searchQuery || selectedCategory !== "All") && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <p>
                Showing <strong className="text-white">{filteredNotices.length}</strong> {filteredNotices.length === 1 ? "notice" : "notices"}
                {selectedCategory !== "All" && (
                  <span> in category <strong className="text-sky-300">{selectedCategory}</strong></span>
                )}
                {searchQuery && (
                  <span> matching &ldquo;<strong className="text-sky-300">{searchQuery}</strong>&rdquo;</span>
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-sky-400 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. NOTICE FEED GRID / LIST */}
        {/* ========================================================================= */}
        {filteredNotices.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onReadMore={(n) => setSelectedNotice(n)}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-16 rounded-3xl border border-dashed border-sky-400/30 bg-[#070b16]/60 p-12 text-center backdrop-blur-md">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 mb-4 border border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">No notices found</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any announcements matching your current filters. Try searching with different keywords or reset your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-500/20 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all hover:bg-sky-500/30 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. NOTICE DETAIL MODAL */}
      {/* ========================================================================= */}
      <NoticeModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* Put photos in /public/faculty/*.jpg and /public/about/*.jpg.               */
/* If an image is missing, an initials avatar is shown instead.               */
/* -------------------------------------------------------------------------- */

type Member = { name: string; role: string; image: string };

const HOD: Member = {
  name: "Dr. John Prakash Veigas",
  role: "Professor & HOD",
  image: "/faculty/john-prakash-veigas.jpg",
};

const FACULTY: Member[] = [
  HOD,
  { name: "Dr. Lokesh M R", role: "Professor", image: "/faculty/lokesh-m-r.jpg" },
  { name: "Dr. Krishna Prasad K", role: "Associate Professor", image: "/faculty/krishna-prasad-k.jpg" },
  { name: "Mr. Rakesh M R", role: "Assistant Professor", image: "/faculty/rakesh-m-r.jpg" },
  { name: "Mrs. Sharanya P S", role: "Assistant Professor", image: "/faculty/sharanya-p-s.jpg" },
  { name: "Mrs. Divya", role: "Assistant Professor", image: "/faculty/divya.jpg" },
  { name: "Mrs. R Sahaya Shamini", role: "Assistant Professor", image: "/faculty/sahaya-shamini.jpg" },
  { name: "Mrs. Archana Priyadarshini", role: "Assistant Professor", image: "/faculty/archana-priyadarshini.jpg" },
  { name: "Mrs. Arpitha Kumari G", role: "Assistant Professor", image: "/faculty/arpitha-kumari-g.jpg" },
  { name: "Mr. Harish Kumar", role: "Programmer", image: "/faculty/harish-kumar.jpg" },
  { name: "Ms. Sushmitha", role: "Instructor", image: "/faculty/sushmitha.jpg" },
  { name: "Mr. Anup Anchan", role: "Instructor", image: "/faculty/anup-anchan.jpg" },
  { name: "Ms. Daksha N Poojary", role: "Instructor", image: "/faculty/daksha-n-poojary.jpg" },
];

const MISSIONS = [
  "To impart theoretical and practical knowledge through the concepts and technologies in Information Science and Engineering.",
  "To foster research, collaboration and higher education with premier institutions and industries.",
  "Promote innovation and entrepreneurship to fulfill the needs of the society and industry.",
];

const STATS = [
  { value: "2016", label: "Established" },
  { value: "60", label: "Annual intake" },
  { value: "100+", label: "Research papers" },
  { value: "NBA", label: "Accredited B.E. program" },
];

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function initials(name: string) {
  return name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function Photo({
  src,
  alt,
  className = "",
  fallbackText,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackText: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-sky-500/20 to-blue-700/20 text-sky-200 font-bold ${className}`}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-jersey text-3xl sm:text-4xl tracking-wide text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.3)]">
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
    />
  );
}

function FacultyCard({ member }: { member: Member }) {
  return (
    <li className="group flex flex-col items-center rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-sky-400/60 hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]">
      <Photo
        src={member.image}
        alt={member.name}
        fallbackText={initials(member.name)}
        className="h-32 w-28 sm:h-36 sm:w-32 rounded-xl border border-sky-400/20 text-2xl"
      />
      <p className="mt-3 text-sm font-semibold text-white leading-snug">{member.name}</p>
      <p className="mt-0.5 text-xs text-sky-200/60">{member.role}</p>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white selection:bg-sky-500 selection:text-white">
      {/* Ambient glow, same as the noticeboard */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] sm:w-[900px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute top-[40%] -right-40 h-[400px] w-[500px] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute -bottom-20 left-10 h-[350px] w-[450px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        {/* ------------------------------------------------------------------ */}
        {/* 1. HERO BANNER (college + department, like the photo header)       */}
        {/* ------------------------------------------------------------------ */}
        <section className="relative mb-14 overflow-hidden rounded-3xl border border-sky-500/30 shadow-[0_0_35px_rgba(56,189,248,0.15)]">
          <Photo
            src="/about/lab-banner.jpg"
            alt="Students working in the department computer lab"
            fallbackText=""
            className="absolute inset-0 h-full w-full opacity-60"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#050610] via-[#050610]/80 to-[#050610]/30"
          />
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:py-20 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span className="tracking-wider uppercase">About the Department</span>
            </div>

            <h1 className="mt-5 font-jersey text-4xl sm:text-5xl md:text-6xl tracking-wide text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.4)]">
              Information Science <span className="text-sky-400 drop-shadow-[0_0_16px_rgba(56,189,248,0.7)]">&amp; Engineering</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-sky-100/80 leading-relaxed">
              A J Institute of Engineering &amp; Technology
              <span className="block text-sm text-sky-100/60">
                A Unit of Laxmi Memorial Educational Trust&reg; &middot; Kottara Chowki, Mangaluru
              </span>
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. EXPLORE, INNOVATE + PHOTO                                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mb-14">
          <div>
            <SectionTitle>
              Explore, Innovate, and Engineer the Future
            </SectionTitle>
            <p className="mt-5 text-sm sm:text-base leading-7 text-slate-300 max-w-2xl">
              The Department of Information Science and Engineering, established in 2016 as a founding
              branch of AJ Institute of Engineering and Technology in Mangaluru, has rapidly emerged as a
              leading academic unit. Offering an NBA-accredited Bachelor of Engineering program with an
              annual intake of 60 students, the department focuses on equipping students with both
              theoretical and practical skills for success in the rapidly evolving IT industry.
            </p>
            <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300 max-w-2xl">
              With state-of-the-art infrastructure, including advanced computing facilities and
              specialized laboratories, students gain hands-on experience through innovative projects,
              research initiatives, and engagement with our vibrant startup ecosystem. Our dedicated
              faculty, with a strong background in both academia and industry, have published two
              textbooks, two book chapters, and over 100 research papers.
            </p>
            <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300 max-w-2xl">
              Our curriculum, prescribed by Visvesvaraya Technological University (VTU), stays aligned
              with industry trends. We emphasize holistic student development through workshops,
              seminars, industry collaborations, and entrepreneurship opportunities, preparing graduates
              with the technical, leadership, and problem-solving skills necessary for impactful
              careers. The department remains committed to advancing the information technology sector
              locally and globally through education, research, innovation, and a thriving startup
              culture.
            </p>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl bg-sky-500/10 blur-2xl"
            />
            <Photo
              src="/faculty/lab-classroom.jpg"
              alt="A faculty member teaching in the computer lab"
              fallbackText="ISE"
              className="relative aspect-[4/3] w-full rounded-3xl border border-sky-400/30 shadow-[0_0_30px_rgba(56,189,248,0.2)] text-5xl"
            />
          </div>
        </section>

        {/* Quick facts */}
        <section aria-label="Department at a glance" className="mb-14">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-sky-500/20 bg-[#070b16]/80 px-5 py-5 text-center backdrop-blur-md"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-jersey text-4xl text-sky-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                  {s.value}
                </dd>
                <p className="mt-1 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </dl>
        </section>

        <Divider />

        {/* ------------------------------------------------------------------ */}
        {/* 3. VISION & MISSION                                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="grid gap-10 py-14 md:grid-cols-2">
          <div>
            <SectionTitle>Vision</SectionTitle>
            <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300 max-w-md">
              To be a center of excellence in Information Science &amp; Engineering education, research
              and training to meet the growing needs of the industry and society.
            </p>
          </div>

          <div>
            <SectionTitle>Mission</SectionTitle>
            <ol className="mt-4 space-y-3">
              {MISSIONS.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm sm:text-base leading-7 text-slate-300">
                  <span className="mt-1 inline-flex h-6 w-9 shrink-0 items-center justify-center rounded-md border border-sky-400/40 bg-sky-500/15 text-[11px] font-bold text-sky-300">
                    M{i + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Divider />

        {/* ------------------------------------------------------------------ */}
        {/* 4. HOD DESK                                                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-14" aria-labelledby="hod-heading">
          <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-950/30 via-[#0a0e1c] to-[#070b16] p-6 sm:p-10 shadow-[0_0_35px_rgba(56,189,248,0.12)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-[80px]"
            />
            <div className="relative z-10 grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
              <div className="flex flex-col items-center md:items-start">
                <h2
                  id="hod-heading"
                  className="font-jersey text-3xl tracking-wide text-white mb-4 self-start"
                >
                  HOD Desk
                </h2>
                <Photo
                  src={HOD.image}
                  alt={HOD.name}
                  fallbackText={initials(HOD.name)}
                  className="h-52 w-44 rounded-2xl border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-4xl"
                />
              </div>

              <div className="md:pt-12">
                <p className="text-sm sm:text-base leading-7 text-slate-300">
                  Welcome to the Department of Information Science and Engineering (ISE), which offers an
                  NBA-accredited undergraduate B.E. program dedicated to achieving excellence in technical
                  education. Our vision is to become a center of excellence, empowering students to meet
                  the evolving needs of industry and society. Our department is committed to nurturing
                  future innovators and leaders in information science by providing a comprehensive
                  curriculum that seamlessly integrates theoretical knowledge with practical skills.
                </p>
                <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300">
                  With a team of experienced faculty, state-of-the-art laboratories, and collaborative
                  industry partnerships, we prepare our students to thrive in the dynamic IT landscape.
                  We have established strong Memorandums of Understanding (MOUs) with leading industries,
                  enabling our students to gain invaluable real-world experience and stay abreast of the
                  latest technological advancements. Furthermore, our robust alumni network offers
                  valuable mentorship and career opportunities, fostering a community of continuous growth
                  and success.
                </p>
                <p className="mt-5 text-sm font-semibold text-white">{HOD.name}</p>
                <p className="text-xs text-sky-300/80">{HOD.role}</p>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ------------------------------------------------------------------ */}
        {/* 5. FACULTY & STAFF                                                 */}
        {/* ------------------------------------------------------------------ */}
        <section className="pt-14" aria-labelledby="faculty-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="faculty-heading"
                className="font-jersey text-3xl sm:text-4xl tracking-wide text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.3)]"
              >
                Faculty &amp; Staff
              </h2>
              <p className="mt-1 text-sm text-sky-100/60">
                {FACULTY.length} members across teaching, programming and lab instruction.
              </p>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {FACULTY.map((m) => (
              <FacultyCard key={m.name} member={m} />
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}

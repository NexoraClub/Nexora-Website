"use client";

import React, { useState, useEffect } from "react";
import LearnHero from "./LearnHero";
import ExploreLearning from "./ExploreLearning";
import UpcomingExams from "./UpcomingExams";
import StudyMaterialsSection from "./StudyMaterialsSection";
import SkillDevelopment from "./SkillDevelopment";
import LatestUpdates from "./LatestUpdates";
import {
  LearningResource,
  ExamSchedule,
  AcademicAnnouncement,
  SkillResource,
  INITIAL_STUDY_MATERIALS,
  INITIAL_EXAMS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SKILLS,
} from "./learnData";

export default function LearnPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LearningResource[]>(INITIAL_STUDY_MATERIALS);
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [announcements, setAnnouncements] = useState<AcademicAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [skills] = useState<SkillResource[]>(INITIAL_SKILLS);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time integration with backend database
  useEffect(() => {
    async function fetchFromDatabase() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/resources");
        const data = await res.json();
        if (data.resources && data.resources.length > 0) {
          const mapped: LearningResource[] = data.resources.map((r: any) => ({
            id: r.id,
            title: r.title,
            subject: r.subject,
            semester: r.semester || 3,
            category: (r.category || "notes") as any,
            description: r.description,
            fileType: (r.resourceType || "PDF") as any,
            fileUrl: r.fileUrl || "#",
            uploadedAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "2026-03-01",
            tags: r.tags || [],
          }));
          setMaterials(mapped);
        }
      } catch (err) {
        console.warn("Fallback to initial study materials", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromDatabase();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <LearnHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Explore Learning 4-Card Grid */}
      <ExploreLearning
        materialsCount={materials.length}
        examsCount={exams.length}
        skillsCount={skills.length}
        announcementsCount={announcements.length}
      />

      {/* Upcoming Exams Section */}
      <UpcomingExams exams={exams} />

      {/* Study Materials & Recently Added Resources */}
      <StudyMaterialsSection
        resources={materials}
        searchQuery={searchQuery}
      />

      {/* Skill Development Tracks */}
      <SkillDevelopment
        skills={skills}
        searchQuery={searchQuery}
      />

      {/* Latest Academic Updates */}
      <LatestUpdates announcements={announcements} />

      {/* Subtle bottom padding for aesthetic spacing before footer */}
      <div className="h-16" />
    </div>
  );
}

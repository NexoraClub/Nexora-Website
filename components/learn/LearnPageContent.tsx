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
import { supabase } from "./supabaseClient";

export default function LearnPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LearningResource[]>(INITIAL_STUDY_MATERIALS);
  const [exams, setExams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [announcements, setAnnouncements] = useState<AcademicAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [skills] = useState<SkillResource[]>(INITIAL_SKILLS);
  const [isLoading, setIsLoading] = useState(false);

  // Attempt real-time Supabase integration gracefully if configured
  useEffect(() => {
    async function fetchFromSupabase() {
      if (!supabase) return;

      try {
        setIsLoading(true);
        // Attempt fetching learning resources if table exists in Supabase
        const { data: remoteMaterials, error: matError } = await supabase
          .from("learning_resources")
          .select("*")
          .order("uploaded_at", { ascending: false });

        if (!matError && remoteMaterials && remoteMaterials.length > 0) {
          setMaterials(remoteMaterials as unknown as LearningResource[]);
        }

        // Attempt fetching exams if table exists
        const { data: remoteExams, error: examError } = await supabase
          .from("exam_schedules")
          .select("*")
          .order("date", { ascending: true });

        if (!examError && remoteExams && remoteExams.length > 0) {
          setExams(remoteExams as unknown as ExamSchedule[]);
        }

        // Attempt fetching announcements if table exists
        const { data: remoteAnnouncements, error: annError } = await supabase
          .from("academic_announcements")
          .select("*")
          .order("published_at", { ascending: false });

        if (!annError && remoteAnnouncements && remoteAnnouncements.length > 0) {
          setAnnouncements(remoteAnnouncements as unknown as AcademicAnnouncement[]);
        }
      } catch (err) {
        // Fallback to verified local academic data without disrupting the user experience
        console.warn("Supabase tables not configured, using verified club data.", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromSupabase();
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

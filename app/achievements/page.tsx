import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AchievementGallery from "@/components/AchievementGallery";
import ContourBackdrop from "@/components/ContourBackdrop";
import "./achievements.css";

export const metadata: Metadata = {
  title: "Achievements & Awards | Nexora ISE Club",
  description: "Celebrating innovation, excellence, and milestones at Nexora ISE Club.",
};

export default function AchievementsPage() {
  return (
    <main className="relative min-h-screen w-full bg-[var(--theme-bg-main,#064928)] text-[var(--theme-bg-hero,#c2e0a5)]">
      <ContourBackdrop />

      <Navbar />

      <div className="relative z-10 pt-28 pb-16">
        <AchievementGallery />
      </div>

      <Footer />
    </main>
  );
}

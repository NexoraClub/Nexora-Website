import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AchievementGallery from "@/components/AchievementGallery";
import "./achievements.css";

export const metadata: Metadata = {
  title: "Achievements | Nexora ISE Club",
  description: "Celebrating innovation, excellence, and milestones at Nexora.",
};

export default function AchievementsPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white">
      <Navbar />
      <AchievementGallery />
      <Footer />
    </main>
  );
}

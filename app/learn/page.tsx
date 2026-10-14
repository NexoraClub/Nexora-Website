import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearnPageContent from "@/components/learn/LearnPageContent";
import ContourBackdrop from "@/components/ContourBackdrop";

export const metadata: Metadata = {
  title: "Learning Hub | Nexora ISE Club",
  description:
    "Your space for academic resources, exam updates, VTU question papers and skill development curated by Nexora ISE Club.",
};

export default function LearnPage() {
  return (
    <main className="relative min-h-screen w-full bg-[var(--theme-bg-main,#064928)] text-[var(--theme-bg-hero,#c2e0a5)]">
      <ContourBackdrop />

      <Navbar />

      <div className="relative z-10">
        <LearnPageContent />
      </div>

      <Footer />
    </main>
  );
}

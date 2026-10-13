import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LearnPageContent from "@/components/learn/LearnPageContent";

export const metadata: Metadata = {
  title: "Learn | Nexora ISE Club",
  description:
    "Your space for academic resources, exam updates, VTU question papers and skill development curated by Nexora ISE Club.",
};

export default function LearnPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white">
      

      
        <Navbar />
          <LearnPageContent />
        <Footer />
    </main>
  );
}

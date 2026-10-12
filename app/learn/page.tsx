import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GridScan } from "@/components/GridScan";
import GlowCursor from "@/components/GlowCursor";
import LearnPageContent from "@/components/learn/LearnPageContent";

export const metadata: Metadata = {
  title: "Learn | Nexora ISE Club",
  description:
    "Your space for academic resources, exam updates, VTU question papers and skill development curated by Nexora ISE Club.",
};

export default function LearnPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white">
      {/* Background GridScan layer matching the Nexora visual identity */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2F293A"
          gridScale={0.1}
          scanColor="#9ff1ff"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          lineJitter={0.1}
          scanGlow={0.5}
          scanSoftness={2}
          enableWebcam={false}
          showPreview={false}
        />
      </div>

      {/* Interactive cursor and neon ambience */}
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
        className="relative z-10 w-full min-h-screen"
      >
        <Navbar />
        <div className="pt-20 sm:pt-24">
          <LearnPageContent />
        </div>
        <Footer />
      </GlowCursor>
    </main>
  );
}

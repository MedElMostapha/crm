import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { displayFont } from "@/components/landing/fonts";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Orbit CRM — Sales pipeline, in perfect orbit",
  description:
    "Orbit brings customers, deals, tasks, and reports together in one clean workspace. Drag-and-drop pipeline, on-piloted reports, and CSV import included.",
};

export default async function LandingPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className={`${displayFont.variable} flex min-h-full flex-col bg-background text-foreground`}>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
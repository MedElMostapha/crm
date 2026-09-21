import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { ProductPreview } from "./product-preview";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24 lg:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-[fade-in-up_0.5s_ease-out]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
            Orbit CRM
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight [font-family:var(--font-display)] md:text-5xl lg:text-6xl">
            Your sales pipeline, in perfect orbit.
          </h1>
          <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted-foreground">
            Orbit brings customers, deals, tasks, and reports together in one
            clean workspace. No spreadsheets, no friction, no lost follow-ups.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/login">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl"
            >
              <a href="#features">
                <Play className="mr-2 h-4 w-4" />
                See what&apos;s inside
              </a>
            </Button>
          </div>
        </div>

        <div className="animate-[fade-in-up_0.5s_0.15s_ease-out_both]">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-violet-600 px-6 py-14 text-center sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="pointer-events-none absolute -inset-x-24 -top-24 h-48 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-foreground)/0.18),transparent_60%)]" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary-foreground [font-family:var(--font-display)] md:text-4xl">
              Put your pipeline in orbit today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/85">
              Create an account and start tracking customers, deals, tasks, and
              reports in one place. Free to get started.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white text-primary hover:bg-white/90"
              >
                <Link href="/login">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
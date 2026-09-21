import Link from "next/link";
import { Target } from "lucide-react";
import { APP_NAME } from "@/constants";

const PRODUCT = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-sm">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">{APP_NAME}</p>
            <p className="text-sm text-muted-foreground">
              Everything a sales team needs, in one orbit.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {PRODUCT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Get started
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Made for measurably better pipelines
          </p>
        </div>
      </div>
    </footer>
  );
}
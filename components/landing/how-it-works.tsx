const STEPS = [
  {
    index: "01",
    title: "Bring your people in",
    copy: "Add customers and companies, or import your existing spreadsheet in one go.",
  },
  {
    index: "02",
    title: "Run deals on a visual pipeline",
    copy: "Drag work through stages, attach tasks and notes, and never lose the thread again.",
  },
  {
    index: "03",
    title: "Let reports do the talking",
    copy: "Win rates, revenue by month, and top customers update themselves as you sell.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-border/60 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <h2 className="text-3xl font-semibold tracking-tight [font-family:var(--font-display)] md:text-4xl">
          Up and running in minutes
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          No onboarding sync, no migration consultant. Sign in with an account
          and the workspace is yours.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-12">
          {STEPS.map((step) => (
            <div key={step.index} className="border-t pt-6 md:pt-8">
              <p className="font-mono text-sm text-primary">{step.index}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
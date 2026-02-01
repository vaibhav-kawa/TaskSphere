import { ArrowLeft, CheckCircle2, Radar } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Project swimlanes",
    description: "Segment microservices and owners to keep delivery commitments visible.",
  },
  {
    title: "Adaptive sprints",
    description: "Auto-adjust priorities as AI detects blockers or shifting business targets.",
  },
  {
    title: "Service telemetry",
    description: "Link deployments, incidents, and chat context to each initiative.",
  },
];

const Workspace = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient" />
      <div className="container relative z-10 grid gap-16 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="max-w-2xl space-y-8">
          <Button asChild variant="ghost" size="sm" className="group w-fit gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2 text-muted-foreground">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to overview
            </Link>
          </Button>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Workspace Console
            </div>
            <h1 className="text-4xl font-heading font-semibold tracking-tight text-foreground sm:text-5xl">
              Compose your real-time command centre
            </h1>
            <p className="text-lg text-muted-foreground">
              We&apos;re ready to craft the console that orchestrates every squad, microservice, and integration. Tell me which visuals or flows you need and I&apos;ll shape this space to mirror your delivery rhythm.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-brand-soft">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Want kanban, gantt, or live burndown views here? Continue the prompt with the modules you need and I&apos;ll build it out.
          </p>
        </div>

        <div className="relative isolate">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-brand-strong">
            <div className="absolute right-12 top-10 h-32 w-32 rounded-full bg-orb-gradient blur-[60px] opacity-80" />
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <span>Live microservices</span>
              <span>15</span>
            </div>
            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s momentum</p>
                <h2 className="text-4xl font-heading font-semibold text-foreground">82% on track</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Urgent</p>
                  <p className="mt-2 text-2xl font-heading text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Needing attention</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                  <p className="mt-2 text-2xl font-heading text-foreground">9</p>
                  <p className="text-xs text-muted-foreground">Next 72 hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-background/60 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <Radar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Predictive insights</p>
                  <p className="text-xs text-muted-foreground">AI flags payment latency as the top risk driver today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workspace;

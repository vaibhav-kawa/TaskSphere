import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  ListChecks,
  MessageSquare,
  Server,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
};

type PriorityQuadrant = {
  title: string;
  focus: string;
  tone: string;
  tasks: {
    name: string;
    owner: string;
    eta: string;
  }[];
};

type AnalyticsMetric = {
  label: string;
  value: string;
  change: string;
};

type ChannelPulse = {
  channel: string;
  sla: string;
  volume: string;
};

type ChatMessage = {
  author: string;
  role: string;
  time: string;
  body: string;
};

const heroMetrics = [
  { value: "92%", label: "on-time delivery", detail: "AI-prioritised sprints" },
  { value: "35%", label: "faster approvals", detail: "chat-in-context" },
  { value: "14", label: "microservices connected", detail: "notifications, analytics" },
];

const heroTasks = [
  {
    id: "TS-108",
    title: "Automate billing anomaly triage",
    owner: "Aisha • Platform",
    due: "Due today",
    status: "In review",
    statusClasses: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    progress: 82,
  },
  {
    id: "MK-214",
    title: "Launch activation experiment",
    owner: "Camille • Growth",
    due: "Due in 1d",
    status: "In progress",
    statusClasses: "border border-amber-500/25 bg-amber-500/10 text-amber-500",
    progress: 64,
  },
  {
    id: "CS-047",
    title: "Refresh retention playbook",
    owner: "Dmitri • Success",
    due: "Due in 3d",
    status: "Scheduled",
    statusClasses: "border border-sky-500/25 bg-sky-500/15 text-sky-500",
    progress: 38,
  },
];

const features: FeatureCard[] = [
  {
    title: "Task assignment & live progress",
    description:
      "Delegate work by squad, attach dependencies, and watch timelines update in real time across every microservice.",
    icon: ListChecks,
    badge: "Tasks",
  },
  {
    title: "AI-based prioritisation",
    description:
      "Let TaskSphere evaluate urgency, impact, and effort scores so your teams execute on what matters most.",
    icon: Sparkles,
    badge: "AI",
  },
  {
    title: "Integrated team chat",
    description:
      "Collaborate without context switching—chat threads stay tethered to initiatives, services, and goals.",
    icon: MessageSquare,
    badge: "Chat",
  },
  {
    title: "Analytics dashboard",
    description:
      "Visualise throughput, workload, and goal progress with executive-ready dashboards and service health heatmaps.",
    icon: BarChart3,
    badge: "Analytics",
  },
  {
    title: "Notifications microservice",
    description:
      "Trigger branded email and SMS alerts with SLA guarantees and automated retries per channel.",
    icon: Bell,
    badge: "Alerts",
  },
  {
    title: "Microservice scalability",
    description:
      "Orchestrate squads across domains with federated access, runtime insights, and resilient workflows.",
    icon: Server,
    badge: "Scalability",
  },
];

const priorityQuadrants: PriorityQuadrant[] = [
  {
    title: "Urgent & Important",
    focus: "Escalate immediately",
    tone: "from-rose-500/45 via-primary/25 to-transparent",
    tasks: [
      { name: "Billing webhook resilience", owner: "Platform Team", eta: "ETA 2h" },
      { name: "Renewal playbook update", owner: "Success Team", eta: "ETA 4h" },
    ],
  },
  {
    title: "Important, not Urgent",
    focus: "Plan & schedule",
    tone: "from-primary/25 via-primary/10 to-transparent",
    tasks: [
      { name: "API observability rollout", owner: "DevOps Team", eta: "ETA 2d" },
      { name: "Partner onboarding journey", owner: "Growth Team", eta: "ETA 3d" },
    ],
  },
  {
    title: "Urgent, not Important",
    focus: "Delegate quickly",
    tone: "from-accent/35 via-accent/15 to-transparent",
    tasks: [
      { name: "Chatbot copy refresh", owner: "Marketing Team", eta: "ETA 6h" },
      { name: "Adjust SMS cadence", owner: "Lifecycle Team", eta: "ETA 8h" },
    ],
  },
  {
    title: "Monitor",
    focus: "Stay informed",
    tone: "from-muted/60 via-muted/20 to-transparent",
    tasks: [
      { name: "Security sandbox audit", owner: "Security Team", eta: "ETA 5d" },
      { name: "Data residency expansion", owner: "Infrastructure", eta: "ETA 1w" },
    ],
  },
];

const analyticsMetrics: AnalyticsMetric[] = [
  { label: "Cycle time", value: "1.9d", change: "-18%" },
  { label: "Throughput", value: "146 tasks", change: "+27%" },
  { label: "Goal completion", value: "84%", change: "+12%" },
];

const channelPulses: ChannelPulse[] = [
  { channel: "Email", sla: "4.9m SLA", volume: "1.2k / week" },
  { channel: "SMS", sla: "2.1m SLA", volume: "640 / week" },
  { channel: "Slack", sla: "Instant", volume: "980 / week" },
  { channel: "Webhooks", sla: "1.2m SLA", volume: "430 / week" },
];

const chatMessages: ChatMessage[] = [
  {
    author: "Olivia • PM",
    role: "Product",
    time: "just now",
    body: "AI suggests bumping ledger migration ahead of marketing launch—impact on revenue is higher.",
  },
  {
    author: "Noah • Backend",
    role: "Engineering",
    time: "2m ago",
    body: "Deploying fix on service-micro-ledger. Notifications paused until green status confirmed.",
  },
  {
    author: "TaskSphere AI",
    role: "Automation",
    time: "5m ago",
    body: "All high-priority stakeholders have been notified via email + SMS microservice.",
  },
];

const integrationPoints = [
  "Threaded chat embedded within tasks",
  "Escalations mirrored to Slack and email automatically",
  "AI recaps pushed to stakeholders when goals shift",
];

const Index = () => {
  return (
    <div className="flex flex-col gap-24 overflow-hidden pb-24 pt-12">
      <section className="relative overflow-hidden pb-24">
        <div className="absolute inset-0 -z-10 bg-hero-gradient" />
        <div className="container grid items-center gap-16 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Productivity OS
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">TaskSphere</span>
                <br />
                orchestrates every project, task, and goal across your microservices.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Assign work, forecast outcomes, and keep your teams aligned with AI-powered prioritisation, embedded chat, and notifications that route through the right microservice every time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="shadow-brand-soft">
                <Link to="/workspace" className="flex items-center gap-2">
                  Launch workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/60 bg-background/70 text-foreground backdrop-blur"
              >
                <a href="#features" className="flex items-center gap-2">
                  Explore capabilities
                  <Sparkles className="h-4 w-4 text-primary" />
                </a>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-border/70 bg-background/75 p-5 shadow-brand-soft"
                >
                  <p className="text-3xl font-heading font-semibold text-foreground">{metric.value}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel relative overflow-hidden rounded-[32px] border border-white/12 p-8 shadow-brand-strong">
              <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orb-gradient opacity-70 blur-[120px]" />
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                <span>Sprint Q1.08</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  +18% velocity
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {heroTasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-white/12 bg-background/75 p-5 shadow-brand-soft"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{task.id}</span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${task.statusClasses}`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-3 text-base font-medium text-foreground">{task.title}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{task.owner}</span>
                      <span>
                        <Clock3 className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" />
                        {task.due}
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/12 bg-background/70 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  <span>Real-time updates</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                      AI
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        Prioritised billing migration for executive visibility.
                      </p>
                      <p className="text-xs text-muted-foreground">Urgency ↑ • Impacted OKR: Revenue velocity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">#growth-chat synced with platform triage.</p>
                      <p className="text-xs text-muted-foreground">Camille: “Routing updates to customers via SMS + email.”</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/40 text-secondary-foreground">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Notifications paused for maintenance window.</p>
                      <p className="text-xs text-muted-foreground">Resumes in 45m after deployment health checks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-32 left-4 hidden w-60 rounded-3xl border border-border/70 bg-background/90 p-5 shadow-brand-soft md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Service health</p>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Payments API</span>
                    <span className="text-emerald-400">99.98%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <span className="block h-full w-[95%] rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Notifications</span>
                    <span className="text-sky-400">99.3%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <span className="block h-full w-[88%] rounded-full bg-sky-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Chat relay</span>
                    <span className="text-amber-400">96.5%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <span className="block h-full w-[72%] rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative">
        <div className="container space-y-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Capabilities
              </span>
              <h2 className="max-w-2xl Bunifu font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built for cross-functional teams shipping fast with microservices.
              </h2>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              TaskSphere unifies planning, execution, and communications so small businesses and startups can operate with enterprise-grade precision without the overhead.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-brand-strong"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-background/80 px-6 py-14 md:px-10">
        <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-80" />
        <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              AI Prioritisation
            </span>
            <h2 className="max-w-xl font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Let TaskSphere&apos;s AI score every task by urgency versus importance.
            </h2>
            <p className="text-sm text-muted-foreground">
              Our weighted engine factors dependencies, revenue impact, and team capacity to propose the most strategic backlog ordering. Human teams stay in control with transparent scoring and live recalculations.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Continuous recalculations as microservices report new telemetry.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Automatic escalation routing to chat and notifications microservices.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Executive summaries generated instantly for stakeholder updates.
              </li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {priorityQuadrants.map((quadrant) => (
              <div
                key={quadrant.title}
                className={`flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br ${quadrant.tone} p-5 text-sm text-foreground shadow-brand-soft`}
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {quadrant.focus}
                  </p>
                  <h3 className="font-heading text-lg font-semibold">{quadrant.title}</h3>
                </div>
                <div className="space-y-3 text-xs text-muted-foreground">
                  {quadrant.tasks.map((task) => (
                    <div key={task.name} className="rounded-2xl border border-white/20 bg-background/60 p-3">
                      <p className="text-sm font-medium text-foreground">{task.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span>{task.owner}</span>
                        <span>{task.eta}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-background/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  <span>AI Confidence</span>
                  <span>94%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="analytics" className="relative">
        <div className="container">
          <div className="glass-panel relative overflow-hidden rounded-[40px] border border-white/12 p-10 shadow-brand-strong">
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-orb-gradient opacity-60 blur-[140px]" />
            <div className="grid gap-12 lg:grid-cols-[1.25fr,0.75fr]">
              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      Analytics Dashboard
                    </p>
                    <h2 className="font-heading text-3xl font-semibold text-foreground">
                      Visibility across productivity, goals, and services.
                    </h2>
                  </div>
                  <Button asChild className="w-fit shadow-brand-soft">
                    <Link to="/workspace">Open analytics workspace</Link>
                  </Button>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-background/75 p-6">
                  <div className="pointer-events-none absolute inset-0 bg-grid-overlay opacity-40" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                        Velocity trend
                      </span>
                      <span>Last 8 weeks</span>
                    </div>
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 via-accent/20 to-transparent">
                      <div className="absolute inset-0 bg-grid-overlay opacity-30" />
                      <div className="absolute bottom-0 left-0 h-full w-full">
                        <div className="absolute bottom-0 left-0 h-full w-full translate-y-6 rounded-[40px] bg-gradient-to-t from-primary/60 via-primary/20 to-transparent blur-[2px]" />
                        <div className="absolute bottom-0 left-0 h-full w-full translate-y-6 rounded-[40px] bg-gradient-to-t from-accent/50 via-accent/10 to-transparent blur-[1px]" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {analyticsMetrics.map((metric) => (
                        <div key={metric.label} className="rounded-2xl border border-white/12 bg-background/70 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="mt-2 text-2xl font-heading font-semibold text-foreground">{metric.value}</p>
                          <p className="mt-1 text-xs font-medium text-emerald-400">{metric.change} vs last sprint</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/12 bg-background/70 p-6 shadow-brand-soft">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Goal tracking</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    OKRs stay linked to initiatives, tasks, and microservice deployments so you can prove impact in seconds.
                  </p>
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-background/80 px-4 py-3">
                      <span>Revenue expansion</span>
                      <span className="font-semibold text-primary">78%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-background/80 px-4 py-3">
                      <span>Platform reliability</span>
                      <span className="font-semibold text-primary">93%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-background/80 px-4 py-3">
                      <span>Activation velocity</span>
                      <span className="font-semibold text-primary">88%</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/12 bg-background/70 p-6 shadow-brand-soft">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Service telemetry</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Microservice dashboards combine latency, error rates, and deployment history so teams can respond instantly.
                  </p>
                  <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
                    <li className="flex items-center justify-between">
                      <span>Ledger API</span>
                      <span className="font-semibold text-emerald-400">+14% uptime</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Notification worker</span>
                      <span className="font-semibold text-amber-400">-6% queue size</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Chat relay</span>
                      <span className="font-semibold text-sky-400">Stable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section id="integrations" className="relative">
        <div className="container grid gap-12 lg:grid-cols-[1fr,1.1fr]">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Collaboration & Notifications
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Embedded chat meets notification microservices for instant alignment.
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep everyone—from founders to frontline—aware of what&apos;s changing. Conversations stay attached to the work, while alerts travel through email, SMS, Slack, or any webhook you configure.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {integrationPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild className="shadow-brand-soft">
              <Link to="/workspace" className="flex items-center gap-2">
                Preview unified inbox
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/70 bg-background/85 p-6 shadow-brand-soft">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Squad sync – Payments</p>
                    <p className="text-xs text-muted-foreground">Live thread • aligned with TS-108</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                  Live
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.body} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{message.author}</span>
                      <span>{message.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{message.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {channelPulses.map((channel) => (
                <div
                  key={channel.channel}
                  className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-brand-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Bell className="h-4 w-4 text-primary" />
                      {channel.channel}
                    </div>
                    <span className="text-xs text-muted-foreground">{channel.sla}</span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{channel.volume}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* <section className="container">
        <div className="relative overflow-hidden rounded-[36px] bg-mesh-gradient p-10 text-primary-foreground shadow-brand-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-accent/60 opacity-80" />
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-primary/50 blur-[120px]" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/40 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
                Ready to scale
              </span>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Bring clarity to your microservice operations.
              </h2>
              <p className="max-w-xl text-sm opacity-90">
                From kickoff to customer notifications, TaskSphere keeps every task, goal, and conversation aligned. Let&apos;s tailor the workspace for your next milestone.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary shadow-brand-soft hover:bg-background/90"
              >
                <Link to="/workspace">Start configuring</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="mailto:hello@tasksphere.app" className="flex items-center gap-2">
                  Talk with our team
                  <Users className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Index;

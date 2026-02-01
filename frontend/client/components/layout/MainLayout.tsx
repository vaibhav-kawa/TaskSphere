import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
  type?: "route" | "hash";
};

const navItems: NavItem[] = [
  { label: "Overview", to: "/", type: "route" },
  { label: "Workspace", to: "/workspace", type: "route" },
  { label: "Pricing", to: "/pricing", type: "route" },
];

const MainLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const isActive = (to: string, type: NavItem["type"]) => {
    if (type === "hash") {
      const targetHash = `#${to.split("#")[1] ?? ""}`;
      return location.pathname === "/" && location.hash === targetHash;
    }

    return location.pathname === to;
  };

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid-overlay opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-[-320px] -z-10 h-[520px] bg-mesh-gradient blur-[160px] opacity-70" />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-6">
          <Link to="/" className="group flex items-center gap-3" onClick={handleLinkClick}>
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-orb-gradient text-background shadow-brand-soft transition-transform duration-200 group-hover:scale-105">
              <span className="text-base font-semibold">TS</span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                TaskSphere
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleLinkClick}
                className={cn(
                  "group relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary/80 after:transition-transform after:duration-200 after:content-['']",
                  isActive(item.to, item.type) ? "text-foreground after:scale-x-100" : "text-muted-foreground hover:text-foreground hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <a href="mailto:hello@tasksphere.app">Talk to us</a>
            </Button>
            <Button asChild size="sm" className="shadow-brand-soft">
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto rounded-xl border border-border/70 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen ? (
          <div className="md:hidden">
            <div className="space-y-4 border-t border-border/60 bg-background/90 px-6 py-5 backdrop-blur-md">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={handleLinkClick}
                    className={cn(
                      "text-base font-medium",
                      isActive(item.to, item.type) ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsDark(!isDark)}
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  {isDark ? <><Sun className="mr-2 h-5 w-5" /> Light Mode</> : <><Moon className="mr-2 h-5 w-5" /> Dark Mode</>}
                </Button>
                <Button asChild variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
                  <a href="mailto:hello@tasksphere.app">Talk to us</a>
                </Button>
                <Button asChild className="shadow-brand-soft">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative z-10 mt-24 border-t border-border/70 bg-sidebar-background/40">
        <div className="container grid gap-10 py-12 md:grid-cols-[1.1fr,1fr,1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orb-gradient text-background shadow-brand-soft">
                <span className="text-base font-semibold">TS</span>
              </span>
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">TaskSphere</p>
                <p className="text-sm text-muted-foreground">Productivity platform for microservice-powered teams.</p>
              </div>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Coordinate projects, chat in context, and turn AI insights into on-time delivery. TaskSphere keeps every specialist synchronized across your microservice architecture.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/80 px-3 py-1">Real-time sync</span>
              <span className="rounded-full border border-border/80 px-3 py-1">AI prioritisation</span>
              <span className="rounded-full border border-border/80 px-3 py-1">Analytics-ready</span>
            </div>
          </div>
          <div className="grid gap-3 text-sm">
            <p className="font-heading text-base text-foreground">Product</p>
            <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
              Overview
            </Link>
            <Link to="/workspace" className="text-muted-foreground transition-colors hover:text-foreground">
              Workspace
            </Link>
            {/* <Link to="/#analytics" className="text-muted-foreground transition-colors hover:text-foreground">
              Analytics
            </Link>
            <Link to="/#integrations" className="text-muted-foreground transition-colors hover:text-foreground">
              Integrations
            </Link> */}
          </div>
          <div className="grid gap-3 text-sm">
            <p className="font-heading text-base text-foreground">Connect</p>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="mailto:hello@tasksphere.app">
              hello@tasksphere.app
            </a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="https://cal.com/tasksphere/demo" rel="noreferrer" target="_blank">
              Book a strategy session
            </a>
            <a className="text-muted-foreground transition-colors hover:text-foreground" href="https://status.tasksphere.app" rel="noreferrer" target="_blank">
              Status page
            </a>
          </div>
        </div>
        <div className="border-t border-border/70">
          <div className="container flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} TaskSphere Labs. All rights reserved.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/workspace" className="transition-colors hover:text-foreground">
                Service Level Agreement
              </Link>
              <a href="https://docs.tasksphere.app" className="transition-colors hover:text-foreground" rel="noreferrer" target="_blank">
                API Documentation
              </a>
              <a href="https://legal.tasksphere.app/privacy" className="transition-colors hover:text-foreground" rel="noreferrer" target="_blank">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

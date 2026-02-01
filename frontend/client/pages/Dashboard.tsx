import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  ListChecks,
  Users,
  BarChart3,
  Bell,
  Settings,
  Search,
  Moon,
  Sun,
  Plus,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Sparkles,
  X,
  Menu,
  UserCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/taskApi";

// Sidebar navigation items
const sidebarItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: ListChecks, label: "Tasks", path: "/dashboard/tasks" },
  { icon: Users, label: "Teams", path: "/dashboard/teams" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: UserCircle, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

// Sample data for charts
const weeklyProductivityData = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 92 },
  { name: "Wed", value: 78 },
  { name: "Thu", value: 95 },
  { name: "Fri", value: 88 },
  { name: "Sat", value: 70 },
  { name: "Sun", value: 65 },
];

const teamPerformanceData = [
  { name: "Alice", tasks: 24 },
  { name: "Bob", tasks: 18 },
  { name: "Charlie", tasks: 32 },
  { name: "Diana", tasks: 28 },
  { name: "Eve", tasks: 20 },
];

const taskCategoryData = [
  { name: "Development", value: 35, color: "hsl(var(--primary))" },
  { name: "Design", value: 25, color: "hsl(var(--accent))" },
  { name: "Testing", value: 20, color: "hsl(var(--secondary))" },
  { name: "Documentation", value: 15, color: "hsl(var(--muted))" },
  { name: "Other", value: 5, color: "hsl(var(--border))" },
];



// Notifications data
const notifications = [
  { id: 1, message: "New task assigned to you", time: "5m ago", read: false },
  { id: 2, message: "Team meeting in 30 minutes", time: "1h ago", read: false },
  { id: 3, message: "Project deadline approaching", time: "2h ago", read: true },
  { id: 4, message: "Code review requested", time: "3h ago", read: true },
  { id: 5, message: "Weekly report available", time: "1d ago", read: true },
];

// Count-up animation hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

const MetricCard = ({ title, value, icon, gradient, delay = 0 }: MetricCardProps) => {
  const count = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft transition-all duration-300",
        gradient
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-heading font-semibold text-foreground">{count}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentUser, setCurrentUser] = useState({ name: 'John Doe', role: 'Admin' });
  const [dashboardData, setDashboardData] = useState({
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    productivityScore: 0
  });
  const [weeklyData, setWeeklyData] = useState(weeklyProductivityData);
  const [teamData, setTeamData] = useState(teamPerformanceData);
  const [categoryData, setCategoryData] = useState(taskCategoryData);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { user, logout } = useAuth();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8086/users/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser({ name: user.name || 'John Doe', role: user.role || 'Admin' });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasks, analytics, users] = await Promise.all([
        taskApi.getAllTasks(),
        taskApi.getAnalytics().catch(() => ({})),
        fetch('http://localhost:8086/getusers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : [])
      ]);

      if (Array.isArray(tasks)) {
        // Get current user ID for filtering
        const currentUserId = currentUser?.id || localStorage.getItem('userId');
        
        // Filter tasks to only show user-specific tasks
        const userTasks = tasks.filter(t => t.assignedTo?.toString() === currentUserId?.toString());
        
        const completed = userTasks.filter(t => t.status?.toLowerCase() === 'completed' || t.status === 'COMPLETED').length;
        const pending = userTasks.filter(t => t.status?.toLowerCase() === 'pending' || t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
        const highPriority = userTasks.filter(t => t.priority?.toLowerCase() === 'high' || t.priority?.toLowerCase() === 'critical' || t.priority === 'HIGH').length;
        
        setDashboardData({
          completedTasks: completed,
          pendingTasks: pending,
          highPriorityTasks: highPriority,
          productivityScore: Math.round((completed / Math.max(userTasks.length, 1)) * 100) || 0
        });

        // Generate team performance data from real users and tasks
        if (Array.isArray(users)) {
          const teamPerf = users.slice(0, 5).map(user => ({
            name: user.name,
            tasks: tasks.filter(t => t.assignedTo?.toString() === user.id?.toString()).length
          }));
          setTeamData(teamPerf);
        }

        // Generate category data from user's task statuses
        const statuses = userTasks.reduce((acc, task) => {
          const status = task.status || 'TODO';
          const displayStatus = status === 'COMPLETED' ? 'Completed' : 
                               status === 'IN_PROGRESS' ? 'In Progress' : 
                               status === 'TODO' ? 'Todo' : 
                               status === 'REVIEW' ? 'Review' : status;
          acc[displayStatus] = (acc[displayStatus] || 0) + 1;
          return acc;
        }, {});

        const categoryColors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))', 'hsl(var(--border))'];
        const categoryDataFromTasks = Object.entries(statuses).map(([name, value], index) => ({
          name,
          value: value as number,
          color: categoryColors[index % categoryColors.length]
        }));
        setCategoryData(categoryDataFromTasks);

        // Generate recent activities from user's latest 5 tasks
        const recentTasks = userTasks
          .sort((a, b) => new Date(b.updatedAt || b.createdAt || Date.now()).getTime() - new Date(a.updatedAt || a.createdAt || Date.now()).getTime())
          .slice(0, 5)
          .map((task, index) => {
            const timeAgo = getTimeAgo(new Date(task.updatedAt || task.createdAt || Date.now()));
            return {
              id: task.id,
              type: "task",
              message: `Task '${task.title}' ${task.status === 'COMPLETED' ? 'completed' : 'updated'}`,
              time: timeAgo,
              user: 'You'
            };
          });
        setRecentActivities(recentTasks);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-orb-gradient opacity-20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-mesh-gradient opacity-15 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-grid-overlay opacity-20" />
      </div>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/60 bg-sidebar-background/95 backdrop-blur-md transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-orb-gradient text-background shadow-brand-soft">
              <span className="text-base font-semibold">TS</span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                TaskSphere
              </span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks, teams, or projects..."
                className="h-10 w-full rounded-lg border-border/60 bg-background/50 pl-10 pr-4"
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Notifications */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-lg">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-lg border-border/60 bg-background/95 backdrop-blur-md shadow-brand-soft">
                  <div className="flex items-center justify-between p-4">
                    <h3 className="font-heading text-lg font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-lg p-3",
                          !notification.read && "bg-primary/5"
                        )}
                        asChild
                      >
                        <Link to="/dashboard/notifications">
                          <p className="text-sm font-medium text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg border-border/60 bg-background/95 backdrop-blur-md shadow-brand-soft">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="flex w-full items-center cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="container mx-auto">
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back! Here's what's happening with your projects today.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
              {/* Left Column - Main Content */}
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Completed Tasks"
                    value={dashboardData.completedTasks}
                    icon={<CheckCircle2 className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-primary/10 to-primary/5"
                    delay={0.1}
                  />
                  <MetricCard
                    title="Pending Tasks"
                    value={dashboardData.pendingTasks}
                    icon={<Clock className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-accent/10 to-accent/5"
                    delay={0.2}
                  />
                  <MetricCard
                    title="High Priority"
                    value={dashboardData.highPriorityTasks}
                    icon={<AlertCircle className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-destructive/10 to-destructive/5"
                    delay={0.3}
                  />
                  <MetricCard
                    title="Productivity Score"
                    value={dashboardData.productivityScore}
                    icon={<TrendingUp className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-secondary/10 to-secondary/5"
                    delay={0.4}
                  />
                </div>



                {/* AI Insights Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          Team Performance Insight
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Your team is performing {dashboardData.productivityScore}% productivity this week. Focus on high-priority tasks for better results.
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <TrendingUp className="h-3 w-3" />
                            {dashboardData.productivityScore > 70 ? 'Trending Up' : 'Needs Attention'}
                          </span>
                          <Button size="sm" variant="outline" className="border-border/60" asChild>
                            <Link to="/dashboard/analytics">
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-3"
                >
                  <Button asChild className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong">
                    <Link to="/dashboard/tasks">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border/60 bg-background/50">
                    <Link to="/dashboard/teams">
                      <Users className="mr-2 h-4 w-4" />
                      Add Team Member
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border/60 bg-background/50">
                    <Link to="/dashboard/tasks">
                      <ListChecks className="mr-2 h-4 w-4" />
                      View All Tasks
                    </Link>
                  </Button>
                </motion.div>

                {/* Charts Section */}
                <div className="space-y-6">
                  {/* Weekly Productivity Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                  >
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Weekly Productivity Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Team Performance & Task Categories */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                    >
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                        Team Member Performance
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teamData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                    >
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                        Task Categories Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right Column - Activity Feed */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="hidden lg:block"
              >
                <div className="sticky top-24 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-foreground">Recent Activity</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setActivityOpen(!activityOpen)}
                    >
                      {activityOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {activityOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            className="rounded-2xl border border-border/60 bg-background/50 p-4"
                          >
                            <p className="text-sm font-medium text-foreground">{activity.message}</p>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{activity.user}</span>
                              <span>{activity.time}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


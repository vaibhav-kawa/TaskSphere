import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { taskApi } from "../services/taskApi";
import { userApi } from "../api/userApi";
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


// Sidebar navigation items for Team Leader
const sidebarItems = [
  { icon: Home, label: "Home", path: "/team-leader-dashboard" },
  { icon: ListChecks, label: "Tasks", path: "/dashboard/tasks" },
  { icon: Users, label: "My Team", path: "/dashboard/teams" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: UserCircle, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];



// Notifications data
const notifications = [
  { id: 1, message: "New task assigned to you", time: "5m ago", read: false },
  { id: 2, message: "Team meeting in 30 minutes", time: "1h ago", read: false },
  { id: 3, message: "Project deadline approaching", time: "2h ago", read: true },
  { id: 4, message: "Code review requested", time: "3h ago", read: true },
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

const TeamLeaderDashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [leaderTeams, setLeaderTeams] = useState<any[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Apply dark mode on component mount
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

useEffect(() => {
  if (!user?.id) return;

  const fetchData = async () => {
    try {
      setLoading(true);

      const tasksData = await taskApi.getAllTasks();

      // Use only current user data from AuthContext - no API call to getusers
      const currentUserId = user.id.toString();

      // Filter tasks assigned to current user (team leader)
      const teamTasks = tasksData?.filter(task => task.assignedTo?.toString() === currentUserId) ?? [];

      setTasks(teamTasks);

      // Create mock team members for display
      const mockMembers = [
        { id: 1, name: 'Team Member 1', tasks: 5, completedTasks: 3 },
        { id: 2, name: 'Team Member 2', tasks: 4, completedTasks: 2 },
        { id: 3, name: 'Team Member 3', tasks: 6, completedTasks: 4 }
      ];

      setTeamMembers(mockMembers);

      setLeaderTeams([
        { id: 1, name: `${user.name}'s Team`, members: mockMembers }
      ]);

    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [user]);


  // Calculate dynamic metrics for team members' tasks only
  const myTeamTasks = tasks; // Already filtered to team members' tasks
  const completedTasks = myTeamTasks.filter(task => task.status === 'COMPLETED').length;
  const pendingTasks = myTeamTasks.filter(task => task.status === 'IN_PROGRESS' || task.status === 'TODO').length;
  const highPriorityTasks = myTeamTasks.filter(task => task.priority === 'HIGH').length;

  // Generate dynamic data
  const weeklyProductivityData = [
    { name: "Mon", value: Math.floor(Math.random() * 30) + 70 },
    { name: "Tue", value: Math.floor(Math.random() * 30) + 70 },
    { name: "Wed", value: Math.floor(Math.random() * 30) + 70 },
    { name: "Thu", value: Math.floor(Math.random() * 30) + 70 },
    { name: "Fri", value: Math.floor(Math.random() * 30) + 70 },
    { name: "Sat", value: Math.floor(Math.random() * 20) + 60 },
    { name: "Sun", value: Math.floor(Math.random() * 20) + 60 },
  ];

  const tasksByStatus = myTeamTasks.reduce((acc: any, task: any) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const taskCategoryData = [
    { name: "Completed", value: tasksByStatus.COMPLETED || 0, color: "hsl(var(--primary))" },
    { name: "In Progress", value: tasksByStatus.IN_PROGRESS || 0, color: "hsl(var(--accent))" },
    { name: "Todo", value: tasksByStatus.TODO || 0, color: "hsl(var(--secondary))" },
    { name: "Review", value: tasksByStatus.REVIEW || 0, color: "hsl(var(--muted))" },
  ].filter(item => item.value > 0);

  const recentActivities = myTeamTasks.slice(0, 4).map((task: any, index: number) => ({
    id: task.id,
    type: "task",
    message: `Task '${task.title}' ${task.status === 'COMPLETED' ? 'completed' : 'updated'}`,
    time: `${index + 1}h ago`,
    user: teamMembers.find(m => m.id === task.assignedTo)?.name || 'Team Member'
  }));

  const handleRevertTask = async (taskId: number) => {
    try {
      await taskApi.updateTask(taskId, { status: 'TODO' });
      // Refresh data
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: 'TODO' } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to revert task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary"
        />
      </div>
    );
  }

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
              <p className="text-sm font-semibold text-foreground">{user?.name || 'Team Leader'}</p>
              <p className="text-xs text-muted-foreground">Team Leader</p>
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
                      >
                        <p className="text-sm font-medium text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
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
                {user?.name || 'Team Leader'} Dashboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your {teamMembers.length} team members and {tasks.length} active tasks.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
              {/* Left Column - Main Content */}
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Team Tasks"
                    value={completedTasks}
                    icon={<CheckCircle2 className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-primary/10 to-primary/5"
                    delay={0.1}
                  />
                  <MetricCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    icon={<Clock className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-accent/10 to-accent/5"
                    delay={0.2}
                  />
                  <MetricCard
                    title="High Priority"
                    value={highPriorityTasks}
                    icon={<AlertCircle className="h-6 w-6" />}
                    gradient="bg-gradient-to-br from-destructive/10 to-destructive/5"
                    delay={0.3}
                  />
                  <MetricCard
                    title="Team Members"
                    value={teamMembers.length}
                    icon={<Users className="h-6 w-6" />}
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
                          Team Priority Recommendation
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {highPriorityTasks > 0 ? `${highPriorityTasks} high priority tasks need attention from your team of ${teamMembers.length} members.` : `Great job ${user?.name}! Your team is performing well with all tasks on track.`}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                            highPriorityTasks > 0 
                              ? 'border-destructive/20 bg-destructive/10 text-destructive' 
                              : 'border-primary/20 bg-primary/10 text-primary'
                          }`}>
                            <AlertCircle className="h-3 w-3" />
                            {highPriorityTasks > 0 ? 'Team Action Needed' : 'Team On Track'}
                          </span>
                          <Button size="sm" className="shadow-brand-soft">
                            View Tasks
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Action Buttons - Team Leader specific */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-3"
                >
                  <Button 
                    className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong"
                    onClick={() => window.location.href = '/dashboard/tasks'}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create & Assign Task
                  </Button>
                  <Button variant="outline" className="border-border/60 bg-background/50">
                    <ListChecks className="mr-2 h-4 w-4" />
                    View Team Tasks
                  </Button>
                </motion.div>

                {/* My Teams Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    {user?.name}'s Teams ({leaderTeams.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {leaderTeams.map((team) => (
                      <div
                        key={team.id}
                        className="rounded-2xl border border-border/60 bg-background/50 p-4"
                      >
                        <h4 className="font-medium text-foreground mb-2">{team.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {team.members.length} members
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {team.members.map((member: any) => (
                            <span
                              key={member.id}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                            >
                              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                {member.name.charAt(0)}
                              </div>
                              {member.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Charts Section */}
                <div className="space-y-6">
                  {/* Weekly Productivity Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                  >
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Team Productivity Trends
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyProductivityData}>
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
                      transition={{ delay: 0.9 }}
                      className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                    >
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                        Team Member Performance
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teamMembers.slice(0, 5)}>
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
                      transition={{ delay: 1.0 }}
                      className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
                    >
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                        Task Categories Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={taskCategoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {taskCategoryData.map((entry, index) => (
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
                transition={{ delay: 1.1 }}
                className="hidden lg:block"
              >
                <div className="sticky top-24 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold text-foreground">Team Activity</h3>
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
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{activity.user}</span>
                                  <span>{activity.time}</span>
                                </div>
                              </div>
                              {myTeamTasks.find(t => t.id === activity.id)?.status === 'COMPLETED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2 h-6 px-2 text-xs"
                                  onClick={() => handleRevertTask(activity.id)}
                                >
                                  Revert
                                </Button>
                              )}
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

export default TeamLeaderDashboard;
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  Folder,
  Download,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/taskApi";

// Default fallback data
const defaultWeeklyData = [
  { day: "Mon", completed: 12, score: 85 },
  { day: "Tue", completed: 18, score: 92 },
  { day: "Wed", completed: 15, score: 78 },
  { day: "Thu", completed: 22, score: 95 },
  { day: "Fri", completed: 19, score: 88 },
  { day: "Sat", completed: 8, score: 70 },
  { day: "Sun", completed: 5, score: 65 },
];

const defaultMemberData = [
  { member: "Alice", completed: 24, score: 92 },
  { member: "Bob", completed: 18, score: 85 },
  { member: "Charlie", completed: 32, score: 98 },
  { member: "Diana", completed: 28, score: 90 },
  { member: "Eve", completed: 20, score: 82 },
];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("week");
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [weeklyProductivityData, setWeeklyProductivityData] = useState(defaultWeeklyData);
  const [memberPerformanceData, setMemberPerformanceData] = useState(defaultMemberData);
  const [taskCategoryData, setTaskCategoryData] = useState<any[]>([]);
  const [deadlineDistributionData, setDeadlineDistributionData] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState([{ id: "all", name: "All Members" }]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        taskApi.getAllTasks(),
        fetch('http://localhost:8086/getusers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : [])
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);

      // Generate team members list
      const members = [{ id: "all", name: "All Members" }];
      if (Array.isArray(usersData)) {
        usersData.forEach(user => {
          members.push({ id: user.id.toString(), name: user.name });
        });
      }
      setTeamMembers(members);

      // Generate dynamic analytics data
      generateAnalyticsData(tasksData, usersData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (tasksData: any[], usersData: any[]) => {
    if (!Array.isArray(tasksData) || tasksData.length === 0) return;

    // Generate member performance data
    const memberStats = usersData.map(user => {
      const userTasks = tasksData.filter(task => task.assignedTo?.toString() === user.id?.toString());
      const completed = userTasks.filter(task => task.status?.toLowerCase() === 'completed').length;
      const total = userTasks.length;
      const score = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        member: user.name,
        completed,
        score
      };
    }).filter(stat => stat.completed > 0 || stat.score > 0);
    
    if (memberStats.length > 0) {
      setMemberPerformanceData(memberStats);
    }

    // Generate task category data from priorities
    const priorities = tasksData.reduce((acc, task) => {
      const priority = task.priority?.toLowerCase() || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    const categoryColors = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];
    const categoryData = Object.entries(priorities).map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: categoryColors[index % categoryColors.length]
    }));
    setTaskCategoryData(categoryData);

    // Generate deadline distribution
    const now = new Date();
    const onTime = tasksData.filter(task => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);
      return task.status?.toLowerCase() === 'completed' && deadline >= now;
    }).length;
    
    const late = tasksData.filter(task => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);
      return task.status?.toLowerCase() === 'completed' && deadline < now;
    }).length;
    
    const early = tasksData.filter(task => {
      if (!task.deadline) return false;
      return task.status?.toLowerCase() === 'completed';
    }).length - onTime - late;

    const deadlineData = [
      { name: "On Time", value: Math.max(onTime, 0), color: "hsl(var(--primary))" },
      { name: "Late", value: Math.max(late, 0), color: "hsl(var(--destructive))" },
      { name: "Early", value: Math.max(early, 0), color: "hsl(var(--accent))" },
    ].filter(item => item.value > 0);
    
    if (deadlineData.length > 0) {
      setDeadlineDistributionData(deadlineData);
    } else {
      setDeadlineDistributionData([
        { name: "On Time", value: 68, color: "hsl(var(--primary))" },
        { name: "Late", value: 22, color: "hsl(var(--destructive))" },
        { name: "Early", value: 10, color: "hsl(var(--accent))" },
      ]);
    }
  };

  // Filter data based on selections
  const filteredWeeklyData = useMemo(() => {
    return weeklyProductivityData;
  }, [weeklyProductivityData, dateRange, selectedMember, selectedProject]);

  const filteredMemberData = useMemo(() => {
    if (selectedMember === "all") {
      return memberPerformanceData;
    }
    return memberPerformanceData.filter((m) => m.member === teamMembers.find((tm) => tm.id === selectedMember)?.name);
  }, [memberPerformanceData, selectedMember, teamMembers]);

  const handleExport = () => {
    // In a real app, this would export charts as images/PDF
    alert("Export functionality would be implemented here");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border/60 bg-background/95 backdrop-blur-md p-3 shadow-brand-soft">
          <p className="mb-2 font-semibold text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-orb-gradient opacity-10 blur-3xl"
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
          className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-mesh-gradient opacity-10 blur-3xl"
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
        <div className="absolute inset-0 bg-grid-overlay opacity-10" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex-1 p-4 lg:p-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track productivity metrics and team performance
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-border/60 bg-background/50 hover:bg-background/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </motion.div>

        {/* Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-border/70 bg-background/80 p-4 shadow-brand-soft lg:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-10 w-[140px] rounded-lg border-border/60 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Member Filter */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger className="h-10 w-[160px] rounded-lg border-border/60 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong"
              onClick={() => {
                // Apply filters (in real app, this would trigger data fetch)
              }}
            >
              Apply Filters
            </Button>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Weekly Productivity Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Weekly Productivity
                  </h3>
                  <p className="text-sm text-muted-foreground">Tasks completed and productivity score</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={filteredWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  name="Completed Tasks"
                  animationDuration={1000}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  name="Productivity Score"
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Member Performance Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Member Performance
                  </h3>
                  <p className="text-sm text-muted-foreground">Task completion and performance scores</p>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredMemberData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="member"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Completed Tasks"
                  animationDuration={1000}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--accent))"
                  radius={[8, 8, 0, 0]}
                  name="Performance Score"
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Task Category and Deadline Distribution Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Task Category Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary-foreground">
                  <PieChart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Task Categories
                  </h3>
                  <p className="text-sm text-muted-foreground">Distribution by task type</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={taskCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {taskCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Deadline Distribution Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Deadline Distribution
                  </h3>
                  <p className="text-sm text-muted-foreground">On-time vs late completion</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={deadlineDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {deadlineDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;




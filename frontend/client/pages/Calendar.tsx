import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  Bell,
  Repeat,
  CheckCircle2,
  AlertCircle,
  X,
  MoreVertical,
  Edit,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/taskApi";

type CalendarView = "month" | "week" | "day";
type TaskPriority = "low" | "medium" | "high" | "critical";
type TaskStatus = "pending" | "in-progress" | "completed";
type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";

interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: { id: string; name: string };
  project?: string;
  reminder?: Date;
  recurring?: RecurrenceType;
  color?: string;
}

interface TeamMember {
  id: string;
  name: string;
  color: string;
  availability: { start: Date; end: Date }[];
}

// Sample tasks
const initialTasks: CalendarTask[] = [
  {
    id: "1",
    title: "Team Standup",
    startTime: new Date(2024, 0, 15, 9, 0),
    endTime: new Date(2024, 0, 15, 9, 30),
    priority: "medium",
    status: "pending",
    assignedTo: { id: "1", name: "Alice" },
    recurring: "daily",
  },
  {
    id: "2",
    title: "API Integration Review",
    startTime: new Date(2024, 0, 15, 14, 0),
    endTime: new Date(2024, 0, 15, 16, 0),
    priority: "high",
    status: "in-progress",
    assignedTo: { id: "1", name: "Alice" },
    reminder: new Date(2024, 0, 15, 13, 30),
  },
  {
    id: "3",
    title: "Sprint Planning",
    startTime: new Date(2024, 0, 16, 10, 0),
    endTime: new Date(2024, 0, 16, 12, 0),
    priority: "high",
    status: "pending",
    assignedTo: { id: "2", name: "Bob" },
  },
];

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alice",
    color: "hsl(var(--primary))",
    availability: [
      { start: new Date(2024, 0, 15, 9, 0), end: new Date(2024, 0, 15, 17, 0) },
    ],
  },
  {
    id: "2",
    name: "Bob",
    color: "hsl(var(--accent))",
    availability: [
      { start: new Date(2024, 0, 15, 8, 0), end: new Date(2024, 0, 15, 16, 0) },
    ],
  },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Convert backend tasks to calendar tasks
  const convertToCalendarTasks = (backendTasks: any[]): CalendarTask[] => {
    return backendTasks.map((task) => {
      const deadlineDate = new Date(task.deadline);
      const startTime = new Date(deadlineDate);
      startTime.setHours(9, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(10, 0, 0, 0);
      
      return {
        id: task.id?.toString() || Math.random().toString(),
        title: task.title || 'Untitled Task',
        description: task.description || '',
        startTime,
        endTime,
        priority: (task.priority?.toLowerCase() || 'medium') as TaskPriority,
        status: (task.status?.toLowerCase() || 'pending') as TaskStatus,
        assignedTo: {
          id: task.assignedTo?.toString() || '1',
          name: teamMembers.find(m => m.id === task.assignedTo?.toString())?.name || 'Unknown'
        },
      };
    });
  };
  
  // Fetch tasks and team members from backend
  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const data = await taskApi.getAllTasks();
      if (Array.isArray(data)) {
        const calendarTasks = convertToCalendarTasks(data);
        setTasks(calendarTasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks(initialTasks);
    }
  };
  
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:8086/getusers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const users = await response.json();
        const members = users.map((user: any, index: number) => ({
          id: user.id.toString(),
          name: user.name,
          color: `hsl(${(index * 137.5) % 360}, 50%, 50%)`,
          availability: []
        }));
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setTeamMembers([
        { id: "1", name: "Alice", color: "hsl(var(--primary))", availability: [] },
        { id: "2", name: "Bob", color: "hsl(var(--accent))", availability: [] },
      ]);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showTeamOverlay, setShowTeamOverlay] = useState(true);
  const [showPredictiveSlots, setShowPredictiveSlots] = useState(true);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endTime: "",
    priority: "medium" as TaskPriority,
    assignedTo: "",
    recurring: "none" as RecurrenceType,
    reminder: "",
  });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    return tasks.filter((task) => {
      const taskDate = new Date(task.startTime);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMember = selectedMember === "all" || task.assignedTo.id === selectedMember;
      const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
      return matchesSearch && matchesMember && matchesPriority;
    });
  }, [tasks, searchQuery, selectedMember, selectedPriority]);

  // Navigate dates
  const navigateDate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);
    if (direction === "today") {
      setCurrentDate(new Date());
    } else if (direction === "prev") {
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      setCurrentDate(newDate);
    } else {
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      setCurrentDate(newDate);
    }
  };

  const handleAddTask = async () => {
    const [startHour, startMin] = taskForm.startTime.split(":").map(Number);
    const [endHour, endMin] = taskForm.endTime.split(":").map(Number);
    const [year, month, day] = taskForm.startDate.split("-").map(Number);

    const newTask: CalendarTask = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      startTime: new Date(year, month - 1, day, startHour, startMin),
      endTime: new Date(year, month - 1, day, endHour, endMin),
      priority: taskForm.priority,
      status: "pending",
      assignedTo: teamMembers.find((m) => m.id === taskForm.assignedTo) || teamMembers[0],
      recurring: taskForm.recurring,
      reminder: taskForm.reminder ? new Date(taskForm.reminder) : undefined,
    };
    
    try {
      const taskDTO = {
        title: newTask.title,
        description: newTask.description || '',
        assignedTo: parseInt(newTask.assignedTo.id),
        priority: newTask.priority,
        status: newTask.status,
        deadline: taskForm.startDate,
        progress: 0,
      };
      await taskApi.createTask(taskDTO);
      await fetchTasks(); // Refresh tasks from backend
    } catch (error) {
      console.error('Failed to create task:', error);
      setTasks([...tasks, newTask]); // Fallback to local state
    }
    setAddTaskOpen(false);
    resetForm();
  };

  // Predictive scheduling - suggest best time slots
  const getRecommendedSlots = (hour: number) => {
    if (!showPredictiveSlots) return null;
    // Simple logic: recommend slots with fewer conflicts
    const hourTasks = tasks.filter((task) => {
      const taskHour = new Date(task.startTime).getHours();
      return taskHour === hour;
    });
    const conflictCount = hourTasks.length;
    // Lower conflict = more recommended
    if (conflictCount === 0) return "high"; // Highly recommended
    if (conflictCount === 1) return "medium"; // Moderately recommended
    return null; // Not recommended
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endTime: "",
      priority: "medium",
      assignedTo: "",
      recurring: "none",
      reminder: "",
    });
  };

  const openTaskDetails = (task: CalendarTask) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "high":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "in-progress":
        return <Clock className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  // Generate time slots for day/week view
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                Calendar / Scheduler
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your schedule and tasks
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          {/* Date Navigation & View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
                className="border-border/60"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
                className="border-border/60"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-4 font-heading text-lg font-semibold text-foreground">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>


          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks, projects, or team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border-border/60 bg-background/50 pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="h-10 w-[140px] rounded-lg border-border/60 bg-background/50">
                  <SelectValue placeholder="Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="h-10 w-[140px] rounded-lg border-border/60 bg-background/50">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
          {/* Main Calendar */}
          <div className="space-y-4">
            {view === "month" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                {/* Calendar Header */}
                <div className="mb-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    const dayTasks = getTasksForDate(date);
                    const isToday =
                      date &&
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear();

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.01 }}
                        className={cn(
                          "min-h-[100px] rounded-xl border border-border/60 bg-background/50 p-2 transition-all",
                          isToday && "border-primary/40 bg-primary/5 ring-2 ring-primary/20",
                          !date && "opacity-30"
                        )}
                      >
                        {date && (
                          <>
                            <div
                              className={cn(
                                "mb-1 text-sm font-medium",
                                isToday && "text-primary font-bold"
                              )}
                            >
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dayTasks.slice(0, 3).map((task) => (
                                <motion.div
                                  key={task.id}
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => openTaskDetails(task)}
                                  className={cn(
                                    "cursor-pointer rounded-lg border p-1.5 text-xs transition-all hover:shadow-sm",
                                    getPriorityColor(task.priority)
                                  )}
                                >
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(task.status)}
                                    <span className="truncate font-medium">{task.title}</span>
                                  </div>
                                  {task.reminder && (
                                    <Bell className="mt-0.5 h-2.5 w-2.5 text-muted-foreground" />
                                  )}
                                </motion.div>
                              ))}
                              {dayTasks.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dayTasks.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {(view === "week" || view === "day") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
              >
                <div className="flex">
                  {/* Time Column */}
                  <div className="w-20 shrink-0">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-b border-border/60 text-xs text-muted-foreground"
                      >
                        {hour.toString().padStart(2, "0")}:00
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1">
                    {timeSlots.map((hour) => {
                      const hourTasks = filteredTasks.filter((task) => {
                        const taskHour = new Date(task.startTime).getHours();
                        return taskHour === hour;
                      });

                      const recommendation = getRecommendedSlots(hour);
                      
                      return (
                        <div
                          key={hour}
                          className="relative h-16 border-b border-border/60"
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedTask) {
                              e.currentTarget.classList.add("bg-primary/5");
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove("bg-primary/5");
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove("bg-primary/5");
                            if (draggedTask) {
                              const task = tasks.find((t) => t.id === draggedTask);
                              if (task) {
                                const newStartTime = new Date(task.startTime);
                                newStartTime.setHours(hour, 0, 0, 0);
                                const duration = task.endTime.getTime() - task.startTime.getTime();
                                const newEndTime = new Date(newStartTime.getTime() + duration);
                                
                                setTasks(
                                  tasks.map((t) =>
                                    t.id === draggedTask
                                      ? { ...t, startTime: newStartTime, endTime: newEndTime }
                                      : t
                                  )
                                );
                                setDraggedTask(null);
                              }
                            }
                          }}
                        >
                          {/* Predictive Scheduling Indicator */}
                          {recommendation && (
                            <div
                              className={cn(
                                "absolute inset-0 border-l-2 pointer-events-none",
                                recommendation === "high" && "border-primary/50 bg-primary/5",
                                recommendation === "medium" && "border-primary/30 bg-primary/3"
                              )}
                              title="Recommended time: minimizes conflicts & maximizes efficiency"
                            />
                          )}
                          
                          {/* Team Availability Overlay */}
                          {showTeamOverlay &&
                            teamMembers.map((member) => {
                              const availability = member.availability.find(
                                (avail) =>
                                  new Date(avail.start).getHours() <= hour &&
                                  new Date(avail.end).getHours() > hour
                              );
                              if (availability) {
                                return (
                                  <div
                                    key={member.id}
                                    className="absolute inset-0 opacity-10"
                                    style={{ backgroundColor: member.color }}
                                    title={`${member.name} – Busy ${hour}:00 - ${hour + 1}:00`}
                                  />
                                );
                              }
                              return null;
                            })}

                          {/* Tasks */}
                          {hourTasks.map((task) => {
                            const startMin = new Date(task.startTime).getMinutes();
                            const duration =
                              (new Date(task.endTime).getTime() -
                                new Date(task.startTime).getTime()) /
                              (1000 * 60);
                            const height = (duration / 60) * 64; // 64px per hour

                            return (
                              <motion.div
                                key={task.id}
                                draggable
                                onDragStart={() => setDraggedTask(task.id)}
                                whileHover={{ scale: 1.02, zIndex: 10 }}
                                onClick={() => openTaskDetails(task)}
                                className={cn(
                                  "absolute left-0 right-0 cursor-pointer rounded-lg border p-2 text-xs shadow-sm transition-all",
                                  getPriorityColor(task.priority)
                                )}
                                style={{
                                  top: `${(startMin / 60) * 64}px`,
                                  height: `${height}px`,
                                }}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(task.status)}
                                  <span className="truncate font-medium">{task.title}</span>
                                </div>
                                {task.reminder && (
                                  <Bell className="mt-1 h-3 w-3 text-muted-foreground" />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-4 shadow-brand-soft"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigateDate("prev")}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => navigateDate("next")}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="py-1 text-muted-foreground">
                    {day}
                  </div>
                ))}
                {days.slice(0, 35).map((date, index) => {
                  const isToday =
                    date &&
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth();
                  const hasTasks = date && getTasksForDate(date).length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => date && setCurrentDate(date)}
                      className={cn(
                        "h-8 rounded text-xs transition-all",
                        !date && "opacity-30",
                        isToday && "bg-primary text-primary-foreground font-bold",
                        !isToday && date && "hover:bg-accent/50",
                        hasTasks && !isToday && "bg-primary/10"
                      )}
                    >
                      {date?.getDate()}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-4 shadow-brand-soft"
            >
              <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">Legend</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-destructive/20 bg-destructive/10" />
                  <span className="text-muted-foreground">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-primary/20 bg-primary/10" />
                  <span className="text-muted-foreground">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-border bg-muted" />
                  <span className="text-muted-foreground">Low Priority</span>
                </div>
                {showTeamOverlay && (
                  <>
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-muted-foreground">Team Members</div>
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded opacity-30"
                          style={{ backgroundColor: member.color }}
                        />
                        <span className="text-muted-foreground">{member.name}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Add Task Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetForm();
            setAddTaskOpen(true);
          }}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-mesh-gradient text-primary-foreground shadow-brand-strong transition-all hover:shadow-brand-strong"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Add Task Modal */}
      <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Add New Task</DialogTitle>
            <DialogDescription>Create a new task and schedule it on the calendar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="mt-1.5 rounded-lg border-border/60"
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={taskForm.startDate}
                  onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                />
              </div>
              <div>
                <Label htmlFor="assigned-to">Assign To</Label>
                <Select
                  value={taskForm.assignedTo}
                  onValueChange={(v) => setTaskForm({ ...taskForm, assignedTo: v })}
                >
                  <SelectTrigger className="mt-1.5 rounded-lg border-border/60">
                    <SelectValue placeholder="Select member" />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={taskForm.startTime}
                  onChange={(e) => setTaskForm({ ...taskForm, startTime: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={taskForm.endTime}
                  onChange={(e) => setTaskForm({ ...taskForm, endTime: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(v) => setTaskForm({ ...taskForm, priority: v as TaskPriority })}
                >
                  <SelectTrigger className="mt-1.5 rounded-lg border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reminder">Reminder</Label>
                <Input
                  id="reminder"
                  type="datetime-local"
                  value={taskForm.reminder}
                  onChange={(e) => setTaskForm({ ...taskForm, reminder: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                />
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              disabled={!taskForm.title || !taskForm.startDate || !taskForm.startTime}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Modal */}
      <Dialog open={taskDetailsOpen} onOpenChange={setTaskDetailsOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              {selectedTask && new Date(selectedTask.startTime).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedTask.description || "No description"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Badge className={cn("mt-1 border", getPriorityColor(selectedTask.priority))}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant="outline"
                    className="mt-1 flex w-fit items-center gap-1 border-border/60"
                  >
                    {getStatusIcon(selectedTask.status)}
                    {selectedTask.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
              {selectedTask.reminder && (
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Reminder: {new Date(selectedTask.reminder).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDetailsOpen(false)}>
              Close
            </Button>
            <Button className="bg-mesh-gradient text-primary-foreground shadow-brand-soft">
              Edit Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;


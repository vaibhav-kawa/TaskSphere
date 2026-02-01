import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  UserPlus,
  ArrowUpDown,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Table2,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/taskApi";
import { useAuth } from "@/contexts/AuthContext";

// Task type definition
type TaskStatus = "pending" | "in-progress" | "completed";
type TaskPriority = "low" | "medium" | "high" | "critical";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  progress: number;
}

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "API Integration",
    description: "Integrate payment API with backend services",
    assignedTo: { id: "1", name: "Alice" },
    priority: "high",
    status: "in-progress",
    deadline: "2024-01-15",
    progress: 65,
  },
  {
    id: "2",
    title: "UI Redesign",
    description: "Redesign dashboard interface with new components",
    assignedTo: { id: "2", name: "Bob" },
    priority: "medium",
    status: "pending",
    deadline: "2024-01-20",
    progress: 0,
  },
  {
    id: "3",
    title: "Database Migration",
    description: "Migrate user data to new database schema",
    assignedTo: { id: "3", name: "Charlie" },
    priority: "critical",
    status: "in-progress",
    deadline: "2024-01-12",
    progress: 40,
  },
  {
    id: "4",
    title: "Documentation Update",
    description: "Update API documentation with new endpoints",
    assignedTo: { id: "4", name: "Diana" },
    priority: "low",
    status: "completed",
    deadline: "2024-01-10",
    progress: 100,
  },
  {
    id: "5",
    title: "Security Audit",
    description: "Conduct security audit for authentication system",
    assignedTo: { id: "1", name: "Alice" },
    priority: "high",
    status: "pending",
    deadline: "2024-01-18",
    progress: 0,
  },
  {
    id: "6",
    title: "Performance Optimization",
    description: "Optimize query performance for large datasets",
    assignedTo: { id: "2", name: "Bob" },
    priority: "medium",
    status: "completed",
    deadline: "2024-01-08",
    progress: 100,
  },
];

interface TeamMember {
  id: string;
  name: string;
  email?: string;
}



const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as TaskPriority,
    status: "pending" as TaskStatus,
    deadline: "",
  });

  // Fetch tasks and team members from backend
  useEffect(() => {
    const loadData = async () => {
      await fetchTeamMembers();
      await fetchTasks();
    };
    loadData();
  }, [statusFilter, priorityFilter]);

  // Re-transform tasks when team members change
  useEffect(() => {
    if (teamMembers.length > 0 && tasks.length > 0) {
      // Re-fetch tasks to update assigned names
      fetchTasks();
    }
  }, [teamMembers]);

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
        const members = users.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email
        }));
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      // Fallback to static data if API fails
      setTeamMembers([
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
        { id: "4", name: "Diana" },
      ]);
    }
  };

  // Helper function to transform backend task to frontend format
  const transformTask = (backendTask: any): Task => {
    // Find assigned user
    const assignedUser = teamMembers.find(m => m.id === backendTask.assignedTo?.toString());
    
    return {
      id: backendTask.id?.toString() || Math.random().toString(),
      title: backendTask.title || 'Untitled Task',
      description: backendTask.description || 'No description',
      assignedTo: {
        id: backendTask.assignedTo?.toString() || '0',
        name: assignedUser?.name || 'Unassigned',
      },
      priority: (backendTask.priority?.toLowerCase() || 'medium') as TaskPriority,
      status: (backendTask.status?.toLowerCase().replace('_', '-') || 'pending') as TaskStatus,
      deadline: backendTask.deadline || new Date().toISOString().split('T')[0],
      progress: backendTask.progress || 0,
    };
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getAllTasks();
      if (Array.isArray(data)) {
        const transformedTasks = data.map(transformTask);
        setTasks(transformedTasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDeadline =
        deadlineFilter === "all" ||
        (deadlineFilter === "today" && task.deadline === new Date().toISOString().split("T")[0]) ||
        (deadlineFilter === "week" &&
          new Date(task.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesStatus && matchesPriority && matchesDeadline;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, deadlineFilter]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Group tasks by status for Kanban
  const kanbanTasks = useMemo(() => {
    return {
      pending: filteredTasks.filter((t) => t.status === "pending"),
      "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
      completed: filteredTasks.filter((t) => t.status === "completed"),
    };
  }, [filteredTasks]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDeadlineFilter("all");
  };

  const handleAddTask = async () => {
    try {
      const taskDTO = {
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: parseInt(taskForm.assignedTo),
        priority: taskForm.priority,
        status: taskForm.status,
        deadline: taskForm.deadline,
        progress: taskForm.status === "completed" ? 100 : 0,
      };
      await taskApi.createTask(taskDTO);
      await fetchTasks();
      setAddTaskOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;
    try {
      const taskDTO = {
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: parseInt(taskForm.assignedTo),
        priority: taskForm.priority,
        status: taskForm.status,
        deadline: taskForm.deadline,
        progress: taskForm.status === "completed" ? 100 : selectedTask.progress,
      };
      await taskApi.updateTask(parseInt(selectedTask.id), taskDTO);
      await fetchTasks();
      setEditTaskOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await taskApi.deleteTask(parseInt(selectedTask.id));
      await fetchTasks();
      setDeleteOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleReassign = async () => {
    if (!selectedTask) return;
    try {
      await taskApi.reassignTask(parseInt(selectedTask.id), taskForm.assignedTo);
      await fetchTasks();
      setReassignOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to reassign task:', error);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      const taskDTO = {
        title: task.title,
        description: task.description,
        assignedTo: parseInt(task.assignedTo.id),
        priority: task.priority,
        status: 'completed' as TaskStatus,
        deadline: task.deadline,
        progress: 100,
      };
      await taskApi.updateTask(parseInt(task.id), taskDTO);
      await fetchTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const canCompleteTask = (task: Task) => {
    return user?.role === 'manager' || user?.role === 'team-leader';
  };

  const resetForm = () => {
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      status: "pending",
      deadline: "",
    });
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo.id,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline,
    });
    setEditTaskOpen(true);
  };

  const openReassignModal = (task: Task) => {
    setSelectedTask(task);
    setTaskForm({ ...taskForm, assignedTo: task.assignedTo.id });
    setReassignOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setDeleteOpen(true);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (newStatus: TaskStatus) => {
    if (!draggedTask) return;
    try {
      const task = tasks.find(t => t.id === draggedTask);
      if (task) {
        const taskDTO = {
          title: task.title,
          description: task.description,
          assignedTo: parseInt(task.assignedTo.id),
          priority: task.priority,
          status: newStatus,
          deadline: task.deadline,
          progress: task.progress,
        };
        await taskApi.updateTask(parseInt(task.id), taskDTO);
        await fetchTasks();
      }
      setDraggedTask(null);
    } catch (error) {
      console.error('Failed to update task status:', error);
      setDraggedTask(null);
    }
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
        return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
    }
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
              All Tasks
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all your team's tasks
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setAddTaskOpen(true);
            }}
            className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border-border/60 bg-background/50 pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}>
                <SelectTrigger className="h-10 w-[140px] rounded-lg border-border/60 bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | "all")}>
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

              <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
                <SelectTrigger className="h-10 w-[140px] rounded-lg border-border/60 bg-background/50">
                  <SelectValue placeholder="Deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Deadlines</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || deadlineFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="h-10 rounded-lg border-border/60"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn(
                  "h-8 rounded-md",
                  viewMode === "table" && "bg-primary text-primary-foreground"
                )}
              >
                <Table2 className="mr-2 h-4 w-4" />
                Table
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "h-8 rounded-md",
                  viewMode === "kanban" && "bg-primary text-primary-foreground"
                )}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                To-Do Board
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-3xl border border-border/70 bg-background/80 shadow-brand-soft overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/60 bg-background/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Task Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {paginatedTasks.map((task) => (
                      <motion.tr
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "hsl(var(--accent) / 0.05)" }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{task.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="text-sm text-foreground">{task.assignedTo.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn("border", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="flex w-fit items-center gap-1 border-border/60"
                          >
                            {getStatusIcon(task.status)}
                            {task.status.replace("-", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(task.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{Math.round(task.progress)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openReassignModal(task)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Reassign
                              </DropdownMenuItem>
                              {canCompleteTask(task) && task.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleCompleteTask(task)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(task)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * tasksPerPage) + 1} to {Math.min(currentPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-4 lg:grid-cols-3"
            >
              {(["pending", "in-progress", "completed"] as TaskStatus[]).map((status) => (
                <div
                  key={status}
                  className="rounded-3xl border border-border/70 bg-background/80 p-4 shadow-brand-soft"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(status)}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-lg font-semibold capitalize text-foreground">
                      {status.replace("-", " ")}
                    </h3>
                    <Badge variant="outline" className="border-border/60">
                      {kanbanTasks[status].length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {kanbanTasks[status].map((task) => (
                      <motion.div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        whileHover={{ y: -2 }}
                        className="cursor-move rounded-2xl border border-border/60 bg-background/50 p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditModal(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openReassignModal(task)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Reassign
                              </DropdownMenuItem>
                              {canCompleteTask(task) && task.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleCompleteTask(task)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => openDeleteModal(task)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-3 w-3" />
                          </div>
                          <span className="text-xs text-muted-foreground">{task.assignedTo.name}</span>
                        </div>
                        <div className="mb-2 flex items-center justify-between">
                          <Badge className={cn("border text-xs", getPriorityColor(task.priority))}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </motion.div>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full border-2 border-dashed border-border/60 hover:border-primary/50"
                      onClick={() => {
                        resetForm();
                        setTaskForm({ ...taskForm, status });
                        setAddTaskOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Modal */}
        <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
          <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
            <DialogHeader>
              <DialogTitle className="font-heading">Add New Task</DialogTitle>
              <DialogDescription>Create a new task and assign it to a team member.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Assign To</label>
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
                <div>
                  <label className="text-sm font-medium text-foreground">Priority</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(v) => setTaskForm({ ...taskForm, status: v as TaskStatus })}
                  >
                    <SelectTrigger className="mt-1.5 rounded-lg border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Deadline</label>
                  <Input
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="mt-1.5 rounded-lg border-border/60"
                    min={new Date().toISOString().split('T')[0]}
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
                disabled={!taskForm.title || !taskForm.assignedTo}
              >
                Save Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Task Modal */}
        <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
          <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
            <DialogHeader>
              <DialogTitle className="font-heading">Edit Task</DialogTitle>
              <DialogDescription>Update task details and status.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="mt-1.5 rounded-lg border-border/60"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Assign To</label>
                  <Select
                    value={taskForm.assignedTo}
                    onValueChange={(v) => setTaskForm({ ...taskForm, assignedTo: v })}
                  >
                    <SelectTrigger className="mt-1.5 rounded-lg border-border/60">
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
                <div>
                  <label className="text-sm font-medium text-foreground">Priority</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(v) => setTaskForm({ ...taskForm, status: v as TaskStatus })}
                  >
                    <SelectTrigger className="mt-1.5 rounded-lg border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Deadline</label>
                  <Input
                    type="date"
                    value={taskForm.deadline}
                    onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                    className="mt-1.5 rounded-lg border-border/60"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTaskOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditTask}
                className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reassign Modal */}
        <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
          <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
            <DialogHeader>
              <DialogTitle className="font-heading">Reassign Task</DialogTitle>
              <DialogDescription>Select a new team member to assign this task to.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={taskForm.assignedTo}
                onValueChange={(v) => setTaskForm({ ...taskForm, assignedTo: v })}
              >
                <SelectTrigger className="rounded-lg border-border/60">
                  <SelectValue placeholder="Select team member" />
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setReassignOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleReassign}
                className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
                disabled={!taskForm.assignedTo}
              >
                Confirm Reassign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading">Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Tasks;


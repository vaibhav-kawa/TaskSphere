import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, Calendar, Check, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { taskApi } from "../services/taskApi";
import { userApi } from "../api/userApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";



const MemberTasks = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, userData] = await Promise.all([
          taskApi.getAllTasks(),
          userApi.getCurrentUser().catch(() => null)
        ]);
        
        setCurrentUser(userData);
        // Filter tasks assigned to current user or show all if no user data
        const memberTasks = tasksData?.filter((task: any) => 
          userData ? task.assignedTo === userData.id : true
        ) || tasksData || [];
        setTasks(memberTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "TODO" || task.status === "IN_PROGRESS";
    if (filter === "in-progress") return task.status === "IN_PROGRESS";
    if (filter === "completed") return task.status === "COMPLETED";
    return task.status === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "COMPLETED": return "completed";
      case "IN_PROGRESS": return "in-progress";
      case "TODO": return "pending";
      case "REVIEW": return "review";
      default: return status.toLowerCase();
    }
  };

  const getPriorityDisplay = (priority: string) => {
    return priority?.toLowerCase() || "medium";
  };

  const getStatusIcon = (status: string) => {
    const displayStatus = getStatusDisplay(status);
    switch (displayStatus) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setCompletingTasks(prev => new Set(prev).add(taskId));
    try {
      const taskDTO = {
        title: task.title,
        description: task.description,
        assignedTo: parseInt(task.assignedTo?.id || task.assignedTo || '1'),
        priority: task.priority,
        status: 'COMPLETED',
        deadline: task.deadline,
        progress: 100,
      };
      
      await taskApi.updateTask(parseInt(taskId), taskDTO);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId 
            ? { ...t, status: 'COMPLETED', progress: 100 }
            : t
        )
      );
      
      toast({
        title: "Task Completed",
        description: "Task has been marked as completed successfully.",
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
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

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4"
      >
        <Link
          to="/member-dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          My Tasks
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and track your assigned tasks.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All Tasks", count: tasks.length },
            { key: "pending", label: "Pending", count: tasks.filter(t => t.status === "TODO" || t.status === "IN_PROGRESS").length },
            { key: "in-progress", label: "In Progress", count: tasks.filter(t => t.status === "IN_PROGRESS").length },
            { key: "completed", label: "Completed", count: tasks.filter(t => t.status === "COMPLETED").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2",
                filter === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab.label}
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                filter === tab.key
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-background text-muted-foreground"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        {filteredTasks.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} tasks
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {currentTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-brand-soft hover:shadow-brand-strong transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-semibold text-foreground">{task.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description || 'No description available'}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                  </span>
                  <span>Assigned by: System</span>
                  {task.progress !== undefined && (
                    <span className="flex items-center gap-1">
                      Progress: {Math.round(task.progress)}%
                    </span>
                  )}
                </div>
                {task.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-muted/30">
                      <div 
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.round(task.progress)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  getPriorityDisplay(task.priority) === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                  getPriorityDisplay(task.priority) === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" :
                  "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                )}>
                  {getPriorityDisplay(task.priority)}
                </span>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  getStatusDisplay(task.status) === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                  getStatusDisplay(task.status) === "in-progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                )}>
                  {getStatusDisplay(task.status)}
                </span>
                {getStatusDisplay(task.status) !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTasks.has(task.id)}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {completingTasks.has(task.id) ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-3 w-3 rounded-full border border-white/30 border-t-white"
                      />
                    ) : (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border/60"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="h-9 w-9 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {currentTasks.length === 0 && filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/20 text-muted-foreground mx-auto mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground mb-2">No tasks found for the selected filter.</p>
          <p className="text-sm text-muted-foreground">Try selecting a different filter or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MemberTasks;
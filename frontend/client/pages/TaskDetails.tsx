import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  UserPlus,
  Share2,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Upload,
  X,
  User,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  File,
  History,
  MoreVertical,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  user: { id: string; name: string; avatar?: string };
  text: string;
  timestamp: string;
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "document" | "other";
  size: string;
  url: string;
}

interface Activity {
  id: string;
  type: "status" | "assign" | "priority" | "comment" | "attachment";
  user: { id: string; name: string };
  action: string;
  timestamp: string;
}

// Sample task data (in real app, this would come from API/route params)
const sampleTask = {
  id: "1",
  title: "API Integration",
  description:
    "Integrate payment API with backend services. This includes setting up authentication, handling webhooks, and implementing error handling for failed transactions.",
  assignedTo: { id: "1", name: "Alice" },
  priority: "high" as const,
  status: "in-progress" as const,
  deadline: "2024-01-15",
  progress: 65,
  createdAt: "2024-01-01",
};

const teamMembers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
  { id: "4", name: "Diana" },
];

const initialComments: Comment[] = [
  {
    id: "1",
    user: { id: "2", name: "Bob" },
    text: "I've reviewed the API documentation. We should add retry logic for failed requests.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: { id: "1", name: "Alice" },
    text: "Good point! I'll add that in the next commit.",
    timestamp: "1 hour ago",
  },
];

const initialAttachments: Attachment[] = [
  {
    id: "1",
    name: "api-spec.pdf",
    type: "document",
    size: "2.4 MB",
    url: "#",
  },
  {
    id: "2",
    name: "wireframe.png",
    type: "image",
    size: "1.2 MB",
    url: "#",
  },
];

const initialActivities: Activity[] = [
  {
    id: "1",
    type: "status",
    user: { id: "1", name: "Alice" },
    action: "changed status to In Progress",
    timestamp: "3 days ago",
  },
  {
    id: "2",
    type: "assign",
    user: { id: "1", name: "Alice" },
    action: "assigned task to Alice",
    timestamp: "5 days ago",
  },
  {
    id: "3",
    type: "priority",
    user: { id: "1", name: "Alice" },
    action: "set priority to High",
    timestamp: "5 days ago",
  },
  {
    id: "4",
    type: "comment",
    user: { id: "2", name: "Bob" },
    action: "added a comment",
    timestamp: "2 hours ago",
  },
];

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(sampleTask);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [activities] = useState<Activity[]>(initialActivities);
  const [newComment, setNewComment] = useState("");
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "high":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      user: { id: "1", name: "You" },
      text: newComment,
      timestamp: "just now",
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleStatusChange = (newStatus: string) => {
    setTask({ ...task, status: newStatus as any });
  };

  const handlePriorityChange = (newPriority: string) => {
    setTask({ ...task, priority: newPriority as any });
  };

  const handleReassign = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      setTask({ ...task, assignedTo: member });
      setReassignOpen(false);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "status":
        return <CheckCircle2 className="h-4 w-4" />;
      case "assign":
        return <UserPlus className="h-4 w-4" />;
      case "priority":
        return <Tag className="h-4 w-4" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "attachment":
        return <Paperclip className="h-4 w-4" />;
    }
  };

  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              to="/dashboard/tasks"
              className="hover:text-foreground transition-colors"
            >
              Tasks
            </Link>
            <span>/</span>
            <span className="text-foreground">{task.title}</span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                  {task.title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Task ID: {task.id}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditTaskOpen(true)}
                  className="border-border/60 bg-background/50"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReassignOpen(true)}
                  className="border-border/60 bg-background/50"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Reassign
                </Button>
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-9 w-[140px] border-border/60 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Main Task Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft transition-shadow hover:shadow-brand-strong"
            >
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {task.description}
                  </p>
                </div>

                {/* Task Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Assigned To
                      </p>
                      <p className="font-medium text-foreground">{task.assignedTo.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Priority
                      </p>
                      <Badge className={cn("mt-1 border", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary-foreground">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 flex w-fit items-center gap-1 border-border/60"
                      >
                        {getStatusIcon(task.status)}
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Deadline
                      </p>
                      <p className="font-medium text-foreground">
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Progress</span>
                    <span className="text-muted-foreground">{task.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Comments
                </h3>
                <Badge variant="outline" className="ml-auto border-border/60">
                  {comments.length}
                </Badge>
              </div>

              {/* Add Comment */}
              <div className="mb-4 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[100px] rounded-lg border-border/60 bg-background/50"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
                  >
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-2xl border border-border/60 bg-background/50 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Attachments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Attachments
                  </h3>
                  <Badge variant="outline" className="ml-2 border-border/60">
                    {attachments.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowAttachments(!showAttachments)}
                >
                  {showAttachments ? <X className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>

              <AnimatePresence>
                {showAttachments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {attachments.map((attachment) => (
                      <motion.div
                        key={attachment.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3 transition-all hover:shadow-sm"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {getFileIcon(attachment.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                    <div className="rounded-xl border-2 border-dashed border-border/60 bg-background/30 p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag & drop files here or click to upload
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full border-border/60 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Mark as Pending</SelectItem>
                    <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                    <SelectItem value="completed">Mark as Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={task.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="w-full border-border/60 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Set Priority: Low</SelectItem>
                    <SelectItem value="medium">Set Priority: Medium</SelectItem>
                    <SelectItem value="high">Set Priority: High</SelectItem>
                    <SelectItem value="critical">Set Priority: Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="w-full border-border/60 bg-background/50"
                  onClick={() => setReassignOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Reassign Task
                </Button>
              </div>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-border/70 bg-background/80 p-6 shadow-brand-soft"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Activity Log
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowActivity(!showActivity)}
                >
                  {showActivity ? <X className="h-4 w-4" /> : <History className="h-4 w-4" />}
                </Button>
              </div>

              <AnimatePresence>
                {showActivity && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{activity.user.name}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="rounded-2xl border-border/60 bg-background/95 backdrop-blur-md shadow-brand-strong">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Task</DialogTitle>
            <DialogDescription>Update task details and properties.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                defaultValue={task.title}
                className="mt-1.5 rounded-lg border-border/60"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                defaultValue={task.description}
                className="mt-1.5 rounded-lg border-border/60"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTaskOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              onClick={() => setEditTaskOpen(false)}
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
            <Select onValueChange={handleReassign}>
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
              className="bg-mesh-gradient text-primary-foreground shadow-brand-soft"
              onClick={() => setReassignOpen(false)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDetails;


import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Bell,
  AlertCircle,
  Clock,
  CheckCircle2,
  X,
  Eye,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/taskApi";

type NotificationType = "all" | "alerts" | "reminders" | "system";

interface Notification {
  id: string;
  type: "alerts" | "reminders" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Sample notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alerts",
    title: "High Priority Task Assigned",
    message: "You have been assigned to 'API Integration' task with high priority",
    timestamp: "5 minutes ago",
    read: false,
    actionUrl: "/dashboard/tasks",
  },
  {
    id: "2",
    type: "reminders",
    title: "Team Meeting in 30 Minutes",
    message: "Sprint review meeting scheduled at 2:00 PM",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "system",
    title: "Project Deadline Approaching",
    message: "Project Alpha deadline is in 3 days. 12 tasks remaining.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "alerts",
    title: "Code Review Requested",
    message: "Bob requested your review on pull request #142",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "reminders",
    title: "Weekly Report Available",
    message: "Your weekly productivity report is ready for review",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "New Team Member Joined",
    message: "Diana has joined the Platform team",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "7",
    type: "alerts",
    title: "Task Overdue",
    message: "Task 'UI Redesign' is past its deadline",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "8",
    type: "reminders",
    title: "Standup Reminder",
    message: "Daily standup meeting starts in 15 minutes",
    timestamp: "3 days ago",
    read: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [typeFilter, setTypeFilter] = useState<NotificationType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchCurrentUser();
    generateNotifications();
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
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const generateNotifications = async () => {
    try {
      setLoading(true);
      const [tasks, users] = await Promise.all([
        taskApi.getAllTasks(),
        fetch('http://localhost:8086/getusers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : [])
      ]);

      const generatedNotifications: Notification[] = [];
      const now = new Date();
      const currentUserId = localStorage.getItem('currentUserId');

      if (Array.isArray(tasks)) {
        // Generate overdue task notifications
        tasks.forEach(task => {
          const deadline = new Date(task.deadline);
          const isOverdue = deadline < now && task.status?.toLowerCase() !== 'completed';
          const isAssignedToCurrentUser = task.assignedTo?.toString() === currentUserId;

          if (isOverdue) {
            const daysPastDue = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
            generatedNotifications.push({
              id: `overdue-${task.id}`,
              type: 'alerts',
              title: 'Task Overdue',
              message: `Task "${task.title}" is ${daysPastDue} day${daysPastDue !== 1 ? 's' : ''} overdue`,
              timestamp: `${daysPastDue} day${daysPastDue !== 1 ? 's' : ''} ago`,
              read: false,
              actionUrl: '/dashboard/tasks'
            });
          }

          // Generate task assignment notifications for current user
          if (isAssignedToCurrentUser && task.status?.toLowerCase() === 'pending') {
            const assignedDate = new Date(task.createdAt || task.deadline);
            const hoursAgo = Math.floor((now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60));
            const timeAgo = hoursAgo < 24 ? `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago` : `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) !== 1 ? 's' : ''} ago`;
            
            generatedNotifications.push({
              id: `assigned-${task.id}`,
              type: task.priority?.toLowerCase() === 'high' || task.priority?.toLowerCase() === 'critical' ? 'alerts' : 'reminders',
              title: `${task.priority?.toLowerCase() === 'high' || task.priority?.toLowerCase() === 'critical' ? 'High Priority ' : ''}Task Assigned`,
              message: `You have been assigned to "${task.title}" task${task.priority ? ` with ${task.priority.toLowerCase()} priority` : ''}`,
              timestamp: timeAgo,
              read: hoursAgo > 24,
              actionUrl: '/dashboard/tasks'
            });
          }

          // Generate deadline approaching notifications
          const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilDeadline <= 3 && daysUntilDeadline > 0 && isAssignedToCurrentUser && task.status?.toLowerCase() !== 'completed') {
            generatedNotifications.push({
              id: `deadline-${task.id}`,
              type: 'reminders',
              title: 'Deadline Approaching',
              message: `Task "${task.title}" is due in ${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}`,
              timestamp: 'Today',
              read: false,
              actionUrl: '/dashboard/tasks'
            });
          }
        });
      }

      // Add some system notifications
      generatedNotifications.push(
        {
          id: 'system-1',
          type: 'system',
          title: 'Weekly Report Available',
          message: 'Your weekly productivity report is ready for review',
          timestamp: '1 day ago',
          read: true
        },
        {
          id: 'system-2',
          type: 'reminders',
          title: 'Daily Standup Reminder',
          message: 'Daily standup meeting starts in 15 minutes',
          timestamp: '2 hours ago',
          read: false
        }
      );

      // Sort by timestamp (newest first) and limit to recent notifications
      const sortedNotifications = generatedNotifications
        .sort((a, b) => {
          const aUnread = !a.read ? 1 : 0;
          const bUnread = !b.read ? 1 : 0;
          return bUnread - aUnread; // Unread first
        })
        .slice(0, 20); // Limit to 20 notifications

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Failed to generate notifications:', error);
      setNotifications(initialNotifications);
    } finally {
      setLoading(false);
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesType = typeFilter === "all" || notification.type === typeFilter;
      const matchesSearch =
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [notifications, typeFilter, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alerts":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "reminders":
        return <Clock className="h-5 w-5 text-accent" />;
      case "system":
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "alerts":
        return "bg-destructive/10 border-destructive/20";
      case "reminders":
        return "bg-accent/10 border-accent/20";
      case "system":
        return "bg-primary/10 border-primary/20";
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
              Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up! No new notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-border/60 bg-background/50 hover:bg-background/80"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </motion.div>

        {/* Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-border/70 bg-background/80 p-4 shadow-brand-soft lg:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border-border/60 bg-background/50 pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as NotificationType)}>
                <SelectTrigger className="h-10 w-[160px] rounded-lg border-border/60 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                  <SelectItem value="reminders">Reminders</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            </div>
          ) : (
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={cn(
                    "group relative rounded-2xl border border-border/60 bg-background/80 p-4 shadow-brand-soft transition-all duration-200",
                    !notification.read && "bg-primary/5 border-primary/20 shadow-md"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        getNotificationColor(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className={cn(
                                "font-semibold text-foreground",
                                !notification.read && "font-bold"
                              )}
                            >
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground"
                              >
                                New
                              </motion.span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => dismissNotification(notification.id)}
                            title="Dismiss"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-border/70 bg-background/80 p-12 text-center shadow-brand-soft"
              >
                <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="mt-4 font-heading text-lg font-semibold text-foreground">
                  No notifications found
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You're all caught up!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;




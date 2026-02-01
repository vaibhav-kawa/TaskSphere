// Shared tasks storage using localStorage
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
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

const STORAGE_KEY = "tasksphere_tasks";

// Get tasks from localStorage
export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
  }
  return [];
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

// Initialize with default tasks if none exist
export const initializeTasks = (defaultTasks: Task[]): Task[] => {
  const existing = getTasks();
  if (existing.length === 0) {
    saveTasks(defaultTasks);
    return defaultTasks;
  }
  return existing;
};




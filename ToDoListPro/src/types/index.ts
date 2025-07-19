import { BaseEntity } from '../../../shared/services/DataService';

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  categoryId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  completedAt?: string;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  tags?: string[];
  subtasks?: SubTask[];
  attachments?: string[]; // file paths or URLs
  notes?: string;
  reminderTime?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every N days/weeks/months
    endDate?: string;
  };
  location?: string;
  collaborators?: string[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Category extends BaseEntity {
  name: string;
  description?: string;
  icon: string;
  color: string;
  isDefault: boolean;
  parentId?: string; // for subcategories
  sortOrder: number;
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  color: string;
  icon: string;
  startDate?: string;
  endDate?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  progress: number; // 0-100 percentage
  categoryIds: string[];
  ownerId?: string;
  teamMembers?: string[];
}

export interface TodoSettings {
  defaultView: 'list' | 'board' | 'calendar';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title' | 'category';
  sortOrder: 'asc' | 'desc';
  showCompleted: boolean;
  autoArchiveCompleted: boolean;
  autoArchiveDays: number;
  notifications: {
    enabled: boolean;
    reminderTime: number; // minutes before due
    dailyDigest: boolean;
    digestTime: string; // HH:mm format
  };
  theme: 'light' | 'dark' | 'auto';
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  workingHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    workingDays: number[]; // [1,2,3,4,5] for Mon-Fri
  };
}

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number; // percentage
  averageCompletionTime: number; // days
  productivityScore: number; // 0-100
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month' | 'year';
  };
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  averagePriority: number; // 1-4 scale
  totalEstimatedTime: number; // minutes
  totalActualTime: number; // minutes
}

export interface ProductivityData {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  timeSpent: number; // minutes
  productivityScore: number; // 0-100
}

export interface PriorityDistribution {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface TodoAlert {
  id: string;
  type: 'overdue' | 'due_soon' | 'reminder' | 'deadline_approaching';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  relatedTaskId?: string;
  relatedProjectId?: string;
  createdAt: string;
  read: boolean;
  actionable: boolean;
  actionUrl?: string;
}

export interface Notification {
  id: string;
  taskId: string;
  type: 'reminder' | 'due' | 'overdue';
  scheduledTime: string;
  sent: boolean;
  title: string;
  body: string;
}

export type TaskFilters = {
  status?: ('pending' | 'in_progress' | 'completed' | 'cancelled')[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  categoryIds?: string[];
  projectIds?: string[];
  dateRange?: {
    start: string;
    end: string;
    field: 'dueDate' | 'createdAt' | 'completedAt';
  };
  tags?: string[];
  title?: string;
  hasSubtasks?: boolean;
  isOverdue?: boolean;
  dueSoon?: number; // days
  assignedTo?: string[];
};

export type TaskSortOptions = {
  field: keyof Task | 'categoryName' | 'projectName';
  direction: 'asc' | 'desc';
};

export type ViewMode = 'list' | 'board' | 'calendar' | 'timeline';

export interface BoardColumn {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  tasks: Task[];
  limit?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  taskId: string;
  type: 'task' | 'reminder' | 'deadline';
}

export interface TimeTracking {
  taskId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  description?: string;
  isRunning: boolean;
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  categoryId: string;
  priority: Task['priority'];
  estimatedDuration?: number;
  subtasks: Omit<SubTask, 'id' | 'createdAt'>[];
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number; // times per frequency period
  currentStreak: number;
  longestStreak: number;
  completedDates: string[]; // YYYY-MM-DD format
  color: string;
  icon: string;
  reminderTime?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'professional' | 'health' | 'financial' | 'learning';
  progress: number; // 0-100 percentage
  milestones: {
    id: string;
    title: string;
    dueDate?: string;
    completed: boolean;
    completedAt?: string;
  }[];
  relatedTaskIds: string[];
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export type ChartType = 'pie' | 'bar' | 'line' | 'doughnut' | 'area';

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
    name?: string;
  }[];
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeCompleted: boolean;
  includeArchived: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  fields?: (keyof Task)[];
} 
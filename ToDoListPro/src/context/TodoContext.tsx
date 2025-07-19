import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TodoService } from '../services/TodoService';
import {
  Task,
  Category,
  Project,
  Goal,
  TaskSummary,
  CategoryStats,
  ProductivityData,
  PriorityDistribution,
  TodoAlert,
  TaskFilters,
  TaskTemplate,
} from '../types';

interface TodoContextType {
  // Data
  tasks: Task[];
  categories: Category[];
  projects: Project[];
  goals: Goal[];
  templates: TaskTemplate[];
  summary: TaskSummary | null;
  categoryStats: CategoryStats[];
  productivityData: ProductivityData[];
  priorityDistribution: PriorityDistribution | null;
  alerts: TodoAlert[];

  // Loading states
  loading: boolean;
  tasksLoading: boolean;
  categoriesLoading: boolean;
  projectsLoading: boolean;

  // Task actions
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getFilteredTasks: (filters: TaskFilters) => Promise<Task[]>;
  searchTasks: (query: string) => Promise<Task[]>;
  completeTask: (id: string) => Promise<void>;
  createTaskFromTemplate: (templateId: string, customizations?: Partial<Task>) => Promise<void>;

  // Category actions
  addCategory: (category: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Project actions
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Goal actions
  addGoal: (goal: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Subtask actions
  addSubtask: (taskId: string, title: string) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, updates: { title?: string; completed?: boolean }) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Utility functions
  refreshData: () => Promise<void>;
  refreshSummary: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getTaskById: (id: string) => Task | undefined;
  getProjectById: (id: string) => Project | undefined;

  // Statistics
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getOverdueTasks: () => Task[];
  getDueTodayTasks: () => Task[];
  getUpcomingTasks: (days?: number) => Task[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [productivityData, setProductivityData] = useState<ProductivityData[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<PriorityDistribution | null>(null);
  const [alerts, setAlerts] = useState<TodoAlert[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Initialize the app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      await TodoService.initialize();
      await refreshData();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      const [
        tasksData,
        categoriesData,
        projectsData,
        goalsData,
        templatesData,
      ] = await Promise.all([
        TodoService.getTasks(),
        TodoService.getCategories(),
        TodoService.getProjects(),
        TodoService.getGoals(),
        TodoService.getTemplates(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      setProjects(projectsData);
      setGoals(goalsData);
      setTemplates(templatesData);

      // Refresh derived data
      await refreshSummary();
      await refreshAlerts();
      await refreshPriorityDistribution();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  // Refresh summary and analytics
  const refreshSummary = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const period = {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
      };

      const [summaryData, statsData, productivityResponse] = await Promise.all([
        TodoService.getTaskSummary(period),
        TodoService.getCategoryStats(period),
        TodoService.getProductivityData(30),
      ]);

      setSummary(summaryData);
      setCategoryStats(statsData);
      setProductivityData(productivityResponse);
    } catch (error) {
      console.error('Failed to refresh summary:', error);
    }
  };

  // Refresh alerts
  const refreshAlerts = async () => {
    try {
      const alertsData = await TodoService.getTodoAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
    }
  };

  // Refresh priority distribution
  const refreshPriorityDistribution = async () => {
    try {
      const distribution = await TodoService.getPriorityDistribution();
      setPriorityDistribution(distribution);
    } catch (error) {
      console.error('Failed to refresh priority distribution:', error);
    }
  };

  // Task actions
  const addTask = async (task: Partial<Task>) => {
    try {
      setTasksLoading(true);
      await TodoService.createTask(task);
      await refreshData();
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setTasksLoading(true);
      await TodoService.updateTask(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasksLoading(true);
      await TodoService.deleteTask(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  const getFilteredTasks = async (filters: TaskFilters) => {
    try {
      return await TodoService.getFilteredTasks(filters);
    } catch (error) {
      console.error('Failed to get filtered tasks:', error);
      return [];
    }
  };

  const searchTasks = async (query: string) => {
    try {
      return await TodoService.searchTasks(query);
    } catch (error) {
      console.error('Failed to search tasks:', error);
      return [];
    }
  };

  const completeTask = async (id: string) => {
    try {
      await updateTask(id, { status: 'completed' });
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  };

  const createTaskFromTemplate = async (templateId: string, customizations?: Partial<Task>) => {
    try {
      setTasksLoading(true);
      await TodoService.createTaskFromTemplate(templateId, customizations);
      await refreshData();
    } catch (error) {
      console.error('Failed to create task from template:', error);
      throw error;
    } finally {
      setTasksLoading(false);
    }
  };

  // Category actions
  const addCategory = async (category: Partial<Category>) => {
    try {
      setCategoriesLoading(true);
      await TodoService.createCategory(category);
      await refreshData();
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    } finally {
      setCategoriesLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      setCategoriesLoading(true);
      await TodoService.updateCategory(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    } finally {
      setCategoriesLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setCategoriesLoading(true);
      await TodoService.deleteCategory(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Project actions
  const addProject = async (project: Partial<Project>) => {
    try {
      setProjectsLoading(true);
      await TodoService.createProject(project);
      await refreshData();
    } catch (error) {
      console.error('Failed to add project:', error);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      setProjectsLoading(true);
      await TodoService.updateProject(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setProjectsLoading(true);
      await TodoService.deleteProject(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    } finally {
      setProjectsLoading(false);
    }
  };

  // Goal actions
  const addGoal = async (goal: Partial<Goal>) => {
    try {
      await TodoService.createGoal(goal);
      await refreshData();
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      await TodoService.updateGoal(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await TodoService.deleteGoal(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  };

  // Subtask actions
  const addSubtask = async (taskId: string, title: string) => {
    try {
      await TodoService.addSubtask(taskId, { title, completed: false });
      await refreshData();
    } catch (error) {
      console.error('Failed to add subtask:', error);
      throw error;
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, updates: { title?: string; completed?: boolean }) => {
    try {
      await TodoService.updateSubtask(taskId, subtaskId, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update subtask:', error);
      throw error;
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await TodoService.deleteSubtask(taskId, subtaskId);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      throw error;
    }
  };

  // Utility functions
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  const getTaskById = (id: string) => {
    return tasks.find(t => t.id === id);
  };

  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  // Statistics functions
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== 'completed'
    );
  };

  const getDueTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate.split('T')[0] === today && 
      task.status !== 'completed'
    );
  };

  const getUpcomingTasks = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= futureDate;
    }).sort((a, b) => 
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    );
  };

  const value: TodoContextType = {
    // Data
    tasks,
    categories,
    projects,
    goals,
    templates,
    summary,
    categoryStats,
    productivityData,
    priorityDistribution,
    alerts,

    // Loading states
    loading,
    tasksLoading,
    categoriesLoading,
    projectsLoading,

    // Task actions
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
    searchTasks,
    completeTask,
    createTaskFromTemplate,

    // Category actions
    addCategory,
    updateCategory,
    deleteCategory,

    // Project actions
    addProject,
    updateProject,
    deleteProject,

    // Goal actions
    addGoal,
    updateGoal,
    deleteGoal,

    // Subtask actions
    addSubtask,
    updateSubtask,
    deleteSubtask,

    // Utility functions
    refreshData,
    refreshSummary,
    getCategoryById,
    getTaskById,
    getProjectById,

    // Statistics
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    getDueTodayTasks,
    getUpcomingTasks,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}; 
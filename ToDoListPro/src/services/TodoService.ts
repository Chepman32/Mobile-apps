import { MMKVDataService } from '../../../shared/services/DataService';
import {
  Task,
  Category,
  Project,
  TaskSummary,
  CategoryStats,
  ProductivityData,
  PriorityDistribution,
  TodoAlert,
  TaskFilters,
  Goal,
  Habit,
  TimeTracking,
  TaskTemplate,
  SubTask,
} from '../types';

class TodoServiceClass {
  private taskService: MMKVDataService<Task>;
  private categoryService: MMKVDataService<Category>;
  private projectService: MMKVDataService<Project>;
  private goalService: MMKVDataService<Goal>;
  private habitService: MMKVDataService<Habit>;
  private templateService: MMKVDataService<TaskTemplate>;

  constructor() {
    this.taskService = new MMKVDataService<Task>('tasks');
    this.categoryService = new MMKVDataService<Category>('categories');
    this.projectService = new MMKVDataService<Project>('projects');
    this.goalService = new MMKVDataService<Goal>('goals');
    this.habitService = new MMKVDataService<Habit>('habits');
    this.templateService = new MMKVDataService<TaskTemplate>('task_templates');
  }

  async initialize(): Promise<void> {
    await this.createDefaultCategories();
    await this.createDefaultTemplates();
  }

  private async createDefaultCategories(): Promise<void> {
    const existingCategories = await this.categoryService.getAll();
    if (existingCategories.length === 0) {
      const defaultCategories: Partial<Category>[] = [
        // Work categories
        { name: 'Work', icon: 'briefcase', color: '#2196F3', isDefault: true, sortOrder: 1 },
        { name: 'Meetings', icon: 'account-group', color: '#FF9800', isDefault: true, sortOrder: 2 },
        { name: 'Projects', icon: 'folder', color: '#4CAF50', isDefault: true, sortOrder: 3 },
        { name: 'Deadlines', icon: 'clock-alert', color: '#F44336', isDefault: true, sortOrder: 4 },
        
        // Personal categories  
        { name: 'Personal', icon: 'account', color: '#9C27B0', isDefault: true, sortOrder: 5 },
        { name: 'Health', icon: 'heart', color: '#E91E63', isDefault: true, sortOrder: 6 },
        { name: 'Learning', icon: 'book-open', color: '#00BCD4', isDefault: true, sortOrder: 7 },
        { name: 'Finance', icon: 'currency-usd', color: '#795548', isDefault: true, sortOrder: 8 },
        
        // Lifestyle categories
        { name: 'Shopping', icon: 'cart', color: '#FF5722', isDefault: true, sortOrder: 9 },
        { name: 'Home', icon: 'home', color: '#607D8B', isDefault: true, sortOrder: 10 },
        { name: 'Travel', icon: 'airplane', color: '#3F51B5', isDefault: true, sortOrder: 11 },
        { name: 'Hobbies', icon: 'palette', color: '#8BC34A', isDefault: true, sortOrder: 12 },
        { name: 'Social', icon: 'account-multiple', color: '#FFEB3B', isDefault: true, sortOrder: 13 },
        { name: 'Other', icon: 'help-circle', color: '#9E9E9E', isDefault: true, sortOrder: 14 },
      ];

      for (const category of defaultCategories) {
        await this.categoryService.create(category);
      }
    }
  }

  private async createDefaultTemplates(): Promise<void> {
    const existingTemplates = await this.templateService.getAll();
    if (existingTemplates.length === 0) {
      const workCategory = (await this.categoryService.getAll()).find(c => c.name === 'Work');
      if (!workCategory) return;

      const defaultTemplates: Partial<TaskTemplate>[] = [
        {
          name: 'Project Planning',
          title: 'Plan new project: [Project Name]',
          description: 'Create detailed project plan with timeline and resources',
          categoryId: workCategory.id,
          priority: 'high',
          estimatedDuration: 120,
          subtasks: [
            { title: 'Define project scope and objectives', completed: false },
            { title: 'Identify stakeholders and team members', completed: false },
            { title: 'Create project timeline and milestones', completed: false },
            { title: 'Estimate resources and budget', completed: false },
            { title: 'Set up project tracking system', completed: false },
          ],
          tags: ['planning', 'project', 'management'],
          isPublic: true,
          usageCount: 0,
        },
        {
          name: 'Weekly Review',
          title: 'Weekly review and planning',
          description: 'Review completed tasks and plan for the upcoming week',
          categoryId: workCategory.id,
          priority: 'medium',
          estimatedDuration: 30,
          subtasks: [
            { title: 'Review completed tasks from last week', completed: false },
            { title: 'Analyze productivity and blockers', completed: false },
            { title: 'Plan priority tasks for next week', completed: false },
            { title: 'Schedule important meetings', completed: false },
          ],
          tags: ['review', 'planning', 'weekly'],
          isPublic: true,
          usageCount: 0,
        },
      ];

      for (const template of defaultTemplates) {
        await this.templateService.create(template);
      }
    }
  }

  // Task operations
  async createTask(task: Partial<Task>): Promise<string> {
    // Generate subtask IDs if provided
    if (task.subtasks) {
      task.subtasks = task.subtasks.map(subtask => ({
        ...subtask,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      }));
    }

    return await this.taskService.create(task);
  }

  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskService.getById(id);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    // Handle completion logic
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date().toISOString();
    } else if (updates.status !== 'completed') {
      updates.completedAt = undefined;
    }

    await this.taskService.update(id, updates);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskService.delete(id);
  }

  async getFilteredTasks(filters: TaskFilters): Promise<Task[]> {
    let tasks = await this.getTasks();

    if (filters.status && filters.status.length > 0) {
      tasks = tasks.filter(t => filters.status!.includes(t.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      tasks = tasks.filter(t => filters.priority!.includes(t.priority));
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      tasks = tasks.filter(t => filters.categoryIds!.includes(t.categoryId));
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      const field = filters.dateRange.field;

      tasks = tasks.filter(t => {
        const date = t[field];
        if (!date) return false;
        const taskDate = new Date(date);
        return taskDate >= start && taskDate <= end;
      });
    }

    if (filters.title) {
      const query = filters.title.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      tasks = tasks.filter(t => 
        t.tags && t.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    if (filters.hasSubtasks !== undefined) {
      tasks = tasks.filter(t => 
        filters.hasSubtasks ? (t.subtasks && t.subtasks.length > 0) : !t.subtasks || t.subtasks.length === 0
      );
    }

    if (filters.isOverdue) {
      const now = new Date();
      tasks = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
      );
    }

    if (filters.dueSoon !== undefined) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + filters.dueSoon);
      tasks = tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) <= futureDate && t.status !== 'completed'
      );
    }

    return tasks;
  }

  // Category operations
  async createCategory(category: Partial<Category>): Promise<string> {
    const categories = await this.categoryService.getAll();
    const maxSortOrder = Math.max(...categories.map(c => c.sortOrder), 0);
    
    return await this.categoryService.create({
      ...category,
      sortOrder: maxSortOrder + 1,
    });
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryService.getAll();
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryService.getById(id);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await this.categoryService.update(id, updates);
  }

  async deleteCategory(id: string): Promise<void> {
    // Check if category is being used by tasks
    const tasks = await this.getTasksByCategory(id);
    if (tasks.length > 0) {
      throw new Error('Cannot delete category that has tasks. Please reassign tasks first.');
    }
    await this.categoryService.delete(id);
  }

  async getTasksByCategory(categoryId: string): Promise<Task[]> {
    return await this.taskService.getByField('categoryId', categoryId);
  }

  // Project operations
  async createProject(project: Partial<Project>): Promise<string> {
    return await this.projectService.create(project);
  }

  async getProjects(): Promise<Project[]> {
    return await this.projectService.getAll();
  }

  async getProjectById(id: string): Promise<Project | null> {
    return await this.projectService.getById(id);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.projectService.update(id, updates);
  }

  async deleteProject(id: string): Promise<void> {
    await this.projectService.delete(id);
  }

  // Analytics and reporting
  async getTaskSummary(period: { start: string; end: string }): Promise<TaskSummary> {
    const tasks = await this.getFilteredTasks({
      dateRange: {
        start: period.start,
        end: period.end,
        field: 'createdAt',
      },
    });

    const now = new Date();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    ).length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate average completion time
    const completedWithDates = tasks.filter(t => 
      t.status === 'completed' && t.completedAt && t.createdAt
    );
    
    const averageCompletionTime = completedWithDates.length > 0 
      ? completedWithDates.reduce((sum, task) => {
          const created = new Date(task.createdAt).getTime();
          const completed = new Date(task.completedAt!).getTime();
          return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
        }, 0) / completedWithDates.length
      : 0;

    // Simple productivity score based on completion rate and overdue tasks
    const overdueRate = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
    const productivityScore = Math.max(0, Math.min(100, completionRate - overdueRate));

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      averageCompletionTime,
      productivityScore,
      period: {
        start: period.start,
        end: period.end,
        type: 'month', // Could be dynamic based on period length
      },
    };
  }

  async getCategoryStats(period: { start: string; end: string }): Promise<CategoryStats[]> {
    const tasks = await this.getFilteredTasks({
      dateRange: {
        start: period.start,
        end: period.end,
        field: 'createdAt',
      },
    });

    const categories = await this.getCategories();
    const categoryMap = new Map<string, CategoryStats>();

    tasks.forEach(task => {
      const category = categories.find(c => c.id === task.categoryId);
      if (!category) return;

      const existing = categoryMap.get(task.categoryId) || {
        categoryId: task.categoryId,
        categoryName: category.name,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        completionRate: 0,
        averagePriority: 0,
        totalEstimatedTime: 0,
        totalActualTime: 0,
      };

      existing.totalTasks += 1;
      if (task.status === 'completed') existing.completedTasks += 1;
      if (task.status === 'pending') existing.pendingTasks += 1;
      if (task.estimatedDuration) existing.totalEstimatedTime += task.estimatedDuration;
      if (task.actualDuration) existing.totalActualTime += task.actualDuration;

      categoryMap.set(task.categoryId, existing);
    });

    const result = Array.from(categoryMap.values());

    // Calculate rates and averages
    result.forEach(stats => {
      stats.completionRate = stats.totalTasks > 0 
        ? (stats.completedTasks / stats.totalTasks) * 100 
        : 0;

      // Calculate average priority (1=low, 2=medium, 3=high, 4=urgent)
      const categoryTasks = tasks.filter(t => t.categoryId === stats.categoryId);
      if (categoryTasks.length > 0) {
        const prioritySum = categoryTasks.reduce((sum, task) => {
          const priorityValue = { low: 1, medium: 2, high: 3, urgent: 4 }[task.priority];
          return sum + priorityValue;
        }, 0);
        stats.averagePriority = prioritySum / categoryTasks.length;
      }
    });

    return result.sort((a, b) => b.totalTasks - a.totalTasks);
  }

  async getProductivityData(days: number = 30): Promise<ProductivityData[]> {
    const result: ProductivityData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Tasks completed on this date
      const completedTasks = await this.getFilteredTasks({
        status: ['completed'],
        dateRange: {
          start: dateString,
          end: dateString,
          field: 'completedAt',
        },
      });

      // Tasks created on this date
      const createdTasks = await this.getFilteredTasks({
        dateRange: {
          start: dateString,
          end: dateString,
          field: 'createdAt',
        },
      });

      const timeSpent = completedTasks.reduce((sum, task) => 
        sum + (task.actualDuration || task.estimatedDuration || 0), 0
      );

      // Simple productivity score based on completion vs creation ratio
      const completionRatio = createdTasks.length > 0 
        ? completedTasks.length / createdTasks.length 
        : completedTasks.length > 0 ? 1 : 0;
      
      const productivityScore = Math.min(100, completionRatio * 100);

      result.push({
        date: dateString,
        tasksCompleted: completedTasks.length,
        tasksCreated: createdTasks.length,
        timeSpent,
        productivityScore,
      });
    }

    return result;
  }

  async getPriorityDistribution(): Promise<PriorityDistribution> {
    const tasks = await this.getFilteredTasks({
      status: ['pending', 'in_progress'],
    });

    return {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length,
    };
  }

  async getTodoAlerts(): Promise<TodoAlert[]> {
    const alerts: TodoAlert[] = [];
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all active tasks
    const activeTasks = await this.getFilteredTasks({
      status: ['pending', 'in_progress'],
    });

    for (const task of activeTasks) {
      if (!task.dueDate) continue;
      
      const dueDate = new Date(task.dueDate);
      const categories = await this.getCategories();
      const category = categories.find(c => c.id === task.categoryId);

      // Overdue tasks
      if (dueDate < now) {
        const daysOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `overdue_${task.id}`,
          type: 'overdue',
          title: 'Overdue Task',
          message: `"${task.title}" is ${daysOverdue} day(s) overdue`,
          severity: 'error',
          relatedTaskId: task.id,
          createdAt: new Date().toISOString(),
          read: false,
          actionable: true,
        });
      }
      // Due soon (within 24 hours)
      else if (dueDate <= tomorrow) {
        alerts.push({
          id: `due_soon_${task.id}`,
          type: 'due_soon',
          title: 'Task Due Soon',
          message: `"${task.title}" is due ${dueDate.toLocaleDateString()}`,
          severity: 'warning',
          relatedTaskId: task.id,
          createdAt: new Date().toISOString(),
          read: false,
          actionable: true,
        });
      }
    }

    return alerts;
  }

  // Subtask operations
  async addSubtask(taskId: string, subtask: Omit<SubTask, 'id' | 'createdAt'>): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    const newSubtask: SubTask = {
      ...subtask,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedSubtasks = [...(task.subtasks || []), newSubtask];
    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  async updateSubtask(taskId: string, subtaskId: string, updates: Partial<SubTask>): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task || !task.subtasks) throw new Error('Task or subtask not found');

    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
    );

    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task || !task.subtasks) throw new Error('Task or subtask not found');

    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  // Goal operations
  async createGoal(goal: Partial<Goal>): Promise<string> {
    return await this.goalService.create(goal);
  }

  async getGoals(): Promise<Goal[]> {
    return await this.goalService.getAll();
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    await this.goalService.update(id, updates);
  }

  async deleteGoal(id: string): Promise<void> {
    await this.goalService.delete(id);
  }

  // Template operations
  async getTemplates(): Promise<TaskTemplate[]> {
    return await this.templateService.getAll();
  }

  async createTaskFromTemplate(templateId: string, customizations?: Partial<Task>): Promise<string> {
    const template = await this.templateService.getById(templateId);
    if (!template) throw new Error('Template not found');

    const taskData: Partial<Task> = {
      title: template.title,
      description: template.description,
      categoryId: template.categoryId,
      priority: template.priority,
      estimatedDuration: template.estimatedDuration,
      tags: [...template.tags],
      subtasks: template.subtasks.map(st => ({
        ...st,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
      })),
      ...customizations,
    };

    const taskId = await this.createTask(taskData);
    
    // Update template usage count
    await this.templateService.update(templateId, {
      usageCount: template.usageCount + 1,
    });

    return taskId;
  }

  // Search functionality
  async searchTasks(query: string): Promise<Task[]> {
    return await this.taskService.search(query, ['title', 'description']);
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Export functionality
  async exportData(): Promise<{
    tasks: Task[];
    categories: Category[];
    projects: Project[];
    goals: Goal[];
    templates: TaskTemplate[];
  }> {
    const [tasks, categories, projects, goals, templates] = await Promise.all([
      this.getTasks(),
      this.getCategories(),
      this.getProjects(),
      this.getGoals(),
      this.getTemplates(),
    ]);

    return { tasks, categories, projects, goals, templates };
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.taskService.clear(),
      this.categoryService.clear(),
      this.projectService.clear(),
      this.goalService.clear(),
      this.templateService.clear(),
    ]);
    await this.createDefaultCategories();
    await this.createDefaultTemplates();
  }
}

export const TodoService = new TodoServiceClass(); 
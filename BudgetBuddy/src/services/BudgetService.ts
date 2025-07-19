import { MMKVDataService } from '../../../shared/services/DataService';
import {
  Transaction,
  Category,
  Budget,
  Goal,
  BudgetSummary,
  CategorySpending,
  MonthlyData,
  DailySpending,
  TransactionFilters,
  BudgetSettings,
  BudgetAlert,
} from '../types';

class BudgetServiceClass {
  private transactionService: MMKVDataService<Transaction>;
  private categoryService: MMKVDataService<Category>;
  private budgetService: MMKVDataService<Budget>;
  private goalService: MMKVDataService<Goal>;

  constructor() {
    this.transactionService = new MMKVDataService<Transaction>('transactions');
    this.categoryService = new MMKVDataService<Category>('categories');
    this.budgetService = new MMKVDataService<Budget>('budgets');
    this.goalService = new MMKVDataService<Goal>('goals');
  }

  async initialize(): Promise<void> {
    await this.createDefaultCategories();
  }

  private async createDefaultCategories(): Promise<void> {
    const existingCategories = await this.categoryService.getAll();
    if (existingCategories.length === 0) {
      const defaultCategories: Partial<Category>[] = [
        // Income categories
        { name: 'Salary', icon: 'briefcase', color: '#4CAF50', type: 'income', isDefault: true },
        { name: 'Freelance', icon: 'laptop', color: '#2196F3', type: 'income', isDefault: true },
        { name: 'Investment', icon: 'trending-up', color: '#FF9800', type: 'income', isDefault: true },
        { name: 'Gift', icon: 'gift', color: '#E91E63', type: 'income', isDefault: true },
        
        // Expense categories
        { name: 'Food & Dining', icon: 'restaurant', color: '#FF5722', type: 'expense', isDefault: true },
        { name: 'Transportation', icon: 'car', color: '#9C27B0', type: 'expense', isDefault: true },
        { name: 'Shopping', icon: 'shopping-cart', color: '#3F51B5', type: 'expense', isDefault: true },
        { name: 'Entertainment', icon: 'movie', color: '#FF9800', type: 'expense', isDefault: true },
        { name: 'Bills & Utilities', icon: 'receipt', color: '#795548', type: 'expense', isDefault: true },
        { name: 'Healthcare', icon: 'medical-bag', color: '#F44336', type: 'expense', isDefault: true },
        { name: 'Education', icon: 'school', color: '#4CAF50', type: 'expense', isDefault: true },
        { name: 'Travel', icon: 'airplane', color: '#00BCD4', type: 'expense', isDefault: true },
        { name: 'Groceries', icon: 'basket', color: '#8BC34A', type: 'expense', isDefault: true },
        { name: 'Personal Care', icon: 'face-woman', color: '#E91E63', type: 'expense', isDefault: true },
        { name: 'Home', icon: 'home', color: '#607D8B', type: 'expense', isDefault: true },
        { name: 'Other', icon: 'help-circle', color: '#9E9E9E', type: 'both', isDefault: true },
      ];

      for (const category of defaultCategories) {
        await this.categoryService.create(category);
      }
    }
  }

  // Transaction operations
  async createTransaction(transaction: Partial<Transaction>): Promise<string> {
    return await this.transactionService.create(transaction);
  }

  async getTransactions(): Promise<Transaction[]> {
    return await this.transactionService.getAll();
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await this.transactionService.getById(id);
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
    await this.transactionService.update(id, updates);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.transactionService.delete(id);
  }

  async getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let transactions = await this.getTransactions();

    if (filters.type) {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      transactions = transactions.filter(t => filters.categoryIds!.includes(t.categoryId));
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      transactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }

    if (filters.amountRange) {
      transactions = transactions.filter(t => 
        t.amount >= filters.amountRange!.min && t.amount <= filters.amountRange!.max
      );
    }

    if (filters.description) {
      const query = filters.description.toLowerCase();
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(query)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      transactions = transactions.filter(t => 
        t.tags && t.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    return transactions;
  }

  // Category operations
  async createCategory(category: Partial<Category>): Promise<string> {
    return await this.categoryService.create(category);
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categoryService.getById(id);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await this.categoryService.update(id, updates);
  }

  async deleteCategory(id: string): Promise<void> {
    // Check if category is being used by transactions
    const transactions = await this.getTransactionsByCategory(id);
    if (transactions.length > 0) {
      throw new Error('Cannot delete category that has transactions. Please reassign transactions first.');
    }
    await this.categoryService.delete(id);
  }

  async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    return await this.transactionService.getByField('categoryId', categoryId);
  }

  // Budget operations
  async createBudget(budget: Partial<Budget>): Promise<string> {
    return await this.budgetService.create(budget);
  }

  async getBudgets(): Promise<Budget[]> {
    return await this.budgetService.getAll();
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return await this.budgetService.getById(id);
  }

  async updateBudget(id: string, updates: Partial<Budget>): Promise<void> {
    await this.budgetService.update(id, updates);
  }

  async deleteBudget(id: string): Promise<void> {
    await this.budgetService.delete(id);
  }

  async getActiveBudgets(): Promise<Budget[]> {
    const budgets = await this.getBudgets();
    return budgets.filter(b => b.isActive);
  }

  // Goal operations
  async createGoal(goal: Partial<Goal>): Promise<string> {
    return await this.goalService.create(goal);
  }

  async getGoals(): Promise<Goal[]> {
    return await this.goalService.getAll();
  }

  async getGoalById(id: string): Promise<Goal | null> {
    return await this.goalService.getById(id);
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    await this.goalService.update(id, updates);
  }

  async deleteGoal(id: string): Promise<void> {
    await this.goalService.delete(id);
  }

  // Analytics and reporting
  async getBudgetSummary(period: { start: string; end: string }): Promise<BudgetSummary> {
    const transactions = await this.getFilteredTransactions({
      dateRange: period,
    });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const budgets = await this.getActiveBudgets();
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      totalBudget,
      budgetUsed: expenses,
      budgetRemaining: totalBudget - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      period: {
        start: period.start,
        end: period.end,
        type: 'month', // Could be dynamic based on period length
      },
    };
  }

  async getCategorySpending(period: { start: string; end: string }): Promise<CategorySpending[]> {
    const transactions = await this.getFilteredTransactions({
      dateRange: period,
      type: 'expense',
    });

    const categories = await this.getCategories();
    const budgets = await this.getActiveBudgets();

    const categoryMap = new Map<string, CategorySpending>();

    transactions.forEach(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId);
      if (!category) return;

      const existing = categoryMap.get(transaction.categoryId) || {
        categoryId: transaction.categoryId,
        categoryName: category.name,
        amount: 0,
        percentage: 0,
        transactionCount: 0,
      };

      existing.amount += transaction.amount;
      existing.transactionCount += 1;

      const budget = budgets.find(b => b.categoryId === transaction.categoryId);
      if (budget) {
        existing.budgetAmount = budget.amount;
        existing.budgetUsedPercentage = (existing.amount / budget.amount) * 100;
      }

      categoryMap.set(transaction.categoryId, existing);
    });

    const result = Array.from(categoryMap.values());
    const totalExpenses = result.reduce((sum, c) => sum + c.amount, 0);

    // Calculate percentages
    result.forEach(category => {
      category.percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
    });

    return result.sort((a, b) => b.amount - a.amount);
  }

  async getMonthlyData(months: number = 12): Promise<MonthlyData[]> {
    const result: MonthlyData[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const transactions = await this.getFilteredTransactions({
        dateRange: { start: startDate, end: endDate },
      });

      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const budgets = await this.getActiveBudgets();
      const budgetAmount = budgets.reduce((sum, b) => sum + b.amount, 0);

      result.push({
        month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        income,
        expenses,
        net: income - expenses,
        budgetUsed: expenses,
      });
    }

    return result;
  }

  async getDailySpending(days: number = 30): Promise<DailySpending[]> {
    const result: DailySpending[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const transactions = await this.getFilteredTransactions({
        dateRange: { start: dateString, end: dateString },
        type: 'expense',
      });

      const amount = transactions.reduce((sum, t) => sum + t.amount, 0);

      result.push({
        date: dateString,
        amount,
        transactionCount: transactions.length,
      });
    }

    return result;
  }

  async getBudgetAlerts(): Promise<BudgetAlert[]> {
    const alerts: BudgetAlert[] = [];
    const budgets = await this.getActiveBudgets();
    const categories = await this.getCategories();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    for (const budget of budgets) {
      const category = categories.find(c => c.id === budget.categoryId);
      if (!category) continue;

      const transactions = await this.getFilteredTransactions({
        categoryIds: [budget.categoryId],
        dateRange: {
          start: startOfMonth.toISOString().split('T')[0],
          end: endOfMonth.toISOString().split('T')[0],
        },
        type: 'expense',
      });

      const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const percentage = (spent / budget.amount) * 100;

      if (percentage >= 100) {
        alerts.push({
          id: `budget_exceeded_${budget.id}`,
          type: 'budget_exceeded',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${category.name} budget by ${((percentage - 100)).toFixed(1)}%`,
          severity: 'error',
          relatedId: budget.id,
          createdAt: new Date().toISOString(),
          read: false,
          actionable: true,
        });
      } else if (percentage >= budget.alertThreshold) {
        alerts.push({
          id: `budget_warning_${budget.id}`,
          type: 'budget_warning',
          title: 'Budget Warning',
          message: `You've used ${percentage.toFixed(1)}% of your ${category.name} budget`,
          severity: 'warning',
          relatedId: budget.id,
          createdAt: new Date().toISOString(),
          read: false,
          actionable: true,
        });
      }
    }

    return alerts;
  }

  // Search functionality
  async searchTransactions(query: string): Promise<Transaction[]> {
    return await this.transactionService.search(query, ['description']);
  }

  // Export functionality
  async exportData(): Promise<{
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
    goals: Goal[];
  }> {
    const [transactions, categories, budgets, goals] = await Promise.all([
      this.getTransactions(),
      this.getCategories(),
      this.getBudgets(),
      this.getGoals(),
    ]);

    return { transactions, categories, budgets, goals };
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.transactionService.clear(),
      this.categoryService.clear(),
      this.budgetService.clear(),
      this.goalService.clear(),
    ]);
    await this.createDefaultCategories();
  }
}

export const BudgetService = new BudgetServiceClass(); 
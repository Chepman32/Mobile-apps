import { BaseEntity } from '../../../shared/services/DataService';

export interface Transaction extends BaseEntity {
  amount: number;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
  date: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: string;
  };
  tags?: string[];
}

export interface Category extends BaseEntity {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  parentId?: string;
  isDefault: boolean;
}

export interface Budget extends BaseEntity {
  name: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  isActive: boolean;
}

export interface Goal extends BaseEntity {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  description?: string;
  category: 'savings' | 'investment' | 'debt' | 'purchase';
  priority: 'low' | 'medium' | 'high';
}

export interface Account extends BaseEntity {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  isDefault: boolean;
  bankName?: string;
  accountNumber?: string; // masked
}

export interface RecurringTransaction extends BaseEntity {
  amount: number;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  isActive: boolean;
  accountId?: string;
}

export interface BudgetSettings {
  currency: string;
  currencySymbol: string;
  monthlyBudget?: number;
  savingsGoal?: number;
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
    recurringTransactions: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  savingsRate: number;
  period: {
    start: string;
    end: string;
    type: 'week' | 'month' | 'year';
  };
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  budgetAmount?: number;
  budgetUsedPercentage?: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
  budgetUsed: number;
}

export interface DailySpending {
  date: string;
  amount: number;
  transactionCount: number;
}

export interface BudgetAlert {
  id: string;
  type: 'budget_exceeded' | 'budget_warning' | 'goal_reminder' | 'recurring_due';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  relatedId?: string; // budgetId, goalId, etc.
  createdAt: string;
  read: boolean;
  actionable: boolean;
}

export type TransactionFilters = {
  type?: 'income' | 'expense';
  categoryIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  description?: string;
};

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export type ChartType = 'pie' | 'bar' | 'line' | 'doughnut';

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
    name?: string;
  }[];
}

export type SortOption = {
  field: keyof Transaction;
  direction: 'asc' | 'desc';
}; 
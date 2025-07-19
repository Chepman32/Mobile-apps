import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BudgetService } from '../services/BudgetService';
import {
  Transaction,
  Category,
  Budget,
  Goal,
  BudgetSummary,
  CategorySpending,
  BudgetAlert,
  TransactionFilters,
} from '../types';

interface BudgetContextType {
  // Data
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  summary: BudgetSummary | null;
  categorySpending: CategorySpending[];
  alerts: BudgetAlert[];

  // Loading states
  loading: boolean;
  transactionsLoading: boolean;
  categoriesLoading: boolean;
  budgetsLoading: boolean;

  // Actions
  addTransaction: (transaction: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getFilteredTransactions: (filters: TransactionFilters) => Promise<Transaction[]>;

  addCategory: (category: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addBudget: (budget: Partial<Budget>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  addGoal: (goal: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  refreshData: () => Promise<void>;
  refreshSummary: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  searchTransactions: (query: string) => Promise<Transaction[]>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [budgetsLoading, setBudgetsLoading] = useState(false);

  // Initialize the app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      await BudgetService.initialize();
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
        transactionsData,
        categoriesData,
        budgetsData,
        goalsData,
      ] = await Promise.all([
        BudgetService.getTransactions(),
        BudgetService.getCategories(),
        BudgetService.getBudgets(),
        BudgetService.getGoals(),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
      setGoals(goalsData);

      // Refresh derived data
      await refreshSummary();
      await refreshAlerts();
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

      const [summaryData, spendingData] = await Promise.all([
        BudgetService.getBudgetSummary(period),
        BudgetService.getCategorySpending(period),
      ]);

      setSummary(summaryData);
      setCategorySpending(spendingData);
    } catch (error) {
      console.error('Failed to refresh summary:', error);
    }
  };

  // Refresh alerts
  const refreshAlerts = async () => {
    try {
      const alertsData = await BudgetService.getBudgetAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
    }
  };

  // Transaction actions
  const addTransaction = async (transaction: Partial<Transaction>) => {
    try {
      setTransactionsLoading(true);
      await BudgetService.createTransaction(transaction);
      await refreshData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setTransactionsLoading(true);
      await BudgetService.updateTransaction(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setTransactionsLoading(true);
      await BudgetService.deleteTransaction(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getFilteredTransactions = async (filters: TransactionFilters) => {
    try {
      return await BudgetService.getFilteredTransactions(filters);
    } catch (error) {
      console.error('Failed to get filtered transactions:', error);
      return [];
    }
  };

  // Category actions
  const addCategory = async (category: Partial<Category>) => {
    try {
      setCategoriesLoading(true);
      await BudgetService.createCategory(category);
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
      await BudgetService.updateCategory(id, updates);
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
      await BudgetService.deleteCategory(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Budget actions
  const addBudget = async (budget: Partial<Budget>) => {
    try {
      setBudgetsLoading(true);
      await BudgetService.createBudget(budget);
      await refreshData();
    } catch (error) {
      console.error('Failed to add budget:', error);
      throw error;
    } finally {
      setBudgetsLoading(false);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      setBudgetsLoading(true);
      await BudgetService.updateBudget(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update budget:', error);
      throw error;
    } finally {
      setBudgetsLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      setBudgetsLoading(true);
      await BudgetService.deleteBudget(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      throw error;
    } finally {
      setBudgetsLoading(false);
    }
  };

  // Goal actions
  const addGoal = async (goal: Partial<Goal>) => {
    try {
      await BudgetService.createGoal(goal);
      await refreshData();
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      await BudgetService.updateGoal(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await BudgetService.deleteGoal(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  };

  // Utility functions
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  const searchTransactions = async (query: string) => {
    try {
      return await BudgetService.searchTransactions(query);
    } catch (error) {
      console.error('Failed to search transactions:', error);
      return [];
    }
  };

  const value: BudgetContextType = {
    // Data
    transactions,
    categories,
    budgets,
    goals,
    summary,
    categorySpending,
    alerts,

    // Loading states
    loading,
    transactionsLoading,
    categoriesLoading,
    budgetsLoading,

    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFilteredTransactions,

    addCategory,
    updateCategory,
    deleteCategory,

    addBudget,
    updateBudget,
    deleteBudget,

    addGoal,
    updateGoal,
    deleteGoal,

    refreshData,
    refreshSummary,
    getCategoryById,
    searchTransactions,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}; 
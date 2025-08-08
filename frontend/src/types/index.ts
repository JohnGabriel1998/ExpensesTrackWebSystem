export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    language: 'en' | 'jp';
    darkMode: boolean;
    currency: string;
  };
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Rent'
  | 'Gas'
  | 'Water'
  | 'Electric'
  | 'Food'
  | 'Shopping'
  | 'Transportation'
  | 'MoneyTransfer'
  | 'CreditCard'
  | 'Others';

export interface DashboardSummary {
  monthlyTotals: Array<{ _id: number; total: number; count: number }>;
  categoryBreakdown: Array<{ _id: string; total: number; count: number }>;
  recentExpenses: Expense[];
  currentMonthTotal: number;
  weeklyBreakdown: Array<{ _id: number; total: number; count: number }>;
  year: number;
}

export interface Salary {
  _id: string;
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    food: number;
    other: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    pension: number;
    other: number;
  };
  month: number;
  year: number;
  payDate: string;
  grossSalary: number;
  netSalary: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryAnalytics {
  salary: {
    gross: number;
    net: number;
    basicSalary: number;
    allowances: {
      housing: number;
      transport: number;
      food: number;
      other: number;
    };
    deductions: {
      tax: number;
      insurance: number;
      pension: number;
      other: number;
    };
  };
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    count: number;
  };
  savings: {
    amount: number;
    percentage: number;
  };
  suggestions: SavingSuggestion[];
}

export interface SavingSuggestion {
  type: 'critical' | 'improvement' | 'success' | 'category';
  priority: 'high' | 'medium' | 'low';
  message: string;
  recommendation: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
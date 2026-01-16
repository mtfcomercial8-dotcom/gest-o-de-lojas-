export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface MonthlyDataPoint {
  name: string;
  income: number;
  expense: number;
}

export interface InsightState {
  loading: boolean;
  content: string | null;
  error: string | null;
}

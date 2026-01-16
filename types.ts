
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  discount: number; // Porcentagem ou valor fixo
  tax: number; // Taxa (%)
  duty: number; // Imposto (%)
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

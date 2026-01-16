
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
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
  image?: string;
  categoryId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  productSupplied: string;
  totalValue: number; // Valor Total do Pedido/Contrato
  amountPaid: number; // Valor Já Pago
  status: 'paid' | 'debt'; // Status calculado
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

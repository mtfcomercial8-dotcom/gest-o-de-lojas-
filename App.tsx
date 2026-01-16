import React, { useState, useMemo } from 'react';
import { LayoutDashboard, List, PieChart as PieIcon, Plus, Menu, Package, PackagePlus } from 'lucide-react';
import { Transaction, MonthlyDataPoint, ChartDataPoint, Product } from './types';
import { StatCard } from './components/StatCard';
import { IncomeExpenseChart, CategoryPieChart } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { ProductForm } from './components/ProductForm';
import { Warehouse } from './components/Warehouse';

// Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Salário Mensal', amount: 500000, type: 'income', category: 'Salário', date: '2023-10-05' },
  { id: '2', title: 'Aluguel', amount: 180000, type: 'expense', category: 'Moradia', date: '2023-10-10' },
  { id: '3', title: 'Supermercado Semanal', amount: 45000, type: 'expense', category: 'Alimentação', date: '2023-10-12' },
  { id: '4', title: 'Freelance Design', amount: 120000, type: 'income', category: 'Freelance', date: '2023-10-15' },
  { id: '5', title: 'Táxi', amount: 4500, type: 'expense', category: 'Transporte', date: '2023-10-16' },
  { id: '6', title: 'Cinema e Jantar', amount: 18000, type: 'expense', category: 'Lazer', date: '2023-10-18' },
  { id: '7', title: 'Farmácia', amount: 8900, type: 'expense', category: 'Saúde', date: '2023-10-20' },
  { id: '8', title: 'Salário Mensal', amount: 500000, type: 'income', category: 'Salário', date: '2023-11-05' },
  { id: '9', title: 'Aluguel', amount: 180000, type: 'expense', category: 'Moradia', date: '2023-11-10' },
  { id: '10', title: 'Supermercado', amount: 62000, type: 'expense', category: 'Alimentação', date: '2023-11-12' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Arroz Tio João', unit: 'Saco 25kg', quantity: 50, purchasePrice: 12000, sellingPrice: 15000, discount: 0, tax: 14, duty: 2 },
  { id: '2', name: 'Óleo Vegetal', unit: 'Caixa 12x1L', quantity: 30, purchasePrice: 18000, sellingPrice: 24000, discount: 5, tax: 14, duty: 0 },
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'warehouse'>('dashboard');

  // Calculate stats
  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    const savings = income > 0 ? ((income - expense) / income) * 100 : 0;
    return { income, expense, balance, savings };
  }, [transactions]);

  // Process data for Monthly Chart
  const monthlyData: MonthlyDataPoint[] = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number }> = {};
    
    // Sort transactions by date first
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach(t => {
      const date = new Date(t.date);
      // Format as "Month" (e.g., "Out")
      const key = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      grouped[key][t.type] += t.amount;
    });

    return Object.entries(grouped).map(([name, vals]) => ({
      name,
      ...vals
    }));
  }, [transactions]);

  // Process data for Category Pie Chart (Expenses only)
  const categoryData: ChartDataPoint[] = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!grouped[t.category]) grouped[t.category] = 0;
        grouped[t.category] += t.amount;
      });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const product = {
      ...newProd,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts(prev => [product, ...prev]);
  };

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Visão Geral';
      case 'transactions': return 'Histórico de Transações';
      case 'warehouse': return 'Gestão de Armazém';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar / Mobile Nav */}
      <aside className="bg-white border-r border-slate-200 md:w-64 flex-shrink-0 flex flex-col fixed md:sticky top-0 h-16 md:h-screen w-full z-20 md:z-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <PieIcon className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">FinDash</h1>
          </div>
          <button className="md:hidden text-slate-500">
            <Menu />
          </button>
        </div>

        <nav className="hidden md:flex flex-col gap-1 p-4 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'transactions' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <List size={20} /> Transações
          </button>
          <button 
            onClick={() => setActiveTab('warehouse')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'warehouse' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Package size={20} /> Armazém
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {getPageTitle()}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta ao seu painel.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95"
          >
            {activeTab === 'warehouse' ? <PackagePlus size={18} /> : <Plus size={18} />}
            {activeTab === 'warehouse' ? 'Novo Produto' : 'Nova Transação'}
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Saldo Total" value={stats.balance} type="balance" />
              <StatCard title="Receitas (Mês)" value={stats.income} type="income" />
              <StatCard title="Despesas (Mês)" value={stats.expense} type="expense" />
              <StatCard title="Economia Estimada" value={stats.balance > 0 ? stats.balance : 0} type="savings" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Fluxo de Caixa Mensal</h3>
                  <IncomeExpenseChart data={monthlyData} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Despesas por Categoria</h3>
                    <CategoryPieChart data={categoryData} />
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Recentes</h3>
                      <button onClick={() => setActiveTab('transactions')} className="text-sm text-indigo-600 font-medium hover:underline">Ver tudo</button>
                    </div>
                    <div className="space-y-4">
                      {transactions.slice(0, 4).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center group">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {tx.type === 'income' ? <Plus size={16} /> : <div className="w-2 h-0.5 bg-current"></div>}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{tx.title}</p>
                              <p className="text-xs text-slate-400">{tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {tx.type === 'income' ? '+' : '-'} Kz {tx.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2">Dica Rápida</h4>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Manter suas despesas essenciais (moradia, alimentação) abaixo de 50% da sua renda total é uma ótima regra para saúde financeira a longo prazo.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Transactions List */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-800">
                        {tx.title}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`p-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'} Kz {tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Warehouse View */}
        {activeTab === 'warehouse' && (
          <Warehouse products={products} />
        )}

      </main>

      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around z-30 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={24} />
          Início
        </button>
        <button onClick={() => setActiveTab('warehouse')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'warehouse' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Package size={24} />
          Armazém
        </button>
        <button onClick={() => setIsFormOpen(true)} className="flex flex-col items-center gap-1 text-xs text-indigo-600 -mt-8">
          <div className="bg-indigo-600 text-white rounded-full p-4 shadow-lg shadow-indigo-200">
            {activeTab === 'warehouse' ? <PackagePlus size={24} /> : <Plus size={24} />}
          </div>
          Add
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'transactions' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <List size={24} />
          Transações
        </button>
      </div>

      {isFormOpen && (
        activeTab === 'warehouse' ? (
          <ProductForm onAdd={handleAddProduct} onClose={() => setIsFormOpen(false)} />
        ) : (
          <TransactionForm onAdd={handleAddTransaction} onClose={() => setIsFormOpen(false)} />
        )
      )}
    </div>
  );
}

export default App;

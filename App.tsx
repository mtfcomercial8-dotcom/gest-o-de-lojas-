import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, List, PieChart as PieIcon, Plus, Menu, Package, PackagePlus, Layers, Truck, ShoppingCart, Wallet, Calculator, Loader2, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { Transaction, MonthlyDataPoint, ChartDataPoint, Product, Category, Supplier } from './types';
import { StatCard } from './components/StatCard';
import { IncomeExpenseChart, CategoryPieChart } from './components/Charts';
import { TransactionForm } from './components/TransactionForm';
import { ProductForm } from './components/ProductForm';
import { CategoryForm } from './components/CategoryForm';
import { SupplierForm } from './components/SupplierForm';
import { Warehouse } from './components/Warehouse';
import { Categories } from './components/Categories';
import { Suppliers } from './components/Suppliers';
import { Sales } from './components/Sales';
import { CashRegister } from './components/CashRegister';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'warehouse' | 'sales' | 'cash' | 'categories' | 'suppliers'>('dashboard');

  // Handle Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data when Session exists
  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      // Fetch Transactions
      const { data: txData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (txData) {
        setTransactions(txData.map(t => ({
          ...t,
          productName: t.product_name
        })));
      }

      // Fetch Products
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prodData) {
        setProducts(prodData.map(p => ({
          ...p,
          purchasePrice: p.purchase_price,
          sellingPrice: p.selling_price,
          categoryId: p.category_id
        })));
      }

      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (catData) setCategories(catData);

      // Fetch Suppliers
      const { data: supData } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
      if (supData) {
        setSuppliers(supData.map(s => ({
          ...s,
          productSupplied: s.product_supplied,
          totalValue: s.total_value,
          amountPaid: s.amount_paid
        })));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTransactions([]);
    setProducts([]);
    setCategories([]);
    setSuppliers([]);
  };

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

  // --- Handlers ---

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase.from('transactions').insert([{
        title: newTx.title,
        amount: newTx.amount,
        type: newTx.type,
        category: newTx.category,
        date: newTx.date,
        // No manual ID, let DB generate UUID
      }]).select();

      if (error) throw error;

      if (data) {
        setTransactions(prev => [data[0], ...prev]);
      }
    } catch (e) {
      console.error('Error adding transaction:', e);
      alert('Erro ao salvar transação.');
    }
  };

  const handleClearSalesHistory = async () => {
    try {
      // Deleta transações onde a categoria é 'Vendas'
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('category', 'Vendas');

      if (error) throw error;

      // Atualiza estado local removendo as vendas
      setTransactions(prev => prev.filter(t => t.category !== 'Vendas'));
      alert('Histórico de vendas limpo com sucesso.');

    } catch (e) {
      console.error('Error clearing history:', e);
      alert('Erro ao limpar histórico.');
    }
  };

  const handleAddProduct = async (newProd: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase.from('products').insert([{
        name: newProd.name,
        unit: newProd.unit,
        quantity: newProd.quantity,
        purchase_price: newProd.purchasePrice,
        selling_price: newProd.sellingPrice,
        discount: newProd.discount,
        tax: newProd.tax,
        duty: newProd.duty,
        image: newProd.image,
        category_id: newProd.categoryId
      }]).select();

      if (error) throw error;

      if (data) {
         const mappedProduct = {
          ...data[0],
          purchasePrice: data[0].purchase_price,
          sellingPrice: data[0].selling_price,
          categoryId: data[0].category_id
        };
        setProducts(prev => [mappedProduct, ...prev]);
      }
    } catch (e) {
      console.error('Error adding product:', e);
      alert('Erro ao salvar produto.');
    }
  };

  const handleAddStock = async (productId: string, quantityToAdd: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQuantity = Number(product.quantity) + Number(quantityToAdd);

    try {
      const { error } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));
      
    } catch (e) {
      console.error('Error adding stock:', e);
      alert('Erro ao atualizar estoque.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este produto?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (e) {
        console.error('Error deleting product:', e);
        alert('Erro ao apagar produto.');
      }
    }
  };

  const handleAddCategory = async (newCat: Omit<Category, 'id'>, selectedProductIds: string[]) => {
    try {
      // 1. Create Category
      const { data: catData, error: catError } = await supabase.from('categories').insert([{
        name: newCat.name,
        description: newCat.description,
        image: newCat.image
      }]).select();

      if (catError) throw catError;
      if (!catData) return;

      const newCategory = catData[0];
      setCategories(prev => [newCategory, ...prev]);

      // 2. Update Products with new Category ID
      if (selectedProductIds.length > 0) {
        const { error: prodError } = await supabase.from('products')
          .update({ category_id: newCategory.id })
          .in('id', selectedProductIds);

        if (prodError) throw prodError;

        // Update local state
        setProducts(prev => prev.map(p => 
          selectedProductIds.includes(p.id) ? { ...p, categoryId: newCategory.id } : p
        ));
      }

    } catch (e) {
      console.error('Error creating category:', e);
      alert('Erro ao criar categoria.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar esta categoria?')) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;

        setCategories(prev => prev.filter(c => c.id !== id));
        // DB set null on delete automatically handles the foreign key if configured, 
        // but we update local state:
        setProducts(prev => prev.map(p => 
          p.categoryId === id ? { ...p, categoryId: undefined } : p
        ));
      } catch (e) {
        console.error('Error deleting category:', e);
      }
    }
  };

  const handleAddSupplier = async (newSupplier: Omit<Supplier, 'id'>) => {
    try {
      const { data, error } = await supabase.from('suppliers').insert([{
        name: newSupplier.name,
        product_supplied: newSupplier.productSupplied,
        total_value: newSupplier.totalValue,
        amount_paid: newSupplier.amountPaid,
        status: newSupplier.status
      }]).select();

      if (error) throw error;
      if (data) {
         const mappedSupplier = {
          ...data[0],
          productSupplied: data[0].product_supplied,
          totalValue: data[0].total_value,
          amountPaid: data[0].amount_paid
        };
        setSuppliers(prev => [mappedSupplier, ...prev]);
      }
    } catch (e) {
       console.error('Error adding supplier:', e);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este fornecedor?')) {
      try {
        const { error } = await supabase.from('suppliers').delete().eq('id', id);
        if (error) throw error;
        setSuppliers(prev => prev.filter(s => s.id !== id));
      } catch (e) {
        console.error('Error deleting supplier:', e);
      }
    }
  };

  const handleSale = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.quantity < quantity) {
      alert("Erro: Quantidade insuficiente em estoque.");
      return;
    }

    const totalSaleValue = product.sellingPrice * quantity;
    const newQuantity = product.quantity - quantity;

    try {
      // 1. Atualizar estoque no Supabase
      const { error: prodError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', productId);

      if (prodError) throw prodError;

      // 2. Adicionar Transação de Venda
      const { data: txData, error: txError } = await supabase.from('transactions').insert([{
        title: `Venda: ${product.name}`,
        amount: totalSaleValue,
        type: 'income',
        category: 'Vendas',
        date: new Date().toISOString().split('T')[0],
        product_name: product.name,
        quantity: quantity
      }]).select();

      if (txError) throw txError;

      // 3. Atualizar Estado Local
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ));

      if (txData) {
         const newTx = {
           ...txData[0],
           productName: txData[0].product_name
         };
         setTransactions(prev => [newTx, ...prev]);
      }

      alert("Venda realizada com sucesso!");

    } catch (e) {
      console.error('Error processing sale:', e);
      alert('Erro ao processar venda. Verifique sua conexão.');
    }
  };

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Visão Geral';
      case 'transactions': return 'Histórico de Vendas';
      case 'warehouse': return 'Gestão de Armazém';
      case 'sales': return 'Vendas';
      case 'cash': return 'Caixa';
      case 'categories': return 'Categorias de Produtos';
      case 'suppliers': return 'Gestão de Fornecedores';
      default: return '';
    }
  };

  const getAddButtonLabel = () => {
    if (activeTab === 'warehouse') return 'Novo Produto';
    if (activeTab === 'categories') return 'Nova Categoria';
    if (activeTab === 'suppliers') return 'Novo Fornecedor';
    if (activeTab === 'sales') return 'Vender'; 
    if (activeTab === 'cash') return 'Nova Entrada';
    return 'Nova Transação';
  }

  const getAddButtonIcon = () => {
     if (activeTab === 'warehouse') return <PackagePlus size={18} />;
     if (activeTab === 'categories') return <Layers size={18} />;
     if (activeTab === 'suppliers') return <Truck size={18} />;
     if (activeTab === 'sales') return <ShoppingCart size={18} />;
     return <Plus size={18} />;
  }

  const renderForm = () => {
    if (activeTab === 'warehouse') {
      return <ProductForm onAdd={handleAddProduct} onClose={() => setIsFormOpen(false)} />;
    }
    if (activeTab === 'categories') {
      return <CategoryForm products={products} onAdd={handleAddCategory} onClose={() => setIsFormOpen(false)} />;
    }
    if (activeTab === 'suppliers') {
      return <SupplierForm onAdd={handleAddSupplier} onClose={() => setIsFormOpen(false)} />;
    }
    // Sales and Cash use default or internal
    return <TransactionForm onAdd={handleAddTransaction} onClose={() => setIsFormOpen(false)} />;
  };

  // Helper para formatar moeda
  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  // Filtrar transações apenas de vendas para a aba de transações
  const salesTransactions = useMemo(() => {
    return transactions.filter(t => t.category === 'Vendas' || t.productName);
  }, [transactions]);
  
  const totalSalesValue = useMemo(() => {
    return salesTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [salesTransactions]);

  // Loading State for Auth Check
  if (isAuthChecking) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
       </div>
    );
  }

  // If not authenticated, show Auth Screen
  if (!session) {
    return <Auth />;
  }

  // If authenticated but data loading (optional visual)
  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-4">
        <Loader2 size={48} className="animate-spin" />
        <p className="text-slate-600 font-medium animate-pulse">Sincronizando seus dados financeiros...</p>
      </div>
    );
  }

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
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'sales' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} /> Vendas
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'transactions' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <List size={20} /> Transações
          </button>
          <button 
            onClick={() => setActiveTab('cash')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'cash' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Wallet size={20} /> Caixa
          </button>
          <button 
            onClick={() => setActiveTab('warehouse')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'warehouse' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Package size={20} /> Armazém
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'categories' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Layers size={20} /> Categorias
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'suppliers' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Truck size={20} /> Fornecedores
          </button>
        </nav>

        {/* Logout Button (Desktop) */}
        <div className="hidden md:block p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {session.user.email?.substring(0,2).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-slate-900 truncate">{session.user.email}</p>
             </div>
           </div>
           <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium text-sm"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-0 p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {getPageTitle()}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Bem-vindo de volta ao seu painel.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             {/* Logout Mobile */}
            <button 
               onClick={handleLogout}
               className="md:hidden p-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-200"
            >
              <LogOut size={20} />
            </button>

            {activeTab !== 'sales' && activeTab !== 'cash' && activeTab !== 'transactions' && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {getAddButtonIcon()}
                {getAddButtonLabel()}
              </button>
            )}
          </div>
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
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6">Data</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Quantidade</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500">
                          Nenhuma venda registrada até o momento.
                        </td>
                      </tr>
                    ) : (
                      salesTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 pl-6 text-sm text-slate-600 whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-800">
                            {tx.productName || tx.title.replace('Venda: ', '')}
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                              {tx.quantity || 1} un
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-sm font-bold text-right text-emerald-600">
                             {formatKz(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Footer */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/10 rounded-xl">
                   <Calculator className="text-emerald-400" size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Total de Transações</h3>
                   <p className="text-slate-400 text-sm">Somatório de todos os produtos vendidos</p>
                 </div>
              </div>
              <div className="text-3xl font-bold text-emerald-400">
                {formatKz(totalSalesValue)}
              </div>
            </div>
          </div>
        )}

        {/* Warehouse View */}
        {activeTab === 'warehouse' && (
          <Warehouse products={products} onDelete={handleDeleteProduct} onUpdateStock={handleAddStock} />
        )}

        {/* Sales View */}
        {activeTab === 'sales' && (
          <Sales products={products} onSell={handleSale} />
        )}

        {/* Cash Register View */}
        {activeTab === 'cash' && (
          <CashRegister transactions={transactions} onClearHistory={handleClearSalesHistory} />
        )}

        {/* Categories View */}
        {activeTab === 'categories' && (
          <Categories categories={categories} products={products} onDelete={handleDeleteCategory} />
        )}

        {/* Suppliers View */}
        {activeTab === 'suppliers' && (
          <Suppliers suppliers={suppliers} onDelete={handleDeleteSupplier} />
        )}

      </main>

      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around z-30 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
        </button>
        <button onClick={() => setActiveTab('sales')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'sales' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <ShoppingCart size={20} />
        </button>
        <button onClick={() => setIsFormOpen(true)} className="flex flex-col items-center gap-1 text-xs text-indigo-600 -mt-8">
          <div className="bg-indigo-600 text-white rounded-full p-3 shadow-lg shadow-indigo-200">
             {activeTab === 'categories' ? <Layers size={20} /> : (activeTab === 'warehouse' ? <PackagePlus size={20} /> : (activeTab === 'suppliers' ? <Truck size={20} /> : <Plus size={20} />))}
          </div>
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'transactions' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <List size={20} />
        </button>
        <button onClick={() => setActiveTab('warehouse')} className={`flex flex-col items-center gap-1 text-xs ${activeTab === 'warehouse' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Package size={20} />
        </button>
      </div>

      {isFormOpen && renderForm()}
    </div>
  );
}

export default App;

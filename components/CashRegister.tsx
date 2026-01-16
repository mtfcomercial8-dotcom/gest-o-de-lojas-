import React from 'react';
import { Wallet, TrendingUp, Calendar, Package, ShoppingBag, Trash2 } from 'lucide-react';
import { Transaction } from '../types';

interface CashRegisterProps {
  transactions: Transaction[];
  onClearHistory: () => void;
}

export const CashRegister: React.FC<CashRegisterProps> = ({ transactions, onClearHistory }) => {
  // Filtra apenas transações que são vendas (Categoria 'Vendas' ou que tenham productName definido)
  const salesTransactions = transactions.filter(
    t => t.type === 'income' && (t.category === 'Vendas' || t.productName)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSales = salesTransactions.reduce((acc, t) => acc + t.amount, 0);

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  const handleClearClick = () => {
    if (window.confirm("ATENÇÃO: Isso apagará permanentemente todo o histórico de vendas. Deseja continuar?")) {
      onClearHistory();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Totais */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-indigo-300" /> Caixa de Vendas
          </h2>
          <p className="text-indigo-100 mt-2 opacity-90">
            Registro detalhado de todo dinheiro entrante via vendas de produtos.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-xl border border-white/20 text-center min-w-[200px]">
          <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mb-1">Total Arrecadado</p>
          <p className="text-3xl font-bold">{formatKz(totalSales)}</p>
        </div>
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-indigo-600 w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-800">Histórico de Vendas</h3>
          </div>
          {salesTransactions.length > 0 && (
            <button 
              onClick={handleClearClick}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Limpar Histórico
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6">Data</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto Vendido</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Quantidade</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="text-slate-300" />
                      </div>
                      <p>Nenhuma venda registrada no caixa ainda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                salesTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800 flex items-center gap-2">
                        <Package size={16} className="text-indigo-500" />
                        {tx.productName || tx.title.replace('Venda: ', '')}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                        {tx.quantity ? `${tx.quantity} un` : '-'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right font-bold text-emerald-600">
                      + {formatKz(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

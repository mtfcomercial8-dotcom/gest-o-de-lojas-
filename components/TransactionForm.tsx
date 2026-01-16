import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date
    });
    onClose();
  };

  const expenseCategories = ['Alimentação', 'Moradia', 'Transporte', 'Lazer', 'Saúde', 'Outros'];
  const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Nova Transação</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
              >
                Receita
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: Supermercado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor (Kz)</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};
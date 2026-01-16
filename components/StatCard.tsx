import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  type: 'balance' | 'income' | 'expense' | 'savings';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, type }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(val);
  };

  const getIcon = () => {
    switch (type) {
      case 'income': return <ArrowUpRight className="w-5 h-5 text-emerald-500" />;
      case 'expense': return <ArrowDownRight className="w-5 h-5 text-rose-500" />;
      case 'balance': return <Wallet className="w-5 h-5 text-indigo-500" />;
      case 'savings': return <DollarSign className="w-5 h-5 text-amber-500" />;
    }
  };

  const getBgColor = () => {
     switch (type) {
      case 'income': return 'bg-emerald-50';
      case 'expense': return 'bg-rose-50';
      case 'balance': return 'bg-indigo-50';
      case 'savings': return 'bg-amber-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(value)}</h3>
      </div>
      <div className={`p-3 rounded-full ${getBgColor()}`}>
        {getIcon()}
      </div>
    </div>
  );
};
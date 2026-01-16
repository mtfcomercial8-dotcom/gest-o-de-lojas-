import React, { useState, useEffect } from 'react';
import { Truck, X, User, Package, AlertCircle, CheckCircle, Calculator } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierFormProps {
  onAdd: (supplier: Omit<Supplier, 'id'>) => void;
  onClose: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    productSupplied: '',
    totalValue: '',
    amountPaid: '',
  });

  const [status, setStatus] = useState<'paid' | 'debt'>('paid');
  const [remainingDebt, setRemainingDebt] = useState(0);

  // Calcula o restante e o status automaticamente
  useEffect(() => {
    const total = parseFloat(formData.totalValue) || 0;
    const paid = parseFloat(formData.amountPaid) || 0;
    const remaining = Math.max(0, total - paid);
    
    setRemainingDebt(remaining);

    if (remaining > 0.01) { // Usando pequena margem para evitar erros de ponto flutuante
      setStatus('debt');
    } else {
      setStatus('paid');
    }
  }, [formData.totalValue, formData.amountPaid]);

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.productSupplied) return;

    const total = parseFloat(formData.totalValue) || 0;
    const paid = parseFloat(formData.amountPaid) || 0;
    const remaining = Math.max(0, total - paid);

    onAdd({
      name: formData.name,
      productSupplied: formData.productSupplied,
      totalValue: total,
      amountPaid: paid,
      status: remaining > 0.01 ? 'debt' : 'paid',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-indigo-600" /> Novo Fornecedor
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status Preview Card */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-colors ${
            status === 'debt' 
              ? 'bg-rose-50 border-rose-100' 
              : 'bg-emerald-50 border-emerald-100'
          }`}>
            <div className="flex items-center gap-3">
              {status === 'debt' ? 
                <AlertCircle size={24} className="text-rose-600" /> : 
                <CheckCircle size={24} className="text-emerald-600" />
              }
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider ${status === 'debt' ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {status === 'debt' ? 'Pagamento Pendente' : 'Totalmente Pago'}
                </p>
                {status === 'debt' && (
                  <p className="font-medium text-rose-800 text-lg mt-1">
                     Faltam: {formatKz(remainingDebt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Fornecedor</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Distribuidora Silva"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Produto Fornecido</label>
            <div className="relative">
              <Package className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="productSupplied"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Bebidas Diversas"
                value={formData.productSupplied}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor Total do Pedido</label>
              <div className="relative">
                <Calculator className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  name="totalValue"
                  min="0"
                  step="0.01"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="0,00"
                  value={formData.totalValue}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-600 uppercase mb-1">Valor Já Pago</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-2.5 text-emerald-500/50 w-4 h-4" />
                <input
                  type="number"
                  name="amountPaid"
                  min="0"
                  step="0.01"
                  className="w-full pl-9 pr-3 py-2 border border-emerald-200 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-800 font-medium"
                  placeholder="0,00"
                  value={formData.amountPaid}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
             <span>O sistema calculará a diferença automaticamente.</span>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Truck size={20} /> Salvar Fornecedor
          </button>
        </form>
      </div>
    </div>
  );
};

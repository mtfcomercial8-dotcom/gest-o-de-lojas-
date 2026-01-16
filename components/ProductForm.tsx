import React, { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  onAdd: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    quantity: '',
    purchasePrice: '',
    sellingPrice: '',
    discount: '0',
    tax: '0',
    duty: '0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.unit || !formData.quantity) return;

    onAdd({
      name: formData.name,
      unit: formData.unit,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      discount: parseFloat(formData.discount) || 0,
      tax: parseFloat(formData.tax) || 0,
      duty: parseFloat(formData.duty) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PackagePlus className="text-indigo-600" /> Novo Produto
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Cimento Portland"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
              <input
                type="text"
                name="unit"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Kg, Saco, Unidade, Caixa"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço de Compra (Kz)</label>
              <input
                type="number"
                name="purchasePrice"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0,00"
                value={formData.purchasePrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço de Venda (Kz)</label>
              <input
                type="number"
                name="sellingPrice"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0,00"
                value={formData.sellingPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Taxas e Descontos (%)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Desconto</label>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Taxa</label>
                <input
                  type="number"
                  name="tax"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.tax}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Imposto</label>
                <input
                  type="number"
                  name="duty"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.duty}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <PackagePlus size={20} /> Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Package, TrendingUp, Trash2, ImageOff } from 'lucide-react';
import { Product } from '../types';

interface WarehouseProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export const Warehouse: React.FC<WarehouseProps> = ({ products, onDelete }) => {
  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  const totalStockValue = products.reduce((acc, p) => acc + (p.purchasePrice * p.quantity), 0);
  const totalPotentialRevenue = products.reduce((acc, p) => acc + (p.sellingPrice * p.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Valor Total em Estoque (Custo)</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatKz(totalStockValue)}</h3>
          </div>
          <div className="p-3 rounded-full bg-blue-50">
            <Package className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Potencial de Venda</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatKz(totalPotentialRevenue)}</h3>
          </div>
          <div className="p-3 rounded-full bg-emerald-50">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Inventário</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6">Produto</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Qtd.</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Preço Compra</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Preço Venda</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Taxas</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total (Venda)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Nenhum produto cadastrado no armazém.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{p.name}</div>
                          <div className="text-xs text-slate-400">Unidade: {p.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-700">
                      {p.quantity}
                    </td>
                    <td className="p-4 text-right text-slate-600">
                      {formatKz(p.purchasePrice)}
                    </td>
                    <td className="p-4 text-right text-emerald-600 font-medium">
                      {formatKz(p.sellingPrice)}
                    </td>
                    <td className="p-4 text-center text-xs text-slate-500">
                      <div>Desc: {p.discount}%</div>
                      <div>Taxa: {p.tax}%</div>
                      <div>Imp: {p.duty}%</div>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800">
                      {formatKz(p.sellingPrice * p.quantity)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onDelete(p.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg transition-colors mx-auto"
                        title="Excluir produto"
                      >
                        <Trash2 size={16} />
                        <span>Apagar</span>
                      </button>
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
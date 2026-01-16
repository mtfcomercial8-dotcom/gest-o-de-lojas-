import React from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface WarehouseProps {
  products: Product[];
}

export const Warehouse: React.FC<WarehouseProps> = ({ products }) => {
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
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produto</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Qtd.</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Preço Compra</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Preço Venda</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Taxas</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total (Venda)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum produto cadastrado no armazém.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-400">Unidade: {p.unit}</div>
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

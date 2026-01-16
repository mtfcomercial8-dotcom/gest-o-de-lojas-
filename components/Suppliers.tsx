import React from 'react';
import { Truck, Trash2, AlertCircle, CheckCircle, Package, DollarSign, Wallet } from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersProps {
  suppliers: Supplier[];
  onDelete: (id: string) => void;
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onDelete }) => {
  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  return (
    <div className="space-y-6">
      {suppliers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 border-dashed">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Truck className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum fornecedor registrado</h3>
          <p className="text-slate-500">Cadastre seus fornecedores para controlar pagamentos e dívidas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map(supplier => {
            const remainingDebt = Math.max(0, supplier.totalValue - supplier.amountPaid);
            const isDebt = remainingDebt > 0.01;

            return (
              <div 
                key={supplier.id} 
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden relative flex flex-col hover:shadow-md transition-shadow ${
                  isDebt ? 'border-rose-100' : 'border-emerald-100'
                }`}
              >
                {/* Status Banner */}
                <div className={`px-6 py-3 flex items-center gap-2 border-b ${
                  isDebt 
                    ? 'bg-rose-50 text-rose-700 border-rose-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {isDebt ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {isDebt ? 'Pagamento Pendente' : 'Totalmente Pago'}
                  </span>
                </div>

                <div className="p-6 flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{supplier.name}</h3>
                  
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <Package size={16} />
                    <span>{supplier.productSupplied}</span>
                  </div>

                  <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                    {/* Linha Valor Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                        <Wallet size={12} /> Valor Total
                      </span>
                      <span className="font-semibold text-slate-700">{formatKz(supplier.totalValue)}</span>
                    </div>

                    <div className="w-full h-px bg-slate-200"></div>

                    {/* Linha Pago */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                        <CheckCircle size={12} /> Pago
                      </span>
                      <span className="font-semibold text-emerald-600">{formatKz(supplier.amountPaid)}</span>
                    </div>

                    {/* Linha Dívida Restante (Só aparece se houver dívida) */}
                    {isDebt && (
                      <>
                        <div className="w-full h-px bg-rose-200"></div>
                        <div className="flex justify-between items-center bg-rose-50 -mx-4 -mb-4 p-4 rounded-b-xl mt-1 border-t border-rose-100">
                          <span className="text-xs font-bold text-rose-600 uppercase flex items-center gap-1">
                            <AlertCircle size={12} /> Dívida Restante
                          </span>
                          <span className="font-bold text-rose-600">{formatKz(remainingDebt)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-50">
                  <button 
                    onClick={() => onDelete(supplier.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Apagar Fornecedor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

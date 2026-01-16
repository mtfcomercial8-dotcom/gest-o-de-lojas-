import React, { useState } from 'react';
import { ShoppingCart, Package, X, Check, AlertCircle, ImageOff, TrendingUp, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface SalesProps {
  products: Product[];
  onSell: (productId: string, quantity: number) => void;
}

export const Sales: React.FC<SalesProps> = ({ products, onSell }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>('1');

  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity('1');
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity('1');
  };

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = parseInt(quantity);
    if (qty > 0 && qty <= selectedProduct.quantity) {
      onSell(selectedProduct.id, qty);
      handleCloseModal();
    }
  };

  const incrementQty = () => {
    if (selectedProduct) {
      const current = parseInt(quantity) || 0;
      if (current < selectedProduct.quantity) {
        setQuantity(String(current + 1));
      }
    }
  };

  const decrementQty = () => {
    const current = parseInt(quantity) || 0;
    if (current > 1) {
      setQuantity(String(current - 1));
    }
  };

  const qtyInt = parseInt(quantity) || 0;
  const totalValue = selectedProduct ? selectedProduct.sellingPrice * qtyInt : 0;
  const isValid = selectedProduct ? (qtyInt > 0 && qtyInt <= selectedProduct.quantity) : false;

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" /> Ponto de Venda
            </h3>
            <p className="text-indigo-100 max-w-xl">
              Selecione um produto do estoque para realizar uma venda. O sistema atualizará automaticamente o inventário e registrará a receita financeira.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-sm text-indigo-200 uppercase tracking-wider font-semibold">Produtos Disponíveis</div>
            <div className="text-3xl font-bold">{products.filter(p => p.quantity > 0).length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${product.quantity === 0 ? 'opacity-60 grayscale' : ''}`}>
            <div className="h-40 bg-slate-100 relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <ImageOff className="text-slate-300 w-10 h-10" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                Estoque: {product.quantity}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1 line-clamp-1" title={product.name}>{product.name}</h4>
                <p className="text-xs text-slate-500 mb-3">{product.unit}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-slate-400">Preço:</span>
                  <span className="text-lg font-bold text-emerald-600">{formatKz(product.sellingPrice)}</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal(product)}
                disabled={product.quantity === 0}
                className={`mt-4 w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  product.quantity === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {product.quantity === 0 ? (
                  <>Sem Estoque</>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Vender
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sale Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" /> Confirmar Venda
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="flex items-center gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                 {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="text-slate-300" />
                  )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{selectedProduct.name}</h4>
                <p className="text-sm text-slate-500">Disponível: {selectedProduct.quantity} {selectedProduct.unit}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSale} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade a Vender</label>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decrementQty}
                    disabled={qtyInt <= 1}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                       qtyInt <= 1 
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Minus size={20} />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`w-full px-4 py-3 text-lg font-bold text-center border rounded-xl outline-none focus:ring-2 transition-all ${
                        !isValid ? 'border-rose-300 focus:ring-rose-200 text-rose-600' : 'border-slate-200 focus:ring-indigo-500 text-slate-800'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">
                      /{selectedProduct.quantity}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={incrementQty}
                    disabled={qtyInt >= selectedProduct.quantity}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                       qtyInt >= selectedProduct.quantity 
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                {!isValid && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-1 justify-center">
                    <AlertCircle size={12} /> Quantidade inválida ou superior ao estoque disponível.
                  </p>
                )}
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-800">Total da Venda</span>
                <span className="text-xl font-bold text-emerald-600">{formatKz(totalValue)}</span>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${
                  !isValid 
                    ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:-translate-y-0.5'
                }`}
              >
                <Check size={20} /> Confirmar Venda
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

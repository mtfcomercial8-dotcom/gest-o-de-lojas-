import React from 'react';
import { Layers, Trash2, Box, ImageOff } from 'lucide-react';
import { Category, Product } from '../types';

interface CategoriesProps {
  categories: Category[];
  products: Product[];
  onDelete: (id: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ categories, products, onDelete }) => {
  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <div className="space-y-6">
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 border-dashed">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Layers className="text-slate-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma categoria criada</h3>
          <p className="text-slate-500">Crie categorias para organizar melhor o seu armazém.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="h-40 bg-slate-100 relative">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <ImageOff className="text-slate-300 w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                  <Box size={12} className="text-indigo-600" />
                  {getProductCount(category.id)} Produtos
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">
                  {category.description || "Sem descrição."}
                </p>
                
                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => onDelete(category.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors shadow-lg shadow-rose-100"
                  >
                    <Trash2 size={16} />
                    Apagar Categoria
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

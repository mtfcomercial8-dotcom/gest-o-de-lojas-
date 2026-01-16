import React, { useState } from 'react';
import { Layers, Upload, X, CheckSquare, Square } from 'lucide-react';
import { Category, Product } from '../types';

interface CategoryFormProps {
  products: Product[];
  onAdd: (category: Omit<Category, 'id'>, selectedProductIds: string[]) => void;
  onClose: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ products, onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProductIds);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProductIds(newSelection);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd({
      name: formData.name,
      description: formData.description,
      image: imagePreview || undefined,
    }, Array.from(selectedProductIds));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-indigo-600" /> Nova Categoria
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2">
          {/* Image Upload */}
          <div className="flex justify-center">
            <div className="relative group">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-slate-200 aspect-video">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 px-12 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500" />
                  <span className="text-sm text-slate-500 font-medium">Imagem de Capa (Opcional)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Categoria</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Materiais de Construção"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição (Opcional)</label>
            <textarea
              name="description"
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Breve descrição desta categoria..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Product Selection */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h4 className="font-semibold text-slate-700 text-sm">Adicionar Produtos Existentes</h4>
              <p className="text-xs text-slate-500">Selecione os produtos para incluir nesta categoria</p>
            </div>
            <div className="max-h-48 overflow-y-auto p-2 bg-white space-y-1">
              {products.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-4">Nenhum produto cadastrado no armazém.</p>
              ) : (
                products.map(product => {
                  const isSelected = selectedProductIds.has(product.id);
                  return (
                    <div 
                      key={product.id}
                      onClick={() => toggleProductSelection(product.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                    >
                      <div className={`text-indigo-600 ${isSelected ? 'opacity-100' : 'opacity-40'}`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{product.name}</p>
                        <p className="text-xs text-slate-400">Qtd: {product.quantity} • {product.unit}</p>
                      </div>
                      {product.categoryId && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          Já possui categoria
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Layers size={20} /> Criar Categoria
          </button>
        </form>
      </div>
    </div>
  );
};

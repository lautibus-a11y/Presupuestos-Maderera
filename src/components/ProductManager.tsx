import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Package, AlertCircle, Search, X } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';

interface ProductManagerProps {
  products: Product[];
  onAction: (action: 'add' | 'edit' | 'delete', product: Partial<Product>) => void;
}

export function ProductManager({ products, onAction }: ProductManagerProps) {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onAction('delete', { id });
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Catálogo</h1>
          <p className="text-slate-500 text-sm font-medium">Gestiona tus productos y precios</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2 font-bold text-sm"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Nuevo Producto</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
        />
      </div>

      {/* ── VERSION ESCRITORIO: TABLA (RESTAURADA) ── */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Precio / Unidad</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-black text-slate-800 uppercase text-sm tracking-tight">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-md uppercase">{product.type}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-black text-slate-800">{formatCurrency(product.price)}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">por {product.unit}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteId(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── VERSION MÓVIL: TARJETAS (MANTENIDA) ── */}
      <div className="md:hidden grid gap-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded mb-1 inline-block">{product.type}</span>
              <p className="font-black text-slate-800 text-sm uppercase truncate leading-tight">{product.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{formatCurrency(product.price)} / {product.unit}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-300 hover:text-amber-600"><Pencil size={18} /></button>
              <button onClick={() => setDeleteId(product.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edición (Adaptable) */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Package className="text-amber-600" size={24} />
              {isAdding ? 'Nuevo Producto' : 'Editar Producto'}
            </h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData.entries());
              onAction(isAdding ? 'add' : 'edit', { ...editingProduct, ...data, price: parseFloat(data.price as string) });
              resetForm();
            }}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 px-1 tracking-widest">Nombre</label>
                <input name="name" required defaultValue={editingProduct?.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 px-1 tracking-widest">Categoría</label>
                  <select name="type" required defaultValue={editingProduct?.type || 'Construcción'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none">
                    <option>Construcción</option><option>Madera Aserrada</option><option>Machimbres</option><option>Placas</option><option>Carpintería</option><option>Exterior</option><option>Insumos</option><option>Terminados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 px-1 tracking-widest">Unidad</label>
                  <select name="unit" required defaultValue={editingProduct?.unit || 'un.'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none appearance-none">
                    <option value="un.">Unidad</option><option value="m">Metro</option><option value="m2">m²</option><option value="ml">Lineal</option><option value="placa">Placa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 px-1 tracking-widest">Precio Unitario ($)</label>
                <input name="price" type="number" step="0.01" required defaultValue={editingProduct?.price} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-stone-900 text-white font-bold text-sm shadow-xl">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de Borrado */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center">
             <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">¿Eliminar producto?</h3>
             <p className="text-slate-500 text-sm mb-6 font-medium">Esta acción quitará el producto permanentemente.</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteId(null)} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">Cancelar</button>
               <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm">Sí, borrar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

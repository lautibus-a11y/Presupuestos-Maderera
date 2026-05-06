import React, { useState } from 'react';
import { Plus, Trash2, Pencil, Package, AlertCircle } from 'lucide-react';
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

  const resetForm = () => {
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onAction('delete', { id });
    setDeleteId(null);
  };

  return (
    <div className="view-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Productos</h1>
        {!isAdding && !editingProduct && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Agregar Producto
          </button>
        )}
      </div>

      {(isAdding || editingProduct) && (
        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-amber-100 mb-8 overflow-hidden">
          <h2 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
            <Package size={20} className="text-amber-600" />
            {isAdding ? 'Nuevo Producto' : 'Editar Producto'}
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            onAction(isAdding ? 'add' : 'edit', { 
              ...editingProduct, 
              ...data, 
              price: parseFloat(data.price as string), 
              stock: data.stock ? parseFloat(data.stock as string) : undefined 
            });
            resetForm();
          }}>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre</label>
              <input name="name" required defaultValue={editingProduct?.name} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none" placeholder="Nombre del producto" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
              <select name="type" required defaultValue={editingProduct?.type || 'Tirante'} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none bg-white">
                <option>Tirante</option>
                <option>Viga</option>
                <option>Columna</option>
                <option>Tabla</option>
                <option>Tablón</option>
                <option>Machimbre</option>
                <option>Listón</option>
                <option>Revestimiento</option>
                <option>Zócalo</option>
                <option>Placa</option>
                <option>Madera Dura</option>
                <option>Insumos</option>
                <option>Subproducto</option>
                <option>Exterior</option>
                <option>Terminado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Precio x Unidad/Medida</label>
              <input name="price" type="number" step="0.01" required defaultValue={editingProduct?.price} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>
             <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unidad de Venta</label>
              <select name="unit" required defaultValue={editingProduct?.unit || 'unidad'} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none bg-white">
                <option value="unidad">Por Unidad</option>
                <option value="metro">Por Metro</option>
                <option value="metro m2">Por m²</option>
                <option value="ml">Metro Lineal</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm transition-colors">Cancelar</button>
              <button type="submit" className="bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-amber-800 transition-colors">
                {isAdding ? 'Guardar Producto' : 'Actualizar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Precio</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No hay productos en el catálogo</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 uppercase tracking-tighter">{product.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold uppercase">{product.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-800">{formatCurrency(product.price)}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">por {product.unit}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setEditingProduct(product)} 
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteId(product.id)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">¿Eliminar producto?</h3>
            </div>
            <p className="text-slate-600 mb-6 text-sm">
              Esta acción no se puede deshacer. Si el producto está en presupuestos existentes, la eliminación podría fallar o causar inconsistencias.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

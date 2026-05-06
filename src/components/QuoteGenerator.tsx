import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, Trash2, Save, Plus, X, Package, User, Hash } from 'lucide-react';
import { Product, QuoteItem } from '../types';
import { formatCurrency } from '../lib/utils';

interface QuoteGeneratorProps {
  products: Product[];
  onSubmit: (q: any) => void;
  onCancel: () => void;
}

export function QuoteGenerator({ products, onSubmit, onCancel }: QuoteGeneratorProps) {
  const [items, setItems] = useState<Partial<QuoteItem>[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Filtrado inteligente
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Mostramos solo los 5 más relevantes para no saturar
  }, [searchTerm, products]);

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] || 1;
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id
          ? { ...item, quantity: (item.quantity || 0) + qty, subtotal: ((item.quantity || 0) + qty) * (item.unitPrice || 0) }
          : item
        );
      }
      return [...prev, {
        productId: product.id,
        quantity: qty,
        unitPrice: product.price,
        subtotal: qty * product.price,
        product
      }];
    });
    // Limpiar búsqueda y cantidad después de agregar
    setSearchTerm('');
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ── CAJA ÚNICA DE PRESUPUESTO ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Encabezado: Cliente */}
        <div className="bg-slate-900 p-6 md:p-8 text-white">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
               <Package className="text-amber-500" size={24} />
               Nuevo Presupuesto
             </h2>
             <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
               <X size={24} />
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                <User size={12} /> Nombre del Cliente
              </label>
              <input 
                type="text" 
                placeholder="Ej: Juan Pérez"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                <Hash size={12} /> Celular / Referencia
              </label>
              <input 
                type="text" 
                placeholder="Ej: 11 2345 6789"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cuerpo: Buscador e Items */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* BUSCADOR INTEGRADO */}
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Buscar Producto</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Escribe madera, viga, placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 pl-12 pr-4 text-base font-bold focus:border-amber-500 transition-all outline-none shadow-inner"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* RESULTADOS INMEDIATOS */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-1">
                  {searchResults.map(product => (
                    <div key={product.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-amber-50 rounded-2xl transition-colors gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-amber-600 uppercase leading-none mb-1">{product.type}</p>
                        <p className="font-black text-slate-800 text-sm md:text-base uppercase truncate leading-tight">{product.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{formatCurrency(product.price)} / {product.unit}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                          <span className="text-[9px] font-black text-slate-400 uppercase pl-2">Cant</span>
                          <input 
                            type="number" 
                            min="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: parseFloat(e.target.value) }))}
                            className="w-12 bg-transparent text-center font-black text-slate-800 text-sm outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => handleAdd(product)}
                          className="bg-amber-600 text-white px-4 py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-amber-200 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Añadir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LISTA DE MATERIALES AÑADIDOS */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b-2 border-slate-100 pb-2">Materiales en Presupuesto</h3>
            
            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-300">
                <Package size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-bold text-sm uppercase tracking-tighter italic">No hay productos seleccionados aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-100 group">
                    <div className="flex items-center gap-4 min-w-0">
                      <button onClick={() => removeItem(item.productId!)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-sm uppercase truncate leading-tight">{item.product?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{item.quantity} {item.product?.unit} x {formatCurrency(item.unitPrice || 0)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-amber-700 text-base md:text-lg tracking-tighter">{formatCurrency(item.subtotal || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie: Total y Guardar */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total a presupuestar</p>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{formatCurrency(total)}</p>
            </div>
            <button
              disabled={items.length === 0}
              onClick={() => onSubmit({ clientName: `${clientName} ${clientPhone}`, total, items })}
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Save size={22} />
              Finalizar Presupuesto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

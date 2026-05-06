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

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
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
    setSearchTerm('');
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-1">
      
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Encabezado: Cliente (Más compacto) */}
        <div className="bg-slate-900 p-5 md:p-8 text-white">
          <div className="flex justify-between items-center mb-5">
             <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
               <Package className="text-amber-500" size={20} />
               Generar
             </h2>
             <button onClick={onCancel} className="text-slate-400 hover:text-white p-1">
               <X size={20} />
             </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Nombre del Cliente"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="relative">
              <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Teléfono / Celular"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cuerpo: Buscador e Items */}
        <div className="p-4 md:p-8 space-y-6">
          
          {/* BUSCADOR (Más pequeño) */}
          <div className="relative">
            <div className="relative">
              <input 
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:border-amber-500 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>

            {/* RESULTADOS (Compactos) */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-1 space-y-0.5">
                  {searchResults.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 hover:bg-amber-50 rounded-xl gap-2">
                      <div className="min-w-0 flex-grow">
                        <p className="font-black text-slate-800 text-[11px] uppercase truncate">{product.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{formatCurrency(product.price)} / {product.unit}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="1"
                          value={quantities[product.id] || 1}
                          onChange={(e) => setQuantities(prev => ({ ...prev, [product.id]: parseFloat(e.target.value) }))}
                          className="w-10 bg-slate-100 rounded-lg py-1 text-center font-black text-slate-800 text-[10px] outline-none"
                        />
                        <button 
                          onClick={() => handleAdd(product)}
                          className="bg-amber-600 text-white p-2 rounded-lg active:scale-95 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LISTA DE ITEMS (Compacta) */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1">Seleccionados</h3>
            
            {items.length === 0 ? (
              <div className="py-8 text-center text-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-widest italic">Lista vacía</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="bg-slate-50/50 rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => removeItem(item.productId!)} className="text-slate-300 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-[11px] uppercase truncate leading-tight">{item.product?.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{item.quantity} {item.product?.unit} x {formatCurrency(item.unitPrice || 0)}</p>
                      </div>
                    </div>
                    <p className="font-black text-amber-700 text-xs">{formatCurrency(item.subtotal || 0)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie: Total y Guardar (Más compacto) */}
        <div className="bg-slate-50 border-t border-slate-100 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{formatCurrency(total)}</p>
            </div>
            <button
              disabled={items.length === 0}
              onClick={() => onSubmit({ clientName: `${clientName} ${clientPhone}`, total, items })}
              className="bg-slate-900 disabled:bg-slate-200 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

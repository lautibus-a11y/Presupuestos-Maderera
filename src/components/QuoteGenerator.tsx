import React, { useState } from 'react';
import { Search, ArrowLeft, Trash2, Save, PlusCircle, X, ChevronRight } from 'lucide-react';
import { Product, QuoteItem } from '../types';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

interface QuoteGeneratorProps {
  products: Product[];
  onSubmit: (q: any) => void;
  onCancel: () => void;
}

export function QuoteGenerator({ products, onSubmit, onCancel }: QuoteGeneratorProps) {
  const [items, setItems] = useState<Partial<QuoteItem>[]>([]);
  const [clientName, setClientName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelectorMobile, setShowSelectorMobile] = useState(false);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id
          ? { ...item, quantity: (item.quantity || 0) + 1, subtotal: ((item.quantity || 0) + 1) * (item.unitPrice || 0) }
          : item
        );
      }
      return [...prev, {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
        product
      }];
    });
    setShowSelectorMobile(false);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (isNaN(qty) || qty < 0) return;
    setItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity: qty, subtotal: qty * (item.unitPrice || 0) } : item
    ));
  };

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ── SELECTOR DE PRODUCTOS (ESCRITORIO: SIEMPRE VISIBLE IZQUIERDA) ── */}
      <div className="hidden lg:block lg:col-span-4 sticky top-28">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[75vh]">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
              <Search size={16} />
              Catálogo
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addItem(product)}
                className="p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-all flex justify-between items-center group shadow-sm"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-xs uppercase truncate leading-tight">{product.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{formatCurrency(product.price)} / {product.unit}</p>
                </div>
                <PlusCircle size={16} className="text-slate-200 group-hover:text-amber-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EDITOR DE PRESUPUESTO (DERECHA / MÓVIL PRINCIPAL) ── */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex justify-between items-center px-1">
          <button onClick={onCancel} className="md:hidden p-2 -ml-2 text-slate-500">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Nuevo Presupuesto</h1>
          <button onClick={onCancel} className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-xs uppercase transition-colors">
            <ArrowLeft size={16} />
            Cerrar
          </button>
        </div>

        {/* Cliente */}
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1 tracking-widest">Nombre del Cliente</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez..."
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-slate-50 md:bg-transparent border border-slate-200 md:border-b-2 md:border-t-0 md:border-x-0 md:rounded-none rounded-2xl px-4 py-3 md:py-1 text-base md:text-xl font-black outline-none focus:ring-0 focus:border-amber-600 transition-all"
          />
        </div>

        {/* Items */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Productos en lista</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{items.length} items seleccionados</span>
          </div>

          <div className="space-y-3 min-h-[200px]">
            {items.length === 0 ? (
              <div 
                onClick={() => setShowSelectorMobile(true)}
                className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center cursor-pointer hover:border-amber-400 transition-colors"
              >
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                  <PlusCircle size={24} />
                </div>
                <p className="text-slate-400 text-sm font-bold">Agrega productos para empezar</p>
                <p className="md:hidden text-[10px] text-slate-300 uppercase mt-2">Toca aquí</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-4 md:px-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    <button onClick={() => removeItem(item.productId!)} className="text-slate-200 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <div className="min-w-0">
                      <p className="font-black text-slate-800 text-sm uppercase truncate">{item.product?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.product?.type} · {formatCurrency(item.unitPrice || 0)} / {item.product?.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId!, parseFloat(e.target.value))}
                        className="w-14 md:w-16 bg-transparent text-center font-black text-slate-800 outline-none text-sm"
                      />
                      <span className="text-[9px] font-bold text-slate-400 pr-2 uppercase">{item.product?.unit}</span>
                    </div>
                    <p className="font-black text-amber-700 text-sm md:text-base">{formatCurrency(item.subtotal || 0)}</p>
                  </div>
                </div>
              ))
            )}

            <button 
              onClick={() => setShowSelectorMobile(true)}
              className="md:hidden w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} />
              Agregar producto
            </button>
          </div>
        </div>

        {/* Resumen Final */}
        {items.length > 0 && (
          <div className="bg-slate-900 text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Presupuestado</p>
                <p className="text-4xl md:text-5xl font-black text-amber-400 tracking-tighter">{formatCurrency(total)}</p>
              </div>
              <div className="hidden md:block text-right">
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Fecha</p>
                 <p className="font-bold text-slate-300">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => onSubmit({ clientName, margin: 0, total, items })}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Save size={22} />
              GUARDAR PRESUPUESTO
            </button>
          </div>
        )}
      </div>

      {/* ── SELECTOR MÓVIL (MODAL SÓLO PARA CELULARES) ── */}
      {showSelectorMobile && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200">
          <div className="h-full w-full bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setShowSelectorMobile(false)} className="p-2 text-slate-500">
                  <ArrowLeft size={24} />
                </button>
                <h3 className="font-black text-slate-800">Elegir Productos</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Madera, placa, tornillo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-2 pb-20">
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => addItem(product)} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm active:bg-amber-50">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-amber-600 uppercase mb-0.5">{product.type}</p>
                    <p className="font-bold text-slate-800 text-sm uppercase truncate leading-tight">{product.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{formatCurrency(product.price)} / {product.unit}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

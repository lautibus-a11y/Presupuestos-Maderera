import React, { useState } from 'react';
import { Search, ArrowLeft, Trash2, Save, PlusCircle as LucidePlusCircle } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 0.1) return;
    setItems(prev => prev.map(item =>
      item.productId === productId ? { ...item, quantity: qty, subtotal: qty * (item.unitPrice || 0) } : item
    ));
  };

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Search & Selector */}
      <div className="lg:col-span-1">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col" style={{ maxHeight: '75vh' }}>
          <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-700">
            <Search size={18} />
            Seleccionar Productos
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          <div className="flex-grow overflow-y-auto space-y-1.5 pr-1">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addItem(product)}
                className="p-3 border border-slate-100 rounded-lg hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all flex justify-between items-center group"
              >
                <div>
                  <p className="font-medium text-sm text-slate-800">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.type} · {formatCurrency(product.price)} / {product.unit}</p>
                </div>
                <LucidePlusCircle size={18} className="text-slate-300 group-hover:text-amber-600 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Editor */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Nuevo Presupuesto</h2>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm">
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 mb-1">Nombre del Cliente</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border-b-2 border-slate-200 focus:border-amber-600 py-2 outline-none text-lg font-semibold placeholder:font-normal placeholder:text-slate-300 transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Unitario</div>
              <div className="col-span-2 text-right">Importe</div>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-300">
                <LucidePlusCircle size={40} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">Seleccioná productos del panel izquierdo</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center py-2 border-b border-slate-50 group">
                  <div className="col-span-12 md:col-span-6 flex gap-3 items-center">
                    <button onClick={() => removeItem(item.productId!)} className="text-slate-200 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={15} />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.product?.name}</p>
                      <p className="text-xs text-slate-400">{item.product?.type} · por {item.product?.unit}</p>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 flex justify-center">
                    <input
                      type="number"
                      value={item.quantity}
                      step="0.1"
                      onChange={(e) => updateQuantity(item.productId!, parseFloat(e.target.value))}
                      className="w-20 text-center border border-slate-200 rounded-lg py-1.5 bg-slate-50 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right text-sm text-slate-500">
                    {formatCurrency(item.unitPrice || 0)}
                  </div>
                  <div className="col-span-3 md:col-span-2 text-right font-bold text-slate-800">
                    {formatCurrency(item.subtotal || 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total bar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total del Presupuesto</p>
              <p className="text-4xl font-black tracking-tight text-amber-400">{formatCurrency(total)}</p>
            </div>
            <div className="text-right text-slate-400 text-sm">
              <p>{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => onSubmit({ clientName, margin: 0, total, items })}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base"
          >
            <Save size={20} />
            Guardar Presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FileText, Trash2, Eye, AlertCircle, ChevronRight } from 'lucide-react';
import { Quote } from '../types';
import { formatCurrency } from '../lib/utils';

interface QuotesListProps {
  quotes: Quote[];
  onViewDetail: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuotesList({ quotes, onViewDetail, onDelete }: QuotesListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Presupuestos</h1>
        <p className="text-slate-500 text-sm font-medium">{quotes.length} generados en total</p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No hay presupuestos</h3>
          <p className="text-slate-400 text-sm mt-2">Crea uno nuevo para empezar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── ESCRITORIO: TABLA (RESTAURADA) ── */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Items</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {quotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tight">#{quote.id.slice(-4).toUpperCase()}</span>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{new Date(quote.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 uppercase text-sm tracking-tight">{quote.clientName || 'Consumidor Final'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-500">{quote.items.length} prod.</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-black text-amber-700 text-lg tracking-tighter">{formatCurrency(quote.total)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onViewDetail(quote.id)} className="p-2.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all" title="Ver detalle">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => setDeleteId(quote.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── MÓVIL: TARJETAS (MANTENIDA) ── */}
          <div className="md:hidden grid gap-3">
            {quotes.map(quote => (
              <div
                key={quote.id}
                onClick={() => onViewDetail(quote.id)}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight">#{quote.id.slice(-4).toUpperCase()}</span>
                    <span className="text-slate-400 text-[10px] font-bold">{new Date(quote.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-black text-slate-800 text-base truncate uppercase">{quote.clientName || 'Consumidor Final'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{quote.items.length} productos</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-black text-amber-700 tracking-tight">{formatCurrency(quote.total)}</p>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Borrado */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-7 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-lg font-black text-slate-900 mb-2">¿Eliminar?</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm">No</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold text-sm">Sí, borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

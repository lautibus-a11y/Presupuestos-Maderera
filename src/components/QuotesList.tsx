import React, { useState } from 'react';
import { FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
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
    <div className="view-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Presupuestos</h1>
          <p className="text-stone-500 text-sm mt-0.5">{quotes.length} {quotes.length === 1 ? 'presupuesto' : 'presupuestos'} generados</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-stone-200">
          <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-semibold text-stone-700">No hay presupuestos generados</h3>
          <p className="text-stone-400 mt-2 text-sm">Comenzá creando uno nuevo para tus clientes.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {quotes.map(quote => (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-5 py-4 gap-4">
                {/* Left: info */}
                <div
                  className="flex-grow cursor-pointer"
                  onClick={() => onViewDetail(quote.id)}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-stone-900 text-white text-xs font-black px-2.5 py-1 rounded-lg tracking-tight">
                      #{quote.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-stone-400 text-xs font-medium">
                      {new Date(quote.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="font-bold text-stone-900 text-base">
                    {quote.clientName || 'Consumidor Final'}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {quote.items.length} {quote.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>

                {/* Right: total + actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Total</p>
                    <p className="text-xl font-black text-amber-700 tracking-tight">{formatCurrency(quote.total)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onViewDetail(quote.id)}
                      className="p-2.5 rounded-xl bg-stone-50 text-stone-500 hover:bg-amber-50 hover:text-amber-700 transition-all"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(quote.id); }}
                      className="p-2.5 rounded-xl bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Eliminar presupuesto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">¿Eliminar presupuesto?</h3>
            </div>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              Se eliminará permanentemente el presupuesto <strong>#{deleteId.slice(-6).toUpperCase()}</strong> y todos sus productos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-sm shadow-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

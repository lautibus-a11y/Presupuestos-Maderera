import React from 'react';
import { TrendingUp, Package, FileText, ArrowRight, DollarSign } from 'lucide-react';
import { Product, Quote } from '../types';
import { formatCurrency } from '../lib/utils';

interface DashboardProps {
  quotes: Quote[];
  products: Product[];
  onViewQuotes: () => void;
  onNewQuote: () => void;
}

export function Dashboard({ quotes, products, onViewQuotes, onNewQuote }: DashboardProps) {
  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);
  const avgQuote = quotes.length > 0 ? totalQuoted / quotes.length : 0;
  
  const productCounts: Record<string, number> = {};
  quotes.forEach(q => {
    q.items.forEach(item => {
      productCounts[item.product?.name || ''] = (productCounts[item.product?.name || ''] || 0) + item.quantity;
    });
  });
  
  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentQuotes = quotes.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">Inicio</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Panel de control MadereraPro</p>
        </div>
        <button 
          onClick={onNewQuote}
          className="hidden md:flex bg-amber-700 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-amber-900/10 hover:bg-amber-800 transition-all items-center gap-2 active:scale-95"
        >
          <FileText size={20} />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Stats Grid - 2 columnas en mobile, 4 en desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          icon={<DollarSign size={20} className="text-green-600" />} 
          label="Total" 
          value={formatCurrency(totalQuoted)} 
          subtext="Histórico"
        />
        <StatCard 
          icon={<FileText size={20} className="text-blue-600" />} 
          label="Presupuestos" 
          value={quotes.length.toString()} 
          subtext="Generados"
        />
        <StatCard 
          icon={<Package size={20} className="text-amber-600" />} 
          label="Productos" 
          value={products.length.toString()} 
          subtext="En catálogo"
        />
        <StatCard 
          icon={<TrendingUp size={20} className="text-purple-600" />} 
          label="Promedio" 
          value={formatCurrency(avgQuote)} 
          subtext="Por cliente"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Actividad Reciente</h3>
            <button onClick={onViewQuotes} className="text-amber-700 text-xs font-black flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentQuotes.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-sm italic">No hay actividad reciente</p>
            ) : (
              recentQuotes.map(quote => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl text-amber-700 shadow-sm border border-slate-100">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm md:text-base uppercase tracking-tight truncate max-w-[150px] md:max-w-none">{quote.clientName || 'Consumidor Final'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(quote.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 md:text-lg tracking-tighter">{formatCurrency(quote.total)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">Más Vendidos</h3>
          <div className="space-y-6">
            {topProducts.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-sm italic">Sin datos</p>
            ) : (
              topProducts.map(([name, count], index) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-black text-xs">
                    {index + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="text-xs font-black text-slate-700 uppercase truncate leading-none">{name}</p>
                      <p className="text-[10px] font-black text-slate-400">{count} un.</p>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, (count / (topProducts[0][1] as number)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
      <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 truncate">{label}</p>
      <h4 className="text-lg md:text-2xl font-black text-slate-800 tracking-tighter mb-0.5 truncate">{value}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{subtext}</p>
    </div>
  );
}

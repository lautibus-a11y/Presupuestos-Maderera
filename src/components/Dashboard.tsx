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
  
  // Calculate most quoted products
  const productCounts: Record<string, number> = {};
  quotes.forEach(q => {
    q.items.forEach(item => {
      productCounts[item.product?.name || ''] = (productCounts[item.product?.name || ''] || 0) + item.quantity;
    });
  });
  
  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const recentQuotes = quotes.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Bienvenido al panel de control de MadereraPro.</p>
        </div>
        <button 
          onClick={onNewQuote}
          className="bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-amber-800 transition-all flex items-center gap-2 active:scale-95"
        >
          <FileText size={20} />
          Nuevo Presupuesto
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<DollarSign className="text-green-600" />} 
          label="Total Presupuestado" 
          value={formatCurrency(totalQuoted)} 
          subtext="Histórico acumulado"
        />
        <StatCard 
          icon={<FileText className="text-blue-600" />} 
          label="Presupuestos" 
          value={quotes.length.toString()} 
          subtext={`${recentQuotes.length} recientes`}
        />
        <StatCard 
          icon={<Package className="text-amber-600" />} 
          label="Catálogo" 
          value={products.length.toString()} 
          subtext="Productos activos"
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-600" />} 
          label="Promedio" 
          value={formatCurrency(avgQuote)} 
          subtext="Por presupuesto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Presupuestos Recientes</h3>
            <button onClick={onViewQuotes} className="text-amber-700 text-sm font-bold flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentQuotes.length === 0 ? (
              <p className="text-center py-8 text-slate-400 italic">No hay actividad reciente</p>
            ) : (
              recentQuotes.map(quote => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-amber-700">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{quote.clientName || 'Consumidor Final'}</p>
                      <p className="text-xs text-slate-500">{new Date(quote.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800">{formatCurrency(quote.total)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{quote.items.length} items</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Más Vendidos</h3>
          <div className="space-y-6">
            {topProducts.length === 0 ? (
              <p className="text-center py-8 text-slate-400 italic">Sin datos de productos</p>
            ) : (
              topProducts.map(([name, count], index) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{name}</p>
                      <p className="text-xs font-bold text-slate-500">{count} unidades</p>
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-800 mb-1">{value}</h4>
      <p className="text-xs text-slate-400 font-medium">{subtext}</p>
    </div>
  );
}

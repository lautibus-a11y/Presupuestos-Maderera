import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  History,
  LayoutDashboard
} from 'lucide-react';
import { cn } from './lib/utils';
import { Product, Quote } from './types';

// Components
import { Dashboard } from './components/Dashboard';
import { QuotesList } from './components/QuotesList';
import { ProductManager } from './components/ProductManager';
import { QuoteGenerator } from './components/QuoteGenerator';
import { QuoteView } from './components/QuoteView';

type View = 'dashboard' | 'quotes' | 'products' | 'generator' | 'detail';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('maderera_products');
    const savedQuotes = localStorage.getItem('maderera_quotes');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedQuotes) setQuotes(JSON.parse(savedQuotes));
    
    setLoading(false);
  }, []);

  // Save data to LocalStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('maderera_products', JSON.stringify(products));
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('maderera_quotes', JSON.stringify(quotes));
    }
  }, [quotes, loading]);

  const handleDeleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const handleCreateQuote = (newQuote: any) => {
    const quoteWithId: Quote = {
      ...newQuote,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: newQuote.items.map((item: any) => ({
        ...item,
        id: crypto.randomUUID(),
        product: products.find(p => p.id === item.productId)
      }))
    };

    setQuotes(prev => [quoteWithId, ...prev]);
    setSelectedQuoteId(quoteWithId.id);
    setView('detail');
  };

  const handleProductAction = (action: 'add' | 'edit' | 'delete', product: Partial<Product>) => {
    if (action === 'delete') {
      const isUsed = quotes.some(q => q.items.some(item => item.productId === product.id));
      if (isUsed) {
        alert("No se puede eliminar el producto porque está siendo usado en uno o más presupuestos.");
        return;
      }
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } else if (action === 'add') {
      const newProduct = { ...product, id: crypto.randomUUID() } as Product;
      setProducts(prev => [...prev, newProduct]);
    } else if (action === 'edit') {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, ...product } as Product : p));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="bg-amber-700 p-2.5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform shadow-amber-900/20">
                <Package size={26} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-800">Maderera<span className="text-amber-700">Pro</span></span>
            </div>
            <div className="hidden md:flex space-x-2 bg-slate-100 p-1.5 rounded-2xl">
              <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Inicio" />
              <NavButton active={view === 'quotes' || view === 'detail'} onClick={() => setView('quotes')} icon={<History size={18} />} label="Presupuestos" />
              <NavButton active={view === 'products'} onClick={() => setView('products')} icon={<Package size={18} />} label="Catálogo" />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('generator')}
                className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 font-bold text-sm active:scale-95"
              >
                <Plus size={18} />
                Nuevo Presupuesto
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="view-container">
            {view === 'dashboard' && (
              <Dashboard 
                key="dashboard" 
                quotes={quotes} 
                products={products} 
                onViewQuotes={() => setView('quotes')} 
                onNewQuote={() => setView('generator')} 
              />
            )}
            {view === 'quotes' && (
              <QuotesList key="quotes" quotes={quotes} onViewDetail={(id) => { setSelectedQuoteId(id); setView('detail'); }} onDelete={handleDeleteQuote} />
            )}
            {view === 'products' && (
              <ProductManager key="products" products={products} onAction={handleProductAction} />
            )}
            {view === 'generator' && (
              <QuoteGenerator key="generator" products={products} onSubmit={handleCreateQuote} onCancel={() => setView('quotes')} />
            )}
            {view === 'detail' && selectedQuoteId && (
              (() => {
                const quote = quotes.find(q => q.id === selectedQuoteId);
                if (!quote) return <div className="text-center py-20 text-slate-400">Cargando presupuesto...</div>;
                return <QuoteView key="detail" quote={quote} onBack={() => setView('quotes')} />;
              })()
            )}
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-slate-100 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 grayscale opacity-50">
             <Package size={20} />
             <span className="font-bold tracking-tighter text-slate-800">MadereraPro</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 MadereraPro. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
             <a href="#" className="hover:text-amber-700 transition-colors">Soporte</a>
             <a href="#" className="hover:text-amber-700 transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm",
        active ? "text-amber-700 bg-white shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-800"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

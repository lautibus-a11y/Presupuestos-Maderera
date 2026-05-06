import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  History,
  LayoutDashboard,
  RefreshCw
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

// --- VERSIÓN DEL CATÁLOGO ---
const DATA_VERSION = '1.1'; // Incrementa esto para forzar la actualización en los clientes

const INITIAL_PRODUCTS: Product[] = [
  // Construcción
  { id: 'c1', name: 'Tirante de pino 2x3 x 3.66m', type: 'Construcción', price: 9000, unit: 'un.' },
  { id: 'c2', name: 'Tirante de pino 2x4 x 3.66m', type: 'Construcción', price: 12000, unit: 'un.' },
  { id: 'c3', name: 'Tirante de pino 2x5 x 4.30m', type: 'Construcción', price: 18000, unit: 'un.' },
  { id: 'c4', name: 'Tirante de pino 2x6 x 4.30m', type: 'Construcción', price: 22000, unit: 'un.' },
  { id: 'c5', name: 'Viga maciza saligna 3x6', type: 'Construcción', price: 28000, unit: 'un.' },
  { id: 'c6', name: 'Viga multilaminada', type: 'Construcción', price: 35000, unit: 'un.' },
  { id: 'c7', name: 'Cabio 2x3', type: 'Construcción', price: 6500, unit: 'un.' },
  { id: 'c8', name: 'Alfajía 1x2', type: 'Construcción', price: 3500, unit: 'un.' },
  { id: 'c9', name: 'Tabla de pino para obra', type: 'Construcción', price: 5500, unit: 'un.' },
  
  // Madera Aserrada
  { id: 'a1', name: 'Tabla de pino cepillada', type: 'Madera Aserrada', price: 6500, unit: 'un.' },
  { id: 'a2', name: 'Tabla de eucalipto', type: 'Madera Aserrada', price: 10000, unit: 'un.' },
  { id: 'a3', name: 'Tabla de paraíso', type: 'Madera Aserrada', price: 18000, unit: 'un.' },
  { id: 'a4', name: 'Tabla de guatambú', type: 'Madera Aserrada', price: 22000, unit: 'un.' },
  { id: 'a5', name: 'Tablón de viraró', type: 'Madera Aserrada', price: 55000, unit: 'un.' },
  { id: 'a6', name: 'Tablón de anchico', type: 'Madera Aserrada', price: 65000, unit: 'un.' },
  
  // Machimbres
  { id: 'm1', name: 'Machimbre pino estándar', type: 'Machimbres', price: 22000, unit: 'm2' },
  { id: 'm2', name: 'Machimbre pino seleccionado', type: 'Machimbres', price: 32000, unit: 'm2' },
  { id: 'm3', name: 'Machimbre eucalipto', type: 'Machimbres', price: 28000, unit: 'm2' },
  { id: 'm4', name: 'Revestimiento alistonado', type: 'Machimbres', price: 15000, unit: 'm2' },
  { id: 'm5', name: 'Listones decorativos', type: 'Machimbres', price: 4000, unit: 'un.' },
  { id: 'm6', name: 'Molduras', type: 'Machimbres', price: 5500, unit: 'un.' },
  { id: 'm7', name: 'Zócalos', type: 'Machimbres', price: 6000, unit: 'un.' },
  
  // Placas
  { id: 'p1', name: 'MDF 18mm (2.75x1.83)', type: 'Placas', price: 160000, unit: 'placa' },
  { id: 'p2', name: 'MDF 12mm', type: 'Placas', price: 110000, unit: 'placa' },
  { id: 'p3', name: 'Melamina blanca', type: 'Placas', price: 170000, unit: 'placa' },
  { id: 'p4', name: 'Melamina texturada', type: 'Placas', price: 190000, unit: 'placa' },
  { id: 'p5', name: 'OSB 11mm', type: 'Placas', price: 35000, unit: 'placa' },
  { id: 'p6', name: 'Fenólico 18mm', type: 'Placas', price: 95000, unit: 'placa' },
  { id: 'p7', name: 'Placa enchapada', type: 'Placas', price: 120000, unit: 'placa' },
  
  // Carpintería
  { id: 'cp1', name: 'Placa finger joint pino', type: 'Carpintería', price: 45000, unit: 'placa' },
  { id: 'cp2', name: 'Placa encolada eucalipto', type: 'Carpintería', price: 60000, unit: 'placa' },
  { id: 'cp3', name: 'Tablero macizo', type: 'Carpintería', price: 80000, unit: 'un.' },
  { id: 'cp4', name: 'Mesada de madera', type: 'Carpintería', price: 180000, unit: 'un.' },
  { id: 'cp5', name: 'Estante flotante', type: 'Carpintería', price: 28000, unit: 'un.' },
  { id: 'cp6', name: 'Escalón de madera', type: 'Carpintería', price: 12000, unit: 'un.' },
  
  // Exterior
  { id: 'e1', name: 'Deck pino tratado (m2)', type: 'Exterior', price: 28000, unit: 'm2' },
  { id: 'e2', name: 'Deck madera dura (m2)', type: 'Exterior', price: 85000, unit: 'm2' },
  { id: 'e3', name: 'Poste impregnado', type: 'Exterior', price: 12000, unit: 'un.' },
  { id: 'e4', name: 'Durmiente', type: 'Exterior', price: 35000, unit: 'un.' },
  { id: 'e5', name: 'Baldosa de madera', type: 'Exterior', price: 9000, unit: 'un.' },
  
  // Industrial
  { id: 'i1', name: 'Pallet estándar', type: 'Industrial', price: 15000, unit: 'un.' },
  { id: 'i2', name: 'Pallet reforzado', type: 'Industrial', price: 22000, unit: 'un.' },
  { id: 'i3', name: 'Cajón de madera', type: 'Industrial', price: 12000, unit: 'un.' },
  { id: 'i4', name: 'Listones industriales', type: 'Industrial', price: 5000, unit: 'un.' },
  { id: 'i5', name: 'Separadores de carga', type: 'Industrial', price: 3000, unit: 'un.' },
  
  // Insumos
  { id: 'in1', name: 'Tornillos para madera (x100)', type: 'Insumos', price: 5000, unit: 'pack' },
  { id: 'in2', name: 'Tarugos', type: 'Insumos', price: 2500, unit: 'pack' },
  { id: 'in3', name: 'Cola vinílica 1kg', type: 'Insumos', price: 6500, unit: 'kg' },
  { id: 'in4', name: 'Adhesivo de contacto', type: 'Insumos', price: 9000, unit: 'un.' },
  { id: 'in5', name: 'Tapacanto', type: 'Insumos', price: 3500, unit: 'm' },
  { id: 'in6', name: 'Bisagras', type: 'Insumos', price: 4500, unit: 'un.' },
  { id: 'in7', name: 'Correderas', type: 'Insumos', price: 12000, unit: 'par' },
  
  // Subproductos
  { id: 's1', name: 'Aserrín (bolsa)', type: 'Subproductos', price: 2000, unit: 'bolsa' },
  { id: 's2', name: 'Viruta', type: 'Subproductos', price: 3000, unit: 'bolsa' },
  { id: 's3', name: 'Chips de madera', type: 'Subproductos', price: 10000, unit: 'm3' },
  { id: 's4', name: 'Leña', type: 'Subproductos', price: 8000, unit: 'bolsa' },
  
  // Productos Terminados
  { id: 't1', name: 'Tabla de asado', type: 'Terminados', price: 25000, unit: 'un.' },
  { id: 't2', name: 'Puerta de madera', type: 'Terminados', price: 160000, unit: 'un.' },
  { id: 't3', name: 'Mesa de madera', type: 'Terminados', price: 220000, unit: 'un.' },
  { id: 't4', name: 'Banco de madera', type: 'Terminados', price: 90000, unit: 'un.' },
];

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data and handle versioning
  useEffect(() => {
    const savedProducts = localStorage.getItem('maderera_products');
    const savedQuotes = localStorage.getItem('maderera_quotes');
    const savedVersion = localStorage.getItem('maderera_version');

    // LÓGICA DE ACTUALIZACIÓN AUTOMÁTICA
    if (!savedVersion || savedVersion !== DATA_VERSION || !savedProducts || JSON.parse(savedProducts).length === 0) {
      // Si la versión es vieja o no hay productos, inyectamos el catálogo
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('maderera_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('maderera_version', DATA_VERSION);
    } else {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedQuotes) setQuotes(JSON.parse(savedQuotes));
    setLoading(false);
  }, []);

  // Sync to LocalStorage
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

  const handleResetCatalog = () => {
    if (window.confirm("¿Estás seguro de que quieres restaurar el catálogo original? Se perderán los cambios en los precios actuales.")) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('maderera_version', DATA_VERSION);
      alert("Catálogo restaurado.");
    }
  };

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
              {view === 'products' && (
                <button 
                  onClick={handleResetCatalog}
                  className="p-3 text-slate-400 hover:text-amber-700 transition-colors"
                  title="Restaurar catálogo por defecto"
                >
                  <RefreshCw size={20} />
                </button>
              )}
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
              <Dashboard quotes={quotes} products={products} onViewQuotes={() => setView('quotes')} onNewQuote={() => setView('generator')} />
            )}
            {view === 'quotes' && (
              <QuotesList quotes={quotes} onViewDetail={(id) => { setSelectedQuoteId(id); setView('detail'); }} onDelete={handleDeleteQuote} />
            )}
            {view === 'products' && (
              <ProductManager products={products} onAction={handleProductAction} />
            )}
            {view === 'generator' && (
              <QuoteGenerator products={products} onSubmit={handleCreateQuote} onCancel={() => setView('quotes')} />
            )}
            {view === 'detail' && selectedQuoteId && (
              (() => {
                const quote = quotes.find(q => q.id === selectedQuoteId);
                if (!quote) return <div className="text-center py-20 text-slate-400">Cargando presupuesto...</div>;
                return <QuoteView quote={quote} onBack={() => setView('quotes')} />;
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
          <p className="text-slate-400 text-sm font-medium">&copy; 2026 MadereraPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm", active ? "text-amber-700 bg-white shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-800")}>
      {icon}
      {label}
    </button>
  );
}

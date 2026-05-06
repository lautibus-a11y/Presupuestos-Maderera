import React, { useRef } from 'react';
import { ArrowLeft, Printer, Share2, Check, Copy, Image as ImageIcon } from 'lucide-react';
import { Quote } from '../types';
import { formatCurrency } from '../lib/utils';
import { toJpeg } from 'html-to-image';
import { cn } from '../lib/utils';

interface QuoteViewProps {
  quote: Quote;
  onBack: () => void;
}

export function QuoteView({ quote, onBack }: QuoteViewProps) {
  const [copied, setCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    const clientName = quote.clientName || 'Consumidor Final';
    const quoteNumber = quote.id.slice(-6).toUpperCase();
    const date = new Date(quote.createdAt).toLocaleDateString('es-AR');
    const rows = quote.items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafaf9'}">
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;"><b>${item.product?.name}</b></td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:12px;">${item.quantity} ${item.product?.unit}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-size:12px;">${formatCurrency(item.subtotal || 0)}</td>
      </tr>`).join('');

    const html = `<html><body style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#92400e">MadereraPro - Presupuesto #${quoteNumber}</h2>
      <p><b>Cliente:</b> ${clientName} | <b>Fecha:</b> ${date}</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead style="background:#1c1917;color:white"><tr><th style="text-align:left;padding:8px">Item</th><th style="padding:8px">Cant.</th><th style="text-align:right;padding:8px">Subtotal</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="text-align:right;font-size:24px;font-weight:bold;">TOTAL: ${formatCurrency(quote.total)}</div>
      <p style="color:#666;font-size:10px;margin-top:40px;">· Válido 7 días · Sujeto a cambios</p>
      <script>window.onload=function(){window.print()}</script>
    </body></html>`;

    const win = window.open('', '_blank');
    win?.document.write(html);
    win?.document.close();
  };

  const exportAsImage = async () => {
    if (!quoteRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toJpeg(quoteRef.current, { quality: 0.95, backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `presupuesto-${quote.id.slice(-4)}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Error al generar imagen');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Presupuesto Detallado</h1>
        </div>
        
        {/* Escritorio: Botones en fila */}
        <div className="hidden md:flex items-center gap-2">
          <button onClick={exportAsImage} disabled={isExporting} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs uppercase text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <ImageIcon size={16} className="text-amber-600" />
            Bajar Imagen
          </button>
          <button onClick={downloadPDF} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs uppercase text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Printer size={16} className="text-slate-400" />
            PDF / Imprimir
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`Presupuesto Cliente: ${quote.clientName}\nTotal: ${formatCurrency(quote.total)}`);
              setCopied(true); setTimeout(() => setCopied(false), 2000);
            }} 
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado' : 'Copiar Texto'}
          </button>
        </div>
      </div>

      {/* Móvil: Botones en cuadrícula táctil */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        <button onClick={exportAsImage} disabled={isExporting} className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col items-center gap-2 active:bg-slate-50 col-span-2">
          {isExporting ? <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> : <ImageIcon className="text-amber-600" size={24} />}
          <span className="text-[10px] font-black uppercase text-slate-600">Descargar Imagen</span>
        </button>
        <button onClick={downloadPDF} className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col items-center gap-2 active:bg-slate-50">
          <Printer className="text-slate-400" size={24} />
          <span className="text-[10px] font-black uppercase text-slate-600">PDF / Imprimir</span>
        </button>
        <button 
          onClick={() => {
             const lines = quote.items.map(i => `• ${i.product?.name}: ${i.quantity} ${i.product?.unit} → ${formatCurrency(i.subtotal)}`).join('\n');
             navigator.clipboard.writeText(`Presupuesto MadereraPro\n\n${lines}\n\nTOTAL: ${formatCurrency(quote.total)}`);
             setCopied(true); setTimeout(() => setCopied(false), 2000);
          }}
          className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col items-center gap-2 active:bg-slate-50"
        >
          {copied ? <Check className="text-green-600" size={24} /> : <Copy className="text-slate-400" size={24} />}
          <span className="text-[10px] font-black uppercase text-slate-600">{copied ? 'Copiado!' : 'Copiar Texto'}</span>
        </button>
      </div>

      {/* Preview Card (Centrada en escritorio) */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div ref={quoteRef} className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden w-full max-w-[600px] min-w-[320px]">
          <div className="h-2 bg-amber-700" />
          <div className="p-6 md:p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">Maderera<span className="text-amber-700">Pro</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Presupuesto de Venta</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-slate-800 leading-none">#{quote.id.slice(-4).toUpperCase()}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{new Date(quote.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preparado para</p>
              <p className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{quote.clientName || 'Consumidor Final'}</p>
            </div>

            <div className="space-y-4 mb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Detalle de Materiales</p>
              {quote.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 uppercase leading-tight">{item.product?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.quantity} {item.product?.unit} x {formatCurrency(item.unitPrice || 0)}</p>
                  </div>
                  <p className="font-black text-slate-800 text-sm md:text-base">{formatCurrency(item.subtotal || 0)}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t-4 border-slate-900 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">{formatCurrency(quote.total)}</p>
              </div>
              <div className="text-right pb-1">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm border border-amber-200">Válido 7 días</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-5 text-center border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Este documento no es válido como factura. Precios sujetos a cambios sin previo aviso.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

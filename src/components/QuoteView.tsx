import React, { useRef } from 'react';
import { ArrowLeft, Printer, Share2, Check, Copy, Image as ImageIcon } from 'lucide-react';
import { Quote } from '../types';
import { formatCurrency } from '../lib/utils';
import { toJpeg } from 'html-to-image';

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
    const date = new Date(quote.createdAt).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const rows = quote.items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafaf9'}">
        <td style="padding:6px 8px 6px 0;border-bottom:1px solid #f0ede8;vertical-align:middle;">
          <div style="font-size:10px;font-weight:700;color:#1c1917;text-transform:uppercase;letter-spacing:0.3px;">${item.product?.name || '-'}</div>
          <div style="font-size:8px;color:#a8a29e;text-transform:uppercase;margin-top:1px;">${item.product?.type || ''}</div>
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;text-align:center;vertical-align:middle;">
          <span style="font-size:11px;font-weight:700;color:#44403c;">${item.quantity}</span>
          <span style="font-size:8px;color:#a8a29e;text-transform:uppercase;margin-left:2px;">${item.product?.unit || ''}</span>
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #f0ede8;text-align:right;vertical-align:middle;font-size:10px;color:#78716c;">${formatCurrency(item.unitPrice || 0)}</td>
        <td style="padding:6px 0 6px 8px;border-bottom:1px solid #f0ede8;text-align:right;vertical-align:middle;font-size:11px;font-weight:800;color:#1c1917;">${formatCurrency(item.subtotal || 0)}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Presupuesto #${quoteNumber}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#f5f4f2; }
    @page { size:A4; margin:0; }
    @media print {
      html,body { width:210mm; height:297mm; }
      body { background:white; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
      .no-print { display:none !important; }
      .page { width:210mm !important; max-height:297mm !important; box-shadow:none !important; page-break-after:avoid; }
    }
    .wrapper { display:flex; justify-content:center; padding:30px 16px; min-height:100vh; }
    .page {
      background:white;
      width:210mm;
      box-shadow:0 8px 40px rgba(0,0,0,0.12);
      border-radius:4px;
      overflow:hidden;
    }
    .top-bar { height:5px; background:linear-gradient(90deg,#92400e,#d97706,#fbbf24); }
    .header {
      background:#1c1917;
      padding:18px 28px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .brand-wrap { display:flex; align-items:center; gap:10px; }
    .brand-icon {
      width:34px; height:34px;
      background:#d97706;
      border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0;
    }
    .brand-name { font-size:18px; font-weight:900; color:#fff; letter-spacing:-0.5px; line-height:1; }
    .brand-name span { color:#f59e0b; }
    .brand-sub { font-size:8px; color:#78716c; text-transform:uppercase; letter-spacing:1px; margin-top:2px; }
    .quote-ref { text-align:right; }
    .quote-ref .lbl { font-size:8px; color:#78716c; text-transform:uppercase; letter-spacing:1.5px; }
    .quote-ref .num { font-size:22px; font-weight:900; color:#f59e0b; letter-spacing:-0.5px; line-height:1.1; }
    .quote-ref .dt { font-size:9px; color:#a8a29e; margin-top:2px; }

    .client-row {
      background:#fafaf9;
      border-bottom:1px solid #e7e5e4;
      padding:12px 28px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .client-lbl { font-size:8px; color:#a8a29e; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:3px; }
    .client-name { font-size:16px; font-weight:800; color:#1c1917; letter-spacing:-0.3px; }
    .badge {
      background:#fef3c7; color:#92400e;
      font-size:9px; font-weight:700;
      text-transform:uppercase; letter-spacing:0.5px;
      padding:4px 12px; border-radius:20px;
      border:1px solid #fde68a;
      white-space:nowrap;
    }

    .body { padding:16px 28px; }
    .section-lbl { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a8a29e; margin-bottom:8px; }

    table { width:100%; border-collapse:collapse; }
    thead tr { border-bottom:2px solid #1c1917; }
    thead th {
      padding:0 8px 7px;
      font-size:8px; font-weight:800;
      text-transform:uppercase; letter-spacing:1px;
      color:#1c1917;
    }
    thead th:first-child { padding-left:0; text-align:left; }
    thead th:last-child { padding-right:0; text-align:right; }
    thead th.c { text-align:center; }
    thead th.r { text-align:right; }

    .total-row {
      border-top:2px solid #1c1917;
      margin-top:4px;
      padding-top:12px;
      display:flex;
      justify-content:flex-end;
    }
    .total-lbl { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#a8a29e; margin-bottom:3px; text-align:right; }
    .total-amt { font-size:32px; font-weight:900; color:#1c1917; letter-spacing:-1.5px; line-height:1; text-align:right; }

    .footer {
      background:#fafaf9;
      border-top:1px solid #e7e5e4;
      padding:10px 28px;
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
    .footer-notes { font-size:7.5px; color:#a8a29e; line-height:1.6; }
    .footer-brand { font-size:9px; font-weight:900; color:#d97706; text-transform:uppercase; letter-spacing:1px; }

    .no-print { text-align:center; padding:16px; }
    .print-btn {
      background:#1c1917; color:white; border:none;
      padding:10px 28px; border-radius:8px;
      font-size:13px; font-weight:700; cursor:pointer;
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="page">
    <div class="top-bar"></div>

    <div class="header">
      <div class="brand-wrap">
        <div class="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
          </svg>
        </div>
        <div>
          <div class="brand-name">Maderera<span>Pro</span></div>
          <div class="brand-sub">Presupuestos profesionales</div>
        </div>
      </div>
      <div class="quote-ref">
        <div class="lbl">Presupuesto</div>
        <div class="num">#${quoteNumber}</div>
        <div class="dt">${date}</div>
      </div>
    </div>

    <div class="client-row">
      <div>
        <div class="client-lbl">Preparado para</div>
        <div class="client-name">${clientName}</div>
      </div>
      <div class="badge">Válido 7 días</div>
    </div>

    <div class="body">
      <div class="section-lbl">Detalle</div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left">Producto</th>
            <th class="c">Cant.</th>
            <th class="r">P. Unit.</th>
            <th class="r" style="padding-right:0">Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="total-row">
        <div>
          <div class="total-lbl">Total a pagar</div>
          <div class="total-amt">${formatCurrency(quote.total)}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-notes">
        <p>· Válido por 7 días · Precios sujetos a cambios · No válido como factura</p>
      </div>
      <div class="footer-brand">MadereraPro</div>
    </div>
  </div>
</div>

<div class="no-print">
  <button class="print-btn" onclick="window.print()">🖨️ Guardar como PDF</button>
</div>

<script>
  window.onload = function() { setTimeout(function(){ window.print(); }, 350); };
</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=860,height=1000');
    if (!win) {
      alert('Habilitá las ventanas emergentes para descargar el PDF.');
      return;
    }
    win.document.write(html);
    win.document.close();
  };

  const exportAsImage = async () => {
    if (!quoteRef.current) return;
    setIsExporting(true);
    
    try {
      const dataUrl = await toJpeg(quoteRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // Mayor nitidez
      });
      
      const link = document.createElement('a');
      link.download = `presupuesto-${quote.id.slice(-6)}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar imagen:', err);
      alert('No se pudo generar la imagen. Intenta con PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareWhatsApp = () => {
    const message = `*MadereraPro — Presupuesto #${quote.id.slice(-6).toUpperCase()}*\n\nHola ${quote.clientName || ''} 👋, te comparto el presupuesto solicitado:\n\n${quote.items.map(i => `• ${i.product?.name}: ${i.quantity} ${i.product?.unit} → ${formatCurrency(i.subtotal)}`).join('\n')}\n\n*TOTAL: ${formatCurrency(quote.total)}*\n\n_Válido por 7 días. Ante cualquier consulta, no dudes en escribirnos._`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = () => {
    const lines = quote.items.map(i =>
      `• ${i.product?.name}: ${i.quantity} ${i.product?.unit} → ${formatCurrency(i.subtotal)}`
    ).join('\n');
    const text = `Presupuesto MadereraPro #${quote.id.slice(-6).toUpperCase()}\nCliente: ${quote.clientName || 'Consumidor Final'} | Fecha: ${new Date(quote.createdAt).toLocaleDateString('es-AR')}\n\n${lines}\n\nTOTAL: ${formatCurrency(quote.total)}\nVálido por 7 días.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm font-medium text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <div className="flex gap-2 flex-wrap">
          <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm shadow-sm transition-all">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </button>
          
          <button 
            onClick={exportAsImage} 
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {isExporting ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <ImageIcon size={16} />}
            {isExporting ? 'Procesando...' : 'Bajar Imagen (WhatsApp)'}
          </button>

          <button onClick={shareWhatsApp} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium text-sm shadow-sm transition-all">
            <Share2 size={16} />
            Texto a WA
          </button>
          
          <button onClick={downloadPDF} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-bold text-sm shadow-lg transition-all active:scale-95">
            <Printer size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* ── PREVIEW (The part we capture) ── */}
      <div ref={quoteRef} className="bg-white border border-slate-200 shadow-lg overflow-hidden rounded-lg">
        <div className="h-1.5 bg-gradient-to-r from-amber-800 via-amber-500 to-yellow-400" />

        {/* Header */}
        <div className="bg-stone-900 px-7 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
              </svg>
            </div>
            <div>
              <p className="text-lg font-black tracking-tighter text-white leading-none">
                Maderera<span className="text-amber-500">Pro</span>
              </p>
              <p className="text-stone-500 text-[9px] font-medium uppercase tracking-wider mt-0.5">Presupuestos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-stone-500 text-[9px] font-bold uppercase tracking-wider">Presupuesto</p>
            <p className="text-amber-400 text-2xl font-black tracking-tight leading-tight">#{quote.id.slice(-6).toUpperCase()}</p>
            <p className="text-stone-500 text-[10px] mt-0.5">{new Date(quote.createdAt).toLocaleDateString('es-AR')}</p>
          </div>
        </div>

        {/* Client */}
        <div className="bg-stone-50 border-b border-stone-100 px-7 py-3.5 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Preparado para</p>
            <p className="text-lg font-black text-stone-900 tracking-tight">{quote.clientName || 'Consumidor Final'}</p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-3 py-1 rounded-full border border-amber-200">Válido 7 días</span>
        </div>

        {/* Table */}
        <div className="px-7 pt-5 pb-3">
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-3">Detalle</p>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-stone-900">
                <th className="pb-2 text-left text-[9px] font-black text-stone-800 uppercase tracking-wide">Producto</th>
                <th className="pb-2 text-center text-[9px] font-black text-stone-800 uppercase tracking-wide">Cant.</th>
                <th className="pb-2 text-right text-[9px] font-black text-stone-800 uppercase tracking-wide">P. Unit.</th>
                <th className="pb-2 text-right text-[9px] font-black text-stone-800 uppercase tracking-wide">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'}>
                  <td className="py-2.5 border-b border-stone-100">
                    <p className="font-bold text-stone-900 text-[10px] uppercase tracking-tight">{item.product?.name}</p>
                    <p className="text-[8px] text-stone-400 font-semibold uppercase mt-0.5">{item.product?.type}</p>
                  </td>
                  <td className="py-2.5 border-b border-stone-100 text-center">
                    <span className="font-bold text-stone-700 text-[10px]">{item.quantity}</span>
                    <span className="text-[8px] text-stone-400 uppercase ml-1">{item.product?.unit}</span>
                  </td>
                  <td className="py-2.5 border-b border-stone-100 text-right text-[10px] text-stone-500">{formatCurrency(item.unitPrice || 0)}</td>
                  <td className="py-2.5 border-b border-stone-100 text-right font-black text-stone-900 text-[11px]">{formatCurrency(item.subtotal || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="px-7 pb-5 flex justify-end">
          <div className="border-t-2 border-stone-900 pt-3 text-right">
            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Total a pagar</p>
            <p className="text-4xl font-black text-stone-900 tracking-tighter">{formatCurrency(quote.total)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-100 px-7 py-3 flex justify-between items-center">
          <p className="text-[8px] text-stone-400">· Válido 7 días · No válido como factura · Precios sujetos a cambios</p>
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-wider">MadereraPro</p>
        </div>
      </div>
    </div>
  );
}

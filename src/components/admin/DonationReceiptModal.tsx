import { X, Printer, CheckCircle } from 'lucide-react';
import type { Donation } from '../../lib/types';
import { useRef } from 'react';

interface DonationReceiptModalProps {
  donation: Donation;
  onClose: () => void;
}

export function DonationReceiptModal({ donation, onClose }: DonationReceiptModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  
  const getProviderName = (donation: Donation) => {
    if (donation.payment_method === 'paypal') return 'PayPal';
    if (donation.transaction_id) {
      if (donation.transaction_id.startsWith('pi_') || donation.transaction_id.startsWith('cs_')) return 'Stripe';
      if (donation.transaction_id.startsWith('PIX-') || donation.transaction_id.startsWith('BOLETO-')) return 'Pagar.me';
      if (donation.transaction_id.length === 36 && donation.transaction_id.includes('-')) return 'Cielo';
    }
    if (donation.payment_method === 'pix' || donation.payment_method === 'card') return 'Cielo';
    return 'Gateway de Pagamento';
  };

  const handlePrint = () => {
    const content = contentRef.current;
    if (!content) return;

    // Abrir janela de impressão simulada
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Doação - ${donation.id}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; padding: 40px; margin: 0; }
            .receipt-box { border: 1px solid #ddd; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #2c5282; margin: 0 0 10px 0; font-size: 24px; }
            .header p { margin: 0; color: #666; font-size: 14px; }
            .amount { text-align: center; font-size: 32px; font-weight: bold; color: #2f855a; margin: 20px 0; }
            .details { margin-top: 30px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #eee; }
            .label { font-weight: bold; color: #555; }
            .value { color: #111; text-align: right; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              .receipt-box { box-shadow: none; border: none; }
            }
          </style>
        </head>
        <body>
          \${content.innerHTML}
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Recibo Formal de Doação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div ref={contentRef} className="receipt-box" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* O conteúdo dentro de receipt-box é o que será impresso e estilizado pelas tags no window.print */}
            <div className="header" style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
              <h1 style={{ color: '#2c5282', margin: '0 0 10px 0', fontSize: '24px' }}>Instituto Educativo de Desenvolvimento e Tecnologias Sociais</h1>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>CNPJ: 03.576.906/0001-47</p>
              <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>Recibo de Doação / Comprovante de Transação</p>
            </div>

            <div className="amount" style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', color: '#2f855a', margin: '20px 0' }}>
              {formatCurrency(donation.amount)}
            </div>

            <div className="status" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0 30px', color: '#2f855a' }}>
              <CheckCircle className="w-5 h-5 mr-2 inline" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              <span style={{ fontWeight: 'bold' }}>Doação Concluída com Sucesso</span>
            </div>

            <div className="details" style={{ marginTop: '30px' }}>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>Doador:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right' }}>{donation.donor_name || 'Doação Anônima'}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>E-mail do Doador:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right' }}>{donation.donor_email || 'Não informado'}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>Método de Pagamento:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right', textTransform: 'capitalize' }}>{donation.payment_method}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>Provedor Gateway:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right' }}>{getProviderName(donation)}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>Data/Hora da Transação:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right' }}>{formatDate(donation.created_at)}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>ID da Transação:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>{donation.transaction_id || 'Não disponível'}</span>
              </div>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #eee' }}>
                <span className="label" style={{ fontWeight: 'bold', color: '#555' }}>ID Interno:</span>
                <span className="value" style={{ color: '#111', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>{donation.id}</span>
              </div>
            </div>

            <div className="footer" style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#888', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <p style={{ margin: '0' }}>Este documento serve como comprovante de doação voluntária.</p>
              <p style={{ margin: '4px 0 0' }}>Para deduções fiscais ou dúvidas, entre em contato conosco.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm flex items-center font-medium"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

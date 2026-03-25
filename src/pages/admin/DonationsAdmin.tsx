import { useState, useEffect, useMemo } from 'react';
import { donationService } from '../../lib/supabaseClient';
import type { Donation } from '../../lib/types';
import { DollarSign, Clock, CheckCircle, XCircle, Printer, Filter } from 'lucide-react';
import { DonationReceiptModal } from '../../components/admin/DonationReceiptModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DonationsAdmin() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptDonation, setReceiptDonation] = useState<Donation | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getAll();
      setDonations(data);
    } catch (error) {
      console.error('Erro ao carregar doações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Donation['status']) => {
    try {
      await donationService.updateStatus(id, status);
      await loadDonations();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };


  const getProvider = (donation: Donation) => {
    if (donation.payment_method === 'paypal') return 'PayPal';
    
    // Tentar adivinhar pelo ID da transação
    if (donation.transaction_id) {
      if (donation.transaction_id.startsWith('pi_') || donation.transaction_id.startsWith('cs_')) return 'Stripe';
      if (donation.transaction_id.startsWith('PIX-') || donation.transaction_id.startsWith('BOLETO-')) return 'Pagar.me';
      // Cielo IDs geralmente são UUIDs de 36 caracteres com hifens (ex: c2524ee8-1f65-46eb...)
      if (donation.transaction_id.length === 36 && donation.transaction_id.includes('-')) return 'Cielo';
    }
    
    // Fallback básico para o caso da transação não ter ID ou ser muito antiga
    if (donation.payment_method === 'pix' || donation.payment_method === 'card') return 'Cielo';
    if (donation.payment_method === 'boleto') return 'Pagar.me';
    
    return 'Desconhecido';
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      const d = new Date(donation.created_at);
      if (startDate && new Date(startDate) > d) return false;
      if (endDate) {
        const parsedEnd = new Date(endDate);
        parsedEnd.setHours(23, 59, 59, 999);
        if (d > parsedEnd) return false;
      }
      return true;
    });
  }, [donations, startDate, endDate]);

  const stats = useMemo(() => {
    const total = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
    const completed = filteredDonations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
    const pending = filteredDonations.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
    const failed = filteredDonations.filter(d => d.status === 'failed').reduce((sum, d) => sum + d.amount, 0);
    return { total, completed, pending, failed };
  }, [filteredDonations]);

  const lineChartData = useMemo(() => {
    const completed = filteredDonations.filter(d => d.status === 'completed').sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const groups: Record<string, number> = {};
    completed.forEach(d => {
      const dateStr = new Date(d.created_at).toLocaleDateString('pt-BR');
      groups[dateStr] = (groups[dateStr] || 0) + d.amount;
    });
    return Object.entries(groups).map(([date, total]) => ({ date, total }));
  }, [filteredDonations]);

  const providerColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#E01E5A'];
  
  const pieChartData = useMemo(() => {
    const completed = filteredDonations.filter(d => d.status === 'completed');
    const groups: Record<string, number> = {};
    completed.forEach(d => {
      const prov = getProvider(d);
      groups[prov] = (groups[prov] || 0) + d.amount;
    });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [filteredDonations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Donation['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'Pendente',
      completed: 'Concluída',
      failed: 'Falhada'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      pix: 'PIX',
      card: 'Cartão',
      boleto: 'Boleto'
    };
    return labels[method as keyof typeof labels] || method;
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Doações</h1>
        
        {/* Date Filter */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
          <Filter className="w-5 h-5 text-gray-400" />
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
            title="Data Inicial"
          />
          <span className="text-gray-400">até</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
            title="Data Final"
          />
          {(startDate || endDate) && (
            <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Limpar</button>
          )}
        </div>
      </div>
        
      {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Arrecadado</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.completed)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.pending)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredDonations.filter(d => d.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Falhadas</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredDonations.filter(d => d.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Arrecadação ao Longo do Tempo</h3>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val: any) => `R$ ${val}`} />
                <RechartsTooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Arrecadado']} />
                <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={2} name="Total Arrecadado" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">Dados insuficientes para este gráfico</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow min-h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Arrecadação por Provedor</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={pieChartData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                  label={({name, percent}: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={providerColors[index % providerColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value) || 0)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Dados insuficientes para este gráfico</div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDonations.map((donation) => (
            <li key={donation.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {donation.donor_name || 'Doação Anônima'}
                    </h3>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(donation.amount)}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>{donation.donor_email}</span>
                    <span className="font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      Via {getProvider(donation)}
                    </span>
                    <span>{getPaymentMethodLabel(donation.payment_method)}</span>
                    <span>{formatDate(donation.created_at)}</span>
                    {donation.transaction_id && (
                      <span className="font-mono text-xs">ID: {donation.transaction_id}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(donation.status)}
                  
                  {donation.status === 'pending' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStatusChange(donation.id, 'completed')}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        title="Marcar como Aprovado"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleStatusChange(donation.id, 'failed')}
                        className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        title="Marcar como Falha"
                      >
                        Mudar Falha
                      </button>
                    </div>
                  )}

                  <div className="flex items-center ml-2 border-l pl-3 border-gray-200">
                    <button
                      onClick={() => setReceiptDonation(donation)}
                      className="ml-2 flex items-center px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors shadow-sm"
                      title="Gerar e Imprimir Recibo"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1" />
                      Gerar Recibo
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredDonations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma doação encontrada.
          </div>
        )}
      </div>

      {receiptDonation && (
        <DonationReceiptModal
          donation={receiptDonation}
          onClose={() => setReceiptDonation(null)}
        />
      )}
    </div>
  );
}
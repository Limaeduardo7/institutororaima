import { useState, useEffect } from 'react';
import { donationService } from '../../lib/supabaseClient';
import type { Donation } from '../../lib/types';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DonationsAdmin() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const data = await donationService.getAll();
      setDonations(data);
      
      // Calculate stats
      const total = data.reduce((sum, donation) => sum + donation.amount, 0);
      const completed = data.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
      const pending = data.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
      const failed = data.filter(d => d.status === 'failed').reduce((sum, d) => sum + d.amount, 0);
      
      setStats({ total, completed, pending, failed });
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Doações</h1>
        
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
                  {donations.filter(d => d.status === 'completed').length}
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
                  {donations.filter(d => d.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {donations.map((donation) => (
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
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleStatusChange(donation.id, 'failed')}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {donations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma doação encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
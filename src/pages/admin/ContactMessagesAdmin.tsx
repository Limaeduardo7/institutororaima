import { useState, useEffect } from 'react';
import { contactService } from '../../lib/supabaseClient';
import type { ContactMessage } from '../../lib/types';
import { Mail, Phone, Eye, Trash2, Clock } from 'lucide-react';

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await contactService.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    try {
      await contactService.updateStatus(id, status);
      await loadMessages();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta mensagem?')) {
      try {
        await contactService.delete(id);
        await loadMessages();
      } catch (error) {
        console.error('Erro ao deletar mensagem:', error);
      }
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await handleStatusChange(message.id, 'read');
    }
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

  const getStatusBadge = (status: ContactMessage['status']) => {
    const colors = {
      new: 'bg-red-100 text-red-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    const labels = {
      new: 'Nova',
      read: 'Lida',
      replied: 'Respondida'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens de Contato</h1>
        <div className="text-sm text-gray-600">
          {messages.filter(m => m.status === 'new').length} novas mensagens
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {messages.map((message) => (
            <li key={message.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => openMessage(message)}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${message.status === 'new' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                      {message.name}
                    </h3>
                    {getStatusBadge(message.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.subject}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {message.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openMessage(message)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusChange(message.id, e.target.value as ContactMessage['status'])}
                    className="text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="new">Nova</option>
                    <option value="read">Lida</option>
                    <option value="replied">Respondida</option>
                  </select>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Mensagem de {selectedMessage.name}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <strong>Assunto:</strong> {selectedMessage.subject}
              </div>
              <div>
                <strong>Email:</strong> {selectedMessage.email}
              </div>
              {selectedMessage.phone && (
                <div>
                  <strong>Telefone:</strong> {selectedMessage.phone}
                </div>
              )}
              <div>
                <strong>Data:</strong> {formatDate(selectedMessage.created_at)}
              </div>
              <div>
                <strong>Mensagem:</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Marcar como Respondida
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Responder por Email
              </a>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
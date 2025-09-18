import { useState, useEffect } from 'react';
import { socialActionService } from '../../lib/supabaseClient';
import type { SocialAction } from '../../lib/types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function SocialActionsAdmin() {
  const [socialActions, setSocialActions] = useState<SocialAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState<SocialAction | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beneficiaries: 0,
    status: 'active' as SocialAction['status'],
    start_date: '',
    image_url: '',
    imageFile: null as File | null
  });

  useEffect(() => {
    loadSocialActions();
  }, []);

  const loadSocialActions = async () => {
    try {
      const data = await socialActionService.getAll();
      setSocialActions(data);
    } catch (error) {
      console.error('Erro ao carregar ações sociais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { imageFile, ...actionData } = formData;
      if (editingAction) {
        await socialActionService.update(editingAction.id, actionData, imageFile || undefined);
      } else {
        await socialActionService.create(actionData, imageFile || undefined);
      }
      await loadSocialActions();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar ação social:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ação social?')) {
      try {
        await socialActionService.delete(id);
        await loadSocialActions();
      } catch (error) {
        console.error('Erro ao deletar ação social:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      beneficiaries: 0,
      status: 'active',
      start_date: '',
      image_url: '',
      imageFile: null
    });
    setEditingAction(null);
  };

  const openModal = (action?: SocialAction) => {
    if (action) {
      setEditingAction(action);
      setFormData({
        title: action.title,
        description: action.description,
        beneficiaries: action.beneficiaries,
        status: action.status,
        start_date: action.start_date,
        image_url: action.image_url || '',
        imageFile: null
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ações Sociais</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Ação Social
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {socialActions.map((action) => (
            <li key={action.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {action.beneficiaries} beneficiários
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      action.status === 'active' ? 'bg-green-100 text-green-800' :
                      action.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {action.status === 'active' ? 'Ativo' :
                       action.status === 'completed' ? 'Concluído' : 'Planejado'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(action)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(action.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {editingAction ? 'Editar Ação Social' : 'Nova Ação Social'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiários</label>
                <input
                  type="number"
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({...formData, beneficiaries: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as SocialAction['status']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Ativo</option>
                  <option value="completed">Concluído</option>
                  <option value="planned">Planejado</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, imageFile: e.target.files?.[0] || null, image_url: ''})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="text-xs text-gray-500 text-center">ou</div>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value, imageFile: null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/imagem.jpg"
                    disabled={!!formData.imageFile}
                  />
                  {formData.imageFile && (
                    <p className="text-sm text-green-600">Arquivo selecionado: {formData.imageFile.name}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingAction ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
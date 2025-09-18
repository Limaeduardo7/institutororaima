import { useState, useEffect } from 'react';
import { financialService } from '../../lib/supabaseClient';
import type { FinancialDocument } from '../../lib/types';
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react';

export default function FinancialDocumentsAdmin() {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'receipt' as FinancialDocument['document_type'],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    file: null as File | null
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await financialService.getAll();
      setDocuments(data);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Por favor, selecione um arquivo');
      return;
    }

    setUploading(true);
    try {
      await financialService.uploadDocument(formData.file, {
        title: formData.title,
        description: formData.description,
        document_type: formData.document_type,
        year: formData.year,
        month: formData.month,
        file_name: formData.file.name
      });
      await loadDocuments();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do documento');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este documento?')) {
      try {
        await financialService.delete(id);
        await loadDocuments();
      } catch (error) {
        console.error('Erro ao deletar documento:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      document_type: 'receipt',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      file: null
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      receipt: 'Recibo',
      report: 'Relatório',
      statement: 'Demonstrativo',
      other: 'Outro'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getDocumentTypeColor = (type: string) => {
    const colors = {
      receipt: 'bg-blue-100 text-blue-800',
      report: 'bg-green-100 text-green-800',
      statement: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documentos Financeiros</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload Documento
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <FileText className="h-8 w-8 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDocumentTypeColor(doc.document_type)}`}>
                        {getDocumentTypeLabel(doc.document_type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {String(doc.month).padStart(2, '0')}/{doc.year}
                      </span>
                      <span className="text-sm text-gray-500">
                        Enviado em {formatDate(doc.upload_date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Visualizar documento"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum documento encontrado.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Upload de Documento</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select
                  value={formData.document_type}
                  onChange={(e) => setFormData({...formData, document_type: e.target.value as FinancialDocument['document_type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="receipt">Recibo</option>
                  <option value="report">Relatório</option>
                  <option value="statement">Demonstrativo</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                  <input
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Enviar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
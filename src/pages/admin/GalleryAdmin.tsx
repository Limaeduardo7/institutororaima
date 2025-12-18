import React, { useState, useEffect } from 'react'
import { galleryService } from '../../lib/supabaseClient'
import type { GalleryItem } from '../../lib/types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import {
  Plus,
  Trash2,
  Image,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  Home as HomeIcon,
  Star
} from 'lucide-react'

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'image' as 'image' | 'video',
    url: '',
    category: '',
    show_on_home: false,
    file: null as File | null
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await galleryService.getAll()
      setItems(data)
    } catch (err: any) {
      console.error('Failed to load gallery items:', err)
      if (err.code === '42P01' || err.message?.includes('404')) { // 42P01 é undefined_table no Postgres, 404 no REST
        setError('A tabela de galeria ainda não foi criada no banco de dados. Por favor, execute o script SQL.')
      } else {
        setError('Erro ao carregar itens da galeria. Verifique sua conexão ou permissões.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleHome = async (item: GalleryItem) => {
    try {
      // Otimistic update
      setItems(items.map(i => 
        i.id === item.id ? { ...i, show_on_home: !i.show_on_home } : i
      ))
      
      if (item.is_virtual) {
        // Se for item virtual (apenas no storage), precisa criar no banco primeiro
        await galleryService.create({
          title: item.title,
          description: item.description,
          media_type: item.media_type,
          url: item.url,
          category: item.category,
          show_on_home: !item.show_on_home // Já cria com o status desejado
        })
        
        // Recarrega para pegar o ID real do banco e remover flag is_virtual
        await loadItems()
      } else {
        // Se já existe no banco, apenas atualiza
        await galleryService.update(item.id, { show_on_home: !item.show_on_home })
      }
    } catch (err) {
      console.error('Error updating item:', err)
      setError('Erro ao atualizar item')
      // Revert on error
      loadItems()
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return

    try {
      setLoading(true)
      await galleryService.delete(id)
      setSuccess('Item excluído com sucesso')
      await loadItems()
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Erro ao excluir item')
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      let finalUrl = formData.url

      // Se for imagem e tiver arquivo, faz upload
      if (formData.media_type === 'image' && formData.file) {
        finalUrl = await galleryService.uploadMedia(formData.file)
      } else if (formData.media_type === 'video' && !formData.url) {
        throw new Error('URL do vídeo é obrigatória')
      } else if (formData.media_type === 'image' && !formData.file && !formData.url) {
         throw new Error('Selecione uma imagem ou forneça uma URL')
      }

      await galleryService.create({
        title: formData.title,
        description: formData.description,
        media_type: formData.media_type,
        url: finalUrl,
        category: formData.category || 'geral',
        show_on_home: formData.show_on_home
      })

      setSuccess('Item adicionado com sucesso!')
      setShowForm(false)
      setFormData({
        title: '',
        description: '',
        media_type: 'image',
        url: '',
        category: '',
        show_on_home: false,
        file: null
      })
      loadItems()
    } catch (err: any) {
      console.error('Error creating item:', err)
      setError(err.message || 'Erro ao criar item')
    } finally {
      setSubmitting(false)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galeria de Mídia</h1>
          <p className="text-gray-600 mt-1">Gerencie imagens e vídeos do site</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Novo Item
            </>
          )}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="mb-8 p-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">Adicionar Mídia</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Ação Social 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: eventos, projetos"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Mídia</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, media_type: 'image' })}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    formData.media_type === 'image'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Imagem
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, media_type: 'video' })}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    formData.media_type === 'video'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Vídeo (YouTube/Vimeo)
                </button>
              </div>

              {formData.media_type === 'image' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Image className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {formData.file ? formData.file.name : 'Clique para selecionar uma imagem'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="text-center text-sm text-gray-500">- ou -</div>
                  <Input
                    placeholder="URL da imagem (opcional se enviar arquivo)"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              ) : (
                <Input
                  placeholder="URL do vídeo (YouTube, Vimeo...)"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_on_home"
                checked={formData.show_on_home}
                onChange={(e) => setFormData({ ...formData, show_on_home: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="show_on_home" className="ml-2 block text-sm text-gray-900 flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                Mostrar na página inicial (Destaque)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Item'
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
          <p className="mt-2 text-gray-500">Carregando galeria...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum item na galeria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-gray-100">
                {item.media_type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <Video className="w-12 h-12 text-white opacity-50" />
                    <Play className="absolute w-8 h-8 text-white" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleHome(item)}
                    className={`p-2 rounded-full shadow-lg ${
                      item.show_on_home ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-yellow-500 hover:text-white'
                    }`}
                    title={item.show_on_home ? "Remover da Home" : "Destacar na Home"}
                  >
                    <Star className={`w-4 h-4 ${item.show_on_home ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.show_on_home && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Destaque
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.media_type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.media_type === 'image' ? 'Imagem' : 'Vídeo'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 truncate">{item.title}</h4>
                <p className="text-sm text-gray-500 truncate">{item.category}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

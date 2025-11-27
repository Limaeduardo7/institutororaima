import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { documentService } from '../lib/supabaseClient'
import type { Document } from '../lib/types'
import {
  FileText,
  Download,
  Calendar,
  FolderOpen,
  Filter,
  Search,
  AlertCircle,
  FileCheck
} from 'lucide-react'

const Documentos: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [selectedYear, setSelectedYear] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = {
    estatuto: 'Estatuto',
    ata: 'Atas',
    relatorio: 'Relatórios',
    certidao: 'Certidões',
    outros: 'Outros'
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, selectedCategory, selectedYear, searchTerm])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getAll()
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load documents:', error)
      setError('Erro ao carregar documentos')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    // Filtrar por categoria
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    // Filtrar por ano
    if (selectedYear !== 'todos') {
      filtered = filtered.filter(doc => doc.year?.toString() === selectedYear)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        doc.description?.toLowerCase().includes(term)
      )
    }

    setFilteredDocuments(filtered)
  }

  const getAvailableYears = (): number[] => {
    const years = documents
      .map(doc => doc.year)
      .filter((year): year is number => year !== null && year !== undefined)
    return Array.from(new Set(years)).sort((a, b) => b - a)
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getCategoryIcon = (category: Document['category']) => {
    switch (category) {
      case 'estatuto':
        return <FileCheck className="w-5 h-5" />
      case 'ata':
        return <FileText className="w-5 h-5" />
      case 'relatorio':
        return <FolderOpen className="w-5 h-5" />
      case 'certidao':
        return <FileCheck className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-documents">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Documentos Institucionais
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Acesse os documentos oficiais, estatutos, atas e relatórios do Instituto Estação.
            Transparência e conformidade legal em todos os nossos processos.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o título ou descrição..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todos">Todas as Categorias</option>
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todos">Todos os Anos</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Exibindo {filteredDocuments.length} de {documents.length} documento(s)
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando documentos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDocuments.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'todos' || selectedYear !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Ainda não há documentos cadastrados'}
            </p>
          </Card>
        )}

        {/* Documents Grid */}
        {!loading && !error && filteredDocuments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                    {getCategoryIcon(doc.category)}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-accent-100 text-accent-700 rounded-full">
                    {categories[doc.category]}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {doc.title}
                </h3>

                {doc.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {doc.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(doc.upload_date)}
                  </div>
                  {doc.year && (
                    <div className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2 text-gray-400" />
                      Ano de referência: {doc.year}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {doc.file_name} ({formatFileSize(doc.file_size)})
                  </div>
                </div>

                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Documento
                </a>
              </Card>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <FileCheck className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 bg-clip-text text-transparent">
            Sobre os Documentos Institucionais
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Todos os documentos disponibilizados nesta seção são de caráter público e
            refletem nosso compromisso com a transparência e a boa governança.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Caso precise de algum documento específico que não esteja disponível aqui,
            entre em contato conosco através da página de Contato.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Documentos

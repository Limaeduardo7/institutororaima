import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { financialService } from '../lib/supabaseClient'
import { type FinancialDocument } from '../lib/types'
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Calendar, 
  DollarSign,
  Shield,
  Award,
  TrendingUp,
  PieChart,
  BarChart3,
  Filter
} from 'lucide-react'

const Transparencia: React.FC = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<FinancialDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [filterType, setFilterType] = useState<string>('all')
  const [uploadLoading, setUploadLoading] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const documentTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'receipt', label: 'Comprovantes' },
    { value: 'report', label: 'Relatórios' },
    { value: 'statement', label: 'Demonstrativos' },
    { value: 'other', label: 'Outros' }
  ]

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await financialService.getByYear(selectedYear)
        setDocuments(docs)
      } catch (error) {
        console.error('Failed to load documents:', error)
        // Fallback data for demonstration
        setDocuments([
          {
            id: '1',
            title: 'Relatório Financeiro Anual 2023',
            description: 'Demonstrativo completo das receitas e despesas do Instituto durante o ano de 2023',
            document_type: 'report',
            file_url: '/documents/relatorio-2023.pdf',
            file_name: 'relatorio-financeiro-2023.pdf',
            upload_date: '2024-01-15',
            year: 2023,
            month: 12
          },
          {
            id: '2',
            title: 'Comprovante de Doações - Dezembro 2023',
            description: 'Detalhamento de todas as doações recebidas no mês de dezembro',
            document_type: 'receipt',
            file_url: '/documents/doacoes-dez-2023.pdf',
            file_name: 'comprovante-doacoes-dezembro-2023.pdf',
            upload_date: '2024-01-05',
            year: 2023,
            month: 12
          },
          {
            id: '3',
            title: 'Demonstrativo de Projetos - 3º Trimestre 2023',
            description: 'Relatório de execução e prestação de contas dos projetos sociais',
            document_type: 'statement',
            file_url: '/documents/projetos-3tri-2023.pdf',
            file_name: 'demonstrativo-projetos-3tri-2023.pdf',
            upload_date: '2023-10-30',
            year: 2023,
            month: 9
          },
          {
            id: '4',
            title: 'Auditoria Externa - 2023',
            description: 'Relatório de auditoria independente das contas do Instituto',
            document_type: 'report',
            file_url: '/documents/auditoria-2023.pdf',
            file_name: 'auditoria-externa-2023.pdf',
            upload_date: '2024-02-20',
            year: 2023,
            month: 12
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [selectedYear])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadLoading(true)
    try {
      await financialService.uploadDocument(file, {
        title: file.name,
        description: 'Documento financeiro enviado',
        document_type: 'other',
        file_name: file.name,
        year: currentYear,
        month: new Date().getMonth() + 1
      })
      // Reload documents after upload
      const docs = await financialService.getByYear(selectedYear)
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to upload document:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type)
    return docType?.label || type
  }

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'receipt': return 'bg-green-100 text-green-800'
      case 'report': return 'bg-blue-100 text-blue-800'
      case 'statement': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewDocument = (document: FinancialDocument) => {
    // Create a mock PDF URL for demonstration
    const mockPdfUrl = `/documents/${document.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
    
    // In a real application, you would get the actual document URL from storage
    window.open(mockPdfUrl, '_blank')
  }

  const handleDownloadDocument = (doc: FinancialDocument) => {
    // Create a mock download
    const link = document.createElement('a')
    link.href = `/documents/${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
    link.download = `${doc.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Show success message
    console.log(`Downloading: ${doc.title}`)
  }

  const filteredDocuments = documents.filter(doc => 
    filterType === 'all' || doc.document_type === filterType
  )

  const financialStats = [
    { 
      icon: <DollarSign className="w-8 h-8" />, 
      title: "Receitas 2023", 
      value: "R$ 485.670", 
      change: "+12%",
      color: "bg-green-100 text-green-600" 
    },
    { 
      icon: <TrendingUp className="w-8 h-8" />, 
      title: "Projetos Ativos", 
      value: "18", 
      change: "+3",
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      icon: <PieChart className="w-8 h-8" />, 
      title: "Eficiência", 
      value: "94%", 
      change: "+2%",
      color: "bg-purple-100 text-purple-600" 
    },
    { 
      icon: <BarChart3 className="w-8 h-8" />, 
      title: "Beneficiários", 
      value: "5.247", 
      change: "+847",
      color: "bg-orange-100 text-orange-600" 
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-transparency">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Transparência
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Acesso completo aos nossos documentos financeiros e relatórios. 
            Transparência é um dos nossos principais valores.
          </p>
        </div>
      </section>

      {/* Financial Stats */}
      <section className="py-12 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStats.map((stat, index) => (
              <Card key={index} variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{stat.title}</h3>
                <div className="text-3xl font-bold text-primary-800 mb-1">{stat.value}</div>
                <p className="text-sm text-green-600 font-medium">{stat.change} vs 2022</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Certificações e Reconhecimentos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nosso compromisso com a transparência é reconhecido por órgãos competentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">CNPJ Ativo</h3>
              <p className="text-gray-600 mb-4">Registro ativo junto à Receita Federal</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Validado
              </span>
            </Card>

            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Utilidade Pública</h3>
              <p className="text-gray-600 mb-4">Título de Utilidade Pública Estadual</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Ativo
              </span>
            </Card>

            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Auditoria Externa</h3>
              <p className="text-gray-600 mb-4">Auditoria independente anual</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                2023
              </span>
            </Card>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Documentos Financeiros
              </h2>
              <p className="text-xl text-gray-600">
                Acesse nossos relatórios e comprovantes organizados por ano
              </p>
            </div>


          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-500 mt-1" />
              <span className="text-sm text-gray-600 mt-0.5">Filtros:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="glass-input px-3 py-1 text-sm rounded-lg"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="glass-input px-3 py-1 text-sm rounded-lg"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" text="Carregando documentos..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document, index) => (
                <Card 
                  key={document.id}
                  variant="glass" 
                  className="group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(document.document_type)}`}>
                        {getDocumentTypeLabel(document.document_type)}
                      </span>
                    </div>
                    <CardTitle className="text-gray-800 group-hover:text-primary-600 transition-colors">
                      {document.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {document.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(document.upload_date)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-gray-600">
                Não há documentos para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 gradient-text">
            Nosso Compromisso com a Transparência
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Acreditamos que a transparência é fundamental para construir confiança 
            com nossos doadores, beneficiários e a sociedade. Por isso, disponibilizamos 
            todos os nossos documentos financeiros e relatórios de atividades de forma 
            clara e acessível.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card variant="glass" className="p-6 text-left">
              <h3 className="text-xl font-semibold mb-3 text-primary-800">
                Prestação de Contas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Publicamos mensalmente nossos relatórios financeiros e 
                demonstrativos de aplicação de recursos, garantindo total 
                visibilidade sobre o destino das doações.
              </p>
            </Card>
            
            <Card variant="glass" className="p-6 text-left">
              <h3 className="text-xl font-semibold mb-3 text-primary-800">
                Auditoria Independente
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Anualmente, passamos por auditoria externa realizada por 
                empresa especializada, assegurando a veracidade e precisão 
                de nossas informações financeiras.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transparência que Gera Confiança
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Nossa transparência é reflexo do nosso compromisso com você. 
            Saiba exatamente como sua doação está transformando vidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/doacoes')}>
              <DollarSign className="w-5 h-5 mr-2" />
              Fazer Doação
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => window.open('/relatorio-anual-2023.pdf', '_blank')}>
              <FileText className="w-5 h-5 mr-2" />
              Relatório Anual
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Transparencia
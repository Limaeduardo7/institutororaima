import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { eventService } from '../lib/supabaseClient'
import { type Event } from '../lib/types'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Share2,
  Heart,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react'

const EventoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return
      
      try {
        // Since getById doesn't exist in eventService, use mock data directly
        setEvent(getMockEvent(parseInt(id)))
      } catch (error) {
        console.error('Failed to load event:', error)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  const getMockEvent = (eventId: number): Event => {
    const mockEvents = [
      {
        id: "1",
        title: "Campanha de Arrecadação de Alimentos",
        description: "Grande campanha de arrecadação de alimentos não perecíveis para distribuição em comunidades carentes de Boa Vista. Sua participação é fundamental para levarmos esperança e nutrição para famílias em situação de vulnerabilidade social.",
        date: "2024-02-15T09:00:00Z",
        location: "Praça do Centro Cívico - Boa Vista/RR",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "2",
        title: "Mutirão de Saúde Comunitária",
        description: "Ação integrada de saúde oferecendo consultas médicas gratuitas, exames básicos, vacinação e orientações de saúde preventiva. Profissionais voluntários estarão disponíveis para atender toda a comunidade.",
        date: "2024-02-20T08:00:00Z",
        location: "Instituto Estação - Jardim Bela Vista",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "3",
        title: "Oficina de Capacitação Profissional",
        description: "Curso gratuito de capacitação em informática básica e desenvolvimento de habilidades profissionais. Destinado a jovens e adultos em busca de novas oportunidades no mercado de trabalho.",
        date: "2024-02-25T14:00:00Z",
        location: "Auditório do Instituto Estação",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      }
    ]
    
    return mockEvents.find(e => e.id === eventId.toString()) || mockEvents[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRegistration = async () => {
    setRegistering(true)
    // Simulate registration process
    setTimeout(() => {
      setRegistering(false)
      setRegistered(true)
    }, 2000)
  }

  const shareEvent = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      })
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Carregando evento..." />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Evento não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate('/eventos')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Eventos
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/eventos')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Eventos
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-500" />
                  {formatTime(event.date)}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                  {event.location}
                </div>
              </div>
            </div>
            
            <div className="lg:w-80">
              <Card variant="glass" className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Participe deste Evento
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sua presença faz a diferença
                  </p>
                </div>
                
                {registered ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-semibold mb-4">
                      Inscrição Confirmada!
                    </p>
                    <p className="text-sm text-gray-600">
                      Você receberá mais detalhes por e-mail
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={handleRegistration}
                    className="w-full mb-4"
                    loading={registering}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {registering ? 'Confirmando...' : 'Confirmar Presença'}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={shareEvent}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Evento
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Event Image/Banner */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto -mt-6">
          <Card variant="glass" className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12" />
                </div>
                <p className="text-lg font-medium">Imagem do Evento</p>
                <p className="text-sm opacity-80 mt-2">Em breve com galeria de fotos</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card variant="glass" className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Sobre o Evento
                </h2>
                <div className="prose prose-lg text-gray-700 leading-relaxed">
                  <p>{event.description}</p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                    O que esperar?
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Atividades organizadas e estruturadas
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Equipe de voluntários experientes
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Ambiente acolhedor e inclusivo
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Oportunidade de fazer a diferença
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                    Como participar?
                  </h3>
                  <p>
                    Para participar deste evento, basta confirmar sua presença clicando no botão 
                    ao lado. Não é necessário inscrição prévia, mas sua confirmação nos ajuda 
                    a organizar melhor o evento e garantir que tenhamos estrutura adequada 
                    para todos os participantes.
                  </p>
                </div>
              </Card>

              {/* Requirements */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Informações Importantes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Entrada:</strong> Gratuita para todos os participantes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Idade:</strong> Evento aberto para todas as idades
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Estacionamento:</strong> Disponível na rua próximo ao local
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Acessibilidade:</strong> Local adaptado para pessoas com mobilidade reduzida
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dúvidas sobre o Evento?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">(95) 3224-5678</p>
                      <p className="text-sm text-gray-600">Horário comercial</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">contato@institutoestacao.org</p>
                      <p className="text-sm text-gray-600">Resposta em 24h</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Location Map */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Localização
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Mapa do Local</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {event.location}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/localizacao')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Como Chegar
                </Button>
              </Card>

              {/* Other Events */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Outros Eventos
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Confira outros eventos e ações que temos planejados
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/eventos')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Todos os Eventos
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventoDetalhes
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { eventService, socialActionService } from '../lib/supabaseClient'
import { type Event, type SocialAction } from '../lib/types'
import { Calendar, MapPin, Users, Image as ImageIcon, Search } from 'lucide-react'
import { Input } from '../components/ui/Input'

const Eventos: React.FC = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [socialActions, setSocialActions] = useState<SocialAction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'events' | 'actions'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, actionsData] = await Promise.all([
          eventService.getAll(),
          socialActionService.getAll()
        ])
        setEvents(eventsData)
        setSocialActions(actionsData)
      } catch (error) {
        console.error('Failed to load data:', error)
        // Fallback data for demonstration
        setEvents([
          {
            id: '1',
            title: 'Feira de Adoção de Animais',
            description: 'Evento especial para conectar famílias com animais que precisam de um lar. Mais de 50 cães e gatos estarão disponíveis para adoção.',
            date: '2024-12-15',
            location: 'Praça do Centro Cívico, Boa Vista - RR',
            image_url: '/images/feira-adocao.jpg',
            created_at: '2024-11-01',
            updated_at: '2024-11-01'
          },
          {
            id: '2',
            title: 'Mutirão de Limpeza do Rio Branco',
            description: 'Ação ambiental para limpeza das margens do Rio Branco com participação da comunidade local.',
            date: '2024-12-20',
            location: 'Orla do Rio Branco, Boa Vista - RR',
            image_url: '/images/mutirao-limpeza.jpg',
            created_at: '2024-11-05',
            updated_at: '2024-11-05'
          },
          {
            id: '3',
            title: 'Natal Solidário 2024',
            description: 'Distribuição de presentes e ceia natalina para famílias em situação de vulnerabilidade social.',
            date: '2024-12-24',
            location: 'Sede do Instituto, Jardim Bela Vista - RR',
            image_url: '/images/natal-solidario.jpg',
            created_at: '2024-11-10',
            updated_at: '2024-11-10'
          }
        ])
        setSocialActions([
          {
            id: '1',
            title: 'Programa Alfabetização de Adultos',
            description: 'Classes de alfabetização para adultos que não tiveram oportunidade de estudar na idade adequada.',
            beneficiaries: 45,
            status: 'active',
            start_date: '2024-01-15',
            image_url: '/images/alfabetizacao.jpg',
            created_at: '2024-01-15',
            updated_at: '2024-01-15'
          },
          {
            id: '2',
            title: 'Horta Comunitária Sustentável',
            description: 'Projeto de criação e manutenção de hortas comunitárias para garantia de segurança alimentar.',
            beneficiaries: 120,
            status: 'active',
            start_date: '2024-03-01',
            image_url: '/images/horta-comunitaria.jpg',
            created_at: '2024-03-01',
            updated_at: '2024-03-01'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: SocialAction['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: SocialAction['status']) => {
    switch (status) {
      case 'active': return 'Em Andamento'
      case 'completed': return 'Concluído'
      case 'planned': return 'Planejado'
      default: return status
    }
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredActions = socialActions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-events">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Eventos e Ações
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Conheça nossos eventos próximos e acompanhe as ações sociais 
            que transformam vidas em Roraima
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filter === 'events' ? 'primary' : 'outline'}
                onClick={() => setFilter('events')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </Button>
              <Button
                variant={filter === 'actions' ? 'primary' : 'outline'}
                onClick={() => setFilter('actions')}
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Ações Sociais
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos e ações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                variant="glass"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      {(filter === 'all' || filter === 'events') && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Próximos Eventos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Participe dos nossos eventos e ajude a fortalecer nossa comunidade
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loading size="lg" text="Carregando eventos..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <Card 
                    key={event.id}
                    variant="glass" 
                    className="group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <p className="text-sm opacity-90">Imagem do Evento</p>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-gray-800 group-hover:text-primary-600 transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                          {event.location}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary-50"
                        onClick={() => navigate(`/evento/${event.id}`)}
                      >
                        Saiba Mais
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Social Actions Section */}
      {(filter === 'all' || filter === 'actions') && (
        <section className="py-20 px-4 bg-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Ações Sociais em Andamento
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Programas contínuos que fazem a diferença na vida das pessoas
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loading size="lg" text="Carregando ações sociais..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredActions.map((action, index) => (
                  <Card 
                    key={action.id}
                    variant="glass" 
                    className="group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="w-8 h-8" />
                        </div>
                        <p className="text-sm opacity-90">Ação Social</p>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-800 group-hover:text-primary-600 transition-colors">
                          {action.title}
                        </CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                          {getStatusLabel(action.status)}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {action.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Beneficiários:</span>
                          <span className="font-semibold text-primary-600">{action.beneficiaries} pessoas</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Início:</span>
                          <span className="font-semibold text-gray-700">{formatDate(action.start_date)}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full group-hover:bg-primary-50">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Participe dos Nossos Eventos
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Sua presença faz a diferença. Junte-se a nós em nossos próximos eventos 
            e ações sociais em Roraima.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/eventos')}>
              <Calendar className="w-5 h-5 mr-2" />
              Ver Agenda Completa
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => navigate('/contato')}>
              <Users className="w-5 h-5 mr-2" />
              Seja Voluntário
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Eventos
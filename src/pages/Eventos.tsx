import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Loading } from '../components/ui/Loading'
import { eventService, socialActionService } from '../lib/supabaseClient'
import { type Event, type SocialAction } from '../lib/types'
import { Calendar, MapPin, Users, Image as ImageIcon, Search } from 'lucide-react'
import { Input } from '../components/ui/Input'

const Eventos: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
        // Em produção: deixar arrays vazios para mostrar mensagem apropriada
        setEvents([])
        setSocialActions([])
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
      case 'active': return t('events.status.active')
      case 'completed': return t('events.status.completed')
      case 'planned': return t('events.status.planned')
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
            {t('events.hero_title')}
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            {t('events.hero_subtitle')}
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
                {t('events.filter_all')}
              </Button>
              <Button
                variant={filter === 'events' ? 'primary' : 'outline'}
                onClick={() => setFilter('events')}
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('events.filter_events')}
              </Button>
              <Button
                variant={filter === 'actions' ? 'primary' : 'outline'}
                onClick={() => setFilter('actions')}
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                {t('events.filter_actions')}
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('events.search_placeholder')}
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
                {t('events.upcoming_events_title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('events.upcoming_events_subtitle')}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loading size="lg" text={t('events.loading') || 'Carregando...'} />
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
                        <p className="text-sm opacity-90">{t('events.event_image')}</p>
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
                        {t('events.learn_more')}
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
                {t('events.ongoing_actions_title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('events.ongoing_actions_subtitle')}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loading size="lg" text={t('events.loading_actions')} />
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
                        <p className="text-sm opacity-90">{t('events.social_action')}</p>
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
                          <span className="text-gray-500">{t('events.beneficiaries')}:</span>
                          <span className="font-semibold text-primary-600">{action.beneficiaries} {t('events.people')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{t('events.start_date')}:</span>
                          <span className="font-semibold text-gray-700">{formatDate(action.start_date)}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full group-hover:bg-primary-50">
                        {t('events.learn_more')}
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
            {t('events.cta_title')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {t('events.cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/eventos')}>
              <Calendar className="w-5 h-5 mr-2" />
              {t('events.view_full_schedule')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => navigate('/contato')}>
              <Users className="w-5 h-5 mr-2" />
              {t('events.become_volunteer')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Eventos
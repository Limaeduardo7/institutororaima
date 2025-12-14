import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Loading } from '../components/ui/Loading'
import { type SocialAction } from '../lib/types'
import { Heart, Users, MapPin, Calendar, ArrowRight, Target, Eye, Handshake } from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeProjects, setActiveProjects] = useState<SocialAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActiveProjects = async () => {
      try {
        // Importar dinamicamente para evitar erro na primeira carga
        const { socialActionService } = await import('../lib/supabaseClient')
        const projects = await socialActionService.getActive()
        setActiveProjects(projects.slice(0, 3)) // Show top 3 active projects
      } catch (error) {
        console.error('Failed to load active projects:', error)
        // Fallback para dados de demonstração
        setActiveProjects([
          {
            id: '1',
            title: 'Alimentação Solidária',
            description: 'Distribuição de cestas básicas para famílias em vulnerabilidade social',
            beneficiaries: 150,
            status: 'active' as const,
            start_date: '2024-01-01',
            image_url: '/images/alimentacao-solidaria.jpg',
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          },
          {
            id: '2',
            title: 'Educação Infantil',
            description: 'Programa de reforço escolar para crianças de 6 a 12 anos',
            beneficiaries: 80,
            status: 'active' as const,
            start_date: '2024-02-01',
            image_url: '/images/educacao-infantil.jpg',
            created_at: '2024-02-01',
            updated_at: '2024-02-01'
          },
          {
            id: '3',
            title: 'Saúde Comunitária',
            description: 'Atendimento médico básico e campanhas de prevenção',
            beneficiaries: 200,
            status: 'active' as const,
            start_date: '2024-03-01',
            image_url: '/images/saude-comunitaria.jpg',
            created_at: '2024-03-01',
            updated_at: '2024-03-01'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadActiveProjects()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-home" style={{ marginTop: '80px' }}>
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            {t('home.hero.title')}
          </h1>
          <p className="body-large mb-10 max-w-4xl mx-auto text-balance">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="btn-primary animate-float inline-flex items-center"
              onClick={() => navigate('/doacoes')}
            >
              <Heart className="w-5 h-5 mr-3" />
              {t('home.hero.cta')}
            </button>
            <button
              className="btn-secondary inline-flex items-center"
              onClick={() => navigate('/quem-somos')}
            >
              <Users className="w-5 h-5 mr-3" />
              {t('home.hero.learn_more')}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-primary-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-primary-600 mb-3 group-hover:scale-110 transition-transform duration-300">27</div>
                <p className="text-neutral-700 font-medium text-lg">{t('home.stats.years')}</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-accent-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-accent-600 mb-3 group-hover:scale-110 transition-transform duration-300">5,000+</div>
                <p className="text-neutral-700 font-medium text-lg">{t('home.stats.lives')}</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-orange-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">15</div>
                <p className="text-neutral-700 font-medium text-lg">{t('home.stats.projects')}</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-purple-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                <p className="text-neutral-700 font-medium text-lg">{t('home.stats.transparency')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 px-4 glass-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-20 text-balance">
            {t('home.principles.title')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon mission group-hover:scale-110">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">{t('home.principles.mission_title')}</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  {t('home.principles.mission_text')}
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon vision group-hover:scale-110">
                  <Eye className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">{t('home.principles.vision_title')}</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  {t('home.principles.vision_text')}
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon values group-hover:scale-110">
                  <Handshake className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">{t('home.principles.values_title')}</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  {t('home.principles.values_text')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Projects */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="section-title mb-6 text-balance">
              {t('home.projects.title')}
            </h2>
            <p className="body-large max-w-3xl mx-auto text-balance">
              {t('home.projects.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loading size="lg" text={t('home.projects.loading')} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
              {activeProjects.map((project, index) => {
                const projectImages = [
                  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop', // Alimentação
                  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', // Educação
                  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop', // Saúde
                  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop', // Capacitação
                  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop'  // Horta
                ];
                
                return (
                <Card 
                  key={project.id} 
                  variant="glass" 
                  className="group animate-fade-in"
                >
                  <div className="aspect-video rounded-t-lg relative overflow-hidden">
                    <img 
                      src={projectImages[index] || projectImages[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
                        <Heart className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">{t('home.projects.active')}</p>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors leading-tight">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <p className="text-neutral-600 mb-6 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-neutral-500">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <Users className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-medium">{project.beneficiaries} {t('home.projects.beneficiaries')}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="font-medium">{t('home.projects.active_since')} {new Date(project.start_date).getFullYear()}</span>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full inline-flex items-center justify-center"
                      onClick={() => navigate('/eventos')}
                    >
                      {t('home.projects.learn_more')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          )}

          <div className="text-center">
            <button
              className="btn-secondary inline-flex items-center"
              onClick={() => navigate('/eventos')}
            >
              <Calendar className="w-5 h-5 mr-3" />
              {t('home.projects.view_all')}
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 glass-section">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title mb-8 text-balance">
            {t('home.cta.title')}
          </h2>
          <p className="body-large mb-12 max-w-3xl mx-auto text-balance">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="btn-primary inline-flex items-center"
              onClick={() => navigate('/doacoes')}
            >
              <Heart className="w-5 h-5 mr-3" />
              {t('home.cta.donate')}
            </button>
            <button
              className="btn-secondary inline-flex items-center"
              onClick={() => navigate('/localizacao')}
            >
              <MapPin className="w-5 h-5 mr-3" />
              {t('home.cta.visit')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
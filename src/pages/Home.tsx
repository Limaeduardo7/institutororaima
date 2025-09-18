import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Loading } from '../components/ui/Loading'
import { type SocialAction } from '../lib/types'
import { Heart, Users, MapPin, Calendar, ArrowRight, Target, Eye, Handshake } from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
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
            Instituto Estação
          </h1>
          <p className="body-large mb-10 max-w-4xl mx-auto text-balance">
            Transformando vidas em Roraima desde 1997 através de ações sociais, 
            educação e desenvolvimento comunitário sustentável
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              className="btn-primary animate-float inline-flex items-center"
              onClick={() => navigate('/doacoes')}
            >
              <Heart className="w-5 h-5 mr-3" />
              Fazer Doação
            </button>
            <button 
              className="btn-secondary inline-flex items-center"
              onClick={() => navigate('/quem-somos')}
            >
              <Users className="w-5 h-5 mr-3" />
              Conheça Nosso Trabalho
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
                <p className="text-neutral-700 font-medium text-lg">Anos de História</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-accent-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-accent-600 mb-3 group-hover:scale-110 transition-transform duration-300">5,000+</div>
                <p className="text-neutral-700 font-medium text-lg">Vidas Impactadas</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-orange-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-orange-600 mb-3 group-hover:scale-110 transition-transform duration-300">15</div>
                <p className="text-neutral-700 font-medium text-lg">Projetos Ativos</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center animate-slide-up group bg-white/95 border border-purple-200">
              <CardContent className="p-8">
                <div className="text-5xl font-black text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                <p className="text-neutral-700 font-medium text-lg">Transparência</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 px-4 glass-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-20 text-balance">
            Nossos Princípios Fundamentais
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon mission group-hover:scale-110">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">Missão</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  Promover o desenvolvimento humano e social das comunidades de Roraima, 
                  oferecendo oportunidades sustentáveis de educação, saúde e cidadania.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon vision group-hover:scale-110">
                  <Eye className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">Visão</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  Ser reconhecida como referência em desenvolvimento social no Norte do Brasil, 
                  criando impacto positivo e duradouro na vida das comunidades.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass" className="text-center group">
              <CardHeader className="pb-4">
                <div className="value-icon values group-hover:scale-110">
                  <Handshake className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-800 mb-4">Valores</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-neutral-600 leading-relaxed text-lg text-balance">
                  Transparência total, solidariedade ativa, dignidade humana, 
                  sustentabilidade ambiental e compromisso com a transformação social.
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
              Projetos Transformadores
            </h2>
            <p className="body-large max-w-3xl mx-auto text-balance">
              Conheça algumas das iniciativas que estão criando impacto real 
              e mudando vidas em nossa comunidade
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loading size="lg" text="Carregando projetos..." />
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
                      <p className="text-sm font-medium">Projeto Ativo</p>
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
                        <span className="font-medium">{project.beneficiaries} beneficiários atendidos</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-accent-600" />
                        </div>
                        <span className="font-medium">Ativo desde {new Date(project.start_date).getFullYear()}</span>
                      </div>
                    </div>
                    
                    <button 
                      className="btn-primary w-full inline-flex items-center justify-center"
                      onClick={() => navigate('/eventos')}
                    >
                      Saiba Mais
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
              Ver Todos os Projetos
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 glass-section">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title mb-8 text-balance">
            Faça Parte Desta Transformação
          </h2>
          <p className="body-large mb-12 max-w-3xl mx-auto text-balance">
            Sua contribuição pode mudar vidas. Junte-se a nós nesta jornada 
            de impacto social sustentável em Roraima.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              className="btn-primary inline-flex items-center"
              onClick={() => navigate('/doacoes')}
            >
              <Heart className="w-5 h-5 mr-3" />
              Fazer Doação Agora
            </button>
            <button 
              className="btn-secondary inline-flex items-center"
              onClick={() => navigate('/localizacao')}
            >
              <MapPin className="w-5 h-5 mr-3" />
              Visite Nossa Sede
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
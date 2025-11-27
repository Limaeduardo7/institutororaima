import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
  Calendar, 
  Award, 
  Users, 
  Heart, 
  Target, 
  MapPin, 
  BookOpen, 
  Stethoscope,
  Home,
  Utensils,
  Briefcase,
  Star,
  User,
  Crown
} from 'lucide-react'

const QuemSomos: React.FC = () => {
  const navigate = useNavigate()
  const milestones = [
    {
      year: 1997,
      title: 'Fundação do Instituto',
      description: 'O Instituto Estação nasce em Boa Vista com o objetivo de promover desenvolvimento social em Roraima',
      icon: <Star className="w-6 h-6" />
    },
    {
      year: 2000,
      title: 'Primeiros Programas Educacionais',
      description: 'Início dos programas de alfabetização e reforço escolar para crianças e adultos',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      year: 2005,
      title: 'Expansão para Saúde Comunitária',
      description: 'Criação do programa de saúde básica e campanhas de prevenção',
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      year: 2010,
      title: 'Habitação Solidária',
      description: 'Lançamento do projeto de moradia popular e reforma de casas',
      icon: <Home className="w-6 h-6" />
    },
    {
      year: 2015,
      title: 'Segurança Alimentar',
      description: 'Criação do programa de distribuição de cestas básicas e hortas comunitárias',
      icon: <Utensils className="w-6 h-6" />
    },
    {
      year: 2020,
      title: 'Capacitação Profissional',
      description: 'Início dos cursos profissionalizantes e programa de geração de renda',
      icon: <Briefcase className="w-6 h-6" />
    }
  ]

  const values = [
    {
      title: 'Transparência',
      description: 'Prestação de contas clara e acessível de todos os recursos recebidos e aplicados',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Solidariedade',
      description: 'Compromisso com o bem-estar coletivo e apoio mútuo entre comunidades',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Dignidade',
      description: 'Respeito à dignidade humana em todas as ações e programas desenvolvidos',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Sustentabilidade',
      description: 'Desenvolvimento de soluções duradouras que promovam autonomia das comunidades',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Inclusão',
      description: 'Garantia de acesso equitativo aos nossos programas, sem qualquer forma de discriminação',
      color: 'text-pink-600 bg-pink-100'
    },
    {
      title: 'Inovação',
      description: 'Busca constante por novas metodologias e tecnologias sociais eficazes',
      color: 'text-indigo-600 bg-indigo-100'
    }
  ]

  const achievements = [
    { number: '27', label: 'Anos de Atuação', icon: <Calendar className="w-8 h-8" /> },
    { number: '5.247', label: 'Vidas Transformadas', icon: <Users className="w-8 h-8" /> },
    { number: '18', label: 'Programas Ativos', icon: <Target className="w-8 h-8" /> },
    { number: '12', label: 'Bairros Atendidos', icon: <MapPin className="w-8 h-8" /> },
    { number: '47', label: 'Parceiros Locais', icon: <Heart className="w-8 h-8" /> },
    { number: '100%', label: 'Transparência', icon: <Award className="w-8 h-8" /> }
  ]

  const founders = [
    {
      name: 'Jarlisson Parente',
      role: 'Presidente Fundador',
      bio: 'Formado em Gestão de Análise de Sistemas, Gestão Pública, especialista no terceiro setor, Comércio Exterior e Ciência Pública. Professor e fundador do Instituto Estação, tem a responsabilidade de liderar a organização, definir sua direção estratégica e garantir que alcance os objetivos de forma eficaz. Estabelece a cultura organizacional e toma decisões cruciais para o sucesso do Instituto. Originou a identificação de promover aos jovens de baixa renda a inclusão social oferecendo esporte, palestras e cursos de educação profissional e capacitação para o mercado de trabalho, utilizando recursos tecnológicos nas atividades sociais e culturais.',
      specialties: ['Gestão Pública', 'Terceiro Setor', 'Educação Profissional', 'Inclusão Social', 'Tecnologia Social'],
      icon: <Crown className="w-6 h-6" />,
      image: '/WhatsApp Image 2025-11-17 at 18.20.19.jpeg'
    },
    {
      name: 'Naila Rodrigues',
      role: 'Coordenadora',
      bio: 'Formada em Educadora Física, Pedagoga e Técnica em Enfermagem. Tem o propósito de cuidar de vidas e ensinar através do Instituto Estação.',
      specialties: ['Educação Física', 'Pedagogia', 'Enfermagem', 'Cuidado Social'],
      icon: <User className="w-6 h-6" />,
      image: '/WhatsApp Image 2025-11-17 at 18.14.35.jpeg'
    },
    {
      name: 'Nara Araújo',
      role: 'Administradora',
      bio: 'Formada em Administração, com qualificação em Gestão Pública e base técnica em Magistério e Patologia Clínica. Profissional versátil, dedicada e comprometida em unir gestão, educação e saúde para gerar resultados, eficiência e impacto positivo.',
      specialties: ['Administração', 'Gestão Pública', 'Magistério', 'Patologia Clínica'],
      icon: <User className="w-6 h-6" />,
      image: '/WhatsApp Image 2025-11-17 at 18.18.25.jpeg'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-about">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Nossa História
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            27 anos transformando vidas em Roraima através do comprometimento 
            com o desenvolvimento social e humano sustentável
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Instituto Estação
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Fundado em <strong>1997</strong> na cidade de Boa Vista, Roraima, 
                  o Instituto Estação nasceu do sonho de um grupo de voluntários 
                  comprometidos em transformar a realidade social do estado mais 
                  setentrional do Brasil.
                </p>
                <p>
                  Durante mais de duas décadas, temos sido uma ponte entre a esperança 
                  e a realidade para milhares de famílias roraimenses. Nossa atuação 
                  se concentra nas áreas de <strong>educação</strong>, <strong>saúde</strong>, 
                  <strong>habitação</strong>, <strong>segurança alimentar</strong> e  
                  <strong>geração de renda</strong>.
                </p>
                <p>
                  Reconhecemos Roraima como um estado de grandes potencialidades e 
                  desafios únicos. Por isso, desenvolvemos programas específicos que 
                  respeitam a diversidade cultural local, incluindo comunidades indígenas, 
                  imigrantes venezuelanos e famílias em situação de vulnerabilidade.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index} 
                  variant="glass" 
                  className="text-center p-4 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-primary-600 mb-3 flex justify-center">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary-800 mb-2">
                    {achievement.number}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {achievement.label}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Nossa Trajetória
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-purple-400"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="relative flex items-start space-x-6 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    {milestone.icon}
                  </div>
                  
                  <Card variant="glass" className="flex-1 group hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-primary-800">
                          {milestone.title}
                        </CardTitle>
                        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {milestone.year}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Nossos Fundadores e Liderança
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça as pessoas visionárias que deram início a esta jornada 
              de transformação social em Roraima
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card 
                key={index} 
                variant="glass" 
                className="group hover:scale-105 transition-all duration-300 text-center"
              >
                <CardHeader className="pb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className={`w-full h-full object-cover ${founder.name === 'Jarlisson Parente' ? 'object-top' : ''}`}
                    />
                  </div>
                  <CardTitle className="text-primary-800 text-xl">
                    {founder.name}
                  </CardTitle>
                  <p className="text-primary-600 font-semibold">
                    {founder.role}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {founder.bio}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Especialidades:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {founder.specialties.map((specialty, specIndex) => (
                        <span 
                          key={specIndex}
                          className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leadership Message */}
          <Card variant="glass" className="mt-12 p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-primary-800">
                Mensagem da Liderança
              </h3>
              <blockquote className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto italic">
                "Fundamos o Instituto Estação com a convicção de que toda pessoa 
                merece oportunidades para crescer e prosperar. Durante mais de duas 
                décadas, temos testemunhado transformações extraordinárias nas vidas 
                das famílias que atendemos. Nossa missão continua sendo ser uma ponte 
                entre a realidade atual e o futuro que sonhamos para Roraima."
              </blockquote>
              <p className="text-primary-600 font-semibold mt-4">
                - Equipe Fundadora do Instituto Estação
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Princípios que norteiam todas as nossas ações e decisões 
              em prol da transformação social
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                variant="glass" 
                className="group hover:scale-105 transition-all duration-300"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${value.color}`}>
                    <Heart className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-gray-800 group-hover:text-primary-600 transition-colors">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Focus */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                Roraima: Nossa Casa
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Roraima é um estado único, com características geográficas, 
                  culturais e sociais que exigem abordagens específicas para 
                  o desenvolvimento social.
                </p>
                <p>
                  Nossa sede fica localizada no <strong>Jardim Bela Vista</strong>, 
                  em Boa Vista, mas nossa atuação se estende por diversos bairros 
                  da capital e municípios do interior do estado.
                </p>
                <p>
                  Trabalhamos diretamente com comunidades indígenas, famílias 
                  migrantes venezuelanas, e populações urbanas e rurais em 
                  situação de vulnerabilidade social.
                </p>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/localizacao')}>
                  <MapPin className="w-5 h-5 mr-2" />
                  Nossa Localização
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/eventos')}>
                  <Users className="w-5 h-5 mr-2" />
                  Conheça Nossos Projetos
                </Button>
              </div>
            </div>
            
            <Card variant="glass" className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-primary-800">
                Nosso Alcance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Boa Vista (Capital)</span>
                  <span className="font-semibold">8 bairros atendidos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interior do Estado</span>
                  <span className="font-semibold">15 municípios</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Comunidades Indígenas</span>
                  <span className="font-semibold">6 comunidades</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Famílias Migrantes</span>
                  <span className="font-semibold">350+ famílias</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Seja Parte da Nossa História
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Convidamos você a fazer parte desta jornada de transformação 
            social em Roraima. Juntos, podemos escrever um futuro melhor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/doacoes')}>
              <Heart className="w-5 h-5 mr-2" />
              Quero Contribuir
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

export default QuemSomos
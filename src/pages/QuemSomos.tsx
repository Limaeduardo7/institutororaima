import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const milestones = [
    {
      year: 1997,
      title: t('about.timeline.1997_title'),
      description: t('about.timeline.1997_description'),
      icon: <Star className="w-6 h-6" />
    },
    {
      year: 2000,
      title: t('about.timeline.2000_title'),
      description: t('about.timeline.2000_description'),
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      year: 2005,
      title: t('about.timeline.2005_title'),
      description: t('about.timeline.2005_description'),
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      year: 2010,
      title: t('about.timeline.2010_title'),
      description: t('about.timeline.2010_description'),
      icon: <Home className="w-6 h-6" />
    },
    {
      year: 2015,
      title: t('about.timeline.2015_title'),
      description: t('about.timeline.2015_description'),
      icon: <Utensils className="w-6 h-6" />
    },
    {
      year: 2020,
      title: t('about.timeline.2020_title'),
      description: t('about.timeline.2020_description'),
      icon: <Briefcase className="w-6 h-6" />
    }
  ]

  const values = [
    {
      title: t('about.values.transparency_title'),
      description: t('about.values.transparency_description'),
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: t('about.values.solidarity_title'),
      description: t('about.values.solidarity_description'),
      color: 'text-green-600 bg-green-100'
    },
    {
      title: t('about.values.dignity_title'),
      description: t('about.values.dignity_description'),
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: t('about.values.sustainability_title'),
      description: t('about.values.sustainability_description'),
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: t('about.values.inclusion_title'),
      description: t('about.values.inclusion_description'),
      color: 'text-pink-600 bg-pink-100'
    },
    {
      title: t('about.values.innovation_title'),
      description: t('about.values.innovation_description'),
      color: 'text-indigo-600 bg-indigo-100'
    }
  ]

  const achievements = [
    { number: '27', label: t('about.achievements.years'), icon: <Calendar className="w-8 h-8" /> },
    { number: '5.247', label: t('about.achievements.lives'), icon: <Users className="w-8 h-8" /> },
    { number: '18', label: t('about.achievements.programs'), icon: <Target className="w-8 h-8" /> },
    { number: '12', label: t('about.achievements.neighborhoods'), icon: <MapPin className="w-8 h-8" /> },
    { number: '47', label: t('about.achievements.partners'), icon: <Heart className="w-8 h-8" /> },
    { number: '100%', label: t('about.achievements.transparency'), icon: <Award className="w-8 h-8" /> }
  ]

  const founders = [
    {
      name: 'Jarlisson Parente',
      role: t('about.founders.jarlisson.role'),
      bio: t('about.founders.jarlisson.bio'),
      specialties: ['Gestão Pública', 'Terceiro Setor', 'Educação Profissional', 'Inclusão Social', 'Tecnologia Social'],
      icon: <Crown className="w-6 h-6" />,
      image: '/WhatsApp Image 2025-11-17 at 18.20.19.jpeg'
    },
    {
      name: 'Naila Rodrigues',
      role: t('about.founders.naila.role'),
      bio: t('about.founders.naila.bio'),
      specialties: ['Educação Física', 'Pedagogia', 'Enfermagem', 'Cuidado Social'],
      icon: <User className="w-6 h-6" />,
      image: '/WhatsApp Image 2025-11-17 at 18.14.35.jpeg'
    },
    {
      name: 'Nara Araújo',
      role: t('about.founders.nara.role'),
      bio: t('about.founders.nara.bio'),
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
            {t('about.hero_title')}
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            {t('about.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">
                {t('about.institute_title')}
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('about.institute_description_1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('about.institute_description_2') }} />
                <p dangerouslySetInnerHTML={{ __html: t('about.institute_description_3') }} />
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
            {t('about.timeline_title')}
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
              {t('about.founders_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.founders_subtitle')}
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
                  <div className="w-full aspect-square overflow-hidden mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow rounded-lg">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className={`w-full h-full object-cover ${founder.name.includes('Naila') ? 'object-top' : 'object-center'}`}
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
                      {t('about.specialties')}:
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
                {t('about.leadership_message_title')}
              </h3>
              <blockquote className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto italic">
                "{t('about.leadership_message_text')}"
              </blockquote>
              <p className="text-primary-600 font-semibold mt-4">
                - {t('about.leadership_message_author')}
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
              {t('about.values_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.values_subtitle')}
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
                {t('about.roraima_title')}
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t('about.roraima_description_1')}</p>
                <p dangerouslySetInnerHTML={{ __html: t('about.roraima_description_2') }} />
                <p>{t('about.roraima_description_3')}</p>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/localizacao')}>
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('about.our_location')}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/eventos')}>
                  <Users className="w-5 h-5 mr-2" />
                  {t('about.our_projects')}
                </Button>
              </div>
            </div>
            
            <Card variant="glass" className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-primary-800">
                {t('about.reach_title')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('about.reach.capital')}</span>
                  <span className="font-semibold">{t('about.reach.capital_value')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('about.reach.interior')}</span>
                  <span className="font-semibold">{t('about.reach.interior_value')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('about.reach.indigenous')}</span>
                  <span className="font-semibold">{t('about.reach.indigenous_value')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('about.reach.migrants')}</span>
                  <span className="font-semibold">{t('about.reach.migrants_value')}</span>
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
            {t('about.cta_title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('about.cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/doacoes')}>
              <Heart className="w-5 h-5 mr-2" />
              {t('about.contribute')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => navigate('/contato')}>
              <Users className="w-5 h-5 mr-2" />
              {t('about.volunteer')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default QuemSomos
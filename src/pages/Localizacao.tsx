import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MapPin, Navigation, Clock, Phone, Car, Bus, ExternalLink } from 'lucide-react'

const Localizacao: React.FC = () => {
  const navigate = useNavigate()
  const openGoogleMaps = () => {
    const address = "Rua Rio Negro, Bela Vista, Boa Vista - RR"
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  const openWaze = () => {
    const address = "Rua Rio Negro, Bela Vista, Boa Vista - RR"
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://waze.com/ul?q=${encodedAddress}`, '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-contact">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Nossa Localização
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Venha nos visitar no coração de Boa Vista, Roraima. 
            Estamos prontos para recebê-lo e mostrar nosso trabalho.
          </p>
        </div>
      </section>

      {/* Address and Map Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Address Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  Endereço Completo
                </h2>
                <Card variant="glass" className="p-8 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Instituto Estação
                      </h3>
                      <div className="text-lg text-gray-600 leading-relaxed">
                        <p className="font-medium">Rua Rio Negro, Bela Vista</p>
                        <p>Boa Vista - Roraima</p>
                        <p className="text-sm text-gray-500 mt-2">Escritório administrativo:</p>
                        <p className="font-medium">Rua Aracaju, 725, Novo Horizonte</p>
                        <p>Rorainópolis - Roraima</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button onClick={openGoogleMaps} className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" />
                      Abrir no Google Maps
                    </Button>
                    <Button onClick={openWaze} variant="outline" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir no Waze
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Operating Hours */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary-800">
                    <Clock className="w-6 h-6 mr-2" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">Segunda a Sexta</span>
                      <span className="text-primary-600 font-semibold">7h30 às 17h30</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">Sábados</span>
                      <span className="text-primary-600 font-semibold">8h às 12h</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="font-medium text-gray-700">Domingos</span>
                      <span className="text-gray-500">Fechado</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Visitação:</strong> Recomendamos agendar sua visita antecipadamente 
                      para garantir que possamos recebê-lo adequadamente.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Quick Access */}
              <Card variant="glass" className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary-800">
                    <Phone className="w-6 h-6 mr-2" />
                    Contato Rápido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Telefone Principal</p>
                      <p className="text-lg font-semibold text-gray-800">+55 (41) 98747-9813</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                      <p className="text-lg font-semibold text-gray-800">+55 (41) 98747-9813</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => window.open('https://wa.me/5541987479813', '_blank')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Chamar no WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Container */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  Mapa Interativo
                </h2>
              </div>
              
              <Card variant="glass" className="overflow-hidden">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.814155!2d-60.6749534!3d2.8194444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNDknMTAuNCJOIDYwwrA0MCczMC4wIlc!5e0!3m2!1spt-BR!2sbr!4v1642000000000!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização do Instituto Estação"
                    className="rounded-lg"
                  />
                </div>
              </Card>

              {/* Location Description */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary-800">
                  Sobre a Localização
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Nossa sede está estrategicamente localizada no bairro Bela Vista, 
                    uma das regiões de Boa Vista, facilitando o acesso tanto para 
                    beneficiários quanto para visitantes.
                  </p>
                  <p>
                    A região é bem servida por transporte público e possui fácil acesso 
                    através das principais vias da cidade. Nosso escritório administrativo 
                    em Rorainópolis também atende a população local.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation Section */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Como Chegar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diversas opções de transporte para facilitar sua visita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">De Carro</h3>
              <p className="text-gray-600 leading-relaxed">
                Estacionamento disponível na rua. Acesso pela Av. Major Williams 
                e demais vias do bairro Jardim Bela Vista.
              </p>
            </Card>

            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Transporte Público</h3>
              <p className="text-gray-600 leading-relaxed">
                Diversas linhas de ônibus atendem a região. 
                Pontos próximos na Av. Major Williams e adjacências.
              </p>
            </Card>

            <Card variant="glass" className="text-center p-6 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Aplicativos</h3>
              <p className="text-gray-600 leading-relaxed">
                Uber, 99 e outros aplicativos de transporte atendem normalmente 
                a região com boa cobertura.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Agende Sua Visita
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Conheça de perto nosso trabalho e descubra como você pode 
            fazer parte desta transformação social em Roraima.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/contato')}>
              <Phone className="w-5 h-5 mr-2" />
              Agendar Visita
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600"
              onClick={openGoogleMaps}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Ver Direções
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Localizacao
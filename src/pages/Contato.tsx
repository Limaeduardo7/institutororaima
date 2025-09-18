import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { contactService } from '../lib/supabaseClient'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'

const Contato: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.subject.trim()) newErrors.subject = 'Assunto é obrigatório'
    if (!formData.message.trim()) newErrors.message = 'Mensagem é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await contactService.create(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-contact">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            Fale Conosco
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Estamos aqui para ouvir você. Entre em contato e saiba como 
            pode fazer parte da nossa missão em Roraima.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  Informações para Contato
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Nossa equipe está pronta para atendê-lo e esclarecer todas as suas dúvidas 
                  sobre nossos projetos e como você pode contribuir.
                </p>
              </div>

              <div className="space-y-6">
                <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Endereço</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Rua Rio Negro, Bela Vista<br />
                        Boa Vista - Roraima<br />
                        <span className="text-sm text-gray-500 mt-1 block">Escritório administrativo:</span>
                        Rua Aracaju, 725, Novo Horizonte<br />
                        Rorainópolis - Roraima
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Telefones</h3>
                      <p className="text-gray-600">
                        +55 (41) 98747-9813
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">E-mails</h3>
                      <p className="text-gray-600">
                        institutoestacao100@gmail.com
                      </p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Horário de Funcionamento</h3>
                      <p className="text-gray-600">
                        Segunda a Sexta: 7h30 às 17h30<br />
                        Sábados: 8h às 12h<br />
                        Domingos: Fechado
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card variant="glass" className="p-8">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    Envie sua Mensagem
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {success ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Obrigado pelo seu contato. Responderemos em breve.
                      </p>
                      <Button onClick={() => setSuccess(false)} variant="outline">
                        Enviar Nova Mensagem
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Nome *"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={errors.name}
                          variant="glass"
                        />
                        <Input
                          label="Telefone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="glass"
                        />
                      </div>
                      
                      <Input
                        label="E-mail *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        variant="glass"
                      />
                      
                      <Input
                        label="Assunto *"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                        variant="glass"
                      />
                      
                      <Textarea
                        label="Mensagem *"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        variant="glass"
                        placeholder="Conte-nos como podemos ajudar..."
                      />
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
                        loading={loading}
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {loading ? 'Enviando...' : 'Enviar Mensagem'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Vamos Transformar Vidas Juntos
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Sua participação é fundamental para continuarmos nosso trabalho 
            de desenvolvimento social em Roraima.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/localizacao')}>
              <MapPin className="w-5 h-5 mr-2" />
              Como Chegar
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => window.open('https://wa.me/5541987479813', '_blank')}>
              <Phone className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contato
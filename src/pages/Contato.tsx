import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { contactService } from '../lib/supabaseClient'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'

const Contato: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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

    if (!formData.name.trim()) newErrors.name = t('contact.validation.name_required')
    if (!formData.email.trim()) newErrors.email = t('contact.validation.email_required')
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('contact.validation.email_invalid')
    if (!formData.subject.trim()) newErrors.subject = t('contact.validation.subject_required')
    if (!formData.message.trim()) newErrors.message = t('contact.validation.message_required')

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
            {t('contact.hero_title')}
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            {t('contact.hero_subtitle')}
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
                  {t('contact.info_title')}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('contact.info_description')}
                </p>
              </div>

              <div className="space-y-6">
                <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{t('contact.address')}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Rua Rio Negro, Bela Vista<br />
                        Boa Vista - Roraima<br />
                        <span className="text-sm text-gray-500 mt-1 block">{t('contact.office_label')}</span>
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
                      <h3 className="font-semibold text-gray-800 mb-2">{t('contact.phone_label')}</h3>
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
                      <h3 className="font-semibold text-gray-800 mb-2">{t('contact.email_label')}</h3>
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
                      <h3 className="font-semibold text-gray-800 mb-2">{t('contact.business_hours')}</h3>
                      <p className="text-gray-600">
                        {t('contact.monday_friday')}<br />
                        {t('contact.saturday')}<br />
                        {t('contact.sunday')}
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
                    {t('contact.form_title')}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {success ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        {t('contact.success')}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {t('contact.success_description')}
                      </p>
                      <Button onClick={() => setSuccess(false)} variant="outline">
                        {t('contact.send_new_message')}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label={t('contact.name')}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={errors.name}
                          variant="glass"
                        />
                        <Input
                          label={t('contact.phone')}
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="glass"
                        />
                      </div>

                      <Input
                        label={t('contact.email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        variant="glass"
                      />

                      <Input
                        label={t('contact.subject')}
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                        variant="glass"
                      />

                      <Textarea
                        label={t('contact.message')}
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        variant="glass"
                        placeholder={t('contact.message_placeholder')}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        loading={loading}
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {loading ? t('contact.sending') : t('contact.send')}
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
            {t('contact.cta.title')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {t('contact.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/localizacao')}>
              <MapPin className="w-5 h-5 mr-2" />
              {t('contact.cta.directions_button')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => window.open('https://wa.me/5541987479813', '_blank')}>
              <Phone className="w-5 h-5 mr-2" />
              {t('contact.cta.whatsapp_button')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contato
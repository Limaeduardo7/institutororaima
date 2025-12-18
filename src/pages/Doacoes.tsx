import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { processDonation } from '../lib/mercadoPagoService'
import { processPayPalDonation, PAYPAL_CURRENCIES, formatCurrency } from '../lib/paypalService'
import {
  Heart,
  CreditCard,
  Smartphone,
  FileText,
  Copy,
  Check,
  QrCode,
  DollarSign,
  Users,
  Home,
  GraduationCap,
  Stethoscope,
  Calendar,
  TrendingUp,
  History,
  Receipt,
  AlertCircle,
  Globe
} from 'lucide-react'

const Doacoes: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto' | 'paypal' | null>(null)
  const [isInternational, setIsInternational] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof PAYPAL_CURRENCIES>('USD')
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  // Verificar status do pagamento ao retornar do Mercado Pago
  useEffect(() => {
    const status = searchParams.get('status')
    if (status === 'success') {
      setSuccess(true)
    } else if (status === 'failure') {
      setError(t('donations.payment_not_approved'))
    } else if (status === 'pending') {
      setError(t('donations.payment_pending'))
    }
  }, [searchParams, t])

  const predefinedAmounts = [25, 50, 100, 200, 500]
  const pixKey = "12345678000195" // Instituto's PIX key
  // const pixQRCode = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const getFinalAmount = () => {
    return selectedAmount || (customAmount ? parseInt(customAmount) : 0)
  }

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey)
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy PIX key:', error)
    }
  }

  const handleDonation = async () => {
    const amount = getFinalAmount()
    if (!amount || !paymentMethod) {
      setError(t('donations.error_select_amount'))
      return
    }

    if (amount < 1) {
      setError(isInternational ? t('donations.error_minimum_amount_intl') : t('donations.error_minimum_amount'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (paymentMethod === 'paypal') {
        // Processar doação internacional via PayPal
        await processPayPalDonation({
          amount,
          currency: selectedCurrency,
          donor_name: donorInfo.name || undefined,
          donor_email: donorInfo.email || undefined,
          donor_phone: donorInfo.phone || undefined,
        })
      } else {
        // Processar doação nacional via Mercado Pago
        const checkoutUrl = await processDonation({
          amount,
          donor_name: donorInfo.name || undefined,
          donor_email: donorInfo.email || undefined,
          donor_phone: donorInfo.phone || undefined,
          payment_method: paymentMethod
        })

        // Redirecionar para checkout do Mercado Pago
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('Failed to process donation:', error)
      setError(t('donations.error_processing'))
      setLoading(false)
    }
  }

  // Mock donations history data
  const donationsHistory = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 250,
      method: 'PIX',
      status: t('donations.donation_status.confirmed'),
      purpose: t('donations.causes.food_title'),
      receipt: 'REC001-2024'
    },
    {
      id: 2,
      date: '2024-02-20',
      amount: 100,
      method: 'Cartão de Crédito',
      status: t('donations.donation_status.confirmed'),
      purpose: t('donations.causes.education_title'),
      receipt: 'REC002-2024'
    },
    {
      id: 3,
      date: '2024-03-10',
      amount: 500,
      method: 'PIX',
      status: t('donations.donation_status.confirmed'),
      purpose: t('donations.causes.health_title'),
      receipt: 'REC003-2024'
    },
    {
      id: 4,
      date: '2023-12-25',
      amount: 150,
      method: 'Boleto',
      status: t('donations.donation_status.confirmed'),
      purpose: t('donations.causes.housing_title'),
      receipt: 'REC004-2023'
    },
    {
      id: 5,
      date: '2023-11-18',
      amount: 75,
      method: 'PIX',
      status: t('donations.donation_status.confirmed'),
      purpose: t('donations.causes.food_title'),
      receipt: 'REC005-2023'
    }
  ]

  const totalDonated = donationsHistory.reduce((sum, donation) => sum + donation.amount, 0)
  const totalDonations = donationsHistory.length
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    if (status === t('donations.donation_status.confirmed')) return 'bg-green-100 text-green-800'
    if (status === t('donations.donation_status.pending')) return 'bg-yellow-100 text-yellow-800'
    if (status === t('donations.donation_status.cancelled')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const causes = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t('donations.causes.food_title'),
      description: t('donations.causes.food_description'),
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: t('donations.causes.education_title'),
      description: t('donations.causes.education_description'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: t('donations.causes.health_title'),
      description: t('donations.causes.health_description'),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: t('donations.causes.housing_title'),
      description: t('donations.causes.housing_description'),
      color: "bg-purple-100 text-purple-600"
    }
  ]

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glass" className="max-w-md w-full text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('donations.thank_you')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('donations.thank_you_message')}
          </p>
          <Button
            onClick={() => {
              setSuccess(false)
              setSelectedAmount(null)
              setCustomAmount('')
              setPaymentMethod(null)
              setDonorInfo({ name: '', email: '', phone: '' })
            }}
            className="w-full"
          >
            {t('donations.new_donation')}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-fullscreen hero-donations">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title gradient-text animate-slide-up mb-8 text-balance">
            {t('donations.hero_title')}
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            {t('donations.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-12 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 25</div>
              <p className="text-sm text-gray-600">{t('donations.impact_numbers.food_basket')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 50</div>
              <p className="text-sm text-gray-600">{t('donations.impact_numbers.school_kit')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 100</div>
              <p className="text-sm text-gray-600">{t('donations.impact_numbers.medical_consultation')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 200</div>
              <p className="text-sm text-gray-600">{t('donations.impact_numbers.basic_renovation')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Amount Selection */}
            <div>
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                {t('donations.amount')}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? 'primary' : 'outline'}
                    onClick={() => handleAmountSelect(amount)}
                    className="h-12"
                  >
                    R$ {amount}
                  </Button>
                ))}
              </div>

              <div className="mb-8">
                <Input
                  label={t('donations.custom_amount')}
                  placeholder={t('donations.custom_amount_placeholder')}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  variant="glass"
                />
              </div>

              {/* Donation Type Selection */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <Button
                    variant={!isInternational ? 'primary' : 'outline'}
                    onClick={() => {
                      setIsInternational(false)
                      setPaymentMethod(null)
                    }}
                    className="flex-1"
                  >
                    {t('donations.national')}
                  </Button>
                  <Button
                    variant={isInternational ? 'primary' : 'outline'}
                    onClick={() => {
                      setIsInternational(true)
                      setPaymentMethod('paypal')
                    }}
                    className="flex-1"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {t('donations.international')}
                  </Button>
                </div>
              </div>

              {/* Currency Selection (International only) */}
              {isInternational && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {t('donations.select_currency')}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(PAYPAL_CURRENCIES).map(([code, info]) => (
                      <Card
                        key={code}
                        variant={selectedCurrency === code ? 'elevated' : 'glass'}
                        className={`p-3 cursor-pointer transition-all text-center ${
                          selectedCurrency === code ? 'ring-2 ring-primary-500' : 'hover:scale-105'
                        }`}
                        onClick={() => setSelectedCurrency(code as keyof typeof PAYPAL_CURRENCIES)}
                      >
                        <div className="font-bold text-lg">{info.symbol}</div>
                        <div className="text-xs text-gray-600">{code}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {t('donations.payment_method')}
                </h3>

                <div className="space-y-3">
                  {isInternational ? (
                    // PayPal (International Payment)
                    <Card
                      variant="elevated"
                      className="p-4 ring-2 ring-primary-500"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{t('donations.paypal_card')}</h4>
                          <p className="text-sm text-gray-600">{t('donations.paypal_description')}</p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    // Mercado Pago (National Payment)
                    <>
                      <Card
                        variant={paymentMethod === 'pix' ? 'elevated' : 'glass'}
                        className={`p-4 cursor-pointer transition-all ${
                          paymentMethod === 'pix' ? 'ring-2 ring-primary-500' : 'hover:scale-105'
                        }`}
                        onClick={() => setPaymentMethod('pix')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">PIX</h4>
                            <p className="text-sm text-gray-600">{t('donations.pix_description')}</p>
                          </div>
                        </div>
                      </Card>

                      <Card
                        variant={paymentMethod === 'card' ? 'elevated' : 'glass'}
                        className={`p-4 cursor-pointer transition-all ${
                          paymentMethod === 'card' ? 'ring-2 ring-primary-500' : 'hover:scale-105'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Cartão de Crédito</h4>
                            <p className="text-sm text-gray-600">{t('donations.card_description')}</p>
                          </div>
                        </div>
                      </Card>

                      <Card
                        variant={paymentMethod === 'boleto' ? 'elevated' : 'glass'}
                        className={`p-4 cursor-pointer transition-all ${
                          paymentMethod === 'boleto' ? 'ring-2 ring-primary-500' : 'hover:scale-105'
                        }`}
                        onClick={() => setPaymentMethod('boleto')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Boleto Bancário</h4>
                            <p className="text-sm text-gray-600">{t('donations.boleto_description')}</p>
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {t('donations.donor_info')}
                </h3>
                <Input
                  label={t('donations.name')}
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                  variant="glass"
                />
                <Input
                  label={t('donations.email')}
                  type="email"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  variant="glass"
                />
                <Input
                  label={t('donations.phone')}
                  type="tel"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({...donorInfo, phone: e.target.value})}
                  variant="glass"
                />
              </div>
            </div>

            {/* Donation Summary and PIX Details */}
            <div className="space-y-6">
              {/* Summary */}
              <Card variant="glass" className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary-800">
                  {t('donations.summary_title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('donations.summary_amount')}:</span>
                    <span className="text-2xl font-bold text-primary-800">
                      {isInternational
                        ? formatCurrency(getFinalAmount() || 0, selectedCurrency)
                        : `R$ ${getFinalAmount() || 0}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('donations.summary_method')}:</span>
                    <span className="font-semibold text-gray-800">
                      {paymentMethod === 'pix' ? t('donations.pix') :
                       paymentMethod === 'card' ? t('donations.card') :
                       paymentMethod === 'boleto' ? t('donations.boleto') :
                       paymentMethod === 'paypal' ? t('donations.paypal_card') :
                       isInternational ? t('donations.method_not_selected_intl') : t('donations.method_not_selected')}
                    </span>
                  </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {getFinalAmount() > 0 && paymentMethod && (
                  <Button
                    onClick={handleDonation}
                    className="w-full mt-6"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {loading
                      ? t('donations.processing')
                      : (isInternational ? t('donations.donate_paypal') : t('donations.donate_button'))
                    }
                  </Button>
                )}
              </Card>

              {/* Informação sobre processamento */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  {isInternational ? t('donations.secure_payment_intl') : t('donations.secure_payment')}
                </h3>
                {isInternational ? (
                  <>
                    <div
                      className="text-sm text-gray-600 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: t('donations.paypal_info') }}
                    />
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 text-sm">{t('donations.how_it_works_intl')}</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. {t('donations.paypal_steps.step1')}</li>
                        <li>2. {t('donations.paypal_steps.step2')}</li>
                        <li>3. {t('donations.paypal_steps.step3')}</li>
                        <li>4. {t('donations.paypal_steps.step4')}</li>
                        <li>5. {t('donations.paypal_steps.step5')}</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="text-sm text-gray-600 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: t('donations.mercadopago_info') }}
                    />
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 text-sm">{t('donations.how_it_works')}</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. {t('donations.mercadopago_steps.step1')}</li>
                        <li>2. {t('donations.mercadopago_steps.step2')}</li>
                        <li>3. {t('donations.mercadopago_steps.step3')}</li>
                        <li>4. {t('donations.mercadopago_steps.step4')}</li>
                        <li>5. {t('donations.mercadopago_steps.step5')}</li>
                      </ol>
                    </div>
                  </>
                )}
              </Card>

              {/* Tax Deduction Info */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  {t('donations.tax_deduction_title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('donations.tax_deduction_text')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Donations History Toggle */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center"
          >
            <History className="w-5 h-5 mr-2" />
            {showHistory ? t('donations.history_hide') : t('donations.history_show')}
          </Button>
        </div>
      </section>

      {/* Donations History Section */}
      {showHistory && (
        <section className="py-20 px-4 bg-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                {t('donations.history_title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('donations.history_subtitle')}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card variant="glass" className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  R$ {totalDonated.toLocaleString('pt-BR')}
                </div>
                <p className="text-gray-600">{t('donations.total_donated')}</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  {totalDonations}
                </div>
                <p className="text-gray-600">{t('donations.total_donations')}</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  R$ {Math.round(totalDonated / totalDonations)}
                </div>
                <p className="text-gray-600">{t('donations.average_donation')}</p>
              </Card>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('donations.your_donations')}</h3>

              {donationsHistory.map((donation) => (
                <Card key={donation.id} variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            R$ {donation.amount.toLocaleString('pt-BR')}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-1">
                          <strong>{t('donations.purpose')}:</strong> {donation.purpose}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(donation.date)}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            {donation.method}
                          </div>
                          <div className="flex items-center">
                            <Receipt className="w-4 h-4 mr-1" />
                            {donation.receipt}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Receipt className="w-4 h-4 mr-1" />
                        {t('donations.receipt')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        {t('donations.proof')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Causes Section */}
      <section className="py-20 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              {t('donations.impact_causes_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('donations.impact_causes_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {causes.map((cause, index) => (
              <Card 
                key={index}
                variant="glass" 
                className="text-center p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 ${cause.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {cause.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {cause.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {cause.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('donations.cta_title')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {t('donations.cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/doacoes')}>
              <DollarSign className="w-5 h-5 mr-2" />
              {t('donations.recurring_donation')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-primary-800 font-semibold bg-white/90 hover:bg-white hover:text-primary-600" onClick={() => navigate('/contato')}>
              <Users className="w-5 h-5 mr-2" />
              {t('donations.volunteer')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Doacoes
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { processPagarmeDonation, savePagarmeDonation, type PagarmeDonationData } from '../lib/pagarmeService'
import { processPayPalDonation, PAYPAL_CURRENCIES, formatCurrency, type PayPalDonationData } from '../lib/paypalService'
import { PagarmeCheckout } from '../components/PagarmeCheckout'
import { PaymentSuccess } from '../components/PaymentSuccess'
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
  const [paymentProvider, setPaymentProvider] = useState<'pagarme' | 'paypal'>('pagarme')
  const [selectedCurrency, setSelectedCurrency] = useState<keyof typeof PAYPAL_CURRENCIES>('USD')
  const [isInternational, setIsInternational] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixCopied, setPixCopied] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPagarmeCheckout, setShowPagarmeCheckout] = useState(false)
  const [pagarmeData, setPagarmeData] = useState<PagarmeDonationData | null>(null)
  const [showBankTransfer, setShowBankTransfer] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [successPaymentMethod, setSuccessPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto' | null>(null)

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
      setError(t('donations.error_minimum_amount'))
      return
    }

    // Validar email obrigatório
    if (!donorInfo.email) {
      setError('Email é obrigatório para doações')
      return
    }

    // Validar CPF apenas para Pagar.me (pagamentos nacionais)
    if (paymentMethod !== 'paypal' && (!donorInfo.cpf || donorInfo.cpf.replace(/\D/g, '').length !== 11)) {
      setError('CPF válido é obrigatório para doações')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Processar doação via PayPal (internacional)
      if (paymentMethod === 'paypal') {
        const paypalData: PayPalDonationData = {
          amount,
          currency: selectedCurrency,
          donor_name: donorInfo.name || 'Doador Anônimo',
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone || undefined,
        }

        // Processar e redirecionar para PayPal
        await processPayPalDonation(paypalData)
        return
      }

      // Processar doação via Pagar.me - abrir modal de checkout
      const donationData: PagarmeDonationData = {
        amount,
        donor_name: donorInfo.name || 'Doador Anônimo',
        donor_email: donorInfo.email,
        donor_phone: donorInfo.phone || undefined,
        donor_cpf: donorInfo.cpf,
        payment_method: paymentMethod === 'card' ? 'credit_card' : paymentMethod as 'pix' | 'boleto' | 'credit_card',
      }
      setPagarmeData(donationData)
      setShowPagarmeCheckout(true)
      setLoading(false)
      return
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

  if (success && transactionId && successPaymentMethod && pagarmeData) {
    return (
      <PaymentSuccess
        amount={pagarmeData.amount}
        transactionId={transactionId}
        paymentMethod={successPaymentMethod}
        donorName={pagarmeData.donor_name || 'Doador Anônimo'}
        donorEmail={pagarmeData.donor_email || ''}
        onNewDonation={() => {
          setSuccess(false)
          setTransactionId(null)
          setSuccessPaymentMethod(null)
          setSelectedAmount(null)
          setCustomAmount('')
          setPaymentMethod(null)
          setPagarmeData(null)
          setDonorInfo({ name: '', email: '', phone: '', cpf: '' })
        }}
      />
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



              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {t('donations.payment_method')}
                </h3>

                <div className="space-y-3">
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

                  <Card
                    variant={paymentMethod === 'paypal' ? 'elevated' : 'glass'}
                    className={`p-4 cursor-pointer transition-all ${
                      paymentMethod === 'paypal' ? 'ring-2 ring-primary-500' : 'hover:scale-105'
                    }`}
                    onClick={() => {
                      setPaymentMethod('paypal')
                      setIsInternational(true)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">PayPal</h4>
                        <p className="text-sm text-gray-600">Pagamento internacional seguro</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Currency Selection for PayPal */}
              {paymentMethod === 'paypal' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Moeda
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(PAYPAL_CURRENCIES).map(([code, info]) => (
                      <Button
                        key={code}
                        variant={selectedCurrency === code ? 'primary' : 'outline'}
                        onClick={() => setSelectedCurrency(code as keyof typeof PAYPAL_CURRENCIES)}
                        className="h-12"
                      >
                        {info.symbol} {code}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

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
                {paymentMethod !== 'paypal' && (
                  <Input
                    label="CPF"
                    type="text"
                    value={donorInfo.cpf}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      const formatted = value
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                        .slice(0, 14)
                      setDonorInfo({...donorInfo, cpf: formatted})
                    }}
                    placeholder="000.000.000-00"
                    variant="glass"
                  />
                )}
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
                      R$ {getFinalAmount() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('donations.summary_method')}:</span>
                    <span className="font-semibold text-gray-800">
                      {paymentMethod === 'pix' ? t('donations.pix') :
                       paymentMethod === 'card' ? t('donations.card') :
                       paymentMethod === 'boleto' ? t('donations.boleto') :
                       t('donations.method_not_selected')}
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
                    {loading ? t('donations.processing') : 'Pagar com Pagar.me'}
                  </Button>
                )}
              </Card>

              {/* Informação sobre processamento */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  {t('donations.secure_payment')}
                </h3>
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

              {/* Bank Transfer Info */}
              <Card variant="glass" className="p-6">
                <button
                  onClick={() => setShowBankTransfer(!showBankTransfer)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-600" />
                    Transferência Bancária Manual
                  </h3>
                  <span className="text-gray-600">
                    {showBankTransfer ? '−' : '+'}
                  </span>
                </button>

                {showBankTransfer && (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Prefere fazer uma transferência direta? Use os dados bancários abaixo:
                    </p>

                    {/* PIX */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        PIX (CNPJ)
                      </h4>
                      <div className="flex items-center justify-between">
                        <code className="text-sm text-green-700 font-mono">03.576.906/0001-47</code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await navigator.clipboard.writeText('03576906000147')
                            setPixCopied(true)
                            setTimeout(() => setPixCopied(false), 2000)
                          }}
                          className="ml-2"
                        >
                          {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Dados Bancários Nacionais */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">Dados Bancários (Brasil)</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-semibold">Banco:</span>
                            <p>BRASIL (001)</p>
                          </div>
                          <div>
                            <span className="font-semibold">Agência:</span>
                            <p>3994-2</p>
                          </div>
                          <div>
                            <span className="font-semibold">Conta Corrente:</span>
                            <p>31866-3</p>
                          </div>
                          <div>
                            <span className="font-semibold">Tipo:</span>
                            <p>Corrente</p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <span className="font-semibold">Beneficiário:</span>
                          <p>Instituto Educ Desenvolv Tec Soc</p>
                          <p className="text-xs mt-1">CNPJ: 03.576.906/0001-47</p>
                        </div>
                      </div>
                    </div>

                    {/* Dados Internacionais */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        International Wire Transfer
                      </h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div>
                          <span className="font-semibold">Bank Name:</span>
                          <p>BRASIL</p>
                        </div>
                        <div>
                          <span className="font-semibold">SWIFT Code:</span>
                          <p className="font-mono">BRASBRRJ</p>
                        </div>
                        <div>
                          <span className="font-semibold">IBAN:</span>
                          <p className="font-mono">BR180000000039940000318663C1</p>
                        </div>
                        <div>
                          <span className="font-semibold">Sort Code / ABA:</span>
                          <p>001</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="font-semibold">City:</span>
                            <p>RORAINÓPOLIS</p>
                          </div>
                          <div>
                            <span className="font-semibold">State:</span>
                            <p>RR - RORAIMA</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-semibold">Country:</span>
                          <p>BRAZIL</p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <span className="font-semibold">Account Name:</span>
                          <p>Instituto Educ Desenvolv Tec Soc</p>
                          <p className="text-xs mt-1">Account Type: CORRENTE (Checking)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Importante:</strong> Após realizar a transferência, por favor envie o comprovante para nosso email junto com seus dados para emissão do recibo de doação.
                      </p>
                    </div>
                  </div>
                )}
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

      {/* Modal de Checkout Pagar.me */}
      {showPagarmeCheckout && pagarmeData && (
        <PagarmeCheckout
          amount={pagarmeData.amount}
          donorName={pagarmeData.donor_name || ''}
          donorEmail={pagarmeData.donor_email || ''}
          donorPhone={pagarmeData.donor_phone || ''}
          donorCpf={pagarmeData.donor_cpf || ''}
          paymentMethod={pagarmeData.payment_method}
          onClose={() => {
            setShowPagarmeCheckout(false)
            setPagarmeData(null)
          }}
          onSuccess={async (txId, method) => {
            // Salvar doação no banco
            await savePagarmeDonation(pagarmeData, txId)
            setShowPagarmeCheckout(false)
            setTransactionId(txId)
            setSuccessPaymentMethod(method)
            setSuccess(true)
          }}
          onError={(errorMessage) => {
            setShowPagarmeCheckout(false)
            setError(errorMessage)
          }}
        />
      )}
    </div>
  )
}

export default Doacoes
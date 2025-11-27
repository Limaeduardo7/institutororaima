import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { processDonation } from '../lib/mercadoPagoService'
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
  AlertCircle
} from 'lucide-react'

const Doacoes: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto' | null>(null)
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
      setError('O pagamento não foi aprovado. Tente novamente.')
    } else if (status === 'pending') {
      setError('Pagamento pendente. Aguardando confirmação.')
    }
  }, [searchParams])

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
      setError('Por favor, selecione um valor e método de pagamento')
      return
    }

    if (amount < 1) {
      setError('O valor mínimo para doação é R$ 1,00')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Processar doação via Mercado Pago
      const checkoutUrl = await processDonation({
        amount,
        donor_name: donorInfo.name || undefined,
        donor_email: donorInfo.email || undefined,
        donor_phone: donorInfo.phone || undefined,
        payment_method: paymentMethod
      })

      // Redirecionar para checkout do Mercado Pago
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Failed to process donation:', error)
      setError('Erro ao processar doação. Tente novamente.')
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
      status: 'Confirmada',
      purpose: 'Alimentação Solidária',
      receipt: 'REC001-2024'
    },
    {
      id: 2,
      date: '2024-02-20',
      amount: 100,
      method: 'Cartão de Crédito',
      status: 'Confirmada',
      purpose: 'Educação Infantil',
      receipt: 'REC002-2024'
    },
    {
      id: 3,
      date: '2024-03-10',
      amount: 500,
      method: 'PIX',
      status: 'Confirmada',
      purpose: 'Saúde Comunitária',
      receipt: 'REC003-2024'
    },
    {
      id: 4,
      date: '2023-12-25',
      amount: 150,
      method: 'Boleto',
      status: 'Confirmada',
      purpose: 'Habitação Social',
      receipt: 'REC004-2023'
    },
    {
      id: 5,
      date: '2023-11-18',
      amount: 75,
      method: 'PIX',
      status: 'Confirmada',
      purpose: 'Alimentação Solidária',
      receipt: 'REC005-2023'
    }
  ]

  const totalDonated = donationsHistory.reduce((sum, donation) => sum + donation.amount, 0)
  const totalDonations = donationsHistory.length
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-800'
      case 'Pendente': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const causes = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Alimentação Solidária",
      description: "Cestas básicas para famílias em vulnerabilidade",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Educação Infantil",
      description: "Material escolar e reforço pedagógico",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Saúde Comunitária",
      description: "Atendimento médico e medicamentos",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Habitação Social",
      description: "Reforma e construção de moradias",
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
            Doação Confirmada!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado pela sua generosidade. Sua doação fará a diferença na vida de muitas pessoas.
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
            Fazer Nova Doação
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
            Faça uma Doação
          </h1>
          <p className="body-large max-w-4xl mx-auto text-balance">
            Sua contribuição transforma vidas em Roraima. 
            Cada doação é um passo em direção a um futuro melhor.
          </p>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-12 px-4 bg-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 25</div>
              <p className="text-sm text-gray-600">1 cesta básica</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 50</div>
              <p className="text-sm text-gray-600">Kit escolar completo</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 100</div>
              <p className="text-sm text-gray-600">Consulta médica</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">R$ 200</div>
              <p className="text-sm text-gray-600">Reforma básica</p>
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
                Escolha o Valor
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
                  label="Outro valor"
                  placeholder="Digite o valor"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  variant="glass"
                />
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Forma de Pagamento
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
                        <p className="text-sm text-gray-600">Instantâneo e gratuito</p>
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
                        <p className="text-sm text-gray-600">Parcelamento disponível</p>
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
                        <p className="text-sm text-gray-600">Vencimento em 3 dias</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Seus Dados (Opcional)
                </h3>
                <Input
                  label="Nome completo"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                  variant="glass"
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  variant="glass"
                />
                <Input
                  label="Telefone"
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
                  Resumo da Doação
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor:</span>
                    <span className="text-2xl font-bold text-primary-800">
                      R$ {getFinalAmount() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-semibold text-gray-800">
                      {paymentMethod === 'pix' ? 'PIX' :
                       paymentMethod === 'card' ? 'Cartão de Crédito' :
                       paymentMethod === 'boleto' ? 'Boleto Bancário' : 'Não selecionado'}
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
                    {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
                  </Button>
                )}
              </Card>

              {/* Informação sobre processamento */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Pagamento Seguro
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Seu pagamento será processado com segurança pelo <strong>Mercado Pago</strong>,
                  a plataforma de pagamentos mais confiável do Brasil.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Como funciona:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Clique em "Pagar com Mercado Pago"</li>
                    <li>2. Você será redirecionado para a página segura do Mercado Pago</li>
                    <li>3. Escolha seu método de pagamento preferido (PIX, Cartão ou Boleto)</li>
                    <li>4. Finalize o pagamento</li>
                    <li>5. Você receberá o comprovante por e-mail</li>
                  </ol>
                </div>
              </Card>

              {/* Tax Deduction Info */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Dedução Fiscal
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sua doação pode ser deduzida do Imposto de Renda. Você receberá 
                  o recibo por e-mail para utilizar na declaração anual.
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
            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico de Doações'}
          </Button>
        </div>
      </section>

      {/* Donations History Section */}
      {showHistory && (
        <section className="py-20 px-4 bg-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Histórico de Doações
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Acompanhe todas as suas contribuições para o Instituto Estação
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
                <p className="text-gray-600">Total Doado</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  {totalDonations}
                </div>
                <p className="text-gray-600">Doações Realizadas</p>
              </Card>

              <Card variant="glass" className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  R$ {Math.round(totalDonated / totalDonations)}
                </div>
                <p className="text-gray-600">Média por Doação</p>
              </Card>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Suas Doações</h3>
              
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
                          <strong>Finalidade:</strong> {donation.purpose}
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
                        Recibo
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        Comprovante
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
              Onde Sua Doação Ajuda
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça as principais áreas onde direcionamos os recursos recebidos
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
            Cada Doação Faz a Diferença
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Não existe doação pequena quando o coração é grande. 
            Junte-se a nós nesta missão de transformar vidas em Roraima.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="glass" className="text-primary-800 font-semibold" onClick={() => navigate('/doacoes')}>
              <DollarSign className="w-5 h-5 mr-2" />
              Doação Recorrente
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

export default Doacoes
import React, { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { X, CreditCard, Lock, QrCode, Barcode, Copy, Check, AlertCircle } from 'lucide-react'

interface PagarmeCheckoutProps {
  amount: number
  donorName: string
  donorEmail: string
  donorPhone: string
  donorCpf: string
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  onClose: () => void
  onSuccess: (transactionId: string, paymentMethod: 'pix' | 'credit_card' | 'boleto') => void
  onError: (error: string) => void
}

export const PagarmeCheckout: React.FC<PagarmeCheckoutProps> = ({
  amount,
  donorName,
  donorEmail,
  donorPhone,
  donorCpf,
  paymentMethod,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string } | null>(null)
  const [boletoData, setBoletoData] = useState<{ url: string; barcode: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Estados para dados do cartão de crédito
  const [cardData, setCardData] = useState({
    number: '',
    holder_name: '',
    exp_month: '',
    exp_year: '',
    cvv: '',
    installments: '1',
  })

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19)
  }

  // Função para processar pagamento (todos os métodos)
  const processPayment = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      // Preparar dados base
      const paymentData: any = {
        amount,
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        donor_cpf: donorCpf.replace(/\D/g, ''),
        payment_method: paymentMethod,
      }

      // Adicionar dados do cartão se for pagamento com cartão
      if (paymentMethod === 'credit_card') {
        // Validar campos do cartão
        const cardNumber = cardData.number.replace(/\s/g, '')
        if (cardNumber.length < 13 || cardNumber.length > 19) {
          setErrorMessage('Número do cartão inválido')
          setLoading(false)
          return
        }

        if (!cardData.holder_name.trim()) {
          setErrorMessage('Nome do titular é obrigatório')
          setLoading(false)
          return
        }

        const expMonth = parseInt(cardData.exp_month)
        const expYear = parseInt(cardData.exp_year)

        if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
          setErrorMessage('Mês de validade inválido')
          setLoading(false)
          return
        }

        const currentYear = new Date().getFullYear() % 100
        if (isNaN(expYear) || expYear < currentYear || (expYear === currentYear && expMonth < new Date().getMonth() + 1)) {
          setErrorMessage('Cartão expirado')
          setLoading(false)
          return
        }

        if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
          setErrorMessage('CVV inválido')
          setLoading(false)
          return
        }

        // Adicionar dados do cartão
        paymentData.card = {
          number: cardNumber,
          holder_name: cardData.holder_name.toUpperCase(),
          exp_month: expMonth,
          exp_year: 2000 + expYear,
          cvv: cardData.cvv,
        }
        paymentData.installments = parseInt(cardData.installments)
      }

      const response = await fetch('/.netlify/functions/process-pagarme-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()
      console.log('Resultado do pagamento:', result)

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Erro ao processar pagamento')
      }

      // Verificar se houve erro (status failed)
      if (result.status === 'failed') {
        console.error('Pagamento falhou:', result)
        throw new Error(result.message || 'Pagamento não autorizado. Verifique a configuração da conta Pagar.me.')
      }

      // Processar resposta baseado no método de pagamento
      if (paymentMethod === 'pix') {
        if (result.pixQrCode) {
          setPixData({
            qrCode: result.pixQrCode,
            qrCodeUrl: result.pixQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(result.pixQrCode)}`,
          })
        } else {
          // Mostrar informações de debug se disponíveis
          console.error('Debug info:', result.debug)
          throw new Error(result.message || 'QR Code do PIX não foi gerado. Verifique se o PIX está habilitado na conta Pagar.me.')
        }
      } else if (paymentMethod === 'boleto') {
        if (result.boletoUrl) {
          setBoletoData({
            url: result.boletoUrl,
            barcode: result.boletoBarcode || '',
          })
        } else {
          console.error('Debug info:', result.debug)
          throw new Error(result.message || 'Boleto não foi gerado. Verifique se o boleto está habilitado na conta Pagar.me.')
        }
      } else if (paymentMethod === 'credit_card') {
        if (result.status === 'paid' || result.status === 'authorized') {
          onSuccess(result.transactionId, 'credit_card')
        } else {
          throw new Error(result.message || 'Pagamento recusado pela operadora')
        }
      }
    } catch (error: any) {
      console.error('Erro no checkout Pagar.me:', error)
      setErrorMessage(error.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processPayment()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const handleConfirmPixPayment = () => {
    onSuccess(`PIX-${Date.now()}`, 'pix')
  }

  const handleConfirmBoletoPayment = () => {
    onSuccess(`BOLETO-${Date.now()}`, 'boleto')
  }

  // Se já temos dados do PIX, mostrar QR Code
  if (pixData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card variant="elevated" className="max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              PIX Gerado!
            </h2>
            <p className="text-gray-600">
              Valor: <span className="font-bold text-green-600">R$ {amount.toFixed(2)}</span>
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
            <img
              src={pixData.qrCodeUrl}
              alt="QR Code PIX"
              className="w-full max-w-[200px] mx-auto"
            />
          </div>

          {/* Código PIX para copiar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou copie o código PIX:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pixData.qrCode}
                readOnly
                className="flex-1 p-2 text-xs border rounded-lg bg-gray-50 truncate"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(pixData.qrCode)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> O PIX expira em 24 horas. Após o pagamento, a confirmação pode levar alguns minutos.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPixPayment}
              className="flex-1"
            >
              Já Paguei
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Se já temos dados do Boleto, mostrar informações
  if (boletoData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card variant="elevated" className="max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Barcode className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Boleto Gerado!
            </h2>
            <p className="text-gray-600">
              Valor: <span className="font-bold text-orange-600">R$ {amount.toFixed(2)}</span>
            </p>
          </div>

          {/* Código de barras */}
          {boletoData.barcode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de barras:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={boletoData.barcode}
                  readOnly
                  className="flex-1 p-2 text-xs border rounded-lg bg-gray-50 truncate"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(boletoData.barcode)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> O boleto vence em 3 dias úteis. A confirmação do pagamento pode levar até 2 dias úteis.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              type="button"
              onClick={() => {
                window.open(boletoData.url, '_blank')
                handleConfirmBoletoPayment()
              }}
              className="flex-1"
            >
              Abrir Boleto
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card variant="elevated" className="max-w-md w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Checkout Pagar.me
          </h2>
          <p className="text-gray-600">
            Valor: <span className="font-bold text-primary-600">R$ {amount.toFixed(2)}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'credit_card' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Cartão de Crédito</h3>
                    <p className="text-sm text-blue-700">Pagamento seguro via Pagar.me</p>
                  </div>
                </div>
              </div>

              {/* Número do cartão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  maxLength={19}
                  autoComplete="cc-number"
                  required
                />
              </div>

              {/* Nome do titular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Titular
                </label>
                <input
                  type="text"
                  value={cardData.holder_name}
                  onChange={(e) => setCardData({ ...cardData, holder_name: e.target.value })}
                  placeholder="NOME COMO NO CARTÃO"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
                  autoComplete="cc-name"
                  required
                />
              </div>

              {/* Validade e CVV */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mês
                  </label>
                  <input
                    type="text"
                    value={cardData.exp_month}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2)
                      setCardData({ ...cardData, exp_month: value })
                    }}
                    placeholder="MM"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    maxLength={2}
                    autoComplete="cc-exp-month"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                  </label>
                  <input
                    type="text"
                    value={cardData.exp_year}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2)
                      setCardData({ ...cardData, exp_year: value })
                    }}
                    placeholder="AA"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    maxLength={2}
                    autoComplete="cc-exp-year"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setCardData({ ...cardData, cvv: value })
                    }}
                    placeholder="123"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    maxLength={4}
                    autoComplete="cc-csc"
                    required
                  />
                </div>
              </div>

              {/* Parcelas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcelas
                </label>
                <select
                  value={cardData.installments}
                  onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>
                      {n}x de R$ {(amount / n).toFixed(2)} {n === 1 ? '(à vista)' : 'sem juros'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : paymentMethod === 'pix' ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <QrCode className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">PIX</h3>
                  <p className="text-sm text-green-700">Pagamento instantâneo</p>
                </div>
              </div>
              <p className="text-sm text-green-800">
                Após clicar em "Gerar PIX", você receberá um QR Code para efetuar o pagamento.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Barcode className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Boleto Bancário</h3>
                  <p className="text-sm text-orange-700">Vencimento em 3 dias</p>
                </div>
              </div>
              <p className="text-sm text-orange-800">
                Após clicar em "Gerar Boleto", o boleto será gerado e você poderá imprimir ou copiar o código de barras.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
            <Lock className="w-4 h-4 mr-1" />
            Pagamento 100% seguro via Pagar.me
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                'Processando...'
              ) : paymentMethod === 'credit_card' ? (
                'Pagar com Cartão'
              ) : paymentMethod === 'pix' ? (
                'Gerar PIX'
              ) : (
                'Gerar Boleto'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

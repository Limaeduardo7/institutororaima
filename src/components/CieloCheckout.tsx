import React, { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { X, CreditCard, Lock, QrCode } from 'lucide-react'
import {
  processCieloDonation,
  detectCardBrand,
  formatCardNumber,
  formatExpirationDate,
  formatCPF,
  CIELO_CARD_BRANDS,
  type CieloDonationData
} from '../lib/cieloService'

interface CieloCheckoutProps {
  amount: number
  donorName: string
  donorEmail: string
  donorPhone: string
  donorCpf: string
  paymentMethod: 'credit_card' | 'debit_card' | 'pix'
  currency?: string
  onClose: () => void
  onSuccess: (transactionId: string, paymentMethod: 'credit_card' | 'debit_card' | 'pix') => void
  onError: (error: string) => void
}

export const CieloCheckout: React.FC<CieloCheckoutProps> = ({
  amount,
  donorName,
  donorEmail,
  donorPhone,
  donorCpf,
  paymentMethod,
  currency = 'BRL',
  onClose,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false)
  const [showPixQrCode, setShowPixQrCode] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState<string | null>(null)
  const [pixTransactionId, setPixTransactionId] = useState<string | null>(null)

  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expirationDate: '',
    cvv: '',
    cpf: donorCpf,
    brand: '',
    installments: 1,
  })

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    const brand = detectCardBrand(formatted)
    setCardData({
      ...cardData,
      number: formatted,
      brand: brand
    })
  }

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value)
    setCardData({ ...cardData, expirationDate: formatted })
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCardData({ ...cardData, cpf: formatted })
  }

  const copyPixCode = async () => {
    if (pixQrCode) {
      try {
        await navigator.clipboard.writeText(pixQrCode)
        alert('Código PIX copiado!')
      } catch (error) {
        console.error('Erro ao copiar código PIX:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let donationData: CieloDonationData

      if (paymentMethod === 'pix') {
        // Pagamento PIX
        donationData = {
          amount,
          currency,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          donor_cpf: donorCpf,
          payment_method: 'pix',
        }
      } else {
        // Pagamento com Cartão
        const cardNumberClean = cardData.number.replace(/\s/g, '')
        const [month, year] = cardData.expirationDate.split('/')

        donationData = {
          amount,
          currency,
          donor_name: donorName || 'Doador Anônimo',
          donor_email: donorEmail || 'anonimo@doacao.com',
          donor_phone: donorPhone,
          donor_cpf: cardData.cpf || '00000000000',
          payment_method: paymentMethod,
          card_number: cardData.number,
          card_holder: cardData.holderName,
          card_expiration_month: month,
          card_expiration_year: year,
          card_cvv: cardData.cvv,
          card_brand: cardData.brand,
          installments: cardData.installments,
        }
      }

      console.log('Processando pagamento Cielo:', donationData)

      // Processar pagamento
      const result = await processCieloDonation(donationData)

      console.log('Resultado do pagamento:', result)

      if (paymentMethod === 'pix') {
        // Mostrar QR Code do PIX
        if (result.pixQrCode && result.pixQrCodeBase64 && result.transactionId) {
          setPixQrCode(result.pixQrCode)
          setPixQrCodeBase64(result.pixQrCodeBase64)
          setPixTransactionId(result.transactionId)
          setShowPixQrCode(true)
          setLoading(false)
          // Não chamar onSuccess ainda - apenas quando o usuário confirmar que pagou
        } else {
          throw new Error('QR Code do PIX não foi gerado')
        }
      } else {
        // Cartão de crédito/débito
        if (result.status === 'approved') {
          onSuccess(result.transactionId, paymentMethod)
        } else if (result.status === 'pending') {
          // Se houver URL de autenticação (3D Secure para débito)
          if (result.authenticationUrl) {
            // Para cartão de débito, redirecionar para autenticação
            if (paymentMethod === 'debit_card') {
              alert('Você será redirecionado para autenticar sua transação no banco.')
              window.location.href = result.authenticationUrl
              return // Não chamar onSuccess ainda
            } else {
              window.open(result.authenticationUrl, '_blank')
            }
          }
          onSuccess(result.transactionId, paymentMethod)
        } else if (result.status === 'processing') {
          // Pagamento em processamento - aguardar confirmação
          onSuccess(result.transactionId, paymentMethod)
        } else {
          throw new Error(result.message || 'Pagamento não aprovado')
        }
      }
    } catch (error: any) {
      console.error('Erro no checkout Cielo:', error)
      onError(error.message || 'Erro ao processar pagamento')
      setLoading(false)
    }
  }

  const confirmPixPayment = () => {
    // Quando o usuário confirmar que pagou o PIX
    if (pixTransactionId) {
      onSuccess(pixTransactionId, 'pix')
    } else {
      onError('ID da transação não encontrado')
    }
  }

  // Se estiver mostrando QR Code do PIX
  if (showPixQrCode && pixQrCodeBase64) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card variant="elevated" className="max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Pague com PIX
            </h2>
            <p className="text-gray-600 mb-4">
              Valor: <span className="font-bold text-primary-600">{currency === 'USD' ? '$' : 'R$'} {amount.toFixed(2)}</span>
            </p>

            <div className="bg-white p-4 rounded-lg mb-4">
              <img
                src={`data:image/png;base64,${pixQrCodeBase64}`}
                alt="QR Code PIX"
                className="mx-auto"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-600 mb-2">Código PIX (Copia e Cola):</p>
              <code className="text-xs break-all block bg-white p-2 rounded border">
                {pixQrCode}
              </code>
            </div>

            <Button
              variant="outline"
              onClick={copyPixCode}
              className="w-full mb-3"
            >
              Copiar Código PIX
            </Button>

            <Button
              variant="primary"
              onClick={confirmPixPayment}
              className="w-full"
            >
              Já Paguei
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para completar o pagamento.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Formulário de pagamento
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card variant="elevated" className="max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Checkout Cielo
          </h2>
          <p className="text-gray-600">
            Valor: <span className="font-bold text-primary-600">{currency === 'USD' ? '$' : 'R$'} {amount.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Método: {paymentMethod === 'pix' ? 'PIX' :
              paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                'Cartão de Débito'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod !== 'pix' && (
            <>
              <Input
                label="Número do Cartão"
                value={cardData.number}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
              />

              {cardData.brand && (
                <div className="text-sm text-gray-600">
                  Bandeira: <span className="font-semibold">{cardData.brand}</span>
                </div>
              )}

              <Input
                label="Nome no Cartão"
                value={cardData.holderName}
                onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                placeholder="NOME COMO NO CARTÃO"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Validade (MM/AA)"
                  value={cardData.expirationDate}
                  onChange={handleExpirationDateChange}
                  placeholder="MM/AA"
                />

                <Input
                  label="CVV"
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="123"
                />
              </div>

              <Input
                label="CPF do Titular"
                value={cardData.cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
              />

              {paymentMethod === 'credit_card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parcelas
                  </label>
                  <select
                    value={cardData.installments}
                    onChange={(e) => setCardData({ ...cardData, installments: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}x de {currency === 'USD' ? '$' : 'R$'} {(amount / n).toFixed(2)} {n === 1 ? '(à vista)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {paymentMethod === 'pix' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Clique em "Gerar PIX" para criar o QR Code de pagamento.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
            <Lock className="w-4 h-4 mr-1" />
            Pagamento 100% seguro via Cielo
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
              variant="primary"
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Processando...' : paymentMethod === 'pix' ? 'Gerar PIX' : 'Pagar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

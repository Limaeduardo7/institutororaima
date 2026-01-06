import React, { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { X, CreditCard, Lock } from 'lucide-react'

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
  onError,
}) => {
  const [loading, setLoading] = useState(false)

  const [cardData, setCardData] = useState({
    number: '',
    holderName: '',
    expirationDate: '',
    cvv: '',
    cpf: '',
  })

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19)
  }

  const formatExpirationDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5)
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardData({ ...cardData, number: formatted })
  }

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value)
    setCardData({ ...cardData, expirationDate: formatted })
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCardData({ ...cardData, cpf: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let cardInfo: any = undefined

      // Validar dados do cartão
      if (paymentMethod === 'credit_card') {
        if (!cardData.number || !cardData.holderName || !cardData.expirationDate || !cardData.cvv || !cardData.cpf) {
          throw new Error('Preencha todos os campos do cartão')
        }

        const cardNumberClean = cardData.number.replace(/\s/g, '')
        if (cardNumberClean.length < 13 || cardNumberClean.length > 16) {
          throw new Error('Número do cartão inválido')
        }

        const [month, year] = cardData.expirationDate.split('/')
        if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
          throw new Error('Data de expiração inválida')
        }

        const cpfClean = cardData.cpf.replace(/\D/g, '')
        if (cpfClean.length !== 11) {
          throw new Error('CPF inválido')
        }

        // Passar os dados brutos para o backend (o backend cuidará da segurança via sk_key)
        cardInfo = {
          number: cardNumberClean,
          holder_name: cardData.holderName,
          exp_month: parseInt(month),
          exp_year: parseInt('20' + year),
          cvv: cardData.cvv,
        }
      }

      // Chamar a API do Pagar.me
      const response = await fetch('/.netlify/functions/process-pagarme-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          donor_cpf: donorCpf.replace(/\D/g, ''),
          payment_method: paymentMethod,
          card_info: cardInfo,
          card_holder_cpf: paymentMethod === 'credit_card' ? cardData.cpf.replace(/\D/g, '') : donorCpf.replace(/\D/g, ''),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Erro detalhado da API:', error)
        throw new Error(error.error || error.message || 'Erro ao processar pagamento')
      }

      const result = await response.json()
      console.log('Resultado do pagamento:', result)

      // Status válidos para sucesso:
      // - paid: Cartão aprovado
      // - authorized: Cartão autorizado (aguardando captura)
      // - pending: PIX/Boleto aguardando pagamento (sucesso!)
      // - waiting_payment: PIX/Boleto aguardando pagamento (sucesso!)
      if (result.status === 'paid' || result.status === 'authorized') {
        onSuccess(result.transactionId, paymentMethod)
      } else if (result.status === 'pending' || result.status === 'waiting_payment') {
        // Para PIX e Boleto - status pending/waiting_payment é SUCESSO
        if (result.pixQrCode) {
          // Mostrar QR Code do PIX
          window.open(result.pixQrCodeUrl, '_blank')
        } else if (result.boletoUrl) {
          // Abrir Boleto
          window.open(result.boletoUrl, '_blank')
        }
        onSuccess(result.transactionId, paymentMethod)
      } else {
        // Status de falha: failed, refused, canceled, etc.
        console.error('Status não aprovado:', result.status)
        console.error('Detalhes:', result)
        throw new Error(`Pagamento ${result.status}: ${result.message || 'Status não aprovado'}`)
      }
    } catch (error: any) {
      console.error('Erro no checkout Pagar.me:', error)
      onError(error.message || 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card variant="elevated" className="max-w-md w-full p-6 relative">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'credit_card' ? (
            <>
              <Input
                label="Número do Cartão"
                value={cardData.number}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
              />

              <Input
                label="Nome no Cartão"
                value={cardData.holderName}
                onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                placeholder="NOME COMO NO CARTÃO"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Validade"
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
            </>
          ) : paymentMethod === 'pix' ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Após clicar em "Pagar", você receberá um QR Code do PIX para efetuar o pagamento.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-800">
                Após clicar em "Pagar", o boleto será gerado e você poderá imprimir ou copiar o código de barras.
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
                loading={loading}
                disabled={loading}
              >
                {loading ? (
                  'Processando...'
                ) : (
                  'Confirmar Doação'
                )}
              </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

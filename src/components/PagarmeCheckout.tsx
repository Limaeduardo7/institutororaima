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

  // Ref para o formulário
  const formRef = React.useRef<HTMLFormElement>(null)

  // Efeito para inicializar o PagarmeCheckout.init() quando o form estiver pronto
  React.useEffect(() => {
    if (paymentMethod !== 'credit_card') return

    const PagarmeCheckout = (window as any).PagarmeCheckout
    if (PagarmeCheckout && formRef.current) {
      console.log('Inicializando PagarmeCheckout interceptor...')
      PagarmeCheckout.init((data: any) => {
        // Callback de SUCESSO - Recebemos o token
        console.log('Tokenização concluída com sucesso via interceptor:', data)
        // O token vem no campo 'id' do objeto data, ou em 'pagarmetoken' no form
        const token = data.id || (formRef.current?.elements as any).pagarmetoken?.value
        
        if (token) {
          // Chamamos o processamento final enviando o token
          processFinalPayment(token)
        } else {
          onError('Falha ao capturar token de segurança')
          setLoading(false)
        }
        
        // Retornar false para abortar o submit padrão do form
        return false
      }, (error: any) => {
        // Callback de ERRO
        console.error('Erro na tokenização via interceptor:', error)
        const errorMsg = error.errors?.[0]?.message || 'Dados do cartão inválidos'
        onError(errorMsg)
        setLoading(false)
        return false
      })
    }
  }, [paymentMethod])

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

    // Se for cartão, o PagarmeCheckout.init() vai interceptar o evento de submit
    // e chamar o callback de sucesso. Se for PIX ou Boleto, processamos direto.
    if (paymentMethod !== 'credit_card') {
      try {
        await processFinalPayment()
      } catch (error: any) {
        onError(error.message)
        setLoading(false)
      }
    }
  }

  const processFinalPayment = async (cardHash?: string) => {
    try {
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
          card_hash: cardHash,
          card_holder_cpf: paymentMethod === 'credit_card' ? cardData.cpf.replace(/\D/g, '') : donorCpf.replace(/\D/g, ''),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || error.message || 'Erro ao processar pagamento')
      }

      const result = await response.json()
      
      if (result.status === 'paid' || result.status === 'authorized') {
        onSuccess(result.transactionId, paymentMethod)
      } else if (result.status === 'pending' || result.status === 'waiting_payment') {
        if (result.pixQrCode) {
          window.open(result.pixQrCodeUrl, '_blank')
        } else if (result.boletoUrl) {
          window.open(result.boletoUrl, '_blank')
        }
        onSuccess(result.transactionId, paymentMethod)
      } else {
        throw new Error(`Pagamento ${result.status}: ${result.message || 'Status não aprovado'}`)
      }
    } catch (error: any) {
      console.error('Erro no processamento final:', error)
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

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-4"
          data-pagarmecheckout-form
        >
          {paymentMethod === 'credit_card' ? (
            <>
              <Input
                label="Número do Cartão"
                value={cardData.number}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                data-pagarmecheckout-element="number"
              />

              <Input
                label="Nome no Cartão"
                value={cardData.holderName}
                onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                placeholder="Como está no cartão"
                data-pagarmecheckout-element="holder_name"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiração"
                  value={cardData.expirationDate}
                  onChange={handleExpirationDateChange}
                  placeholder="MM/AA"
                  data-pagarmecheckout-element="expiration_date"
                />
                <Input
                  label="CVV"
                  type="password"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="123"
                  data-pagarmecheckout-element="cvv"
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

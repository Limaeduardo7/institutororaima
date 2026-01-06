import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Check, Heart, Download, Mail, Share2, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PaymentSuccessProps {
  amount: number
  transactionId: string
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  donorName: string
  donorEmail: string
  onNewDonation: () => void
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  amount,
  transactionId,
  paymentMethod,
  donorName,
  donorEmail,
  onNewDonation,
}) => {
  const navigate = useNavigate()

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'pix':
        return 'PIX'
      case 'credit_card':
        return 'Cartão de Crédito'
      case 'boleto':
        return 'Boleto Bancário'
      default:
        return 'Pagamento'
    }
  }

  const handleDownloadReceipt = () => {
    // Aqui você pode implementar a lógica para gerar/baixar o recibo
    console.log('Download do recibo:', transactionId)
    // TODO: Implementar download real do recibo
  }

  const handleShare = async () => {
    const shareText = `Acabei de fazer uma doação de R$ ${amount.toFixed(2)} para o Instituto Estação! Você também pode ajudar: ${window.location.origin}/doacoes`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Doação Instituto Estação',
          text: shareText,
          url: `${window.location.origin}/doacoes`,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(shareText)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-2xl w-full">
        {/* Animação de Sucesso */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative inline-block">
            {/* Círculo pulsante de fundo */}
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 animate-pulse"></div>

            {/* Ícone de check */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <Check className="w-14 h-14 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Card Principal */}
        <Card variant="elevated" className="p-8 mb-6 animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Doação Realizada com Sucesso!
            </h1>
            <p className="text-lg text-gray-600">
              {donorName}, muito obrigado pela sua generosidade!
            </p>
          </div>

          {/* Detalhes da Doação */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-500 mr-2 fill-current" />
              <span className="text-4xl font-bold text-primary-800">
                R$ {amount.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">Método de Pagamento:</span>
                <span className="font-semibold text-gray-800">{getPaymentMethodLabel()}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">ID da Transação:</span>
                <span className="font-mono text-xs font-semibold text-gray-800">{transactionId}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600">Data:</span>
                <span className="font-semibold text-gray-800">
                  {new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-800 truncate ml-2">{donorEmail}</span>
              </div>
            </div>
          </div>

          {/* Mensagem de Impacto */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-blue-600" />
              Seu impacto
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Sua doação de <strong>R$ {amount.toFixed(2)}</strong> fará a diferença na vida de muitas pessoas.
              Com sua ajuda, podemos continuar oferecendo educação, saúde, alimentação e moradia digna para
              nossa comunidade. Você acabou de plantar uma semente de esperança!
            </p>
          </div>

          {/* Informações sobre Recibo */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-8 border border-yellow-100">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Comprovante enviado por email</p>
                <p>
                  Enviamos um email de confirmação com o comprovante da sua doação para <strong>{donorEmail}</strong>.
                  Verifique também sua caixa de spam.
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadReceipt}
              className="w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Recibo
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="w-full"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onNewDonation}
              className="w-full"
            >
              <Heart className="w-5 h-5 mr-2" />
              Fazer Nova Doação
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </Card>

        {/* Card de Agradecimento Extra */}
        <Card variant="glass" className="p-6 text-center">
          <p className="text-gray-700 italic">
            "A alegria que se tem em pensar e aprender faz-nos pensar e aprender ainda mais."
          </p>
          <p className="text-sm text-gray-600 mt-2">— Aristóteles</p>
          <p className="text-sm text-primary-600 font-semibold mt-4">
            Obrigado por fazer parte da nossa missão! ❤️
          </p>
        </Card>
      </div>
    </div>
  )
}

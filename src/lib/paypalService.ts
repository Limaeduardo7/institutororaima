import { donationService } from './supabaseClient'

// Credenciais do PayPal
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

// Interface para os dados de doação
export interface PayPalDonationData {
  amount: number
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  message?: string
  currency?: 'USD' | 'EUR' | 'GBP' | 'BRL'
}

// Interface para a resposta do PayPal
export interface PayPalOrder {
  id: string
  status: string
  links: Array<{
    href: string
    rel: string
    method: string
  }>
}

/**
 * Cria uma ordem de pagamento no PayPal
 * Esta função chama a Netlify Function que interage com a API do PayPal
 */
export const createPayPalOrder = async (
  donationData: PayPalDonationData
): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/create-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: donationData.amount,
        currency: donationData.currency || 'USD',
        donor_email: donationData.donor_email,
        donor_name: donationData.donor_name,
        donor_phone: donationData.donor_phone,
        message: donationData.message,
        return_url: `${window.location.origin}/doacoes?status=success&payment=paypal`,
        cancel_url: `${window.location.origin}/doacoes?status=cancelled&payment=paypal`,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar ordem de pagamento')
    }

    const { orderId, approvalUrl } = await response.json()

    // Salvar doação no banco de dados com status pending
    await donationService.create({
      amount: donationData.amount,
      donor_name: donationData.donor_name,
      donor_email: donationData.donor_email,
      donor_phone: donationData.donor_phone,
      payment_method: 'paypal',
      status: 'pending',
      transaction_id: orderId,
      message: donationData.message,
    })

    return approvalUrl
  } catch (error) {
    console.error('PayPal Order Creation Error:', error)
    throw error
  }
}

/**
 * Processa uma doação via PayPal
 * Redireciona para a página de aprovação do PayPal
 */
export const processPayPalDonation = async (
  donationData: PayPalDonationData
): Promise<void> => {
  try {
    // Criar ordem de pagamento
    const approvalUrl = await createPayPalOrder(donationData)

    // Redirecionar para o PayPal
    window.location.href = approvalUrl
  } catch (error) {
    console.error('Failed to process PayPal donation:', error)
    // Mensagem amigável informando que está em desenvolvimento
    throw new Error('Pagamentos internacionais via PayPal estão em desenvolvimento. Por favor, utilize o Mercado Pago para doações nacionais ou entre em contato conosco.')
  }
}

/**
 * Captura uma ordem do PayPal após aprovação do usuário
 */
export const capturePayPalOrder = async (orderId: string): Promise<any> => {
  try {
    const response = await fetch(`/.netlify/functions/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    })

    if (!response.ok) {
      throw new Error('Erro ao capturar ordem do PayPal')
    }

    const order = await response.json()
    return order
  } catch (error) {
    console.error('Error capturing PayPal order:', error)
    throw error
  }
}

/**
 * Moedas suportadas pelo PayPal
 */
export const PAYPAL_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
}

/**
 * Formata valor para exibição baseado na moeda
 */
export const formatCurrency = (
  amount: number,
  currency: keyof typeof PAYPAL_CURRENCIES = 'USD'
): string => {
  const currencyInfo = PAYPAL_CURRENCIES[currency]
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Obtém o Client ID do PayPal para uso no frontend
 */
export const getPayPalClientId = (): string => {
  if (!PAYPAL_CLIENT_ID) {
    throw new Error('PayPal Client ID não configurado')
  }
  return PAYPAL_CLIENT_ID
}

export default {
  createPayPalOrder,
  processPayPalDonation,
  capturePayPalOrder,
  formatCurrency,
  getPayPalClientId,
  PAYPAL_CURRENCIES,
}

import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { donationService } from './supabaseClient'

// Credenciais do Stripe
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY

// Interface para os dados de doação
export interface StripeDonationData {
  amount: number
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  message?: string
  currency?: 'usd' | 'eur' | 'gbp' | 'cad' | 'aud'
}

// Interface para a resposta do Stripe
export interface StripeCheckoutSession {
  id: string
  url: string
}

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Inicializa o Stripe
 */
const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

/**
 * Cria uma sessão de checkout no Stripe
 *
 * IMPORTANTE: Esta é uma implementação frontend simplificada.
 * Em produção, você DEVE criar um endpoint backend para:
 * 1. Criar a sessão de checkout de forma segura
 * 2. Validar os dados no servidor
 * 3. Evitar exposição de chaves secretas
 *
 * Exemplo de endpoint backend (Node.js/Express):
 *
 * ```javascript
 * const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
 *
 * app.post('/api/create-checkout-session', async (req, res) => {
 *   const { amount, donor_email, donor_name, currency } = req.body
 *
 *   const session = await stripe.checkout.sessions.create({
 *     payment_method_types: ['card'],
 *     line_items: [{
 *       price_data: {
 *         currency: currency || 'usd',
 *         product_data: {
 *           name: 'Doação - Instituto Estação',
 *           description: `Doação de ${donor_name || 'Anônimo'}`,
 *         },
 *         unit_amount: Math.round(amount * 100),
 *       },
 *       quantity: 1,
 *     }],
 *     mode: 'payment',
 *     success_url: `${req.headers.origin}/doacoes?status=success&session_id={CHECKOUT_SESSION_ID}`,
 *     cancel_url: `${req.headers.origin}/doacoes?status=cancelled`,
 *     customer_email: donor_email,
 *     metadata: {
 *       donor_name,
 *       donor_phone: req.body.donor_phone,
 *       message: req.body.message,
 *     }
 *   })
 *
 *   res.json({ sessionId: session.id, url: session.url })
 * })
 * ```
 */
export const createStripeCheckout = async (
  donationData: StripeDonationData
): Promise<string> => {
  try {
    // AVISO: Esta é uma implementação simplificada para demonstração
    // Em produção, você DEVE fazer esta chamada através de um backend

    // Para desenvolvimento, vamos simular a criação da sessão
    // Você precisará criar um endpoint backend real para produção

    const response = await fetch('/api/create-stripe-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: donationData.amount,
        currency: donationData.currency || 'usd',
        donor_email: donationData.donor_email,
        donor_name: donationData.donor_name,
        donor_phone: donationData.donor_phone,
        message: donationData.message,
        success_url: `${window.location.origin}/doacoes?status=success&payment=stripe`,
        cancel_url: `${window.location.origin}/doacoes?status=cancelled&payment=stripe`,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar sessão de pagamento')
    }

    const { url, sessionId } = await response.json()

    // Salvar doação no banco de dados com status pending
    await donationService.create({
      amount: donationData.amount,
      donor_name: donationData.donor_name,
      donor_email: donationData.donor_email,
      donor_phone: donationData.donor_phone,
      payment_method: 'stripe',
      status: 'pending',
      transaction_id: sessionId,
      message: donationData.message,
    })

    return url
  } catch (error) {
    console.error('Stripe Checkout Error:', error)
    throw error
  }
}

/**
 * Processa uma doação via Stripe
 * Redireciona para a página de checkout do Stripe
 */
export const processStripeDonation = async (
  donationData: StripeDonationData
): Promise<void> => {
  try {
    // Criar sessão de checkout
    const checkoutUrl = await createStripeCheckout(donationData)

    // Redirecionar para o Stripe Checkout
    window.location.href = checkoutUrl
  } catch (error) {
    console.error('Failed to process Stripe donation:', error)
    throw new Error('Erro ao processar doação via Stripe. Tente novamente.')
  }
}

/**
 * Verifica o status de uma sessão de checkout
 */
export const verifyStripeSession = async (sessionId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/verify-stripe-session/${sessionId}`)

    if (!response.ok) {
      throw new Error('Erro ao verificar sessão de pagamento')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Error verifying Stripe session:', error)
    throw error
  }
}

/**
 * Moedas suportadas pelo Stripe
 */
export const STRIPE_CURRENCIES = {
  usd: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  eur: { symbol: '€', name: 'Euro', locale: 'de-DE' },
  gbp: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  cad: { symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  aud: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
}

/**
 * Formata valor para exibição baseado na moeda
 */
export const formatCurrency = (
  amount: number,
  currency: keyof typeof STRIPE_CURRENCIES = 'usd'
): string => {
  const currencyInfo = STRIPE_CURRENCIES[currency]
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

export default {
  createStripeCheckout,
  processStripeDonation,
  verifyStripeSession,
  formatCurrency,
  STRIPE_CURRENCIES,
}

import type { Handler } from '@netlify/functions'

/**
 * Netlify Function para criar sessão de checkout do Stripe
 *
 * SETUP NECESSÁRIO:
 * 1. Instalar Stripe no backend: npm install stripe
 * 2. Adicionar STRIPE_SECRET_KEY nas variáveis de ambiente do Netlify
 * 3. Deploy da função
 *
 * Variáveis de ambiente necessárias:
 * - STRIPE_SECRET_KEY: Chave secreta do Stripe
 */

export const handler: Handler = async (event) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Responder OPTIONS para CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Verificar se a chave secreta está configurada
    const secretKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY

    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Stripe not configured',
          message: 'Payment system is not properly configured. Please contact support.'
        }),
      }
    }

    // Validar formato da chave
    if (!secretKey.startsWith('sk_')) {
      console.error('Invalid Stripe secret key format')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Invalid Stripe configuration',
          message: 'Payment system configuration is invalid. Please contact support.'
        }),
      }
    }

    // Importar Stripe dinamicamente
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    })

    // Parse do body
    const {
      amount,
      currency = 'usd',
      donor_email,
      donor_name,
      donor_phone,
      message,
      success_url,
      cancel_url,
    } = JSON.parse(event.body || '{}')

    // Validações
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      }
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Doação - Instituto Estação',
              description: `Doação internacional de ${donor_name || 'Anônimo'}`,
              images: ['https://your-logo-url.com/logo.png'], // Adicione sua logo
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || `${event.headers.origin}/doacoes?status=success&payment=stripe`,
      cancel_url: cancel_url || `${event.headers.origin}/doacoes?status=cancelled&payment=stripe`,
      customer_email: donor_email,
      metadata: {
        donor_name: donor_name || '',
        donor_phone: donor_phone || '',
        message: message || '',
        source: 'instituto_estacao_website',
      },
      // Configurações adicionais
      billing_address_collection: 'auto',
      payment_intent_data: {
        metadata: {
          donor_name: donor_name || '',
          donor_email: donor_email || '',
        },
      },
    })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
    }
  } catch (error: any) {
    console.error('Stripe checkout error:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        message: error.message,
      }),
    }
  }
}

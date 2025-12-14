import type { Handler } from '@netlify/functions'

/**
 * Netlify Function para verificar status de uma sessão de checkout do Stripe
 */

export const handler: Handler = async (event) => {
  // Permitir apenas GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Importar Stripe dinamicamente
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })

    // Extrair session_id da URL
    const sessionId = event.path.split('/').pop()

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Session ID required' }),
      }
    }

    // Buscar sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Retornar informações da sessão
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        metadata: session.metadata,
      }),
    }
  } catch (error: any) {
    console.error('Stripe session verification error:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to verify session',
        message: error.message,
      }),
    }
  }
}

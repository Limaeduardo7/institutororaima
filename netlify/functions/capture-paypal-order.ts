import { Handler } from '@netlify/functions'
import paypal from '@paypal/checkout-server-sdk'

// Configuração do ambiente PayPal
const clientId = process.env.VITE_PAYPAL_CLIENT_ID || ''
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''

// Configurar cliente PayPal - PRODUÇÃO
const environment = new paypal.core.LiveEnvironment(clientId, clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)

export const handler: Handler = async (event) => {
  // Definir headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Tratar requisições OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  try {
    // Validar credenciais
    if (!clientId || !clientSecret) {
      throw new Error('Credenciais do PayPal não configuradas')
    }

    // Parse do body
    const body = JSON.parse(event.body || '{}')
    const { orderId } = body

    // Validar orderId
    if (!orderId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Order ID não fornecido' }),
      }
    }

    // Criar requisição de captura
    const request = new paypal.orders.OrdersCaptureRequest(orderId)
    request.requestBody({})

    // Executar captura
    const capture = await client.execute(request)

    // Retornar resultado
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orderId: capture.result.id,
        status: capture.result.status,
        payer: capture.result.payer,
        purchase_units: capture.result.purchase_units,
      }),
    }
  } catch (error: any) {
    console.error('Erro ao capturar ordem PayPal:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao capturar pagamento',
        error: error.message,
      }),
    }
  }
}

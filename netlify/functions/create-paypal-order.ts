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
    const {
      amount,
      currency = 'USD',
      donor_name,
      donor_email,
      donor_phone,
      message,
      return_url,
      cancel_url,
    } = body

    // Validar dados obrigatórios
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Valor inválido' }),
      }
    }

    // Criar requisição de ordem
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: `Doação - Instituto Estação${donor_name ? ` - ${donor_name}` : ''}`,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          custom_id: donor_email || undefined,
        },
      ],
      application_context: {
        brand_name: 'Instituto Estação',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: return_url || `${process.env.URL}/doacoes?status=success&payment=paypal`,
        cancel_url: cancel_url || `${process.env.URL}/doacoes?status=cancelled&payment=paypal`,
      },
      payer: donor_email
        ? {
            email_address: donor_email,
            name: donor_name
              ? {
                  given_name: donor_name.split(' ')[0] || '',
                  surname: donor_name.split(' ').slice(1).join(' ') || '',
                }
              : undefined,
          }
        : undefined,
    })

    // Executar requisição
    const order = await client.execute(request)

    // Encontrar link de aprovação
    const approvalUrl = order.result.links?.find(
      (link: any) => link.rel === 'approve'
    )?.href

    if (!approvalUrl) {
      throw new Error('URL de aprovação não encontrada na resposta do PayPal')
    }

    // Retornar sucesso
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orderId: order.result.id,
        approvalUrl,
        status: order.result.status,
      }),
    }
  } catch (error: any) {
    console.error('Erro ao criar ordem PayPal:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao criar ordem de pagamento',
        error: error.message,
      }),
    }
  }
}

import type { Handler } from '@netlify/functions'

/**
 * Netlify Function para criar preferência de pagamento do Mercado Pago
 *
 * SETUP NECESSÁRIO:
 * 1. Adicionar MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente do Netlify
 * 2. Deploy da função
 *
 * Variáveis de ambiente necessárias:
 * - MERCADOPAGO_ACCESS_TOKEN: Access Token do Mercado Pago
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
    // Verificar se o access token está configurado
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.VITE_MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Mercado Pago not configured',
          message: 'Sistema de pagamento não está configurado corretamente.'
        }),
      }
    }

    // Validar formato do token
    if (!accessToken.startsWith('APP_USR-') && !accessToken.startsWith('TEST-')) {
      console.error('Invalid Mercado Pago access token format')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Invalid Mercado Pago configuration',
          message: 'Configuração do sistema de pagamento é inválida.'
        }),
      }
    }

    // Parse do body
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      payment_method,
    } = JSON.parse(event.body || '{}')

    // Validações
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valor inválido' }),
      }
    }

    // Obter origin do request para URLs de retorno
    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '') || 'https://institutoeestacao.org.br'

    // Criar preferência de pagamento
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Doação - Instituto Estação',
            description: 'Contribuição para as ações sociais do Instituto Estação em Roraima',
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'BRL'
          }
        ],
        payer: {
          name: donor_name || 'Doador Anônimo',
          email: donor_email || 'doador@institutoeestacao.org.br',
          phone: {
            area_code: donor_phone?.substring(0, 2) || '95',
            number: donor_phone?.substring(2) || '999999999'
          }
        },
        back_urls: {
          success: `${origin}/doacoes?status=success`,
          failure: `${origin}/doacoes?status=failure`,
          pending: `${origin}/doacoes?status=pending`
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [],
          installments: 12
        },
        statement_descriptor: 'Instituto Estacao',
        external_reference: `DONATION-${Date.now()}`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Mercado Pago API Error:', errorData)

      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Erro ao criar preferência de pagamento',
          details: errorData
        }),
      }
    }

    const preference = await response.json()

    // Determinar qual URL usar (sandbox vs produção)
    const isProduction = !accessToken.includes('TEST')
    const checkoutUrl = isProduction ? preference.init_point : preference.sandbox_init_point

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        preferenceId: preference.id,
        checkoutUrl: checkoutUrl,
        sandboxUrl: preference.sandbox_init_point,
        productionUrl: preference.init_point,
      }),
    }
  } catch (error: any) {
    console.error('Mercado Pago checkout error:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create payment preference',
        message: error.message,
      }),
    }
  }
}

import type { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const merchantId = process.env.CIELO_MERCHANT_ID
    const merchantKey = process.env.CIELO_MERCHANT_KEY
    const isProduction = process.env.CIELO_ENVIRONMENT === 'production'
    const apiUrl = isProduction
      ? 'https://apiquery.cieloecommerce.cielo.com.br'
      : 'https://apiquerysandbox.cieloecommerce.cielo.com.br'

    const paymentId = event.queryStringParameters?.paymentId

    if (!paymentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing paymentId' }),
      }
    }

    if (!merchantId || !merchantKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Cielo credentials are missing' }),
      }
    }

    const cieloResponse = await fetch(`${apiUrl}/1/sales/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'MerchantId': merchantId,
        'MerchantKey': merchantKey,
      },
    })

    const cieloResult = await cieloResponse.json()

    if (!cieloResponse.ok) {
      return {
        statusCode: cieloResponse.status,
        headers,
        body: JSON.stringify({
          error: 'Failed to verify payment',
          details: cieloResult
        }),
      }
    }

    const status = cieloResult.Payment.Status

    // Status mapping
    // 1 = Authorized, 2 = PaymentConfirmed, 3 = Denied,
    // 10 = Voided, 11 = Refunded, 12 = Pending, 13 = Aborted
    let paymentStatus = 'processing'
    if (status === 1 || status === 2) {
      paymentStatus = 'approved'
    } else if (status === 3 || status === 10 || status === 13) {
      paymentStatus = 'denied'
    } else if (status === 12) {
      paymentStatus = 'pending'
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        status: paymentStatus,
        cieloStatus: status,
        paymentId: cieloResult.Payment.PaymentId,
      }),
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    }
  }
}

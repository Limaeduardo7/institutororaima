import type { Handler } from '@netlify/functions'

/**
 * Netlify Function para processar pagamentos via Cielo
 *
 * API Cielo: https://developercielo.github.io/manual/cielo-ecommerce
 *
 * Variáveis de ambiente necessárias:
 * - CIELO_MERCHANT_ID: ID do merchant da Cielo
 * - CIELO_MERCHANT_KEY: Chave secreta do merchant
 */

interface CieloPaymentRequest {
  amount: number
  currency?: string
  donor_name: string
  donor_email: string
  donor_phone?: string
  donor_cpf: string
  payment_method: 'credit_card' | 'debit_card' | 'pix'
  card_number?: string
  card_holder?: string
  card_expiration_month?: string
  card_expiration_year?: string
  card_cvv?: string
  card_brand?: string
  installments?: number
}

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
    // Verificar credenciais
    const merchantId = process.env.CIELO_MERCHANT_ID
    const merchantKey = process.env.CIELO_MERCHANT_KEY

    if (!merchantId || !merchantKey) {
      console.error('Cielo credentials not configured')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Payment system not configured',
          message: 'Cielo credentials are missing'
        }),
      }
    }

    // Parse do body
    const paymentData: CieloPaymentRequest = JSON.parse(event.body || '{}')

    // Validações
    if (!paymentData.amount || paymentData.amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' }),
      }
    }

    // Valores padrão para campos opcionais
    if (!paymentData.donor_cpf || paymentData.donor_cpf.length !== 11) {
      paymentData.donor_cpf = '00000000000'
    }
    if (!paymentData.donor_name) {
      paymentData.donor_name = 'Doador Anônimo'
    }
    if (!paymentData.donor_email) {
      paymentData.donor_email = 'anonimo@doacao.com'
    }

    // URL da API Cielo (Sandbox ou Produção)
    const isProduction = process.env.CIELO_ENVIRONMENT === 'production'
    const apiUrl = isProduction
      ? 'https://api.cieloecommerce.cielo.com.br'
      : 'https://apisandbox.cieloecommerce.cielo.com.br'

    // Preparar payload baseado no método de pagamento
    let cieloPayload: any

    if (paymentData.payment_method === 'pix') {
      // Pagamento PIX
      cieloPayload = {
        MerchantOrderId: `INST-${Date.now()}`,
        Customer: {
          Name: paymentData.donor_name,
          Email: paymentData.donor_email,
          Identity: paymentData.donor_cpf,
          IdentityType: 'CPF',
          Mobile: paymentData.donor_phone || '',
        },
        Payment: {
          Type: 'Pix',
          Amount: Math.round(paymentData.amount * 100), // Centavos
          Currency: paymentData.currency || 'BRL',
          // Provider não é necessário para PIX
        },
      }
    } else {
      // Pagamento com Cartão (Crédito ou Débito)
      if (!paymentData.card_number || !paymentData.card_holder ||
        !paymentData.card_expiration_month || !paymentData.card_expiration_year ||
        !paymentData.card_cvv || !paymentData.card_brand) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing card information' }),
        }
      }

      if (paymentData.payment_method === 'credit_card') {
        // Cartão de Crédito
        cieloPayload = {
          MerchantOrderId: `INST-${Date.now()}`,
          Customer: {
            Name: paymentData.donor_name,
            Email: paymentData.donor_email,
            Identity: paymentData.donor_cpf,
            IdentityType: 'CPF',
            Mobile: paymentData.donor_phone || '',
          },
          Payment: {
            Type: 'CreditCard',
            Amount: Math.round(paymentData.amount * 100), // Centavos
            Currency: paymentData.currency || 'BRL',
            Installments: paymentData.installments || 1,
            SoftDescriptor: 'Instituto Estacao',
            CreditCard: {
              CardNumber: paymentData.card_number.replace(/\s/g, ''),
              Holder: paymentData.card_holder,
              ExpirationDate: `${paymentData.card_expiration_month.padStart(2, '0')}/20${paymentData.card_expiration_year}`,
              SecurityCode: paymentData.card_cvv,
              Brand: paymentData.card_brand,
            },
          },
        }
      } else {
        // Cartão de Débito
        cieloPayload = {
          MerchantOrderId: `INST-${Date.now()}`,
          Customer: {
            Name: paymentData.donor_name,
            Email: paymentData.donor_email,
            Identity: paymentData.donor_cpf,
            IdentityType: 'CPF',
            Mobile: paymentData.donor_phone || '',
          },
          Payment: {
            Type: 'DebitCard',
            Amount: Math.round(paymentData.amount * 100), // Centavos
            Currency: paymentData.currency || 'BRL',
            ReturnUrl: `${event.headers.origin || 'https://institutororaima.netlify.app'}/doacoes?status=processing&payment=cielo`,
            AuthenticateTransaction: true,
            SoftDescriptor: 'Instituto Estacao',
            DebitCard: {
              CardNumber: paymentData.card_number.replace(/\s/g, ''),
              Holder: paymentData.card_holder,
              ExpirationDate: `${paymentData.card_expiration_month.padStart(2, '0')}/20${paymentData.card_expiration_year}`,
              SecurityCode: paymentData.card_cvv,
              Brand: paymentData.card_brand,
            },
          },
        }
      }
    }

    console.log('Sending payment to Cielo:', JSON.stringify(cieloPayload, null, 2))

    // Fazer requisição para a API da Cielo
    const cieloResponse = await fetch(`${apiUrl}/1/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'MerchantId': merchantId,
        'MerchantKey': merchantKey,
      },
      body: JSON.stringify(cieloPayload),
    })

    const cieloResult = await cieloResponse.json()

    console.log('Cielo API Response:', JSON.stringify(cieloResult, null, 2))

    if (!cieloResponse.ok) {
      console.error('Cielo API Error:', cieloResult)
      return {
        statusCode: cieloResponse.status,
        headers,
        body: JSON.stringify({
          error: 'Payment processing failed',
          message: cieloResult[0]?.Message || 'Unknown error',
          details: cieloResult,
        }),
      }
    }

    // Processar resposta baseado no tipo de pagamento
    if (paymentData.payment_method === 'pix') {
      // Resposta PIX
      const payment = cieloResult.Payment

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: payment.Status === 12 ? 'pending' : 'processing',
          transactionId: cieloResult.Payment.PaymentId,
          pixQrCode: payment.QrCodeString,
          pixQrCodeBase64: payment.QrCodeBase64Image,
          expirationDate: payment.ExpirationDate,
          message: 'PIX gerado com sucesso. Escaneie o QR Code para pagar.',
        }),
      }
    } else {
      // Resposta Cartão
      const payment = cieloResult.Payment
      const status = payment.Status

      // Status Cielo:
      // 1 = Authorized, 2 = PaymentConfirmed, 3 = Denied,
      // 10 = Voided, 11 = Refunded, 12 = Pending, 13 = Aborted

      let paymentStatus = 'processing'
      let message = 'Pagamento em processamento'

      if (status === 1 || status === 2) {
        paymentStatus = 'approved'
        message = 'Pagamento aprovado com sucesso!'
      } else if (status === 3 || status === 13) {
        paymentStatus = 'denied'
        message = payment.ReturnMessage || 'Pagamento negado'
      } else if (status === 12) {
        paymentStatus = 'pending'
        message = 'Pagamento pendente de confirmação'
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: status === 1 || status === 2,
          status: paymentStatus,
          transactionId: payment.PaymentId,
          authorizationCode: payment.AuthorizationCode,
          proofOfSale: payment.ProofOfSale,
          returnCode: payment.ReturnCode,
          returnMessage: payment.ReturnMessage,
          message: message,
          // Para cartão de débito, incluir URL de autenticação se necessário
          authenticationUrl: payment.AuthenticationUrl,
        }),
      }
    }
  } catch (error: any) {
    console.error('Cielo payment processing error:', error)

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

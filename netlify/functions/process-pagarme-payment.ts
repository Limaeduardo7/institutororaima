import { Handler } from '@netlify/functions'
import pagarme from 'pagarme'

// Credenciais do Pagar.me
const secretKey = process.env.PAGARME_SECRET_KEY || ''

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
    if (!secretKey) {
      throw new Error('Credenciais do Pagar.me não configuradas')
    }

    // Parse do body
    const body = JSON.parse(event.body || '{}')
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      payment_method,
      card_data,
    } = body

    // Validar dados obrigatórios
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Valor inválido' }),
      }
    }

    if (!donor_email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Email é obrigatório' }),
      }
    }

    // Conectar ao Pagar.me
    const client = await pagarme.client.connect({ api_key: secretKey })

    // Converter valor para centavos
    const amountInCents = Math.round(amount * 100)

    // Preparar dados do cliente
    const customer = {
      external_id: donor_email,
      name: donor_name || 'Doador Anônimo',
      email: donor_email,
      type: 'individual',
      country: 'br',
      phone_numbers: donor_phone ? [`+55${donor_phone.replace(/\D/g, '')}`] : [],
      documents: [
        {
          type: 'cpf',
          number: payment_method === 'credit_card' && card_data ? card_data.card_holder_cpf : '00000000000',
        },
      ],
    }

    let transaction: any

    // Processar de acordo com o método de pagamento
    if (payment_method === 'credit_card' && card_data) {
      // Processar pagamento com cartão de crédito
      transaction = await client.transactions.create({
        amount: amountInCents,
        payment_method: 'credit_card',
        card_number: card_data.card_number,
        card_holder_name: card_data.card_holder_name,
        card_expiration_date: card_data.card_expiration_date,
        card_cvv: card_data.card_cvv,
        customer,
        billing: {
          name: donor_name || 'Doador Anônimo',
          address: {
            country: 'br',
            state: 'RR',
            city: 'Boa Vista',
            street: 'Rua não informada',
            street_number: '0',
            zipcode: '69000000',
          },
        },
        items: [
          {
            id: '1',
            title: 'Doação - Instituto Estação',
            unit_price: amountInCents,
            quantity: 1,
            tangible: false,
          },
        ],
        metadata: {
          donor_name: donor_name || 'Anônimo',
          donor_phone: donor_phone || '',
        },
      })
    } else if (payment_method === 'pix') {
      // Processar pagamento via PIX
      transaction = await client.transactions.create({
        amount: amountInCents,
        payment_method: 'pix',
        customer,
        items: [
          {
            id: '1',
            title: 'Doação - Instituto Estação',
            unit_price: amountInCents,
            quantity: 1,
            tangible: false,
          },
        ],
        pix_expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          donor_name: donor_name || 'Anônimo',
          donor_phone: donor_phone || '',
        },
      })
    } else if (payment_method === 'boleto') {
      // Processar pagamento via Boleto
      transaction = await client.transactions.create({
        amount: amountInCents,
        payment_method: 'boleto',
        customer,
        items: [
          {
            id: '1',
            title: 'Doação - Instituto Estação',
            unit_price: amountInCents,
            quantity: 1,
            tangible: false,
          },
        ],
        boleto_expiration_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metadata: {
          donor_name: donor_name || 'Anônimo',
          donor_phone: donor_phone || '',
        },
      })
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Método de pagamento inválido' }),
      }
    }

    // Preparar resposta
    const response: any = {
      transactionId: transaction.id.toString(),
      status: transaction.status,
      paymentMethod: payment_method,
    }

    // Adicionar informações específicas do método de pagamento
    if (payment_method === 'pix' && transaction.pix_qr_code) {
      response.pixQrCode = transaction.pix_qr_code
      response.pixQrCodeUrl = transaction.pix_qr_code_url
    } else if (payment_method === 'boleto' && transaction.boleto_url) {
      response.boletoUrl = transaction.boleto_url
      response.boletoBarcode = transaction.boleto_barcode
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento Pagar.me:', error)

    // Retornar erro detalhado
    const errorMessage = error.response?.errors?.[0]?.message || error.message || 'Erro desconhecido'

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao processar pagamento',
        error: errorMessage,
        details: error.response?.errors || [],
      }),
    }
  }
}

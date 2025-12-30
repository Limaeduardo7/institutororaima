import { Handler } from '@netlify/functions'

// Credenciais do Pagar.me
const encryptionKey = process.env.VITE_PAGARME_PUBLIC_KEY || ''

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
    if (!encryptionKey) {
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
      message,
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

    // Converter valor para centavos
    const amountInCents = Math.round(amount * 100)

    // Criar dados para o Pagar.me Checkout
    // Nota: O Pagar.me não tem um checkout hospedado como o Mercado Pago
    // Vamos retornar os dados necessários para o frontend processar
    const checkoutData = {
      amount: amountInCents,
      createToken: 'false',
      paymentMethods: payment_method === 'credit_card' ? 'credit_card' : payment_method,
      customerData: 'true',
      customer: {
        name: donor_name || 'Doador Anônimo',
        email: donor_email,
        documentNumber: '00000000000',
        phone: donor_phone ? `+55${donor_phone.replace(/\D/g, '')}` : '',
      },
      metadata: {
        donor_name: donor_name || 'Anônimo',
        donor_phone: donor_phone || '',
        message: message || '',
      },
    }

    // Retornar dados para o frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        // Retornar URL de volta para o frontend processar usando Pagar.me Checkout.js
        checkoutUrl: `${process.env.URL}/doacoes?status=success&payment=pagarme`,
        transactionId: `temp_${Date.now()}`,
        status: 'pending',
        checkoutData,
        encryptionKey,
      }),
    }
  } catch (error: any) {
    console.error('Erro ao criar checkout Pagar.me:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao criar checkout',
        error: error.message || 'Erro desconhecido',
      }),
    }
  }
}

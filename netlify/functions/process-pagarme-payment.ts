import { Handler } from '@netlify/functions'

// Credenciais do Pagar.me
const accessToken = 'acs_666666c500ac43dbadb8d89f3ecc6d253fcf9b084a68a6cb2ec691bdbbf5'
const accountId = 'acc_nmoNbEeIAI3qbW9K' // ID da conta fornecido pelo usuário

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
    if (!accessToken) {
      console.error('Access Token não configurado')
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
      card_hash,
      card_holder_cpf,
    } = body

    console.log('Processando pagamento:', { amount, payment_method, donor_email })

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

    // Extrair código de área e número do telefone
    const phoneClean = donor_phone?.replace(/\D/g, '') || ''
    const areaCode = phoneClean.slice(0, 2) || '95'
    const phoneNumber = phoneClean.slice(2) || '00000000'

    // Preparar payload para API V5 do Pagar.me seguindo estrutura oficial
    const transactionData: any = {
      closed: true,
      customer: {
        name: donor_name || 'Doador Anônimo',
        email: donor_email,
        type: 'individual',
        document: card_holder_cpf || '00000000000',
        document_type: 'CPF',
        address: {
          line_1: '1, Rua Principal, Centro',
          line_2: 'Complemento',
          zip_code: '69300000',
          city: 'Boa Vista',
          state: 'RR',
          country: 'BR',
        },
        phones: {
          home_phone: {
            country_code: '55',
            area_code: areaCode,
            number: phoneNumber,
          },
          mobile_phone: {
            country_code: '55',
            area_code: areaCode,
            number: phoneNumber,
          },
        },
      },
      items: [
        {
          amount: amountInCents,
          description: 'Doação - Instituto Estação',
          quantity: 1,
          code: `DOA${Date.now()}`,
        },
      ],
      metadata: {
        donor_name: donor_name || 'Anônimo',
        donor_phone: donor_phone || '',
      },
    }

    // Adicionar dados específicos por método de pagamento
    if (payment_method === 'credit_card' && card_hash) {
      transactionData.payments = [
        {
          payment_method: 'credit_card',
          credit_card: {
            operation_type: 'auth_and_capture',
            installments: 1,
            statement_descriptor: 'Inst Estacao',
            card_token: card_hash,
            card: {
              billing_address: {
                line_1: '1, Rua Principal, Centro',
                zip_code: '69300000',
                city: 'Boa Vista',
                state: 'RR',
                country: 'BR',
              },
            },
          },
        },
      ]
    } else if (payment_method === 'pix') {
      transactionData.payments = [
        {
          payment_method: 'pix',
          pix: {
            expires_in: 86400, // 24 horas
          },
        },
      ]
    } else if (payment_method === 'boleto') {
      transactionData.payments = [
        {
          payment_method: 'boleto',
          boleto: {
            instructions: 'Sr. Caixa, favor não aceitar pagamento após o vencimento',
            due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ]
    }

    console.log('Enviando requisição para Pagar.me API V5...')
    console.log('Transaction Data:', JSON.stringify(transactionData, null, 2))

    // Fazer requisição para API V5 do Pagar.me
    // Access Token usa Bearer
    const authHeader = `Bearer ${accessToken}`

    const apiResponse = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'X-Pagarme-Account-Id': accountId,
      },
      body: JSON.stringify(transactionData),
    })

    const transaction = await apiResponse.json()

    console.log('Resposta completa da API:', JSON.stringify(transaction, null, 2))
    console.log('Status HTTP:', apiResponse.status)

    if (!apiResponse.ok) {
      console.error('Erro da API Pagar.me - Status:', apiResponse.status)
      console.error('Erro da API Pagar.me - Body:', JSON.stringify(transaction, null, 2))

      // Extrair mensagem de erro mais detalhada
      let errorMessage = 'Erro ao processar pagamento'
      if (transaction.errors && Array.isArray(transaction.errors) && transaction.errors.length > 0) {
        errorMessage = transaction.errors.map((e: any) => `${e.parameter_name}: ${e.message}`).join(', ')
      } else if (transaction.message) {
        errorMessage = transaction.message
      }

      throw new Error(errorMessage)
    }

    // Preparar resposta (formato API V5)
    const response: any = {
      transactionId: transaction.id,
      status: transaction.status,
      paymentMethod: payment_method,
    }

    // Adicionar informações específicas do método de pagamento (API V5)
    if (payment_method === 'pix') {
      // API V5: dados do PIX estão em charges[0].last_transaction.qr_code_url
      const charge = transaction.charges?.[0]
      const lastTransaction = charge?.last_transaction

      if (lastTransaction?.qr_code) {
        response.pixQrCode = lastTransaction.qr_code
        response.pixQrCodeUrl = lastTransaction.qr_code_url
      }
    } else if (payment_method === 'boleto') {
      // API V5: dados do boleto estão em charges[0].last_transaction
      const charge = transaction.charges?.[0]
      const lastTransaction = charge?.last_transaction

      if (lastTransaction?.pdf) {
        response.boletoUrl = lastTransaction.pdf
        response.boletoBarcode = lastTransaction.line
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento Pagar.me:', error)
    console.error('Stack:', error.stack)

    // Retornar erro detalhado
    const errorMessage = error.message || 'Erro desconhecido'

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao processar pagamento',
        error: errorMessage,
      }),
    }
  }
}

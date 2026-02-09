import { Handler } from '@netlify/functions'

// Credenciais do Pagar.me V5 (via variáveis de ambiente)
const secretKey = process.env.PAGARME_SECRET_KEY || process.env.PAGARME_ACCESS_TOKEN || ''

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
      console.error('Secret Key não configurada')
      throw new Error('Credenciais do Pagar.me não configuradas')
    }

    // Parse do body
    const body = JSON.parse(event.body || '{}')
    const {
      amount,
      donor_name,
      donor_email,
      donor_phone,
      donor_cpf,
      payment_method,
      card,
      installments,
    } = body

    console.log('Processando pagamento V5:', { amount, payment_method, donor_email })

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
    const areaCode = phoneClean.slice(0, 2) || '11'
    const phoneNumber = phoneClean.slice(2) || '999999999'

    // Obter CPF do doador
    const customerCpf = donor_cpf?.replace(/\D/g, '') || '00000000000'

    // Preparar payload para API V5 do Pagar.me
    const orderData: any = {
      customer: {
        name: donor_name || 'Doador Anônimo',
        email: donor_email,
        type: 'individual',
        document: customerCpf,
        document_type: 'cpf',
        phones: {
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
          code: 'DOACAO',
        },
      ],
    }

    // Adicionar dados específicos por método de pagamento
    if (payment_method === 'credit_card') {
      if (!card || !card.number) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Dados do cartão não fornecidos' }),
        }
      }

      orderData.payments = [
        {
          payment_method: 'credit_card',
          credit_card: {
            installments: installments || 1,
            statement_descriptor: 'INST ESTACAO',
            card: {
              number: card.number.toString().replace(/\s/g, ''),
              holder_name: card.holder_name.toUpperCase(),
              exp_month: parseInt(card.exp_month),
              exp_year: parseInt(card.exp_year),
              cvv: card.cvv.toString(),
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
      orderData.payments = [
        {
          payment_method: 'pix',
          pix: {
            expires_in: 86400, // 24 horas em segundos
          },
        },
      ]
    } else if (payment_method === 'boleto') {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 3)

      orderData.payments = [
        {
          payment_method: 'boleto',
          boleto: {
            instructions: 'Sr. Caixa, favor não aceitar pagamento após o vencimento',
            due_at: dueDate.toISOString(),
          },
        },
      ]
    }

    console.log('Enviando requisição para Pagar.me API V5...')
    console.log('Order data:', JSON.stringify(orderData, null, 2))

    // Autenticação Basic Auth para API V5: sk_xxx: (chave seguida de dois pontos, sem senha)
    const authString = Buffer.from(`${secretKey}:`).toString('base64')

    // Fazer requisição para API V5 do Pagar.me
    const apiUrl = 'https://api.pagar.me/core/v5/orders'

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(orderData),
    })

    const order = await apiResponse.json()

    console.log('PAGARME V5 RESPONSE:', JSON.stringify(order, null, 2))
    console.log('Status HTTP:', apiResponse.status)

    if (!apiResponse.ok) {
      console.error('Erro da API Pagar.me V5 - Status:', apiResponse.status)
      console.error('Erro da API Pagar.me V5 - Body:', JSON.stringify(order, null, 2))

      // Extrair mensagem de erro
      let userMessage = 'Erro ao processar pagamento. Por favor, tente novamente.'

      if (order.errors && Array.isArray(order.errors)) {
        const errorMessages = order.errors.map((e: any) => e.message || e.parameter_name).join(', ')
        userMessage = errorMessages || userMessage
      } else if (order.message) {
        userMessage = order.message
      }

      return {
        statusCode: 402,
        headers,
        body: JSON.stringify({
          message: userMessage,
          status: order?.status,
          raw_error: order.errors || order.message,
        }),
      }
    }

    // Extrair dados da resposta V5
    const charge = order.charges?.[0]
    const lastTransaction = charge?.last_transaction

    console.log('Charge:', JSON.stringify(charge, null, 2))
    console.log('Last Transaction:', JSON.stringify(lastTransaction, null, 2))

    // Preparar resposta
    const response: any = {
      transactionId: order.id || `ORDER-${Date.now()}`,
      status: order.status,
      paymentMethod: payment_method,
    }

    // Mapear status
    if (order.status === 'paid') {
      response.status = 'paid'
    } else if (order.status === 'pending') {
      response.status = 'pending'
    } else if (order.status === 'failed') {
      response.status = 'failed'
      response.message = lastTransaction?.gateway_response?.message ||
                        lastTransaction?.acquirer_message ||
                        charge?.last_transaction?.gateway_response?.errors?.[0]?.message ||
                        'Transação recusada'
    }

    // Extrair mensagem de erro da API (se houver)
    const apiErrorMessage = lastTransaction?.gateway_response?.message ||
                           lastTransaction?.acquirer_message ||
                           charge?.last_transaction?.gateway_response?.errors?.[0]?.message ||
                           lastTransaction?.gateway_response?.errors?.[0]?.message ||
                           null

    console.log('API Error Message:', apiErrorMessage)

    // Adicionar informações específicas do método de pagamento
    if (payment_method === 'pix') {
      // Se a ordem falhou, retornar erro com a mensagem da API
      if (order.status === 'failed' || charge?.status === 'failed') {
        response.status = 'failed'
        response.message = apiErrorMessage || 'PIX não habilitado ou erro na configuração da conta Pagar.me'
        response.debug = {
          orderStatus: order.status,
          chargeStatus: charge?.status,
          apiError: apiErrorMessage,
        }
      } else {
        // Tentar encontrar dados do PIX em diferentes locais da resposta V5
        const pixQrCode = lastTransaction?.qr_code ||
                         charge?.last_transaction?.qr_code ||
                         order.charges?.[0]?.last_transaction?.qr_code
        const pixQrCodeUrl = lastTransaction?.qr_code_url ||
                            charge?.last_transaction?.qr_code_url ||
                            order.charges?.[0]?.last_transaction?.qr_code_url

        console.log('PIX QR Code encontrado:', pixQrCode ? 'SIM' : 'NÃO')
        console.log('PIX QR Code URL encontrado:', pixQrCodeUrl ? 'SIM' : 'NÃO')

        if (pixQrCode) {
          response.pixQrCode = pixQrCode
          response.pixQrCodeUrl = pixQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixQrCode)}`
          response.status = 'pending'
        } else {
          // Se não encontrou, retornar a resposta completa para debug
          console.error('PIX QR Code não encontrado na resposta')
          console.error('Order completo:', JSON.stringify(order, null, 2))
          response.debug = {
            orderStatus: order.status,
            chargeStatus: charge?.status,
            hasCharges: !!order.charges,
            chargesLength: order.charges?.length,
            hasLastTransaction: !!lastTransaction,
          }
        }
      }
    } else if (payment_method === 'boleto') {
      // Se a ordem falhou, retornar erro com a mensagem da API
      if (order.status === 'failed' || charge?.status === 'failed') {
        response.status = 'failed'
        response.message = apiErrorMessage || 'Boleto não habilitado ou erro na configuração da conta Pagar.me'
        response.debug = {
          orderStatus: order.status,
          chargeStatus: charge?.status,
          apiError: apiErrorMessage,
        }
      } else {
        const boletoUrl = lastTransaction?.pdf || lastTransaction?.url ||
                         charge?.last_transaction?.pdf || charge?.last_transaction?.url
        const boletoBarcode = lastTransaction?.line || lastTransaction?.barcode ||
                            charge?.last_transaction?.line || charge?.last_transaction?.barcode

        if (boletoUrl) {
          response.boletoUrl = boletoUrl
          response.boletoBarcode = boletoBarcode || ''
          response.status = 'waiting_payment'
        } else {
          console.error('Boleto URL não encontrado na resposta')
          response.debug = {
            orderStatus: order.status,
            chargeStatus: charge?.status,
          }
        }
      }
    } else if (payment_method === 'credit_card') {
      if (charge?.status === 'paid') {
        response.status = 'paid'
      } else if (charge?.status === 'pending') {
        response.status = 'authorized'
      } else if (charge?.status === 'failed' || order.status === 'failed') {
        response.status = 'failed'
        response.message = lastTransaction?.acquirer_message ||
                          lastTransaction?.gateway_response?.message ||
                          'Pagamento recusado pela operadora'
      }
    }

    console.log('Response final:', JSON.stringify(response, null, 2))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento Pagar.me V5:', error)
    console.error('Stack:', error.stack)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Erro ao processar pagamento',
        error: error.message || 'Erro desconhecido',
      }),
    }
  }
}

// Serviço de integração com Mercado Pago
import { donationService } from './supabaseClient'

const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
const MERCADOPAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN

export interface DonationData {
  amount: number
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  payment_method: 'pix' | 'card' | 'boleto'
}

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * e retorna o link para checkout
 */
export const createPaymentPreference = async (
  donationData: DonationData
): Promise<MercadoPagoPreference> => {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Doação - Instituto Estação',
            description: 'Contribuição para as ações sociais do Instituto Estação em Roraima',
            quantity: 1,
            unit_price: Number(donationData.amount),
            currency_id: 'BRL'
          }
        ],
        payer: {
          name: donationData.donor_name || 'Doador Anônimo',
          email: donationData.donor_email || 'doador@institutoeestacao.org.br',
          phone: {
            area_code: donationData.donor_phone?.substring(0, 2) || '95',
            number: donationData.donor_phone?.substring(2) || '999999999'
          }
        },
        back_urls: {
          success: `${window.location.origin}/doacoes?status=success`,
          failure: `${window.location.origin}/doacoes?status=failure`,
          pending: `${window.location.origin}/doacoes?status=pending`
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
      throw new Error('Erro ao criar preferência de pagamento')
    }

    const preference: MercadoPagoPreference = await response.json()
    return preference
  } catch (error) {
    console.error('Error creating payment preference:', error)
    throw error
  }
}

/**
 * Processa a doação: salva no banco e cria checkout do Mercado Pago
 */
export const processDonation = async (donationData: DonationData): Promise<string> => {
  try {
    // 1. Criar preferência de pagamento no Mercado Pago
    const preference = await createPaymentPreference(donationData)

    // 2. Salvar doação no banco de dados como 'pending'
    await donationService.create({
      donor_name: donationData.donor_name,
      donor_email: donationData.donor_email,
      donor_phone: donationData.donor_phone,
      amount: donationData.amount,
      payment_method: donationData.payment_method,
      status: 'pending',
      transaction_id: preference.id
    })

    // 3. Retornar URL do checkout
    // Usar sandbox_init_point em desenvolvimento, init_point em produção
    const isProduction = !MERCADOPAGO_ACCESS_TOKEN.includes('TEST')
    return isProduction ? preference.init_point : preference.sandbox_init_point
  } catch (error) {
    console.error('Error processing donation:', error)
    throw error
  }
}

/**
 * Inicializa o Mercado Pago SDK no frontend
 */
export const initMercadoPago = () => {
  if (typeof window === 'undefined') return

  // Carregar SDK do Mercado Pago
  const script = document.createElement('script')
  script.src = 'https://sdk.mercadopago.com/js/v2'
  script.async = true
  script.onload = () => {
    // @ts-ignore
    if (window.MercadoPago) {
      // @ts-ignore
      window.mp = new window.MercadoPago(MERCADOPAGO_PUBLIC_KEY)
    }
  }
  document.body.appendChild(script)
}

/**
 * Verifica o status do pagamento pelo ID da preferência
 */
export const checkPaymentStatus = async (preferenceId: string): Promise<any> => {
  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?external_reference=${preferenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao verificar status do pagamento')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking payment status:', error)
    throw error
  }
}

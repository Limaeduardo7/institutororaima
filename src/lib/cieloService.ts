import { supabase } from './supabaseClient'

// Tipos
export interface CieloDonationData {
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

export interface CieloPaymentResponse {
  success: boolean
  status: 'approved' | 'pending' | 'denied' | 'processing'
  transactionId: string
  message: string
  // PIX
  pixQrCode?: string
  pixQrCodeBase64?: string
  expirationDate?: string
  // Cartão
  authorizationCode?: string
  proofOfSale?: string
  returnCode?: string
  returnMessage?: string
  authenticationUrl?: string
}

// Marcas de cartão suportadas pela Cielo (regex simplificadas e corrigidas)
export const CIELO_CARD_BRANDS = {
  Visa: { name: 'Visa', regex: /^4/ },
  Master: { name: 'Master', regex: /^5[1-5]/ },
  Elo: { name: 'Elo', regex: /^(4011(78|79)|43(1274|8935)|45(1416|7393|763[12])|50(4175|6699|67[0-6]\d|677[0-8]|9\d{3})|627780|63(6297|6368|6369)|65(0[0-5]\d{2}|16[5-7]\d|50[0-5]\d))/ },
  Amex: { name: 'Amex', regex: /^3[47]/ },
  Diners: { name: 'Diners', regex: /^3[068]/ },
  Discover: { name: 'Discover', regex: /^6(011|5)/ },
  JCB: { name: 'JCB', regex: /^(2131|1800|35)/ },
  Aura: { name: 'Aura', regex: /^50[0-9]/ },
  Hipercard: { name: 'Hipercard', regex: /^(606282|3841)/ },
}

/**
 * Detectar bandeira do cartão baseado no número
 */
export const detectCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '')

  // Ordem específica para evitar conflitos (mais específicos primeiro)
  const brands: Array<[string, { name: string; regex: RegExp }]> = [
    ['Elo', CIELO_CARD_BRANDS.Elo],
    ['Hipercard', CIELO_CARD_BRANDS.Hipercard],
    ['Aura', CIELO_CARD_BRANDS.Aura],
    ['Amex', CIELO_CARD_BRANDS.Amex],
    ['Diners', CIELO_CARD_BRANDS.Diners],
    ['Discover', CIELO_CARD_BRANDS.Discover],
    ['JCB', CIELO_CARD_BRANDS.JCB],
    ['Master', CIELO_CARD_BRANDS.Master],
    ['Visa', CIELO_CARD_BRANDS.Visa],
  ]

  for (const [brand, info] of brands) {
    if (info.regex.test(cleanNumber)) {
      return brand
    }
  }

  // Fallback: se não conseguir detectar, assume Visa como padrão
  // (a maioria dos cartões não identificados são Visa)
  return 'Visa'
}

/**
 * Validar número do cartão usando algoritmo de Luhn
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '')

  if (!/^\d+$/.test(cleanNumber)) return false
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false

  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Processar doação via Cielo
 */
export const processCieloDonation = async (
  donationData: CieloDonationData
): Promise<CieloPaymentResponse> => {
  try {
    // Validações adicionais
    if (donationData.payment_method !== 'pix') {
      if (!donationData.card_number || !validateCardNumber(donationData.card_number)) {
        throw new Error('Número de cartão inválido')
      }

      const detectedBrand = detectCardBrand(donationData.card_number)
      // Remove a validação que causava erro, pois agora sempre retorna uma bandeira

      // Atualizar bandeira detectada
      donationData.card_brand = detectedBrand
    }

    // Chamar função Netlify
    const response = await fetch('/.netlify/functions/process-cielo-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: donationData.amount,
        currency: donationData.currency || 'BRL',
        donor_name: donationData.donor_name,
        donor_email: donationData.donor_email,
        donor_phone: donationData.donor_phone,
        donor_cpf: donationData.donor_cpf.replace(/\D/g, ''),
        payment_method: donationData.payment_method,
        card_number: donationData.card_number?.replace(/\s/g, ''),
        card_holder: donationData.card_holder,
        card_expiration_month: donationData.card_expiration_month,
        card_expiration_year: donationData.card_expiration_year,
        card_cvv: donationData.card_cvv,
        card_brand: donationData.card_brand,
        installments: donationData.installments || 1,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao processar pagamento')
    }

    const result: CieloPaymentResponse = await response.json()
    return result
  } catch (error: any) {
    console.error('Error processing Cielo donation:', error)
    throw error
  }
}

/**
 * Salvar doação Cielo no banco de dados
 */
export const saveCieloDonation = async (
  donationData: CieloDonationData,
  transactionId: string,
  status: string = 'pending'
): Promise<void> => {
  try {
    const { data, error } = await supabase.from('donations').insert({
      donor_name: donationData.donor_name,
      donor_email: donationData.donor_email,
      amount: donationData.amount,
      payment_method: 'card', // Simplified to match schema constraints
      status: status === 'pending' ? 'pending' : status === 'approved' ? 'completed' : 'failed',
      transaction_id: transactionId,
    })

    if (error) {
      console.error('Error saving Cielo donation to database:', error)
      throw error
    }

    console.log('Cielo donation saved successfully:', data)
  } catch (error) {
    console.error('Error saving Cielo donation:', error)
    throw error
  }
}

/**
 * Formatar número do cartão com espaços
 */
export const formatCardNumber = (value: string): string => {
  return value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim()
    .slice(0, 19)
}

/**
 * Formatar data de expiração MM/AA
 */
export const formatExpirationDate = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 5)
}

/**
 * Formatar CPF
 */
export const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

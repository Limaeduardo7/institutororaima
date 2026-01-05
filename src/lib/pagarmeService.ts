import { donationService } from './supabaseClient'

// Credenciais do Pagar.me
const PAGARME_PUBLIC_KEY = import.meta.env.VITE_PAGARME_PUBLIC_KEY

// Interface para os dados de doação
export interface PagarmeDonationData {
  amount: number
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  donor_cpf?: string
  message?: string
  payment_method: 'pix' | 'credit_card' | 'boleto'
}

/**
 * Salva a doação no banco de dados
 */
export const savePagarmeDonation = async (
  donationData: PagarmeDonationData,
  transactionId: string
): Promise<void> => {
  await donationService.create({
    amount: donationData.amount,
    donor_name: donationData.donor_name,
    donor_email: donationData.donor_email,
    donor_phone: donationData.donor_phone,
    payment_method: donationData.payment_method === 'credit_card' ? 'card' : donationData.payment_method,
    status: 'pending',
    transaction_id: transactionId,
    message: donationData.message,
  })
}

/**
 * Processa uma doação via Pagar.me
 * Retorna os dados para abrir o modal de checkout
 */
export const processPagarmeDonation = async (
  donationData: PagarmeDonationData
): Promise<{ openCheckout: boolean }> => {
  // Retorna indicação para abrir o modal de checkout
  return { openCheckout: true }
}

/**
 * Obtém a Public Key do Pagar.me para uso no frontend
 */
export const getPagarmePublicKey = (): string => {
  if (!PAGARME_PUBLIC_KEY) {
    throw new Error('Pagar.me Public Key não configurado')
  }
  return PAGARME_PUBLIC_KEY
}

export default {
  savePagarmeDonation,
  processPagarmeDonation,
  getPagarmePublicKey,
}

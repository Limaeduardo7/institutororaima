// Tipos básicos para o projeto
export interface SocialAction {
  id: string;
  title: string;
  description: string;
  beneficiaries: number;
  status: 'active' | 'completed' | 'planned';
  start_date: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialDocument {
  id: string
  title: string
  description: string
  document_type: 'receipt' | 'report' | 'statement' | 'other'
  file_url: string
  file_name: string
  upload_date: string
  year: number
  month: number
}

export interface Donation {
  id: string
  donor_name?: string
  donor_email?: string
  amount: number
  payment_method: 'pix' | 'card' | 'boleto'
  status: 'pending' | 'completed' | 'failed'
  transaction_id?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}
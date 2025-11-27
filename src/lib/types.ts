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
  donor_phone?: string
  amount: number
  payment_method: 'pix' | 'card' | 'boleto'
  status: 'pending' | 'completed' | 'failed'
  transaction_id?: string
  message?: string
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

export interface Document {
  id: string
  title: string
  description?: string
  category: 'estatuto' | 'ata' | 'relatorio' | 'certidao' | 'outros'
  file_url: string
  file_name: string
  file_size?: number
  file_type?: string
  upload_date: string
  year?: number
  is_public: boolean
  created_at: string
  updated_at: string
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos básicos
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

// Serviços Supabase
export const socialActionService = {
  getAll: async (): Promise<SocialAction[]> => {
    const { data, error } = await supabase
      .from('social_actions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getActive: async (): Promise<SocialAction[]> => {
    const { data, error } = await supabase
      .from('social_actions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  create: async (action: Omit<SocialAction, 'id' | 'created_at' | 'updated_at'>): Promise<SocialAction> => {
    const { data, error } = await supabase
      .from('social_actions')
      .insert([action])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<SocialAction>): Promise<SocialAction> => {
    const { data, error } = await supabase
      .from('social_actions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('social_actions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  getUpcoming: async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  create: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<Event>): Promise<Event> => {
    const { data, error } = await supabase
      .from('events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Financial Documents Functions
export const financialService = {
  async getAll(): Promise<FinancialDocument[]> {
    const { data, error } = await supabase
      .from('financial_documents')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByYear(year: number): Promise<FinancialDocument[]> {
    const { data, error } = await supabase
      .from('financial_documents')
      .select('*')
      .eq('year', year)
      .order('month', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(document: Omit<FinancialDocument, 'id' | 'upload_date'>): Promise<FinancialDocument> {
    const { data, error } = await supabase
      .from('financial_documents')
      .insert([{ ...document, upload_date: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async uploadDocument(file: File, metadata: Omit<FinancialDocument, 'id' | 'file_url' | 'upload_date'>): Promise<FinancialDocument> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return await this.create({
      ...metadata,
      file_url: urlData.publicUrl,
      file_name: file.name
    });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Donation Functions
export const donationService = {
  async getAll(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(donation: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .insert([{ ...donation, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: Donation['status'], transactionId?: string): Promise<Donation> {
    const { data, error } = await supabase
      .from('donations')
      .update({ status, transaction_id: transactionId })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTotalByMonth(year: number, month: number): Promise<number> {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', `${year}-${String(month).padStart(2, '0')}-01`)
      .lt('created_at', `${year}-${String(month + 1).padStart(2, '0')}-01`);
    
    if (error) throw error;
    return data?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  }
}

// Contact Functions
export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ 
        ...message, 
        status: 'new',
        created_at: new Date().toISOString() 
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Storage Functions
export const storageService = {
  async uploadImage(file: File, bucket: string, path: string): Promise<string> {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
}
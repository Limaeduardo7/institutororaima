import { createClient } from '@supabase/supabase-js'
import type { SocialAction, Event, FinancialDocument, Donation, ContactMessage, Document } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

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

  create: async (actionData: Omit<SocialAction, 'id' | 'created_at' | 'updated_at'>, imageFile?: File): Promise<SocialAction> => {
    let imageUrl = actionData.image_url;
    
    // Se uma imagem foi fornecida, fazer upload para o bucket
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `social-actions/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }
    
    const action = { ...actionData, image_url: imageUrl };
    
    const { data, error } = await supabase
      .from('social_actions')
      .insert([action])
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao criar ação social - nenhum dado retornado');
    }
    return data[0];
  },

  update: async (id: string, updates: Partial<SocialAction>, imageFile?: File): Promise<SocialAction> => {
    const updateData = { ...updates };
    
    // Se uma nova imagem foi fornecida, fazer upload
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `social-actions/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload da nova imagem
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      updateData.image_url = urlData.publicUrl;
      
      // Opcional: Remover imagem antiga (se não for uma URL externa)
      if (updates.image_url && updates.image_url.includes('supabase')) {
        const oldPath = updates.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('images')
            .remove([`social-actions/${oldPath}`]);
        }
      }
    }
    
    const { data, error } = await supabase
      .from('social_actions')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao atualizar ação social - registro não encontrado');
    }
    return data[0];
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

  create: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>, imageFile?: File): Promise<Event> => {
    let imageUrl = eventData.image_url;
    
    // Se uma imagem foi fornecida, fazer upload para o bucket
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `events/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }
    
    const event = { ...eventData, image_url: imageUrl };
    
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao criar evento - nenhum dado retornado');
    }
    return data[0];
  },

  update: async (id: string, updates: Partial<Event>, imageFile?: File): Promise<Event> => {
    const updateData = { ...updates };
    
    // Se uma nova imagem foi fornecida, fazer upload
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `events/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload da nova imagem
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      updateData.image_url = urlData.publicUrl;
      
      // Opcional: Remover imagem antiga
      if (updates.image_url && updates.image_url.includes('supabase')) {
        const oldPath = updates.image_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('images')
            .remove([`events/${oldPath}`]);
        }
      }
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao atualizar evento - registro não encontrado');
    }
    return data[0];
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
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao criar documento - nenhum dado retornado');
    }
    return data[0];
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

// Document Functions (General Administrative Documents)
export const documentService = {
  async getAll(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: Document['category']): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByYear(year: number): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('year', year)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(document: Omit<Document, 'id' | 'upload_date' | 'created_at' | 'updated_at'>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert([{ ...document, upload_date: new Date().toISOString() }])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao criar documento - nenhum dado retornado');
    }
    return data[0];
  },

  async uploadDocument(
    file: File,
    metadata: Omit<Document, 'id' | 'file_url' | 'file_name' | 'file_size' | 'file_type' | 'upload_date' | 'created_at' | 'updated_at'>
  ): Promise<Document> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${metadata.category}/${fileName}`;

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
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    });
  },

  async update(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Falha ao atualizar documento - registro não encontrado');
    }
    return data[0];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
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
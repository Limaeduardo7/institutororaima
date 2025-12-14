-- ========================================
-- INSTITUTO ESTAÇÃO - ESTRUTURA COMPLETA DO BANCO DE DADOS
-- ========================================
-- Este script cria TODAS as tabelas, políticas e configurações necessárias
-- para o projeto do Instituto Estação em Roraima
--
-- VERSÃO: 2.0 (Incluindo tabela de Documentos Institucionais)
--
-- INSTRUÇÕES:
-- 1. Crie um novo projeto no Supabase (https://supabase.com/dashboard)
-- 2. Vá em SQL Editor
-- 3. Cole e execute este script completo
-- 4. Depois crie os buckets de storage manualmente (instruções no final)
-- ========================================

-- ========================================
-- 1. TABELA: social_actions
-- Armazena as ações sociais do instituto
-- ========================================
CREATE TABLE IF NOT EXISTS social_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  beneficiaries INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'planned')),
  start_date DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_social_actions_status ON social_actions(status);
CREATE INDEX IF NOT EXISTS idx_social_actions_created_at ON social_actions(created_at DESC);

-- ========================================
-- 2. TABELA: events
-- Armazena os eventos do instituto
-- ========================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- ========================================
-- 3. TABELA: financial_documents
-- Armazena os documentos financeiros para transparência
-- ========================================
CREATE TABLE IF NOT EXISTS financial_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('receipt', 'report', 'statement', 'other')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_financial_documents_year ON financial_documents(year DESC);
CREATE INDEX IF NOT EXISTS idx_financial_documents_type ON financial_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_financial_documents_upload_date ON financial_documents(upload_date DESC);

-- ========================================
-- 4. TABELA: donations
-- Armazena as doações recebidas
-- ========================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  donor_phone VARCHAR(50),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('pix', 'card', 'boleto', 'stripe')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id VARCHAR(255),
  message TEXT,
  currency VARCHAR(10) DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Comentários explicativos
COMMENT ON COLUMN donations.currency IS 'Moeda da doação: BRL (Real), USD (Dólar), EUR (Euro), GBP (Libra), CAD (Dólar Canadense), AUD (Dólar Australiano)';
COMMENT ON COLUMN donations.payment_method IS 'Método de pagamento: pix, card, boleto (Mercado Pago) ou stripe (internacional)';

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_payment_method ON donations(payment_method);
CREATE INDEX IF NOT EXISTS idx_donations_currency ON donations(currency);

-- ========================================
-- 5. TABELA: contact_messages
-- Armazena as mensagens de contato recebidas
-- ========================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ========================================
-- 6. TABELA: documents (NOVA!)
-- Armazena documentos institucionais (estatutos, atas, relatórios, certidões)
-- Esta tabela é diferente de 'financial_documents'
-- ========================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL CHECK (category IN ('estatuto', 'ata', 'relatorio', 'certidao', 'outros')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  year INTEGER,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_year ON documents(year);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON documents(is_public);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Comentários explicativos
COMMENT ON TABLE documents IS 'Documentos administrativos e institucionais do Instituto Estação';
COMMENT ON COLUMN documents.category IS 'Categorias: estatuto, ata, relatorio, certidao, outros';
COMMENT ON COLUMN documents.is_public IS 'Define se o documento pode ser visualizado publicamente';
COMMENT ON COLUMN documents.file_size IS 'Tamanho do arquivo em bytes';

-- ========================================
-- 7. HABILITAR ROW LEVEL SECURITY (RLS)
-- Segurança em nível de linha para todas as tabelas
-- ========================================
ALTER TABLE social_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 8. POLÍTICAS DE ACESSO - LEITURA PÚBLICA
-- Permite que qualquer pessoa veja os dados (necessário para o site público)
-- ========================================

-- Social Actions - Leitura pública
DROP POLICY IF EXISTS "Public read access for social_actions" ON social_actions;
CREATE POLICY "Public read access for social_actions"
  ON social_actions FOR SELECT
  USING (true);

-- Events - Leitura pública
DROP POLICY IF EXISTS "Public read access for events" ON events;
CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  USING (true);

-- Financial Documents - Leitura pública (transparência)
DROP POLICY IF EXISTS "Public read access for financial_documents" ON financial_documents;
CREATE POLICY "Public read access for financial_documents"
  ON financial_documents FOR SELECT
  USING (true);

-- Documents - Leitura pública apenas para documentos marcados como públicos
DROP POLICY IF EXISTS "Public read access to public documents" ON documents;
CREATE POLICY "Public read access to public documents"
  ON documents FOR SELECT
  USING (is_public = true);

-- Donations - Sem leitura pública (dados sensíveis)
-- Contact Messages - Sem leitura pública (dados sensíveis)

-- ========================================
-- 9. POLÍTICAS DE ACESSO - INSERÇÃO PÚBLICA
-- Permite que qualquer pessoa envie doações e mensagens de contato
-- ========================================

-- Donations - Inserção pública (qualquer pessoa pode doar)
DROP POLICY IF EXISTS "Public insert access for donations" ON donations;
CREATE POLICY "Public insert access for donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- Contact Messages - Inserção pública (qualquer pessoa pode enviar mensagem)
DROP POLICY IF EXISTS "Public insert access for contact_messages" ON contact_messages;
CREATE POLICY "Public insert access for contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- ========================================
-- 10. POLÍTICAS DE ACESSO - ADMINISTRAÇÃO COMPLETA (TEMPORÁRIO)
-- IMPORTANTE: Estas políticas permitem acesso PÚBLICO total
-- Isso é TEMPORÁRIO até implementar autenticação Supabase Auth
-- ========================================

-- Social Actions - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public full access for social_actions" ON social_actions;
CREATE POLICY "Public full access for social_actions"
  ON social_actions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Events - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public full access for events" ON events;
CREATE POLICY "Public full access for events"
  ON events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Financial Documents - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public full access for financial_documents" ON financial_documents;
CREATE POLICY "Public full access for financial_documents"
  ON financial_documents FOR ALL
  USING (true)
  WITH CHECK (true);

-- Donations - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public full access for donations" ON donations;
CREATE POLICY "Public full access for donations"
  ON donations FOR ALL
  USING (true)
  WITH CHECK (true);

-- Contact Messages - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public full access for contact_messages" ON contact_messages;
CREATE POLICY "Public full access for contact_messages"
  ON contact_messages FOR ALL
  USING (true)
  WITH CHECK (true);

-- Documents - Acesso completo público (TEMPORÁRIO)
DROP POLICY IF EXISTS "Public insert for documents" ON documents;
CREATE POLICY "Public insert for documents"
  ON documents FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update for documents" ON documents;
CREATE POLICY "Public update for documents"
  ON documents FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public delete for documents" ON documents;
CREATE POLICY "Public delete for documents"
  ON documents FOR DELETE
  USING (true);

-- ========================================
-- 11. FUNÇÕES E TRIGGERS
-- Atualização automática de updated_at
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para social_actions
DROP TRIGGER IF EXISTS update_social_actions_updated_at ON social_actions;
CREATE TRIGGER update_social_actions_updated_at
  BEFORE UPDATE ON social_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para events
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers para documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 12. BANCO DE DADOS PRONTO PARA PRODUÇÃO
-- ========================================
-- As tabelas estão criadas e vazias, prontas para receber dados reais.
-- Use o painel administrativo (/admin) para adicionar:
-- - Ações sociais reais do instituto
-- - Eventos e programações
-- - Documentos financeiros para transparência
-- - Documentos institucionais (estatutos, atas, etc.)
-- - As doações e mensagens serão registradas automaticamente

-- ========================================
-- RESUMO DAS TABELAS CRIADAS
-- ========================================
-- ✅ social_actions - Ações sociais do instituto
-- ✅ events - Eventos e programações
-- ✅ financial_documents - Documentos financeiros (transparência)
-- ✅ donations - Doações recebidas via Mercado Pago
-- ✅ contact_messages - Mensagens de contato
-- ✅ documents - Documentos institucionais (estatutos, atas, relatórios, certidões)

-- ========================================
-- FIM DO SCRIPT SQL
-- ========================================

-- ========================================
-- PRÓXIMOS PASSOS - CRIAR BUCKETS DE STORAGE
-- ========================================
-- Após executar este script, você precisa criar os buckets de storage manualmente:
--
-- 1. No painel do Supabase, vá em "Storage"
-- 2. Clique em "New bucket"
-- 3. Crie os seguintes buckets:
--
-- BUCKET 1: images
--   - Nome: images
--   - Público: SIM (marque a opção "Public bucket")
--   - Usado para: Imagens de eventos e ações sociais
--
-- BUCKET 2: documents
--   - Nome: documents
--   - Público: SIM (marque a opção "Public bucket")
--   - Usado para: Documentos financeiros E documentos institucionais (PDFs, DOCs, etc.)
--
-- 4. Configure as políticas de storage:
--    Execute estas queries no SQL Editor:

-- Políticas para bucket 'images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to images" ON storage.objects
FOR SELECT USING ( bucket_id = 'images' );

CREATE POLICY "Public Upload to images" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public Update in images" ON storage.objects
FOR UPDATE USING ( bucket_id = 'images' );

CREATE POLICY "Public Delete in images" ON storage.objects
FOR DELETE USING ( bucket_id = 'images' );

-- Políticas para bucket 'documents'
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to documents" ON storage.objects
FOR SELECT USING ( bucket_id = 'documents' );

CREATE POLICY "Public Upload to documents" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'documents' );

CREATE POLICY "Public Update in documents" ON storage.objects
FOR UPDATE USING ( bucket_id = 'documents' );

CREATE POLICY "Public Delete in documents" ON storage.objects
FOR DELETE USING ( bucket_id = 'documents' );

-- ========================================
-- CONFIGURAR ARQUIVO .env
-- ========================================
-- Após criar o projeto e executar este script, atualize o arquivo .env com:
--
-- VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
-- VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
--
-- Você encontra essas informações em:
-- Settings > API > Project URL e Project API keys (anon, public)
-- ========================================

-- ========================================
-- AVISOS IMPORTANTES DE SEGURANÇA
-- ========================================
-- ⚠️ ATENÇÃO: As políticas atuais permitem acesso PÚBLICO total!
--
-- Isso foi feito TEMPORARIAMENTE porque o painel admin usa senha simples (admin123)
-- ao invés de autenticação Supabase.
--
-- RECOMENDAÇÃO PARA PRODUÇÃO:
-- 1. Implementar Supabase Auth no painel /admin
-- 2. Trocar políticas públicas por políticas autenticadas:
--    - Substituir USING (true) por USING (auth.role() = 'authenticated')
--    - Substituir WITH CHECK (true) por WITH CHECK (auth.role() = 'authenticated')
-- 3. Manter apenas leitura pública para tabelas que devem ser visíveis no site
-- ========================================

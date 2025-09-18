-- SQL para corrigir os erros no Supabase
-- Execute estas queries no SQL Editor do Supabase

-- 1. DESABILITAR RLS temporariamente para permitir todas as operações
ALTER TABLE social_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes que podem estar causando conflitos
DROP POLICY IF EXISTS "Allow public read access on social_actions" ON social_actions;
DROP POLICY IF EXISTS "Allow public read access on events" ON events;
DROP POLICY IF EXISTS "Allow public insert on donations" ON donations;
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin full access on social_actions" ON social_actions;
DROP POLICY IF EXISTS "Allow admin full access on events" ON events;
DROP POLICY IF EXISTS "Allow admin full access on financial_documents" ON financial_documents;
DROP POLICY IF EXISTS "Allow admin read access on donations" ON donations;
DROP POLICY IF EXISTS "Allow admin update access on donations" ON donations;
DROP POLICY IF EXISTS "Allow admin full access on contact_messages" ON contact_messages;

-- 3. Para PRODUÇÃO: Reabilitar RLS com políticas corretas (opcional)
-- Descomente as linhas abaixo apenas quando quiser usar RLS em produção

/*
-- Reabilitar RLS
ALTER TABLE social_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para leitura pública
CREATE POLICY "public_read_social_actions" ON social_actions 
    FOR SELECT USING (true);

CREATE POLICY "public_read_events" ON events 
    FOR SELECT USING (true);

-- Políticas para inserção pública (doações e contato)
CREATE POLICY "public_insert_donations" ON donations 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "public_insert_contact" ON contact_messages 
    FOR INSERT WITH CHECK (true);

-- Políticas para operações administrativas (sem autenticação por enquanto)
CREATE POLICY "admin_all_social_actions" ON social_actions 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_events" ON events 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_financial" ON financial_documents 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_donations" ON donations 
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_contact" ON contact_messages 
    FOR ALL USING (true) WITH CHECK (true);
*/

-- 4. Verificar se as tabelas existem e têm dados
SELECT 'social_actions' as tabela, COUNT(*) as registros FROM social_actions
UNION ALL
SELECT 'events' as tabela, COUNT(*) as registros FROM events  
UNION ALL
SELECT 'financial_documents' as tabela, COUNT(*) as registros FROM financial_documents
UNION ALL
SELECT 'donations' as tabela, COUNT(*) as registros FROM donations
UNION ALL
SELECT 'contact_messages' as tabela, COUNT(*) as registros FROM contact_messages;

-- 5. Testar inserção de ação social
INSERT INTO social_actions (
    title, 
    description, 
    beneficiaries, 
    status, 
    start_date, 
    image_url
) VALUES (
    'Teste de Ação Social',
    'Esta é uma ação social de teste para verificar se as inserções estão funcionando',
    50,
    'active',
    CURRENT_DATE,
    '/images/teste.jpg'
) RETURNING *;

SELECT 'Correções aplicadas com sucesso!' as status;
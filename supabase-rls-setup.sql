-- Configuração RLS (Row Level Security) para Supabase
-- Execute este código APÓS criar as tabelas com o arquivo supabase-schema-simple.sql

-- Desabilitar RLS temporariamente para permitir todas as operações durante desenvolvimento
ALTER TABLE social_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE financial_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE donations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- OU se quiser usar RLS (mais seguro para produção), execute estas políticas:

-- Habilitar RLS
-- ALTER TABLE social_actions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir leitura pública das ações sociais e eventos
-- CREATE POLICY "Allow public read on social_actions" ON social_actions FOR SELECT USING (true);
-- CREATE POLICY "Allow public read on events" ON events FOR SELECT USING (true);

-- Políticas para permitir inserção de doações e mensagens de contato
-- CREATE POLICY "Allow public insert on donations" ON donations FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public insert on contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Políticas para operações administrativas (requer autenticação)
-- CREATE POLICY "Allow authenticated full access on social_actions" ON social_actions USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated full access on events" ON events USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated full access on financial_documents" ON financial_documents USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated read/update on donations" ON donations FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated update on donations" ON donations FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated full access on contact_messages" ON contact_messages USING (auth.role() = 'authenticated');

SELECT 'RLS configurado com sucesso!' as status;
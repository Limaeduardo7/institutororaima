-- SQL para criar toda a estrutura do Instituto Estação no Supabase
-- Execute este código no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Ações Sociais
CREATE TABLE social_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    beneficiaries INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'planned')) DEFAULT 'active',
    start_date DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Eventos
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(500) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Documentos Financeiros
CREATE TABLE financial_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    document_type VARCHAR(20) CHECK (document_type IN ('receipt', 'report', 'statement', 'other')) DEFAULT 'other',
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    year INTEGER NOT NULL,
    month INTEGER CHECK (month >= 1 AND month <= 12) NOT NULL
);

-- 4. Tabela de Doações
CREATE TABLE donations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) CHECK (payment_method IN ('pix', 'card', 'boleto')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Mensagens de Contato
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_social_actions_status ON social_actions(status);
CREATE INDEX idx_social_actions_created_at ON social_actions(created_at DESC);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_financial_documents_year_month ON financial_documents(year, month);
CREATE INDEX idx_financial_documents_type ON financial_documents(document_type);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_social_actions_updated_at 
    BEFORE UPDATE ON social_actions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE social_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (social_actions e events)
CREATE POLICY "Allow public read access on social_actions" ON social_actions
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on events" ON events
    FOR SELECT USING (true);

-- Políticas para inserção pública (donations e contact_messages)
CREATE POLICY "Allow public insert on donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on contact_messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Políticas administrativas (necessário estar autenticado como admin)
CREATE POLICY "Allow admin full access on social_actions" ON social_actions
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on events" ON events
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on financial_documents" ON financial_documents
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin read access on donations" ON donations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update access on donations" ON donations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on contact_messages" ON contact_messages
    USING (auth.role() = 'authenticated');

-- Configurar storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('documents', 'documents', true),
    ('images', 'images', true);

-- Políticas para storage
CREATE POLICY "Allow public read access on documents bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow admin upload to documents bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete from documents bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on images bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow admin upload to images bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete from images bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Dados iniciais para desenvolvimento/teste
INSERT INTO social_actions (title, description, beneficiaries, status, start_date, image_url) VALUES
('Alimentação Solidária', 'Distribuição de cestas básicas para famílias em vulnerabilidade social da região metropolitana', 150, 'active', '2024-01-01', '/images/alimentacao-solidaria.jpg'),
('Educação Infantil Comunitária', 'Programa de reforço escolar e atividades educativas para crianças de 6 a 12 anos', 80, 'active', '2024-02-01', '/images/educacao-infantil.jpg'),
('Saúde Comunitária', 'Atendimento médico básico, campanhas de vacinação e orientação sobre saúde preventiva', 200, 'active', '2024-03-01', '/images/saude-comunitaria.jpg'),
('Capacitação Profissional', 'Cursos de qualificação profissional em diversas áreas para jovens e adultos', 60, 'active', '2024-04-01', '/images/capacitacao.jpg'),
('Projeto Horta Comunitária', 'Cultivo de alimentos orgânicos para distribuição às famílias atendidas', 100, 'completed', '2023-06-01', '/images/horta-comunitaria.jpg');

INSERT INTO events (title, description, date, location, image_url) VALUES
('Feira de Adoção de Animais', 'Evento especial para conectar famílias com animais que precisam de um lar. Mais de 50 cães e gatos estarão disponíveis.', '2024-12-15', 'Praça do Centro Cívico, Boa Vista - RR', '/images/feira-adocao.jpg'),
('Mutirão de Limpeza do Rio Branco', 'Ação ambiental para limpeza das margens do Rio Branco com participação da comunidade local.', '2024-12-20', 'Orla do Rio Branco, Boa Vista - RR', '/images/mutirao-limpeza.jpg'),
('Natal Solidário 2024', 'Distribuição de presentes e ceia natalina para famílias em situação de vulnerabilidade social.', '2024-12-24', 'Sede do Instituto, Jardim Bela Vista - RR', '/images/natal-solidario.jpg'),
('Campanha de Vacinação Infantil', 'Mutirão de vacinação em parceria com a Secretaria de Saúde para crianças de 0 a 5 anos.', '2025-01-15', 'Centro Comunitário São Pedro, Boa Vista - RR', '/images/vacinacao.jpg'),
('Workshop de Capacitação Digital', 'Curso gratuito de informática básica e inclusão digital para jovens e adultos.', '2025-02-01', 'Laboratório de Informática - Instituto Estação', '/images/workshop-digital.jpg');

INSERT INTO financial_documents (title, description, document_type, file_url, file_name, year, month) VALUES
('Relatório Financeiro - Dezembro 2024', 'Demonstrativo completo das receitas e despesas do mês de dezembro', 'report', '/documents/relatorio-dezembro-2024.pdf', 'relatorio-dezembro-2024.pdf', 2024, 12),
('Comprovantes de Doações - Novembro 2024', 'Recibos e comprovantes de todas as doações recebidas em novembro', 'receipt', '/documents/doacoes-novembro-2024.pdf', 'doacoes-novembro-2024.pdf', 2024, 11),
('Balanço Patrimonial 2024', 'Demonstrativo patrimonial completo do exercício 2024', 'statement', '/documents/balanco-2024.pdf', 'balanco-2024.pdf', 2024, 10);

-- Comentários explicativos
COMMENT ON TABLE social_actions IS 'Tabela que armazena informações sobre as ações sociais do instituto';
COMMENT ON TABLE events IS 'Tabela que armazena informações sobre eventos organizados pelo instituto';
COMMENT ON TABLE financial_documents IS 'Tabela que armazena documentos financeiros para transparência';
COMMENT ON TABLE donations IS 'Tabela que registra todas as doações recebidas pelo instituto';
COMMENT ON TABLE contact_messages IS 'Tabela que armazena mensagens enviadas através do formulário de contato';

-- Finalização
SELECT 'Schema do Instituto Estação criado com sucesso!' as status;
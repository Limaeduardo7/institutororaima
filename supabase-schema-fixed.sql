-- SQL Corrigido para criar estrutura no Supabase
-- Execute este código no SQL Editor do Supabase

-- 1. Tabela de Ações Sociais
CREATE TABLE IF NOT EXISTS social_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    beneficiaries INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'planned')),
    start_date DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(500) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Documentos Financeiros
CREATE TABLE IF NOT EXISTS financial_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    document_type VARCHAR(20) DEFAULT 'other' CHECK (document_type IN ('receipt', 'report', 'statement', 'other')),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    year INTEGER NOT NULL,
    month INTEGER CHECK (month >= 1 AND month <= 12) NOT NULL
);

-- 4. Tabela de Doações
CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('pix', 'card', 'boleto')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Mensagens de Contato
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais usando DO block para evitar duplicatas
DO $$
BEGIN
    -- Inserir ações sociais apenas se a tabela estiver vazia
    IF NOT EXISTS (SELECT 1 FROM social_actions LIMIT 1) THEN
        INSERT INTO social_actions (title, description, beneficiaries, status, start_date, image_url) VALUES
        ('Alimentação Solidária', 'Distribuição de cestas básicas para famílias em vulnerabilidade social da região metropolitana', 150, 'active', '2024-01-01'::date, '/images/alimentacao-solidaria.jpg'),
        ('Educação Infantil Comunitária', 'Programa de reforço escolar e atividades educativas para crianças de 6 a 12 anos', 80, 'active', '2024-02-01'::date, '/images/educacao-infantil.jpg'),
        ('Saúde Comunitária', 'Atendimento médico básico, campanhas de vacinação e orientação sobre saúde preventiva', 200, 'active', '2024-03-01'::date, '/images/saude-comunitaria.jpg'),
        ('Capacitação Profissional', 'Cursos de qualificação profissional em diversas áreas para jovens e adultos', 60, 'active', '2024-04-01'::date, '/images/capacitacao.jpg'),
        ('Projeto Horta Comunitária', 'Cultivo de alimentos orgânicos para distribuição às famílias atendidas', 100, 'completed', '2023-06-01'::date, '/images/horta-comunitaria.jpg');
    END IF;

    -- Inserir eventos apenas se a tabela estiver vazia
    IF NOT EXISTS (SELECT 1 FROM events LIMIT 1) THEN
        INSERT INTO events (title, description, date, location, image_url) VALUES
        ('Feira de Adoção de Animais', 'Evento especial para conectar famílias com animais que precisam de um lar. Mais de 50 cães e gatos estarão disponíveis.', '2024-12-15'::date, 'Praça do Centro Cívico, Boa Vista - RR', '/images/feira-adocao.jpg'),
        ('Mutirão de Limpeza do Rio Branco', 'Ação ambiental para limpeza das margens do Rio Branco com participação da comunidade local.', '2024-12-20'::date, 'Orla do Rio Branco, Boa Vista - RR', '/images/mutirao-limpeza.jpg'),
        ('Natal Solidário 2024', 'Distribuição de presentes e ceia natalina para famílias em situação de vulnerabilidade social.', '2024-12-24'::date, 'Sede do Instituto, Jardim Bela Vista - RR', '/images/natal-solidario.jpg'),
        ('Campanha de Vacinação Infantil', 'Mutirão de vacinação em parceria com a Secretaria de Saúde para crianças de 0 a 5 anos.', '2025-01-15'::date, 'Centro Comunitário São Pedro, Boa Vista - RR', '/images/vacinacao.jpg'),
        ('Workshop de Capacitação Digital', 'Curso gratuito de informática básica e inclusão digital para jovens e adultos.', '2025-02-01'::date, 'Laboratório de Informática - Instituto Estação', '/images/workshop-digital.jpg');
    END IF;

    -- Inserir documentos financeiros apenas se a tabela estiver vazia
    IF NOT EXISTS (SELECT 1 FROM financial_documents LIMIT 1) THEN
        INSERT INTO financial_documents (title, description, document_type, file_url, file_name, year, month) VALUES
        ('Relatório Financeiro - Dezembro 2024', 'Demonstrativo completo das receitas e despesas do mês de dezembro', 'report', '/documents/relatorio-dezembro-2024.pdf', 'relatorio-dezembro-2024.pdf', 2024, 12),
        ('Comprovantes de Doações - Novembro 2024', 'Recibos e comprovantes de todas as doações recebidas em novembro', 'receipt', '/documents/doacoes-novembro-2024.pdf', 'doacoes-novembro-2024.pdf', 2024, 11),
        ('Balanço Patrimonial 2024', 'Demonstrativo patrimonial completo do exercício 2024', 'statement', '/documents/balanco-2024.pdf', 'balanco-2024.pdf', 2024, 10);
    END IF;

    -- Inserir algumas doações de exemplo apenas se a tabela estiver vazia
    IF NOT EXISTS (SELECT 1 FROM donations LIMIT 1) THEN
        INSERT INTO donations (donor_name, donor_email, amount, payment_method, status) VALUES
        ('João Silva', 'joao@email.com', 100.00, 'pix', 'completed'),
        ('Maria Santos', 'maria@email.com', 50.00, 'card', 'completed'),
        ('Empresa ABC Ltda', 'contato@empresa.com', 500.00, 'boleto', 'pending');
    END IF;
END $$;

-- Verificação final
SELECT 'Schema criado com sucesso!' as status;
SELECT COUNT(*) as total_social_actions FROM social_actions;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_financial_documents FROM financial_documents;
SELECT COUNT(*) as total_donations FROM donations;
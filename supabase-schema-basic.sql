-- SQL Básico para Supabase (Execute no SQL Editor)
-- Se houver erro com as outras versões, use esta

-- 1. Criar tabelas
CREATE TABLE IF NOT EXISTS social_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    beneficiaries INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    start_date DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    document_type TEXT DEFAULT 'other',
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name TEXT,
    donor_email TEXT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inserir dados de exemplo (execute um de cada vez se necessário)
INSERT INTO social_actions (title, description, beneficiaries, status, start_date, image_url) VALUES
('Alimentação Solidária', 'Distribuição de cestas básicas para famílias em vulnerabilidade social da região metropolitana', 150, 'active', '2024-01-01', '/images/alimentacao-solidaria.jpg');

INSERT INTO social_actions (title, description, beneficiaries, status, start_date, image_url) VALUES
('Educação Infantil Comunitária', 'Programa de reforço escolar e atividades educativas para crianças de 6 a 12 anos', 80, 'active', '2024-02-01', '/images/educacao-infantil.jpg');

INSERT INTO social_actions (title, description, beneficiaries, status, start_date, image_url) VALUES
('Saúde Comunitária', 'Atendimento médico básico, campanhas de vacinação e orientação sobre saúde preventiva', 200, 'active', '2024-03-01', '/images/saude-comunitaria.jpg');

INSERT INTO events (title, description, date, location, image_url) VALUES
('Feira de Adoção de Animais', 'Evento especial para conectar famílias com animais que precisam de um lar', '2024-12-15', 'Praça do Centro Cívico, Boa Vista - RR', '/images/feira-adocao.jpg');

INSERT INTO events (title, description, date, location, image_url) VALUES
('Natal Solidário 2024', 'Distribuição de presentes e ceia natalina para famílias em situação de vulnerabilidade social', '2024-12-24', 'Sede do Instituto, Jardim Bela Vista - RR', '/images/natal-solidario.jpg');

INSERT INTO financial_documents (title, description, document_type, file_url, file_name, year, month) VALUES
('Relatório Financeiro - Dezembro 2024', 'Demonstrativo completo das receitas e despesas do mês de dezembro', 'report', '/documents/relatorio-dezembro-2024.pdf', 'relatorio-dezembro-2024.pdf', 2024, 12);

-- Verificar se funcionou
SELECT COUNT(*) as social_actions FROM social_actions;
SELECT COUNT(*) as events FROM events;
SELECT COUNT(*) as financial_documents FROM financial_documents;
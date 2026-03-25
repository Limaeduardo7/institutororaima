-- Adicionar coluna para nota fiscal/recibo na tabela de doações
ALTER TABLE donations ADD COLUMN IF NOT EXISTS receipt_url TEXT;

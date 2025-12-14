-- ========================================
-- MIGRAÇÃO: Adicionar Suporte ao Stripe
-- ========================================
-- Este script adiciona suporte para pagamentos internacionais via Stripe
-- Execute este script no SQL Editor do Supabase

-- ========================================
-- 1. Adicionar 'stripe' ao payment_method
-- ========================================
ALTER TABLE donations
  DROP CONSTRAINT IF EXISTS donations_payment_method_check;

ALTER TABLE donations
  ADD CONSTRAINT donations_payment_method_check
  CHECK (payment_method IN ('pix', 'card', 'boleto', 'stripe'));

-- ========================================
-- 2. Adicionar coluna currency (moeda)
-- ========================================
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'BRL';

-- Comentário explicativo
COMMENT ON COLUMN donations.currency IS 'Moeda da doação: BRL (Real), USD (Dólar), EUR (Euro), GBP (Libra), CAD (Dólar Canadense), AUD (Dólar Australiano)';

-- ========================================
-- 3. Criar índice para currency
-- ========================================
CREATE INDEX IF NOT EXISTS idx_donations_currency ON donations(currency);

-- ========================================
-- 4. Atualizar doações existentes
-- ========================================
-- Define BRL como moeda padrão para doações existentes
UPDATE donations
SET currency = 'BRL'
WHERE currency IS NULL;

-- ========================================
-- FIM DA MIGRAÇÃO
-- ========================================

-- Verificar as alterações:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'donations'
-- ORDER BY ordinal_position;

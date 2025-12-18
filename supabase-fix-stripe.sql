-- Script para adicionar 'stripe' como método de pagamento válido
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos remover a constraint antiga
ALTER TABLE donations
DROP CONSTRAINT IF EXISTS donations_payment_method_check;

-- 2. Adicionar a nova constraint incluindo 'stripe'
ALTER TABLE donations
ADD CONSTRAINT donations_payment_method_check
CHECK (payment_method IN ('pix', 'card', 'boleto', 'stripe'));

-- 3. Verificar se a constraint foi criada corretamente
SELECT conname, consrc
FROM pg_constraint
WHERE conrelid = 'donations'::regclass
AND conname = 'donations_payment_method_check';

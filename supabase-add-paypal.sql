-- Script para migrar de Stripe para PayPal
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, vamos remover a constraint antiga
ALTER TABLE donations
DROP CONSTRAINT IF EXISTS donations_payment_method_check;

-- 2. Migrar registros existentes de 'stripe' para 'paypal'
UPDATE donations
SET payment_method = 'paypal'
WHERE payment_method = 'stripe';

-- 3. Adicionar a nova constraint incluindo 'paypal' ao invés de 'stripe'
ALTER TABLE donations
ADD CONSTRAINT donations_payment_method_check
CHECK (payment_method IN ('pix', 'card', 'boleto', 'paypal'));

-- 4. Verificar se a constraint foi criada corretamente
SELECT conname, pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'donations'::regclass
AND conname = 'donations_payment_method_check';

-- 5. Verificar registros migrados
SELECT payment_method, COUNT(*) as total
FROM donations
GROUP BY payment_method
ORDER BY payment_method;

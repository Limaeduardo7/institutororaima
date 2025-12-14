-- ========================================
-- LIMPAR DADOS DE EXEMPLO - AMBIENTE DE PRODUÇÃO
-- ========================================
-- Execute este script para remover todos os dados de exemplo
-- e deixar o banco pronto para dados reais de produção
-- ========================================

-- IMPORTANTE: Este script irá DELETAR todos os dados das tabelas!
-- Execute apenas se tiver certeza que deseja limpar tudo.

-- Limpar ações sociais de exemplo
DELETE FROM social_actions;

-- Limpar eventos de exemplo
DELETE FROM events;

-- Limpar documentos financeiros de exemplo
DELETE FROM financial_documents;

-- Limpar doações (se houver alguma de teste)
DELETE FROM donations;

-- Limpar mensagens de contato (se houver alguma de teste)
DELETE FROM contact_messages;

-- ========================================
-- RESETAR SEQUÊNCIAS (OPCIONAL)
-- ========================================
-- Se você quiser que os novos IDs comecem do zero novamente,
-- descomente as linhas abaixo:

-- ALTER SEQUENCE social_actions_id_seq RESTART WITH 1;
-- ALTER SEQUENCE events_id_seq RESTART WITH 1;
-- ALTER SEQUENCE financial_documents_id_seq RESTART WITH 1;
-- ALTER SEQUENCE donations_id_seq RESTART WITH 1;
-- ALTER SEQUENCE contact_messages_id_seq RESTART WITH 1;

-- ========================================
-- PRONTO PARA PRODUÇÃO
-- ========================================
-- Agora as tabelas estão vazias e prontas para receber dados reais.
-- Use o painel administrativo em /admin para adicionar:
-- - Ações sociais reais do Instituto Estação
-- - Eventos verdadeiros
-- - Documentos financeiros reais
-- - Doações e mensagens serão capturadas automaticamente do site

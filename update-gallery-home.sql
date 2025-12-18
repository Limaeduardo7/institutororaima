-- Adicionar coluna para controlar exibição na Home
ALTER TABLE gallery_items 
ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false;

-- Atualizar política de segurança para permitir leitura pública dessa coluna (já está coberto pelo SELECT * mas é bom garantir se houver select explícito no futuro)
-- A política existente "Leitura pública da galeria" já cobre SELECT USING (true), então não precisa alterar RLS para leitura.

-- Opcional: Criar índice para performance se houver muitos itens
CREATE INDEX IF NOT EXISTS idx_gallery_show_on_home ON gallery_items(show_on_home) WHERE show_on_home = true;

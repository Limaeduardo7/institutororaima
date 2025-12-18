-- Tabela para itens da galeria
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'geral',
  show_on_home BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar campo show_on_home se a tabela já existir
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false;

-- Habilitar RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
DROP POLICY IF EXISTS "Leitura pública da galeria" ON gallery_items;
CREATE POLICY "Leitura pública da galeria" ON gallery_items
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin pode gerenciar galeria" ON gallery_items;
CREATE POLICY "Admin pode gerenciar galeria" ON gallery_items
  FOR ALL USING (true); -- Permite todas as operações (temporário para desenvolvimento)

-- Para produção, use esta política mais restritiva:
-- DROP POLICY IF EXISTS "Admin pode gerenciar galeria" ON gallery_items;
-- CREATE POLICY "Admin pode gerenciar galeria" ON gallery_items
--   FOR ALL USING (auth.role() = 'authenticated');

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_show_on_home ON gallery_items(show_on_home);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON gallery_items(created_at DESC);

-- Inserir dados de demonstração (6 itens para exibir na home)
INSERT INTO gallery_items (title, description, media_type, url, category, show_on_home) VALUES
  ('Ação Social', 'Distribuição de alimentos para famílias em vulnerabilidade', 'image', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', 'social', true),
  ('Educação Infantil', 'Crianças participando de atividades educacionais', 'image', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop', 'educacao', true),
  ('Saúde Comunitária', 'Atendimento médico básico na comunidade', 'image', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', 'saude', true),
  ('Esporte e Lazer', 'Atividades esportivas com crianças', 'image', 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop', 'esporte', true),
  ('Cultura', 'Apresentação cultural da comunidade', 'image', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop', 'cultura', true),
  ('Meio Ambiente', 'Ações de preservação ambiental', 'image', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop', 'ambiente', true)
ON CONFLICT DO NOTHING;

-- Verificar os dados inseridos
SELECT id, title, category, show_on_home, created_at FROM gallery_items WHERE show_on_home = true ORDER BY created_at DESC;

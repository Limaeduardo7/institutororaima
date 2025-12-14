-- ========================================
-- TABELA DE DOCUMENTOS GERAIS
-- ========================================
-- Esta tabela é diferente de 'financial_documents' e serve para
-- documentos administrativos, estatutos, atas, relatórios, etc.

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'estatuto', 'ata', 'relatorio', 'certidao', 'outros'
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER, -- tamanho em bytes
  file_type VARCHAR(100), -- tipo MIME do arquivo
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  year INTEGER, -- ano de referência do documento
  is_public BOOLEAN DEFAULT true, -- se o documento é público ou restrito
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_year ON documents(year);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON documents(is_public);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Habilitar RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (temporário - até implementar autenticação)
DROP POLICY IF EXISTS "Allow public read access to public documents" ON documents;
CREATE POLICY "Allow public read access to public documents"
  ON documents FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Allow public insert for documents" ON documents;
CREATE POLICY "Allow public insert for documents"
  ON documents FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update for documents" ON documents;
CREATE POLICY "Allow public update for documents"
  ON documents FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete for documents" ON documents;
CREATE POLICY "Allow public delete for documents"
  ON documents FOR DELETE
  USING (true);

-- ========================================
-- COMENTÁRIOS EXPLICATIVOS
-- ========================================

COMMENT ON TABLE documents IS 'Documentos administrativos e institucionais do Instituto Estação';
COMMENT ON COLUMN documents.category IS 'Categorias: estatuto, ata, relatorio, certidao, outros';
COMMENT ON COLUMN documents.is_public IS 'Define se o documento pode ser visualizado publicamente';
COMMENT ON COLUMN documents.file_size IS 'Tamanho do arquivo em bytes';

-- ========================================
-- BUCKET DE STORAGE (criar manualmente)
-- ========================================
-- Você já deve ter o bucket 'documents' criado.
-- Se não tiver, execute via SQL no Supabase:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('documents', 'documents', true);
--
-- E configure as políticas de storage:
--
-- CREATE POLICY "Public Access"
-- ON storage.objects FOR SELECT
-- USING ( bucket_id = 'documents' );
--
-- CREATE POLICY "Public Upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK ( bucket_id = 'documents' );
--
-- CREATE POLICY "Public Update"
-- ON storage.objects FOR UPDATE
-- USING ( bucket_id = 'documents' );
--
-- CREATE POLICY "Public Delete"
-- ON storage.objects FOR DELETE
-- USING ( bucket_id = 'documents' );

-- ========================================
-- FIM DO SCRIPT
-- ========================================

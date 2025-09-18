-- SQL para configurar os buckets de storage no Supabase
-- Execute este código no SQL Editor do Supabase

-- 1. Criar buckets se não existirem
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('images', 'images', true),
    ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Remover políticas existentes (caso existam)
DROP POLICY IF EXISTS "Allow public read access on images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete from images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload to documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete from documents bucket" ON storage.objects;

-- 3. Políticas para bucket de IMAGES
-- Leitura pública
CREATE POLICY "Public read images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Upload público (permitir que qualquer um faça upload de imagens)
CREATE POLICY "Public upload images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'images');

-- Update público
CREATE POLICY "Public update images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

-- Delete público (para permitir substituição de imagens)
CREATE POLICY "Public delete images" ON storage.objects
    FOR DELETE USING (bucket_id = 'images');

-- 4. Políticas para bucket de DOCUMENTS
-- Leitura pública
CREATE POLICY "Public read documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

-- Upload público
CREATE POLICY "Public upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents');

-- Update público
CREATE POLICY "Public update documents" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

-- Delete público
CREATE POLICY "Public delete documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents');

-- 5. Verificar se os buckets foram criados
SELECT id, name, public, created_at FROM storage.buckets 
WHERE id IN ('images', 'documents');

-- 6. Verificar políticas criadas
SELECT policyname, tablename FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (policyname LIKE '%images%' OR policyname LIKE '%documents%');

SELECT 'Buckets de storage configurados com sucesso!' as status;
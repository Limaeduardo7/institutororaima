# ✅ Checklist de Produção - Instituto Estação

## 📋 Status Atual

✅ Novo projeto Supabase criado
✅ Credenciais configuradas no `.env`
✅ Script SQL sem dados de exemplo
✅ Frontend ajustado para ambiente de produção
⚠️ Dados de exemplo ainda estão no banco (precisa limpar)
⚠️ Buckets de storage precisam ser criados

---

## 🔥 AÇÕES URGENTES (Faça Agora)

### 1. Limpar Dados de Exemplo do Banco

Execute o script para remover todos os dados de teste:

1. Acesse: https://supabase.com/dashboard/project/onzpsdspnliqqludbrxw/sql/new
2. Abra o arquivo `cleanup-example-data.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor do Supabase
5. Clique em **"Run"**

**Isso vai deletar:**
- 3 ações sociais de exemplo
- 3 eventos de exemplo
- 3 documentos financeiros de exemplo
- Qualquer doação ou mensagem de teste

---

### 2. Criar Buckets de Storage

**BUCKET 1: images**
1. Vá em: https://supabase.com/dashboard/project/onzpsdspnliqqludbrxw/storage/buckets
2. Clique em **"New bucket"**
3. Nome: `images`
4. ✅ Marque **"Public bucket"** (IMPORTANTE!)
5. Clique em **"Create bucket"**

**BUCKET 2: documents**
1. Clique novamente em **"New bucket"**
2. Nome: `documents`
3. ✅ Marque **"Public bucket"** (IMPORTANTE!)
4. Clique em **"Create bucket"**

**Configurar Políticas (Recomendado):**
- Para cada bucket, vá em **Policies**
- Adicione: **"Allow public read access"**
- Adicione: **"Allow authenticated uploads"**

---

## 📊 Adicionar Dados Reais

### Via Painel Administrativo (/admin)

**Senha padrão:** `admin123` (⚠️ MUDE ISSO!)

#### 1. Ações Sociais
- Acesse: http://localhost:5173/admin/social-actions
- Adicione programas reais do instituto
- Use fotos reais (serão enviadas para o bucket `images`)

#### 2. Eventos
- Acesse: http://localhost:5173/admin/events
- Adicione eventos reais e programações
- Use fotos reais dos eventos

#### 3. Documentos Financeiros
- Acesse: http://localhost:5173/admin/financial-documents
- Faça upload de PDFs reais de transparência
- Os arquivos serão enviados para o bucket `documents`

---

## 🔒 Segurança (CRÍTICO!)

### Alterar Senha do Admin

A senha padrão `admin123` está definida no código. Você precisa:

**Opção 1: Senha Hardcoded (Rápido)**
1. Edite: `src/pages/Admin.tsx` linha 12
2. Mude de `'admin123'` para uma senha forte
3. Faça commit e deploy

**Opção 2: Autenticação Real (Recomendado)**
1. Configure Supabase Auth
2. Crie usuários administrativos
3. Use autenticação JWT real

⚠️ **NUNCA deixe `admin123` em produção!**

---

## 🌐 Deploy em Produção

### Antes de fazer deploy:

✅ Dados de exemplo removidos
✅ Buckets criados e públicos
✅ Dados reais adicionados
✅ Senha do admin alterada
✅ Testado localmente

### Comandos para build:

```bash
# Teste local
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

### Deploy no Netlify:

```bash
# Se já tem netlify configurado
netlify deploy --prod

# Ou manualmente:
# 1. npm run build
# 2. Suba a pasta 'dist' no Netlify
```

**Variáveis de Ambiente no Netlify:**
- `VITE_SUPABASE_URL=https://onzpsdspnliqqludbrxw.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🧪 Testes Finais

### Páginas Públicas (sem login):
- [ ] Home carrega corretamente
- [ ] Eventos mostra dados reais ou "nenhum evento"
- [ ] Transparência mostra documentos reais
- [ ] Formulário de doação funciona
- [ ] Formulário de contato funciona

### Área Administrativa (/admin):
- [ ] Login funciona
- [ ] Pode criar ações sociais
- [ ] Pode criar eventos
- [ ] Pode fazer upload de documentos
- [ ] Imagens são salvas no bucket
- [ ] Documentos são salvos no bucket

### Banco de Dados:
- [ ] Apenas dados reais no banco
- [ ] Sem dados de exemplo/teste
- [ ] Doações sendo registradas
- [ ] Mensagens sendo registradas

---

## 📞 Problemas Comuns

### "Failed to fetch" ou erro de CORS
- Verifique se as credenciais no `.env` estão corretas
- Reinicie o servidor de desenvolvimento

### Upload de imagens falha
- Verifique se os buckets foram criados
- Confirme que estão marcados como PÚBLICOS
- Verifique as políticas de storage

### Páginas vazias
- Normal se não tiver dados reais ainda
- Adicione dados via /admin
- Verifique o console do navegador (F12)

---

## 📁 Arquivos Importantes

- `supabase-setup.sql` - Script SQL completo (SEM dados de exemplo)
- `cleanup-example-data.sql` - Remove dados de teste
- `SUPABASE-SETUP-GUIDE.md` - Guia completo passo a passo
- `.env` - Credenciais do Supabase (✅ já configurado)

---

## 🎉 Pronto para Produção!

Depois de seguir todos os passos acima, seu site estará 100% pronto para produção com dados reais do Instituto Estação!

**Próximos passos:**
1. Execute `cleanup-example-data.sql` ⚠️
2. Crie os 2 buckets de storage ⚠️
3. Adicione dados reais via /admin
4. Mude a senha do admin 🔒
5. Faça deploy! 🚀

---

**Instituto Estação - Transformando Vidas em Roraima** 🌟

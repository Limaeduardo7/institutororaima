# 🚀 Guia de Configuração do Supabase - Instituto Estação

Este guia contém todas as instruções para recriar o banco de dados do projeto no Supabase.

## 📋 Pré-requisitos

- Conta no Supabase (gratuita): https://supabase.com

## 🔧 Passo 1: Criar Novo Projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha as informações:
   - **Name**: `instituto-estacao` (ou outro nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **SALVE EM LOCAL SEGURO**
   - **Region**: Escolha a região mais próxima (recomendado: **South America (São Paulo)**)
   - **Pricing Plan**: Free (gratuito)
4. Clique em **"Create new project"**
5. ⏰ Aguarde 2-3 minutos enquanto o projeto é criado

## 📊 Passo 2: Executar o Script SQL

1. No painel do projeto, vá em **SQL Editor** (menu lateral esquerdo)
2. Clique em **"New query"**
3. Abra o arquivo `supabase-setup.sql` (na raiz do projeto)
4. **Copie TODO o conteúdo** do arquivo
5. **Cole no editor SQL** do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. ✅ Aguarde a mensagem de sucesso

### O que o script faz?

- ✅ Cria 5 tabelas:
  - `social_actions` - Ações sociais do instituto
  - `events` - Eventos e programações
  - `financial_documents` - Documentos de transparência
  - `donations` - Registro de doações
  - `contact_messages` - Mensagens de contato
- ✅ Configura políticas de segurança (RLS)
- ✅ Cria índices para performance
- ✅ Adiciona triggers para atualização automática
- ✅ Insere dados de exemplo para teste

## 📦 Passo 3: Criar Buckets de Storage

Os buckets são necessários para armazenar imagens e documentos.

### Bucket 1: images

1. No painel, vá em **Storage** (menu lateral esquerdo)
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `images`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (importante!)
4. Clique em **"Create bucket"**

### Bucket 2: documents

1. Clique novamente em **"New bucket"**
2. Preencha:
   - **Name**: `documents`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (importante!)
3. Clique em **"Create bucket"**

## 🔐 Passo 4: Configurar Políticas de Storage (Recomendado)

### Para o bucket "images":

1. Clique no bucket **images**
2. Vá em **Policies**
3. Clique em **"New Policy"**
4. Escolha **"Allow public read access"** (template)
5. Clique em **"Review"** e depois **"Save policy"**

6. Clique novamente em **"New Policy"**
7. Escolha **"Custom policy"**
8. Cole este código:
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
```
9. Clique em **"Save policy"**

### Para o bucket "documents":

Repita os mesmos passos acima, mas substituindo `'images'` por `'documents'` no código SQL.

## 🔑 Passo 5: Obter Credenciais

1. No painel, vá em **Settings** > **API** (menu lateral)
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Uma chave longa começando com `eyJ...`

## 📝 Passo 6: Atualizar o Arquivo .env

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua as informações antigas pelas novas:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui
```

3. **Salve o arquivo**

## ✅ Passo 7: Testar a Configuração

1. Pare o servidor de desenvolvimento (se estiver rodando)
2. Execute:
```bash
npm run dev
```
3. Acesse o site e teste:
   - ✅ Página de Eventos deve carregar
   - ✅ Página de Transparência deve carregar
   - ✅ Formulário de Doações deve funcionar
   - ✅ Formulário de Contato deve funcionar

## 🔍 Verificar se Está Tudo Funcionando

### No Supabase Dashboard:

1. Vá em **Table Editor**
2. Verifique se as 5 tabelas aparecem no menu lateral
3. Clique em cada tabela para ver os dados de exemplo

### No Site:

1. Acesse a página **/eventos** - deve mostrar eventos de exemplo
2. Acesse a página **/transparencia** - deve mostrar documentos de exemplo
3. Tente fazer uma doação de teste
4. Vá no Supabase > Table Editor > `donations` - deve aparecer sua doação

## 🛠️ Solução de Problemas

### Erro: "relation already exists"
- ✅ Isso é normal se você executou o script mais de uma vez
- O script usa `IF NOT EXISTS` para evitar duplicação

### Erro: "Failed to fetch" ou "ERR_NAME_NOT_RESOLVED"
- ❌ Verifique se atualizou o `.env` corretamente
- ❌ Verifique se o projeto Supabase está ativo (não pausado)
- ❌ Reinicie o servidor de desenvolvimento

### Imagens não aparecem
- ❌ Verifique se os buckets estão marcados como **PUBLIC**
- ❌ Verifique se as políticas de storage foram criadas

### Erro de permissão ao inserir dados
- ❌ Verifique se as políticas RLS foram criadas corretamente
- ❌ Execute o script SQL novamente

## 📊 Estrutura das Tabelas

### social_actions
- Armazena ações sociais em andamento
- Campos principais: title, description, beneficiaries, status

### events
- Armazena eventos e programações
- Campos principais: title, description, date, location

### financial_documents
- Armazena documentos de transparência
- Campos principais: title, file_url, year, month, document_type

### donations
- Registra doações recebidas
- Campos principais: amount, payment_method, status, donor_email

### contact_messages
- Armazena mensagens de contato
- Campos principais: name, email, subject, message, status

## 🔒 Segurança

- ✅ RLS (Row Level Security) está habilitado em todas as tabelas
- ✅ Leitura pública apenas para: social_actions, events, financial_documents
- ✅ Inserção pública apenas para: donations, contact_messages
- ✅ Dados sensíveis protegidos (doações, mensagens)
- ✅ Área administrativa requer autenticação

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do Supabase Dashboard > Logs
3. Revise cada passo deste guia

## 🎉 Pronto!

Seu banco de dados está configurado e pronto para uso!

---

**Instituto Estação - Transformando Vidas em Roraima** 🌟

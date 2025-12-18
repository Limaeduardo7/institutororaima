# 🚀 Deploy via Netlify CLI - Guia Rápido

## Pré-requisitos

Certifique-se de estar autenticado:
```bash
netlify login
```

Se já tiver um site, verifique a conexão:
```bash
netlify status
```

## 1️⃣ Configurar Variáveis de Ambiente

### Opção A: Sincronizar do arquivo .env (FÁCIL) ⭐

Certifique-se que seu arquivo `.env` está atualizado, depois execute:

```bash
npm run sync-env
```

Este comando vai ler automaticamente todas as variáveis do `.env` e enviar para a Netlify!

### Opção B: Configurar manualmente (comando por comando)

Execute cada comando (copie e cole):

#### Supabase (OBRIGATÓRIO)
```bash
netlify env:set VITE_SUPABASE_URL "https://tzdblblhvqqoozwloxwo.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGJsYmxodnFxb296d2xveHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Njk1MTQsImV4cCI6MjA4MTE0NTUxNH0.XIOeUtNLau7tUzvwAAOQUXKUGJtWWgnYWsgYuVAMV5A"
```

#### Mercado Pago (Pagamentos Nacionais)
```bash
netlify env:set VITE_MERCADOPAGO_PUBLIC_KEY "APP_USR-d9f80d3f-3aab-4ec2-954b-3bd965eefa5e"
netlify env:set MERCADOPAGO_ACCESS_TOKEN "APP_USR-2576338669498211-112716-dd23971aaabc96c7138af29c36d1cb7e-2584952014"
```

#### Stripe (Pagamentos Internacionais) - Opcional
```bash
netlify env:set VITE_STRIPE_PUBLIC_KEY "pk_test_ou_pk_live_aqui"
netlify env:set STRIPE_SECRET_KEY "sk_test_ou_sk_live_aqui"
```

## 2️⃣ Verificar Variáveis Configuradas

```bash
netlify env:list
```

Deve mostrar todas as variáveis que você acabou de configurar.

## 3️⃣ Build Local

```bash
npm run build
```

Aguarde o build terminar. A pasta `dist/` será criada.

## 4️⃣ Deploy para Produção

```bash
netlify deploy --prod
```

O CLI vai:
1. Perguntar qual pasta fazer deploy → digite: `dist` ou `.` (se já configurado)
2. Fazer upload dos arquivos
3. Processar as funções serverless
4. Retornar a URL do site

## 5️⃣ Testar

Abra o site e verifique:
- [ ] Site carrega sem erro no console
- [ ] Não aparece erro "Invalid supabaseUrl"
- [ ] Páginas navegam normalmente

## 🔄 Próximos Deploys

Depois que configurar uma vez, os próximos deploys são simples:

### Opção 1: Comando único (RECOMENDADO) ⭐
```bash
npm run deploy
```

Esse comando faz automaticamente:
1. Build do projeto
2. Deploy para produção

### Opção 2: Passo a passo
```bash
# Build
npm run build

# Deploy
netlify deploy --prod
```

### 🔄 Se atualizar o .env
Se você modificar o arquivo `.env`, sincronize novamente:
```bash
npm run sync-env
npm run deploy
```

## 🆘 Comandos Úteis

```bash
# Ver logs do último deploy
netlify deploy:logs

# Ver status do site
netlify status

# Abrir painel da Netlify no browser
netlify open

# Abrir site em produção
netlify open:site

# Listar variáveis de ambiente
netlify env:list

# Deletar uma variável
netlify env:unset NOME_DA_VARIAVEL

# Ver functions deployadas
netlify functions:list
```

## 🐛 Troubleshooting

### Erro: "No site configured"
```bash
netlify link
```
Escolha o site existente ou crie um novo.

### Erro: "Not authorized"
```bash
netlify logout
netlify login
```

### Variáveis não aparecem após configurar
As variáveis só são aplicadas no **próximo deploy**. Faça:
```bash
npm run build
netlify deploy --prod
```

### Build falha
Verifique erros com:
```bash
npm run build
```
Corrija os erros antes de fazer deploy.

### Funções não funcionam
Verifique se a pasta `netlify/functions/` tem os arquivos `.ts`:
```bash
ls netlify/functions/
```

Deve mostrar:
- `create-stripe-checkout.ts`
- `create-mercadopago-checkout.ts`
- `verify-stripe-session.ts`

## 🎯 Comando Completo (All-in-One)

Se for a primeira vez ou quiser reconfigurar tudo:

```bash
netlify env:set VITE_SUPABASE_URL "https://tzdblblhvqqoozwloxwo.supabase.co" && \
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZGJsYmxodnFxb296d2xveHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Njk1MTQsImV4cCI6MjA4MTE0NTUxNH0.XIOeUtNLau7tUzvwAAOQUXKUGJtWWgnYWsgYuVAMV5A" && \
netlify env:set VITE_MERCADOPAGO_PUBLIC_KEY "APP_USR-d9f80d3f-3aab-4ec2-954b-3bd965eefa5e" && \
netlify env:set MERCADOPAGO_ACCESS_TOKEN "APP_USR-2576338669498211-112716-dd23971aaabc96c7138af29c36d1cb7e-2584952014" && \
echo "✅ Variáveis configuradas! Fazendo build..." && \
npm run build && \
echo "✅ Build completo! Fazendo deploy..." && \
netlify deploy --prod
```

**Windows (PowerShell)**: Remova as `\` e coloque tudo em uma linha, ou execute um comando por vez.

## 📚 Documentação

- Netlify CLI: https://docs.netlify.com/cli/get-started/
- Environment Variables: https://docs.netlify.com/environment-variables/overview/
- Functions: https://docs.netlify.com/functions/overview/

---

**Próximo passo**: Depois do deploy, use o [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) para testar tudo!

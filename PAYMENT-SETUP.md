# Configuração de Pagamentos - Instituto Estação

Este guia explica como configurar corretamente os sistemas de pagamento (Mercado Pago e Stripe) para o site do Instituto Estação.

## 🔑 Credenciais Necessárias

### Mercado Pago (Pagamentos Nacionais - Brasil)

Você precisa de 2 credenciais do Mercado Pago:

1. **Public Key** (Chave Pública)
   - Formato: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Usada no frontend
   - Pode ser exposta publicamente

2. **Access Token**
   - Formato: `APP_USR-xxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx` (produção)
   - Formato: `TEST-xxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx` (teste)
   - Usada no backend (funções Netlify)
   - **NUNCA** deve ser exposta no código frontend

#### Como Obter as Credenciais do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login com sua conta Mercado Pago
3. Vá em "Suas Integrações" > "Credenciais"
4. Escolha entre **Teste** (sandbox) ou **Produção**
5. Copie as credenciais:
   - Public key
   - Access token

### Stripe (Pagamentos Internacionais)

Você precisa de 2 credenciais do Stripe:

1. **Publishable Key** (Chave Pública)
   - Formato: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx` (teste)
   - Formato: `pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx` (produção)
   - Usada no frontend
   - Pode ser exposta publicamente

2. **Secret Key** (Chave Secreta)
   - Formato: `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx` (teste)
   - Formato: `sk_live_EXAMPLE_KEY...` (produção)
   - Usada no backend (funções Netlify)
   - **NUNCA** deve ser exposta no código frontend

#### Como Obter as Credenciais do Stripe

1. Acesse: https://dashboard.stripe.com/
2. Faça login ou crie uma conta
3. Vá em "Developers" > "API keys"
4. Escolha entre **Test mode** (desenvolvimento) ou **Live mode** (produção)
5. Copie as credenciais:
   - Publishable key
   - Secret key

## 🛠️ Configuração no Netlify (Produção)

### Passo 1: Acessar Configurações do Site

1. Faça login em https://app.netlify.com/
2. Selecione seu site
3. Vá em **Site settings** > **Environment variables**

### Passo 2: Adicionar Variáveis de Ambiente

Adicione as seguintes variáveis (clique em "Add a variable"):

#### Para Mercado Pago:

| Key | Value | Exemplo |
|-----|-------|---------|
| `VITE_MERCADOPAGO_PUBLIC_KEY` | Sua Public Key | `APP_USR-12345678-1234-1234-1234-123456789012` |
| `MERCADOPAGO_ACCESS_TOKEN` | Seu Access Token | `APP_USR-123456789012345-123456-abcdef123456...` |

#### Para Stripe:

| Key | Value | Exemplo |
|-----|-------|---------|
| `VITE_STRIPE_PUBLIC_KEY` | Sua Publishable Key | `pk_live_51abcdef...` |
| `STRIPE_SECRET_KEY` | Sua Secret Key | `sk_live_51abcdef...` |

#### Para Supabase:

| Key | Value | Exemplo |
|-----|-------|---------|
| `VITE_SUPABASE_URL` | Sua URL do Supabase | `https://seu-projeto.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua Anon Key do Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Importante**: Sem essas variáveis, o site não funcionará. Você verá o erro: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL."

### Passo 3: Deploy

Após adicionar as variáveis:
1. Vá em **Deploys**
2. Clique em **Trigger deploy** > **Deploy site**
3. Aguarde o deploy finalizar (~2 minutos)

## 🧪 Teste em Desenvolvimento Local

### Criar arquivo .env.local

Na raiz do projeto, crie um arquivo `.env.local` (não commitado no git):

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key

# Mercado Pago (use credenciais de TESTE)
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-12345678-1234-1234-1234-123456789012
VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-123456789012345-123456-abc...

# Stripe (use credenciais de TESTE)
VITE_STRIPE_PUBLIC_KEY=pk_test_51abc...
VITE_STRIPE_SECRET_KEY=sk_test_51abc...
```

### Executar Localmente

```bash
npm run dev
```

## ✅ Verificação

### Como Saber se Está Funcionando

1. **Mercado Pago**:
   - Abra a página de doações
   - Selecione um valor e método de pagamento nacional (PIX, Cartão, Boleto)
   - Clique em "Doar"
   - Você deve ser redirecionado para o checkout do Mercado Pago
   - Se aparecer erro "Sistema de pagamento não está configurado", verifique as credenciais

2. **Stripe**:
   - Abra a página de doações
   - Ative "Doação Internacional"
   - Selecione um valor e moeda
   - Clique em "Doar"
   - Você deve ser redirecionado para o checkout do Stripe
   - Se aparecer erro "Payment system is not properly configured", verifique as credenciais

### Logs de Debug

No console do navegador (F12), você verá logs que indicam:
- ✅ `Creating payment preference...` - Iniciando pagamento
- ✅ `Redirecting to checkout...` - Redirecionando
- ❌ `Mercado Pago API Error:` - Erro nas credenciais do Mercado Pago
- ❌ `Stripe checkout error:` - Erro nas credenciais do Stripe
- ❌ `Netlify Function Error:` - Função serverless não encontrou credenciais

## 🚨 Problemas Comuns

### 0. "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"

**Causa**: As variáveis de ambiente do Supabase não estão configuradas na Netlify.

**Solução**:
1. Acesse https://app.netlify.com/
2. Vá em seu site > Site settings > Environment variables
3. Adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase (começa com https://)
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase
4. Faça um novo deploy (Deploys > Trigger deploy > Deploy site)
5. Aguarde o build finalizar

**Como obter as credenciais do Supabase**:
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie:
   - Project URL (exemplo: `https://abc123.supabase.co`)
   - anon/public key

### 1. "Sistema de pagamento não está configurado"

**Causa**: Credenciais do Mercado Pago não estão configuradas na Netlify.

**Solução**:
- Verifique se `MERCADOPAGO_ACCESS_TOKEN` está nas variáveis de ambiente da Netlify
- Confirme que o token começa com `APP_USR-` ou `TEST-`
- Faça um novo deploy após adicionar a variável

### 2. "Payment system is not properly configured"

**Causa**: Credenciais do Stripe não estão configuradas na Netlify.

**Solução**:
- Verifique se `STRIPE_SECRET_KEY` está nas variáveis de ambiente da Netlify
- Confirme que a chave começa com `sk_test_` ou `sk_live_`
- Faça um novo deploy após adicionar a variável

### 3. "Invalid Stripe configuration"

**Causa**: A chave secreta do Stripe está no formato errado.

**Solução**:
- Certifique-se de estar usando a **Secret Key** (sk_...), NÃO a Publishable Key (pk_...)
- Copie a chave diretamente do dashboard do Stripe
- Não adicione espaços ou caracteres extras

### 4. "Configuração do sistema de pagamento é inválida"

**Causa**: O access token do Mercado Pago está no formato errado.

**Solução**:
- Certifique-se de estar usando o **Access Token**, NÃO a Public Key
- O token deve começar com `APP_USR-` (produção) ou `TEST-` (teste)
- Copie o token diretamente do painel do Mercado Pago

### 5. Funções Netlify retornam 404

**Causa**: As funções serverless não foram deployadas corretamente.

**Solução**:
- Verifique se a pasta `netlify/functions/` existe
- Confirme que os arquivos `.ts` estão presentes:
  - `create-stripe-checkout.ts`
  - `create-mercadopago-checkout.ts`
- Faça um novo deploy completo (Trigger deploy > Clear cache and deploy site)

## 📊 Modo Teste vs Produção

### Desenvolvimento/Teste
- Use credenciais de **TESTE**
- Mercado Pago: Token começa com `TEST-`
- Stripe: Chaves começam com `pk_test_` e `sk_test_`
- Pagamentos não são reais
- Use cartões de teste:
  - Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing
  - Stripe: `4242 4242 4242 4242` (qualquer CVC e data futura)

### Produção
- Use credenciais de **PRODUÇÃO**
- Mercado Pago: Token começa com `APP_USR-`
- Stripe: Chaves começam com `pk_live_` e `sk_live_`
- **Pagamentos são REAIS e processam cobranças verdadeiras**
- Teste bem antes de ativar

## 🔐 Segurança

### ✅ Boas Práticas

- ✅ NUNCA commite credenciais no git
- ✅ Use `.env` local para desenvolvimento (já está no .gitignore)
- ✅ Configure variáveis de ambiente na Netlify
- ✅ Use credenciais de teste durante desenvolvimento
- ✅ Mantenha as Secret Keys privadas
- ✅ Monitore transações no dashboard do Mercado Pago e Stripe

### ❌ Evite

- ❌ Expor Secret Keys no código frontend
- ❌ Commitá arquivo `.env` ou `.env.local`
- ❌ Compartilhar credenciais em mensagens ou emails
- ❌ Usar credenciais de produção em desenvolvimento
- ❌ Hardcoded de credenciais no código

## 📞 Suporte

### Documentação Oficial

- **Mercado Pago**: https://www.mercadopago.com.br/developers/pt/docs
- **Stripe**: https://stripe.com/docs
- **Netlify Functions**: https://docs.netlify.com/functions/overview/

### Contato do Suporte

- Mercado Pago: https://www.mercadopago.com.br/developers/pt/support
- Stripe: https://support.stripe.com/

---

**Última atualização**: $(Get-Date -Format "dd/MM/yyyy")

# Configuração do PayPal - Instituto Estação

## ✅ Migração Concluída

A integração do Stripe foi substituída pelo PayPal com sucesso! Todas as referências ao Stripe foram atualizadas.

## 📋 O que foi feito:

### 1. Pacotes Instalados
- ✅ `@paypal/checkout-server-sdk` - SDK servidor do PayPal
- ✅ `@paypal/react-paypal-js` - SDK React do PayPal

### 2. Arquivos Criados/Atualizados

#### Novos Arquivos:
- ✅ `src/lib/paypalService.ts` - Serviço PayPal no frontend
- ✅ `netlify/functions/create-paypal-order.ts` - Função para criar ordem
- ✅ `netlify/functions/capture-paypal-order.ts` - Função para capturar pagamento
- ✅ `supabase-add-paypal.sql` - Script SQL para atualizar banco

#### Arquivos Modificados:
- ✅ `src/pages/Doacoes.tsx` - Página de doações usando PayPal
- ✅ `src/lib/types.ts` - Tipos atualizados (paypal ao invés de stripe)
- ✅ `.env` - Variáveis de ambiente do PayPal
- ✅ `package.json` - Dependências do PayPal
- ✅ Todos os arquivos de tradução (pt-BR, en, es, fr, tr, ar)

## 🔑 Próximos Passos - IMPORTANTE!

### 1. Obter Credenciais do PayPal

Você precisa obter suas credenciais reais do PayPal:

1. **Acesse o PayPal Developer Dashboard:**
   - Produção: https://developer.paypal.com/dashboard/
   - Sandbox (testes): https://developer.paypal.com/dashboard/

2. **Crie uma aplicação:**
   - Vá em "My Apps & Credentials"
   - Clique em "Create App"
   - Escolha um nome para sua aplicação
   - Selecione "Merchant" como tipo de conta

3. **Copie as credenciais:**
   - **Client ID** (público - usado no frontend)
   - **Client Secret** (privado - usado nas Netlify Functions)

### 2. Atualizar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais reais:

```env
# PayPal (PRODUÇÃO)
VITE_PAYPAL_CLIENT_ID=SUA_CLIENT_ID_AQUI
PAYPAL_CLIENT_SECRET=SUA_CLIENT_SECRET_AQUI
```

⚠️ **IMPORTANTE:**
- `VITE_PAYPAL_CLIENT_ID` - Com prefixo `VITE_` (visível no frontend)
- `PAYPAL_CLIENT_SECRET` - Sem prefixo `VITE_` (apenas backend/Netlify Functions)

### 3. Configurar Netlify

Configure as variáveis de ambiente na Netlify:

```bash
# Via CLI:
netlify env:set VITE_PAYPAL_CLIENT_ID "AWg0PNHbDsVCAdkJNdtDIutk-wSiDYIxSfbaBKtrBIclk87grnfo-HNNUXsJag8Qe9osHPX_aB4j7Iy1"
netlify env:set PAYPAL_CLIENT_SECRET "EH-k3P2vbeZ_jRnQ21gfJdWZZV_N8cjRLijfSvX7zyjroFrSldZTjWl_xxNRXus1e1FS1rRwcXqFQ_NQ

# Ou via interface web:
# https://app.netlify.com/sites/SEU_SITE/settings/deploys#environment
```

### 4. Atualizar Banco de Dados

Execute o script SQL no Supabase SQL Editor:

```sql
-- Arquivo: supabase-add-paypal.sql
ALTER TABLE donations
DROP CONSTRAINT IF EXISTS donations_payment_method_check;

ALTER TABLE donations
ADD CONSTRAINT donations_payment_method_check
CHECK (payment_method IN ('pix', 'card', 'boleto', 'paypal'));
```

**Como executar:**
1. Acesse: https://supabase.com/dashboard/project/SEU_PROJECT/editor
2. Cole o conteúdo do arquivo `supabase-add-paypal.sql`
3. Clique em "Run"

### 5. Testar em Modo Sandbox (Recomendado)

Para testar antes de ir para produção:

1. **Use credenciais Sandbox:**
   ```env
   VITE_PAYPAL_CLIENT_ID=sandbox_client_id
   PAYPAL_CLIENT_SECRET=sandbox_client_secret
   ```

2. **Atualize as Netlify Functions para Sandbox:**

   Em `netlify/functions/create-paypal-order.ts` e `capture-paypal-order.ts`:
   ```typescript
   // Trocar de:
   const environment = new paypal.core.LiveEnvironment(clientId, clientSecret)

   // Para:
   const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
   ```

3. **Crie contas de teste:**
   - Acesse: https://developer.paypal.com/dashboard/accounts
   - Crie uma conta "Business" (vendedor)
   - Crie uma conta "Personal" (comprador)

4. **Teste o fluxo completo:**
   - Faça uma doação usando a conta Personal
   - Verifique se a ordem é criada
   - Confirme o pagamento
   - Verifique se é salvo no Supabase

### 6. Deploy para Produção

Quando tudo estiver funcionando:

```bash
# Build local
npm run build

# Deploy via Netlify CLI
npm run deploy

# Ou via Git (push para o branch principal)
git add .
git commit -m "Migração para PayPal concluída"
git push origin main
```

## 🔒 Ambiente de Produção vs Sandbox

### Sandbox (Testes)
- URL: `https://api.sandbox.paypal.com`
- Use: `new paypal.core.SandboxEnvironment()`
- Contas de teste do PayPal Developer

### Produção (Live)
- URL: `https://api.paypal.com`
- Use: `new paypal.core.LiveEnvironment()`
- Credenciais de produção
- Pagamentos reais

## 🌍 Moedas Suportadas

O PayPal agora suporta:
- USD (Dólar Americano) - Padrão
- EUR (Euro)
- GBP (Libra Esterlina)
- BRL (Real Brasileiro)

## 📝 Diferenças entre Stripe e PayPal

| Recurso | Stripe | PayPal |
|---------|--------|---------|
| Checkout | Sessão única | Ordem + Captura |
| SDK | @stripe/stripe-js | @paypal/checkout-server-sdk |
| Método de pagamento | Cartão direto | PayPal + Cartão |
| Conta necessária | Não | Opcional |

## 🐛 Troubleshooting

### Erro: "PayPal Client ID não configurado"
- Verifique se `VITE_PAYPAL_CLIENT_ID` está no `.env`
- Reinicie o dev server após alterar `.env`

### Erro: "Credenciais do PayPal não configuradas"
- Verifique se `PAYPAL_CLIENT_SECRET` está configurado na Netlify
- Redeploy após configurar as variáveis

### Erro 401 ao criar ordem
- Verifique se as credenciais estão corretas
- Certifique-se de que está usando o ambiente correto (Sandbox vs Live)

### Ordem criada mas não capturada
- Verifique se o usuário completou o pagamento no PayPal
- Use a função `capture-paypal-order` para capturar manualmente

## 📚 Documentação

- PayPal REST API: https://developer.paypal.com/api/rest/
- PayPal SDK Node.js: https://github.com/paypal/Checkout-NodeJS-SDK
- PayPal React: https://developer.paypal.com/sdk/js/react/

## ✨ Arquivos Removidos (Opcional)

Você pode remover estes arquivos do Stripe se quiser:
- `src/lib/stripeService.ts`
- `netlify/functions/create-stripe-checkout.ts`
- `supabase-fix-stripe.sql`
- Desinstalar: `npm uninstall @stripe/stripe-js stripe`

## 🎉 Pronto!

A migração está completa. Agora é só:
1. Obter as credenciais do PayPal
2. Configurar as variáveis de ambiente
3. Executar o SQL no Supabase
4. Testar em sandbox
5. Deploy para produção

Boa sorte com o PayPal! 🚀

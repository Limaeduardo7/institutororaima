# Integração Stripe - Pagamentos Internacionais

## 📋 Visão Geral

O sistema agora suporta pagamentos internacionais via **Stripe**, além dos pagamentos nacionais via Mercado Pago.

### Funcionalidades

- ✅ Toggle entre doação nacional (BRL) e internacional
- ✅ Suporte a 5 moedas: USD, EUR, GBP, CAD, AUD
- ✅ Checkout seguro via Stripe
- ✅ Armazenamento de doações no Supabase
- ✅ Interface bilíngue (PT/EN)

## 🚀 Configuração

### 1. Criar Conta Stripe

1. Acesse https://dashboard.stripe.com
2. Crie uma conta ou faça login
3. Vá em **Developers** > **API keys**

### 2. Obter Credenciais

Você precisa de DUAS chaves:

**Frontend (Pública):**
```
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```
- Começa com `pk_test_` (teste) ou `pk_live_` (produção)
- Pode ser exposta no frontend
- Usada para criar o checkout

**Backend (Secreta):**
```
STRIPE_SECRET_KEY=sk_test_...
```
- Começa com `sk_test_` (teste) ou `sk_live_` (produção)
- **NUNCA** deve ser exposta no frontend
- Usada nas Netlify Functions

### 3. Configurar Variáveis de Ambiente

#### Desenvolvimento Local (.env)

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

#### Produção (Netlify)

1. Acesse seu site no Netlify
2. Vá em **Site settings** > **Environment variables**
3. Adicione:
   - `VITE_STRIPE_PUBLIC_KEY` = `pk_live_your_key_here`
   - `STRIPE_SECRET_KEY` = `sk_live_your_key_here`

### 4. Instalar Stripe (Backend)

```bash
npm install stripe
```

## 📁 Arquivos Criados

### Frontend

**`src/lib/stripeService.ts`**
- Serviço principal de integração
- Funções de criação de checkout
- Formatação de moedas
- Moedas suportadas

**`src/pages/Doacoes.tsx`** (atualizado)
- Toggle nacional/internacional
- Seletor de moedas
- Interface bilíngue
- Integração com Stripe

**`src/lib/types.ts`** (atualizado)
- Tipo `Donation` atualizado com `currency`
- `payment_method` aceita `'stripe'`

### Backend (Netlify Functions)

**`netlify/functions/create-stripe-checkout.ts`**
- Cria sessão de checkout do Stripe
- Valida dados do doador
- Retorna URL de redirecionamento

**`netlify/functions/verify-stripe-session.ts`**
- Verifica status de uma sessão
- Confirma pagamento concluído

### Database

**`migration-add-stripe-support.sql`**
- Adiciona suporte ao Stripe na tabela `donations`
- Adiciona coluna `currency`
- Atualiza constraint do `payment_method`

**`supabase-setup-completo.sql`** (atualizado)
- Schema completo já com suporte ao Stripe

## 🎯 Como Funciona

### Fluxo de Pagamento Internacional

1. **Usuário seleciona "International Donation"**
   - Interface muda para inglês
   - Mostra seletor de moedas

2. **Usuário seleciona moeda e valor**
   - USD, EUR, GBP, CAD ou AUD
   - Valores são formatados na moeda selecionada

3. **Usuário clica em "Pay with Stripe"**
   - Frontend chama `/api/create-stripe-checkout`
   - Netlify Function cria sessão no Stripe
   - Retorna URL de checkout

4. **Redirecionamento para Stripe**
   - Usuário é levado para página segura do Stripe
   - Insere dados do cartão
   - Completa o pagamento

5. **Confirmação**
   - Stripe redireciona de volta para `/doacoes?status=success`
   - Doação é salva no Supabase com status `pending`
   - Pode ser atualizada para `completed` via webhook (futuro)

## 🔐 Segurança

### Chaves Públicas vs Secretas

| Chave | Onde Usar | Segurança |
|-------|-----------|-----------|
| `pk_test_` / `pk_live_` | Frontend | ✅ Seguro expor |
| `sk_test_` / `sk_live_` | Backend apenas | ⚠️ NUNCA expor |

### Boas Práticas

- ✅ Use chaves de **teste** (`_test_`) durante desenvolvimento
- ✅ Use chaves de **produção** (`_live_`) apenas em deploy
- ✅ Guarde `STRIPE_SECRET_KEY` apenas em variáveis de ambiente seguras
- ✅ Nunca comite chaves secretas no Git
- ✅ Valide valores no backend (Netlify Functions)

## 💰 Moedas Suportadas

| Código | Moeda | Símbolo | Exemplo |
|--------|-------|---------|---------|
| USD | US Dollar | $ | $25.00 |
| EUR | Euro | € | €25.00 |
| GBP | British Pound | £ | £25.00 |
| CAD | Canadian Dollar | CA$ | CA$25.00 |
| AUD | Australian Dollar | A$ | A$25.00 |

Para adicionar mais moedas, edite `STRIPE_CURRENCIES` em `stripeService.ts`.

## 🧪 Teste

### Modo Teste (Development)

Use cartões de teste do Stripe:

| Número | Resultado |
|--------|-----------|
| 4242 4242 4242 4242 | Sucesso |
| 4000 0000 0000 9995 | Falha (insuficiente) |
| 4000 0025 0000 3155 | Requer autenticação |

- **Data de expiração:** Qualquer data futura
- **CVV:** Qualquer 3 dígitos
- **CEP:** Qualquer CEP

### Modo Produção

- Use suas credenciais `pk_live_` e `sk_live_`
- Pagamentos reais serão processados
- Taxas do Stripe serão aplicadas

## 📊 Webhooks (Opcional - Futuro)

Para atualização automática do status de doações:

1. Configure webhook no Stripe Dashboard
2. URL: `https://seu-site.com/.netlify/functions/stripe-webhook`
3. Eventos: `checkout.session.completed`
4. Crie função `stripe-webhook.ts` para processar

## ❓ Troubleshooting

### Erro: "VITE_STRIPE_PUBLIC_KEY not found"

- Verifique se adicionou a variável no `.env`
- Reinicie o servidor de desenvolvimento

### Erro: "Failed to create checkout session"

- Verifique se `STRIPE_SECRET_KEY` está configurada no Netlify
- Confirme que a chave é válida (começa com `sk_`)

### Erro: "Invalid amount"

- Valor mínimo: 1 unidade da moeda (ex: $1.00)
- Verifique se o valor é um número positivo

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)

## 🎉 Conclusão

A integração está completa! Agora você pode:

1. ✅ Aceitar doações nacionais (Mercado Pago)
2. ✅ Aceitar doações internacionais (Stripe)
3. ✅ Suportar múltiplas moedas
4. ✅ Processar pagamentos com segurança

**Próximo passo:** Adicione suas credenciais do Stripe no `.env` e teste! 🚀

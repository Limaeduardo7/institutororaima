# 🚨 Como Obter Chaves Válidas do Stripe

## Problema Atual

Você está usando chaves inválidas:
- `mk_1SdffgHZADFBff2KMrRW5cHS` ❌
- `mk_1SdffqHZADFBff2KnYQrjK7u` ❌

Essas chaves **NÃO** são do Stripe (começam com `mk_`).

## ✅ Chaves Válidas do Stripe

Chaves do Stripe começam com:
- **Public/Publishable Key**: `pk_test_...` ou `pk_live_...`
- **Secret Key**: `sk_test_...` ou `sk_live_...`

## 📋 Como Obter as Chaves

### Opção 1: Criar Conta de Teste (GRÁTIS)

1. **Acesse**: https://dashboard.stripe.com/register
2. **Crie uma conta** (gratuita)
3. **Pule o setup** (pode fazer depois)
4. **Vá em**: Developers > API keys
5. **Copie as chaves de TESTE**:
   - Publishable key: `pk_test_51xxxxx...`
   - Secret key: `sk_test_51xxxxx...`

### Opção 2: Usar Conta Existente

Se você já tem conta Stripe:

1. **Acesse**: https://dashboard.stripe.com/
2. **Faça login**
3. **Vá em**: Developers > API keys
4. **Escolha o modo**:
   - **Test mode** (recomendado para começar) - Não processa pagamentos reais
   - **Live mode** (produção) - Processa pagamentos reais
5. **Copie as chaves**

## 🔧 Configurar no Projeto

### Passo 1: Adicionar no .env

Edite o arquivo `.env`:

```env
# Stripe (TESTE - não processa pagamentos reais)
VITE_STRIPE_PUBLIC_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxx
```

**OU** (se for usar produção):

```env
# Stripe (PRODUÇÃO - processa pagamentos REAIS)
VITE_STRIPE_PUBLIC_KEY=pk_live_51xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_51xxxxxxxxxxxxxxxxxxxxx
```

### Passo 2: Sincronizar com Netlify

```bash
npm run sync-env
```

### Passo 3: Deploy

```bash
npm run deploy
```

## 🧪 Testar Stripe

### Com Chaves de Teste (Test Mode)

Use cartões de teste:
- **Número**: `4242 4242 4242 4242`
- **Data**: Qualquer data futura (ex: 12/34)
- **CVC**: Qualquer 3 dígitos (ex: 123)
- **CEP**: Qualquer 5 dígitos

**Não cobra nada real!**

### Com Chaves de Produção (Live Mode)

**CUIDADO**: Pagamentos serão REAIS! 💰

## ❌ Se Não Quiser Usar Stripe Agora

Se não quiser configurar o Stripe por enquanto, você pode:

1. **Remover o toggle de doação internacional** temporariamente
2. **Ou adicionar mensagem** dizendo que pagamentos internacionais estão em breve

Quer que eu faça isso?

## 📞 Suporte Stripe

- Documentação: https://stripe.com/docs
- Suporte: https://support.stripe.com/
- Dashboard: https://dashboard.stripe.com/

## ⚠️ Segurança

- ✅ NUNCA commite chaves secretas (`sk_`) no Git
- ✅ Use `.env` local e Netlify para variáveis
- ✅ Mantenha backup das chaves em local seguro
- ✅ Use chaves de teste durante desenvolvimento
- ✅ Só ative produção quando tudo estiver testado

---

**Próximo passo**: Obtenha chaves válidas em https://dashboard.stripe.com/

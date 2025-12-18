# ✅ Checklist de Deploy - Instituto Estação

Use esta lista para garantir que tudo está configurado corretamente antes do deploy.

## 🔐 Variáveis de Ambiente na Netlify

Acesse: https://app.netlify.com/ > Seu site > Site settings > Environment variables

### ✅ Supabase (OBRIGATÓRIO - sem isso o site não funciona)

- [ ] `VITE_SUPABASE_URL`
  - Formato: `https://seu-projeto.supabase.co`
  - Onde obter: https://supabase.com/dashboard > Settings > API > Project URL

- [ ] `VITE_SUPABASE_ANON_KEY`
  - Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (longo token JWT)
  - Onde obter: https://supabase.com/dashboard > Settings > API > Project API keys > anon/public

### ✅ Mercado Pago (para pagamentos nacionais)

- [ ] `VITE_MERCADOPAGO_PUBLIC_KEY`
  - Formato: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Onde obter: https://www.mercadopago.com.br/developers/panel > Credenciais > Public key

- [ ] `MERCADOPAGO_ACCESS_TOKEN` (backend - sem prefixo VITE_)
  - Formato Teste: `TEST-xxxxxxxxxxxxxxxx-xxxxxx-...`
  - Formato Produção: `APP_USR-xxxxxxxxxxxxxxxx-xxxxxx-...`
  - Onde obter: https://www.mercadopago.com.br/developers/panel > Credenciais > Access token

### ✅ Stripe (para pagamentos internacionais)

- [ ] `VITE_STRIPE_PUBLIC_KEY`
  - Formato Teste: `pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Formato Produção: `pk_live_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Onde obter: https://dashboard.stripe.com/ > Developers > API keys > Publishable key

- [ ] `STRIPE_SECRET_KEY` (backend - sem prefixo VITE_)
  - Formato Teste: `sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - Formato Produção: `sk_live_EXAMPLE_KEY_xxxxxxxxxxxxxxxx`
  - Onde obter: https://dashboard.stripe.com/ > Developers > API keys > Secret key

## 📦 Arquivos e Funções

- [ ] Pasta `netlify/functions/` existe
- [ ] Arquivo `netlify/functions/create-stripe-checkout.ts` existe
- [ ] Arquivo `netlify/functions/create-mercadopago-checkout.ts` existe
- [ ] Arquivo `.gitignore` inclui `.env` e `.env.local`

## 🚀 Deploy

- [ ] Todas as variáveis de ambiente foram adicionadas na Netlify
- [ ] Fez commit e push das alterações
- [ ] Trigger deploy na Netlify
- [ ] Aguardou o build finalizar (sem erros)

## 🧪 Testes Pós-Deploy

### Teste 1: Site carrega sem erros
- [ ] Abrir o site em produção
- [ ] Verificar console do navegador (F12) - não deve ter erro de Supabase
- [ ] Navegar pelas páginas principais

### Teste 2: Doação Nacional (Mercado Pago)
- [ ] Ir para página /doacoes
- [ ] Selecionar valor (ex: R$ 50)
- [ ] Escolher método: PIX, Cartão ou Boleto
- [ ] Clicar em "Doar"
- [ ] Deve redirecionar para checkout do Mercado Pago
- [ ] **Se der erro**: Verifique `MERCADOPAGO_ACCESS_TOKEN` na Netlify

### Teste 3: Doação Internacional (Stripe)
- [ ] Ir para página /doacoes
- [ ] Ativar toggle "Doação Internacional"
- [ ] Selecionar valor e moeda (ex: $25 USD)
- [ ] Clicar em "Doar"
- [ ] Deve redirecionar para checkout do Stripe
- [ ] **Se der erro**: Verifique `STRIPE_SECRET_KEY` na Netlify

### Teste 4: Formulário de Contato
- [ ] Ir para página /contato
- [ ] Preencher formulário
- [ ] Enviar mensagem
- [ ] Deve aparecer mensagem de sucesso
- [ ] **Se der erro**: Problema com Supabase

### Teste 5: Documentos
- [ ] Ir para página /documentos
- [ ] Verificar se carrega sem erro
- [ ] Deve mostrar "Nenhum documento encontrado" se não houver docs
- [ ] **Se der erro**: Problema com Supabase

## ❌ Erros Comuns e Soluções Rápidas

### Erro: "Invalid supabaseUrl"
```
Solução:
1. Adicionar VITE_SUPABASE_URL na Netlify
2. Adicionar VITE_SUPABASE_ANON_KEY na Netlify
3. Fazer novo deploy
```

### Erro: "Sistema de pagamento não está configurado"
```
Solução:
1. Verificar se MERCADOPAGO_ACCESS_TOKEN está na Netlify (SEM prefixo VITE_)
2. Verificar se o token começa com APP_USR- ou TEST-
3. Fazer novo deploy
```

### Erro: "Payment system is not properly configured"
```
Solução:
1. Verificar se STRIPE_SECRET_KEY está na Netlify (SEM prefixo VITE_)
2. Verificar se a chave começa com sk_test_ ou sk_live_
3. Fazer novo deploy
```

### Erro: "Invalid Stripe configuration"
```
Solução:
A chave está no formato errado.
Certifique-se de usar a SECRET KEY (sk_...), não a PUBLIC KEY (pk_...)
```

### Funções Netlify retornam 404
```
Solução:
1. Ir em Netlify > Deploys
2. Clicar em "Trigger deploy"
3. Escolher "Clear cache and deploy site"
4. Aguardar build finalizar
```

## 📊 Ambiente: Teste vs Produção

### 🧪 Modo Teste (Desenvolvimento)
Use estas credenciais durante desenvolvimento e testes:

**Mercado Pago**:
- Token começa com `TEST-`
- Pagamentos não são reais
- Cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

**Stripe**:
- Chaves começam com `pk_test_` e `sk_test_`
- Pagamentos não são reais
- Cartão de teste: `4242 4242 4242 4242`

### 🚀 Modo Produção
Use estas credenciais em produção:

**Mercado Pago**:
- Token começa com `APP_USR-`
- **PAGAMENTOS SÃO REAIS** 💰

**Stripe**:
- Chaves começam com `pk_live_` e `sk_live_`
- **PAGAMENTOS SÃO REAIS** 💰

## 📝 Notas Finais

- ✅ Sempre teste com credenciais de teste primeiro
- ✅ Só ative produção quando tiver certeza que está tudo funcionando
- ✅ Monitore transações no dashboard do Mercado Pago e Stripe
- ✅ Faça backup das credenciais em local seguro
- ✅ Nunca compartilhe SECRET KEYS publicamente

---

**Para mais detalhes**, consulte: [PAYMENT-SETUP.md](PAYMENT-SETUP.md)

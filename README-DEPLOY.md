# 🚀 Deploy Rápido - Instituto Estação

## Primeira Vez

### 1. Configure suas variáveis no `.env`

Certifique-se que o arquivo `.env` na raiz do projeto está atualizado com todas as credenciais:

```env
VITE_SUPABASE_URL=https://tzdblblhvqqoozwloxwo.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui

VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
VITE_MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...
```

### 2. Sincronize as variáveis com a Netlify

```bash
npm run sync-env
```

Este comando lê o `.env` e envia todas as variáveis para a Netlify automaticamente!

### 3. Faça o deploy

```bash
npm run deploy
```

Pronto! ✅ Seu site está no ar em https://estacao.ong.br

---

## Deploy Diário (Próximas Vezes)

### Se NÃO alterou o .env:
```bash
npm run deploy
```

### Se alterou o .env:
```bash
npm run sync-env
npm run deploy
```

---

## Comandos Disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Roda servidor local de desenvolvimento |
| `npm run build` | Faz build do projeto |
| `npm run sync-env` | Sincroniza variáveis do `.env` para Netlify |
| `npm run deploy` | Build + Deploy em um comando |
| `netlify status` | Mostra status do site |
| `netlify open:site` | Abre o site em produção |
| `netlify env:list` | Lista variáveis configuradas na Netlify |

---

## 🔧 Troubleshooting

### Erro: "Arquivo .env não encontrado"
Crie o arquivo `.env` na raiz do projeto com as variáveis necessárias.

### Erro ao sincronizar variáveis
Certifique-se de estar autenticado:
```bash
netlify login
netlify link
```

### Site não reflete mudanças no .env
Execute novamente:
```bash
npm run sync-env
npm run deploy
```

### Variáveis não aparecem na Netlify
Verifique se executou `npm run sync-env` com sucesso.
Liste as variáveis com: `netlify env:list`

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [NETLIFY-CLI-DEPLOY.md](NETLIFY-CLI-DEPLOY.md) - Guia completo do Netlify CLI
- [PAYMENT-SETUP.md](PAYMENT-SETUP.md) - Configuração de pagamentos
- [DEPLOY-CHECKLIST.md](DEPLOY-CHECKLIST.md) - Checklist de testes

---

## ⚠️ Importante

- **Nunca** commite o arquivo `.env` no Git
- Use credenciais de **TESTE** durante desenvolvimento
- Use credenciais de **PRODUÇÃO** apenas quando tudo estiver funcionando
- Mantenha backup das suas credenciais em local seguro

# Guia de Integração de Gateways de Pagamento - Instituto Estação

Este documento detalha a implementação técnica e as instruções de configuração para os três principais gateways de pagamento integrados ao site: **Pagar.me**, **Cielo** e **PayPal**.

---

## 🚀 Visão Geral da Arquitetura

O sistema utiliza uma arquitetura baseada em **Netlify Functions** (Backend Serverless) para garantir que as chaves secretas nunca sejam expostas no frontend.

1.  **Frontend**: Captura os dados do doador e do pagamento (via componentes dedicados).
2.  **API Proxy**: Envia os dados para uma Netlify Function.
3.  **Netlify Function**: Processa o pagamento diretamente com a API do gateway usando chaves secretas.
4.  **Banco de Dados**: Após o processamento, a doação é registrada no Supabase.

---

## 💳 1. Pagar.me (API V5)

A integração com o Pagar.me utiliza a versão mais recente da API (V5), suportando PIX, Cartão de Crédito e Boleto.

### 🔑 Credenciais Necessárias
-   **PAGARME_SECRET_KEY**: Chave secreta (API Key) obtida no dashboard do Pagar.me.
-   **VITE_PAGARME_PUBLIC_KEY**: Chave pública para criptografia de dados no frontend (se aplicável).

### 🛠️ Configuração Técnica
-   **Frontend Service**: `src/lib/pagarmeService.ts`
-   **Backend Function**: `netlify/functions/process-pagarme-payment.ts`
-   **Endpoint API**: `https://api.pagar.me/core/v5/orders`

### 📝 Fluxo de Pagamento
1.  **PIX**: Gera um `pixQrCode` e uma `pixQrCodeUrl`.
2.  **Cartão de Crédito**: Requer dados completos do cartão e endereço de cobrança (mockado para o endereço do Instituto).
3.  **Boleto**: Gera um link para o PDF (`boletoUrl`) e o código de barras.

---

## 🔒 2. Cielo (E-commerce API)

A Cielo é utilizada para processar pagamentos nacionais (BRL) e internacionais (USD) via Cartão de Crédito, Débito e PIX.

### 🔑 Credenciais Necessárias
-   **CIELO_MERCHANT_ID**: Identificador do estabelecimento na Cielo.
-   **CIELO_MERCHANT_KEY**: Chave de segurança para autenticação das requisições.
-   **CIELO_ENVIRONMENT**: `sandbox` ou `production`.

### 🛠️ Configuração Técnica
-   **Frontend Service**: `src/lib/cieloService.ts`
-   **Backend Function**: `netlify/functions/process-cielo-payment.ts`
-   **Endpoint API**: 
    -   Sandbox: `https://apisandbox.cieloecommerce.cielo.com.br`
    -   Produção: `https://api.cieloecommerce.cielo.com.br`

### 🌍 Suporte Internacional
A integração foi customizada para aceitar o campo `Currency`. Quando o usuário seleciona **Cielo Inter**, o sistema envia `USD` para a API, permitindo cobranças internacionais.

---

## 🌍 3. PayPal (REST API)

O PayPal é o gateway principal para doações internacionais de grande escala.

### 🔑 Credenciais Necessárias
-   **VITE_PAYPAL_CLIENT_ID**: Client ID público da aplicação PayPal.
-   **PAYPAL_CLIENT_SECRET**: Client Secret privado.

### 🛠️ Configuração Técnica
-   **Frontend Service**: `src/lib/paypalService.ts`
-   **Backend Functions**:
    -   `netlify/functions/create-paypal-order.ts`: Cria a ordem de pagamento.
    -   `netlify/functions/capture-paypal-order.ts`: Confirma e captura o valor.

### 📝 Diferencial
Diferente da Cielo e Pagar.me, o PayPal utiliza um fluxo de **Order/Capture**. O usuário autoriza o pagamento na janela do PayPal e, após o retorno, o servidor "captura" os fundos para confirmar a transação.

---

## 🗄️ 4. Base de Dados (Supabase)

Todas as doações processadas pelos gateways são registradas na tabela `donations`. Para garantir a integridade dos dados, a coluna `payment_method` possui uma restrição (constraint).

### Script SQL de Configuração
Se você estiver configurando o banco do zero ou adicionando um novo método, execute o seguinte comando no SQL Editor do Supabase:

```sql
-- Garante que o banco aceite os métodos integrados
ALTER TABLE donations
DROP CONSTRAINT IF EXISTS donations_payment_method_check;

ALTER TABLE donations
ADD CONSTRAINT donations_payment_method_check
CHECK (payment_method IN ('pix', 'card', 'boleto', 'paypal'));
```

*Nota: 'card' é usado para transações via Cielo (Crédito/Débito) e Pagar.me (Crédito).*

---

## ⚙️ Variáveis de Ambiente (Netlify)

Para que todos os sistemas funcionem em produção, você deve configurar as seguintes variáveis no painel da Netlify (**Site settings > Environment variables**):

| Gateway | Variável | Descrição |
| :--- | :--- | :--- |
| **Geral** | `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| | `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| **Pagar.me** | `PAGARME_SECRET_KEY` | Chave secreta da API V5 |
| **Cielo** | `CIELO_MERCHANT_ID` | Merchant ID da Cielo |
| | `CIELO_MERCHANT_KEY` | Merchant Key da Cielo |
| | `CIELO_ENVIRONMENT` | `production` ou `sandbox` |
| **PayPal** | `VITE_PAYPAL_CLIENT_ID` | Client ID do PayPal |
| | `PAYPAL_CLIENT_SECRET` | Secret Key do PayPal |

---

## 📋 Checklist de Implementação Manual

Se precisar replicar essa integração em outro ambiente:

1.  **Instalação de Dependências**:
    -   PIX/Cartão: `crypto` para hashes (se necessário).
    -   PayPal: `@paypal/checkout-server-sdk`.
2.  **CORS**: Certifique-se de que as Netlify Functions retornam os headers de CORS corretos para o domínio do frontend.
3.  **Tratamento de Erros**: Todas as funções serverless estão configuradas para retornar mensagens amigáveis em caso de falha na API (ex: cartão recusado, saldo insuficiente).
4.  **Segurança**: Nunca salve números de cartão de crédito no banco de dados. O sistema apenas envia os dados para o gateway e salva o `transactionId`.

---

**Instituto Estação** - Guia Técnico de Pagamentos v1.1

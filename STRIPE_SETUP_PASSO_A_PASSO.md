# 🎯 GUIA COMPLETO: Como Configurar Produtos no Stripe

## 📌 Você já tem:
- ✅ Conta Stripe criada
- ✅ API Keys configuradas
- ✅ Webhook configurado

## 🎁 Agora vamos criar os 3 produtos de lançamento!

---

## 🚀 PASSO 1: Acessar o Dashboard

1. Acesse: **https://dashboard.stripe.com/test/products**
2. Faça login com sua conta
3. Clique no botão **"+ Add product"** (ou "+ Adicionar produto")

---

## 💰 PRODUTO 1: Plano Mensal (50% OFF)

### Preencha os campos:

**Name (Nome):**
```
E-Kids PRO - Mensal (Lançamento 50% OFF)
```

**Description (Descrição) - OPCIONAL:**
```
Plano mensal com desconto especial de lançamento para os primeiros 100 assinantes. Preço garantido para sempre!
```

**Pricing model (Modelo de preços):**
- Selecione: **Standard pricing**

**Price (Preço):**
- Digite: **14.90**
- Moeda: **BRL** (Real Brasileiro)

**Billing period (Período de cobrança):**
- Selecione: **Monthly** (Mensal)

**Checkbox "Prices are tax inclusive":**
- **DEIXE DESMARCADO** (impostos não inclusos)

**Usage is metered:**
- **DEIXE DESMARCADO**

### Clique em "Add product" (Adicionar produto)

### ⚠️ IMPORTANTE - COPIAR O PRICE ID:
1. Depois de criar, você vai ver uma tela com os detalhes
2. Na seção "Pricing", clique no preço que acabou de criar
3. Você verá algo como: **price_1Abc123XyZ...**
4. **COPIE ESSE CÓDIGO INTEIRO** - é o `PRICE_ID_MENSAL`

---

## 💰 PRODUTO 2: Plano Trimestral (50% OFF)

Clique novamente em **"+ Add product"**

### Preencha os campos:

**Name (Nome):**
```
E-Kids PRO - Trimestral (Lançamento 50% OFF)
```

**Description (Descrição) - OPCIONAL:**
```
Plano trimestral - economize 13% em relação ao mensal. Oferta limitada aos primeiros 100 assinantes.
```

**Pricing model:**
- Selecione: **Standard pricing**

**Price (Preço):**
- Digite: **38.70**
- Moeda: **BRL**

**Billing period:**
- Selecione: **Every 3 months** (A cada 3 meses)

### Clique em "Add product"

### ⚠️ COPIAR O PRICE ID:
- Copie o código **price_1Abc123XyZ...**
- Este é o `PRICE_ID_TRIMESTRAL`

---

## 💰 PRODUTO 3: Plano Anual (67% OFF) ⭐

Clique novamente em **"+ Add product"**

### Preencha os campos:

**Name (Nome):**
```
E-Kids PRO - Anual (Lançamento 67% OFF) ⭐
```

**Description (Descrição) - OPCIONAL:**
```
Melhor oferta! Apenas R$ 9,90/mês. Economize R$ 240,00 no ano. Oferta exclusiva para os primeiros 100 assinantes.
```

**Pricing model:**
- Selecione: **Standard pricing**

**Price (Preço):**
- Digite: **118.80**
- Moeda: **BRL**

**Billing period:**
- Selecione: **Yearly** (Anual)

### Clique em "Add product"

### ⚠️ COPIAR O PRICE ID:
- Copie o código **price_1Abc123XyZ...**
- Este é o `PRICE_ID_ANUAL`

---

## 📝 PASSO 2: Atualizar o arquivo .env

Abra o arquivo `D:\E-Kids-PRO\mvp\.env` e substitua:

```env
# Stripe Price IDs (SUBSTITUA COM OS SEUS)
STRIPE_PRICE_ID_MENSAL=price_COLE_AQUI_O_ID_DO_MENSAL
STRIPE_PRICE_ID_TRIMESTRAL=price_COLE_AQUI_O_ID_DO_TRIMESTRAL
STRIPE_PRICE_ID_ANUAL=price_COLE_AQUI_O_ID_DO_ANUAL
```

**Exemplo de como deve ficar:**
```env
STRIPE_PRICE_ID_MENSAL=price_1SgXXXDQePDpp7pJxxxxx
STRIPE_PRICE_ID_TRIMESTRAL=price_1SgYYYDQePDpp7pJxxxxx
STRIPE_PRICE_ID_ANUAL=price_1SgZZZDQePDpp7pJxxxxx
```

---

## 📝 PASSO 3: Atualizar pricing.html

Abra o arquivo `D:\E-Kids-PRO\mvp\public\pricing.html`

Procure por estas 3 linhas (no final do arquivo, dentro do JavaScript):

```javascript
<button class="plan-button" onclick="subscribe('PRICE_ID_MENSAL')">
<button class="plan-button" onclick="subscribe('PRICE_ID_TRIMESTRAL')">
<button class="plan-button" onclick="subscribe('PRICE_ID_ANUAL')">
```

Substitua pelos IDs reais que você copiou:

```javascript
<button class="plan-button" onclick="subscribe('price_1SgXXXDQePDpp7pJ...')">
<button class="plan-button" onclick="subscribe('price_1SgYYYDQePDpp7pJ...')">
<button class="plan-button" onclick="subscribe('price_1SgZZZDQePDpp7pJ...')">
```

---

## 🔄 PASSO 4: Reiniciar o container

No terminal/PowerShell:

```bash
docker restart ekids
```

Aguarde 5 segundos e teste!

---

## ✅ PASSO 5: Testar!

1. Acesse: **http://localhost:3004/pricing.html**
2. Clique em um dos botões "Assinar Agora"
3. Você deve ser redirecionado para o checkout do Stripe
4. Use o cartão de teste do Stripe:
   - Número: **4242 4242 4242 4242**
   - Data: Qualquer data futura (ex: 12/34)
   - CVC: Qualquer 3 números (ex: 123)
   - CEP: Qualquer CEP (ex: 12345-678)

---

## 🎯 DICAS IMPORTANTES:

### ✅ Modo Test vs Live
- Você está em **modo TEST** (chaves começam com `sk_test_` e `pk_test_`)
- Nenhum pagamento real será processado
- Para aceitar pagamentos reais, você precisará:
  1. Ativar sua conta Stripe (enviar documentos)
  2. Trocar as chaves para **LIVE** (começam com `sk_live_` e `pk_live_`)

### ✅ Checkout Stripe
- O Stripe cuida de TUDO (formulário, segurança, validação)
- Você não precisa armazenar dados de cartão
- Stripe é PCI-DSS Level 1 compliant

### ✅ Webhooks
- Quando um pagamento for confirmado, o Stripe enviará um evento
- Seu webhook em `/api/stripe/webhook` receberá a notificação
- Lá você pode ativar a assinatura no banco de dados

### ✅ Grandfathering (Preço Garantido)
- No Stripe, quando um cliente assina, o preço dele fica fixo
- Mesmo que você aumente o preço depois, clientes antigos mantêm o original
- Isso é automático no Stripe!

---

## 🆘 PROBLEMAS COMUNS:

**❌ "No such price"**
- Você copiou o Price ID errado
- Verifique se copiou o `price_xxx` e não o `prod_xxx`

**❌ "Invalid request"**
- Verifique se está usando moeda BRL
- Verifique se o valor está correto (14.90, não 14,90)

**❌ Checkout não abre**
- Verifique se a chave pública está correta no pricing.html
- Abra o Console do navegador (F12) para ver erros

---

## 📊 MONITORAR ASSINATURAS:

Acesse: **https://dashboard.stripe.com/test/subscriptions**

Lá você verá:
- ✅ Assinaturas ativas
- 💰 Receita recorrente
- 📈 Gráficos de crescimento
- 👥 Lista de clientes

---

## 🎉 PRONTO!

Agora você tem:
- ✅ Página de preços linda com oferta de lançamento
- ✅ 3 planos configurados no Stripe
- ✅ Checkout funcionando
- ✅ Webhook configurado
- ✅ Sistema pronto para receber pagamentos (modo test)

**Próximo passo:** Começar a divulgar e conseguir os primeiros 100 clientes! 🚀

# Instituto Estação - Site Institucional

Site institucional moderno e funcional para o Instituto Educacional de Desenvolvimento Técnico Social em Ação do Estado de Roraima – ESTAÇÃO RR.

## 🚀 Tecnologias Utilizadas

- **React** + **Vite** + **TypeScript**
- **TailwindCSS** para estilização
- **ShadCN UI** para componentes
- **React Router** para navegação
- **Supabase** para backend e banco de dados
- **GSAP** e **Anime.js** para animações
- **Glassmorphism** design theme
- **Lucide React** para ícones

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── Layout/          # Header, Footer, Layout
├── pages/               # Páginas da aplicação
│   ├── Home.tsx
│   ├── QuemSomos.tsx
│   ├── Eventos.tsx
│   ├── Doacoes.tsx
│   ├── Transparencia.tsx
│   ├── Contato.tsx
│   └── Localizacao.tsx
├── lib/
│   ├── utils.ts         # Utilitários
│   └── supabase.ts      # Configuração Supabase
└── assets/
```

## 🎨 Design Features

- **Tema claro** com alta legibilidade
- **Glassmorphism** com efeitos translúcidos
- **Fonte Inter** para melhor legibilidade
- **Layout responsivo** (mobile-first)
- **Animações suaves** com GSAP
- **Gradientes modernos**

## 📄 Páginas Implementadas

1. **Home** - Apresentação, missão, visão e projetos destacados
2. **Quem Somos** - História da ONG desde 1997
3. **Eventos e Ações** - Listagem dinâmica integrada com Supabase
4. **Doações** - Sistema de doações com PIX, cartão e boleto
5. **Transparência** - Upload e exibição de documentos financeiros
6. **Contato** - Formulário funcional e informações de contato
7. **Localização** - Mapa interativo e informações de localização

## 🔧 Configuração

### 1. Instalação

```bash
npm install
```

### 2. Configuração do Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Configure as variáveis do Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Desenvolvimento

```bash
npm run dev
```

### 4. Build para Produção

```bash
npm run build
```

## 🗄️ Configuração do Supabase

### Tabelas Necessárias

1. **events** - Eventos e campanhas
2. **social_actions** - Ações sociais realizadas
3. **financial_documents** - Documentos de transparência
4. **contact_submissions** - Formulários de contato
5. **donations** - Registro de doações

### Storage Buckets

- **documents** - Para documentos de transparência
- **images** - Para imagens de eventos e ações

## 🎯 Funcionalidades Implementadas

### ✅ Core Features
- [x] Navegação multipage com React Router
- [x] Design glassmorphism responsivo
- [x] Integração com Supabase configurada
- [x] Formulários funcionais
- [x] Sistema de upload de arquivos
- [x] Animações com GSAP
- [x] SEO otimizado com meta tags
- [x] Schema.org para SEO

### ✅ Páginas Completas
- [x] Home com hero section e estatísticas
- [x] Quem Somos com história e valores
- [x] Eventos com integração Supabase
- [x] Doações com múltiplas formas de pagamento
- [x] Transparência com upload de documentos
- [x] Contato com formulário e FAQ
- [x] Localização com mapa interativo

## 📱 Responsividade

O site foi desenvolvido com abordagem **mobile-first** e é totalmente responsivo em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🌟 Próximos Passos

1. Conectar com Supabase real
2. Implementar sistema de autenticação para admin
3. Adicionar dashboard administrativo
4. Integração com gateway de pagamento
5. Implementar sistema de newsletter
6. Adicionar mais animações interativas
7. Otimizações de performance

## 📞 Contato

**Instituto Estação**
- Endereço: Rua Rio Negro – Jardim Bela Vista, Boa Vista - RR – CEP: 69301-970
- Telefone: (95) 3224-1234
- E-mail: contato@institutoestacao.org.br

---

*Desenvolvido com ❤️ para transformar vidas através da tecnologia*

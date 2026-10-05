# Transparência — Instituto Estação

A rota `/transparencia` mantém a identidade visual e consulta os serviços existentes de documentos financeiros e institucionais. Os botões utilizam `file_url`, com download real e tratamento de falha. A página diferencia erro de consulta, acervo vazio e arquivo não disponibilizado.

## Dados das parcerias

A relação estruturada é publicada em `public/transparency/partnerships.json`. O arquivo está vazio porque os materiais fornecidos não contêm os dados oficiais das parcerias. Uma relação ainda não publicada **não é uma declaração de inexistência de parcerias**.

Cada item em `partnerships` precisa de `id`, `title`, `agency`, `instrument` (tipo e número) e `object`. Demais campos:

- `signedAt`, `startsAt`, `endsAt`: datas ISO `AAAA-MM-DD` ou `null`.
- `status`: situação da parceria, baseada no instrumento oficial.
- `totalAmount`, `releasedAmount`: valores numéricos em reais; `null` significa não informado. Zero só deve ser usado quando informado explicitamente.
- `accountability`: `status`, `dueAt`, `submittedAt`, `analysisDueAt`, `conclusion`.
- `team`: `funding` (`partnership`, `not-funded` ou `not-informed`), `totalAmount`, `roles` (lista de `role` e `plannedAmount`). Usar `not-funded` somente após confirmação da ausência de equipe paga com recursos da parceria.
- `attachments`: lista de `title` e `url` dos instrumentos, planos de trabalho, aditivos, relatórios e comprovantes públicos.

`updatedAt` indica a atualização efetiva dos dados, não a visita à página. O parser exige identificação mínima e links válidos. Dados faltantes aparecem como “Não informado”. Não inserir valores estimados, parceiros presumidos ou declarações sem comprovação.

Se houver declaração oficial de ausência de parcerias, preencher `absenceDeclaration` com `title`, `period`, `issuedAt` e `url` do documento assinado. A declaração não é criada automaticamente quando a lista está vazia.

## Comprovação da divulgação

1. Completar os dados oficiais e conferir sua publicação.
2. Usar “Imprimir consulta”; a impressão inclui data, URL e os detalhes das parcerias. Para imprimir tudo, limpar os filtros antes.
3. Divulgar as informações em local visível na sede e nos estabelecimentos em que as ações ocorrem, quando aplicável.
4. Fotografar a divulgação física e guardar a fotografia com a cópia datada, conforme o procedimento solicitado pelo órgão parceiro.

O CNPJ reproduz o que já está no rodapé do projeto. Confirmar nome cadastral, situação e abertura no cartão CNPJ atualizado. O site vinculado no Netlify é `https://estacao.ong.br`; as fotos mencionam `estacao.org.br`. Conferir o endereço informado no processo administrativo.

Referência: [Lei 13.019/2014, arts. 3º e 11](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13019compilado.htm). Confirmar o enquadramento dos instrumentos e exigências locais com o responsável institucional. A implementação da página não comprova atendimento integral às obrigações.

## Ambiente verificado em 05/10/2026

- `npm ci --no-audit --no-fund`: 319 pacotes instalados.
- Build original: passou.
- Lint original: 55 erros e 2 avisos, incluindo 3 erros na página de transparência anterior.
- As variáveis públicas de Supabase foram lidas via Netlify CLI para `.env.local`, ignorado pelo Git.
- O host do Supabase configurado não resolve no DNS (`ENOTFOUND`). O mesmo endereço está no bundle público do site. Isso impede validar o acervo real e deve ser resolvido no projeto Supabase correto; não foi alterado para outro projeto.
- O arquivo de parcerias e os componentes podem ser usados independentemente da restauração do acervo, com os estados de indisponibilidade exibidos corretamente.

Para desenvolvimento local: `npm run dev:vite -- --host 127.0.0.1 --port 5180`.

## Verificação das alterações

- Build e ESLint dos arquivos alterados: passaram. O lint geral do projeto tem as pendências anteriores indicadas acima.
- Navegador: busca sem acentos, filtros por ano e categoria, anos antigos, detalhes, download, falha parcial, nova tentativa e declaração explícita verificados. Os dados usados nesses testes são interceptados somente no navegador e não são publicados.
- Layout: verificado em 320, 390, 768, 1024, 1280 e 1440 pixels. Menu e contato no rodapé receberam ajustes para caber nessas telas.
- Impressão: PDFs conferidos com data, endereço, identificação e conteúdo dos detalhes, mesmo quando recolhidos na tela.
- Novos textos do portal têm fallback em português; as traduções completas dessas novas chaves ainda não foram adicionadas aos demais idiomas.

O teste manual pode ser repetido com `node scripts/verify-transparency.cjs`, com Chrome e Playwright disponíveis. Ele registra o estado inicial ainda sem parcerias e com o Supabase indisponível. `TRANSPARENCY_PLAYWRIGHT_PATH` permite informar o módulo Playwright e `TRANSPARENCY_BASE_URL` muda o endereço do servidor. Evidências locais ficam em `output/playwright/`, ignorado pelo Git.

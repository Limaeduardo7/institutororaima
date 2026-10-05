// Synthetic records are intercepted in the test browser only; never published.
const path = require('node:path')
const os = require('node:os')
let playwright
if (process.env.TRANSPARENCY_PLAYWRIGHT_PATH) {
  playwright = require(process.env.TRANSPARENCY_PLAYWRIGHT_PATH)
} else {
  try {
    playwright = require('playwright')
  } catch {
    playwright = require(
      path.join(
        os.homedir(),
        '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
      ),
    )
  }
}
const { chromium } = playwright
const fs = require('node:fs')
const assert = require('node:assert/strict')
const output = 'output/playwright'
fs.mkdirSync(output, { recursive: true })
;(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      locale: 'pt-BR',
    })
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    const result = { live: {}, fixtures: {}, viewport: [], pageErrors }
    const base = process.env.TRANSPARENCY_BASE_URL || 'http://127.0.0.1:5180'
    await page.goto(`${base}/transparencia`)
    await page
      .getByRole('heading', {
        name: 'Informações de parcerias aguardando publicação',
      })
      .waitFor({ timeout: 25000 })
    result.live.partnershipsPending = true
    await page
      .getByRole('heading', { name: 'Parte do acervo não pôde ser carregada' })
      .waitFor({ timeout: 25000 })
    result.live.documentError = true
    assert.equal(
      result.live.documentError,
      true,
      'The currently unavailable backend must not appear as an empty successful query',
    )
    assert.equal(await page.getByText('R$ 485.670', { exact: true }).count(), 0)
    assert.equal(await page.getByText('CNPJ Ativo', { exact: true }).count(), 0)
    for (const width of [1440, 1280, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      const sizes = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      result.viewport.push(sizes)
      assert.equal(
        sizes.scrollWidth <= width,
        true,
        `Horizontal overflow at ${width}px: ${sizes.scrollWidth}`,
      )
      for (const button of await page.locator('header button:visible').all()) {
        const box = await button.boundingBox()
        assert.equal(
          box && box.x >= 0 && box.x + box.width <= width,
          true,
          `Header control clipped at ${width}px`,
        )
      }
      await page.screenshot({
        path: `${output}/estacao-${width}.png`,
        fullPage: true,
      })
    }
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.pdf({
      path: `${output}/consulta-local-transparencia.pdf`,
      printBackground: true,
      preferCSSPageSize: true,
    })

    let mode = 'success'
    let disclosure = {
      updatedAt: '2026-10-05',
      absenceDeclaration: null,
      partnerships: [
        {
          id: 'qa-partnership',
          title: 'Parceria de teste — dados simulados',
          agency: 'Órgão de teste',
          instrument: 'Termo de fomento TESTE/2026',
          object: 'Objeto exclusivamente simulado para verificação.',
          signedAt: '2026-01-10',
          startsAt: '2026-01-15',
          endsAt: '2026-12-31',
          status: 'Em execução',
          totalAmount: 1000,
          releasedAmount: 0,
          accountability: {
            status: 'A apresentar',
            dueAt: '2027-02-01',
            submittedAt: null,
            analysisDueAt: null,
            conclusion: null,
          },
          team: {
            funding: 'partnership',
            totalAmount: null,
            roles: [{ role: 'Função de teste', plannedAmount: 200 }],
          },
          attachments: [
            { title: 'Documento de teste', url: `${base}/__qa-document.pdf` },
          ],
        },
      ],
    }
    const finance = [
      {
        id: 'qa-financial',
        title: 'Balancéte de teste',
        description: 'Documento financeiro simulado.',
        document_type: 'statement',
        year: 2024,
        month: 1,
        upload_date: '2024-01-01T12:00:00Z',
        file_url: `${base}/__qa-document.pdf`,
        file_name: 'balancete-de-teste.pdf',
      },
      {
        id: 'qa-missing',
        title: 'Relatório sem arquivo de teste',
        description: 'Registro simulado sem arquivo.',
        document_type: 'report',
        year: 2021,
        month: 1,
        upload_date: '2021-01-01T12:00:00Z',
        file_url: 'document:invalid.pdf',
        file_name: 'invalid.pdf',
      },
    ]
    const institutional = [
      {
        id: 'qa-institutional',
        title: 'Estatuto de teste',
        description: 'Documento institucional simulado.',
        category: 'estatuto',
        year: 2026,
        upload_date: '2026-01-01T12:00:00Z',
        file_url: `${base}/__qa-document.pdf`,
        file_name: 'estatuto-de-teste.pdf',
        is_public: true,
      },
    ]
    const queries = []
    await page.route('**/rest/v1/**', (route) => {
      const url = new URL(route.request().url())
      queries.push({
        path: url.pathname,
        publicFilter: url.searchParams.get('is_public'),
      })
      if (mode === 'partial' && url.pathname.endsWith('/financial_documents'))
        return route.fulfill({
          status: 503,
          json: { message: 'Controlled test failure' },
          headers: { 'access-control-allow-origin': '*' },
        })
      return route.fulfill({
        json: url.pathname.endsWith('/financial_documents')
          ? finance
          : institutional,
        headers: { 'access-control-allow-origin': '*' },
      })
    })
    await page.route('**/transparency/partnerships.json', (route) =>
      route.fulfill({ json: disclosure }),
    )
    const pdfBody = Buffer.from(
      '%PDF-1.4\n% Synthetic fixture for download verification only\n%%EOF',
    )
    await page.route('**/__qa-document.pdf', (route) =>
      route.fulfill({ contentType: 'application/pdf', body: pdfBody }),
    )
    await page.reload()
    await page
      .getByRole('heading', { name: 'Parceria de teste — dados simulados' })
      .waitFor()
    await page.waitForFunction(
      () => document.querySelectorAll('.tp-document').length === 3,
    )
    assert.equal(await page.locator('.tp-document').count(), 3)
    await page.getByLabel('Buscar documento', { exact: true }).fill('balancete')
    assert.equal(
      await page.locator('.tp-document').count(),
      1,
      'Search must ignore case and accents',
    )
    await page
      .getByRole('button', { name: 'Limpar filtros', exact: true })
      .click()
    await page.getByLabel('Ano', { exact: true }).selectOption('2021')
    assert.equal(
      await page.locator('.tp-document').count(),
      1,
      'Published years older than five years must remain accessible',
    )
    assert.equal(
      await page.locator('.tp-document').getByRole('link').count(),
      0,
      'Invalid file schemes must not produce document links',
    )
    await page
      .getByRole('button', { name: 'Limpar filtros', exact: true })
      .click()
    await page.getByLabel('Categoria', { exact: true }).selectOption('estatuto')
    assert.equal(await page.locator('.tp-document').count(), 1)
    await page
      .getByRole('button', { name: 'Limpar filtros', exact: true })
      .click()
    await page.getByLabel('Buscar parceria, órgão ou instrumento').fill('orgao')
    assert.equal(await page.locator('.tp-partnership').count(), 1)
    await page
      .getByLabel('Buscar parceria, órgão ou instrumento')
      .fill('nenhuma-correspondencia')
    await page.getByText('Nenhuma parceria corresponde à busca.').waitFor()
    await page
      .getByRole('button', { name: 'Limpar busca', exact: true })
      .click()
    await page
      .getByText('Ver prestação de contas e equipe', { exact: true })
      .click()
    await page
      .getByRole('heading', {
        name: 'Equipe remunerada com recursos da parceria',
      })
      .waitFor()
    assert.equal(
      (await page
        .locator('.tp-partnership')
        .getByText('Não informado', { exact: true })
        .count()) > 0,
      true,
    )
    assert.equal(
      await page
        .locator('.tp-partnership')
        .getByText('R$ 0,00', { exact: true })
        .count(),
      1,
    )
    const downloadPromise = page.waitForEvent('download')
    await page
      .getByRole('button', { name: 'Baixar: Balancéte de teste', exact: true })
      .click()
    const download = await downloadPromise
    assert.equal(download.suggestedFilename(), 'balancete-de-teste.pdf')
    await download.saveAs(`${output}/download-fixture.pdf`)
    assert.deepEqual(fs.readFileSync(`${output}/download-fixture.pdf`), pdfBody)
    await page.locator('.tp-details').evaluate((detail) => {
      detail.open = false
    })
    await page.pdf({
      path: `${output}/fixture-print.pdf`,
      printBackground: true,
      preferCSSPageSize: true,
    })
    await page.emulateMedia({ media: 'screen' })
    result.fixtures.searchAndFilters = true
    result.fixtures.detailsAndDownload = true
    result.fixtures.publicDocumentFilter = queries.some(
      (query) =>
        query.path.endsWith('/documents') && query.publicFilter === 'eq.true',
    )
    assert.equal(result.fixtures.publicDocumentFilter, true)
    await page.setViewportSize({ width: 320, height: 900 })
    await page.locator('.tp-details').evaluate((detail) => {
      detail.open = true
    })
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      320,
      'Partnership details must fit the smallest supported viewport',
    )
    await page.screenshot({
      path: `${output}/fixture-mobile.png`,
      fullPage: true,
    })
    await page.setViewportSize({ width: 1440, height: 1000 })
    mode = 'partial'
    await page.reload()
    await page
      .getByRole('heading', { name: 'Parte do acervo não pôde ser carregada' })
      .waitFor()
    assert.equal(await page.locator('.tp-document').count(), 1)
    mode = 'success'
    await page
      .getByRole('button', { name: 'Tentar novamente', exact: true })
      .click()
    await page.waitForFunction(
      () => document.querySelectorAll('.tp-document').length === 3,
    )
    result.fixtures.partialFailureAndRetry = true
    disclosure = {
      updatedAt: '2026-10-05',
      partnerships: [],
      absenceDeclaration: {
        title: 'Declaração de teste — dados simulados',
        period: 'Período simulado',
        issuedAt: '2026-10-05',
        url: `${base}/__qa-document.pdf`,
      },
    }
    await page.reload()
    await page
      .getByRole('heading', { name: 'Declaração de teste — dados simulados' })
      .waitFor()
    assert.equal(
      await page
        .getByRole('link', { name: 'Abrir declaração oficial' })
        .count(),
      1,
    )
    result.fixtures.explicitDeclaration = true
    disclosure = {
      partnerships: [{ id: 'invalid' }],
      absenceDeclaration: null,
      updatedAt: null,
    }
    await page.reload()
    await page
      .getByRole('heading', { name: 'Não foi possível carregar as parcerias' })
      .waitFor()
    await page.waitForFunction(
      () => document.querySelectorAll('.tp-document').length === 3,
    )
    assert.equal(await page.locator('.tp-document').count(), 3)
    result.fixtures.invalidDisclosureHandled = true
    assert.deepEqual(pageErrors, [])
    fs.writeFileSync(
      `${output}/verification.json`,
      JSON.stringify(result, null, 2),
    )
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await browser.close()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

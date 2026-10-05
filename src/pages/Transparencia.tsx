import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  Building2,
  Download,
  ExternalLink,
  FileText,
  Info,
  Printer,
} from 'lucide-react'
import PartnershipCard from '../components/transparency/PartnershipCard'
import { transparencyInstitution } from '../data/transparency'
import { documentService, financialService } from '../lib/supabaseClient'
import {
  downloadPublicDocument,
  financialToPublic,
  formatPublicDate,
  institutionalToPublic,
  loadDisclosure,
  normalizeSearch,
} from '../lib/transparency'
import type {
  PublicDocument,
  TransparencyDisclosure,
} from '../types/transparency'
import '../styles/transparency.css'

export default function Transparencia() {
  const { t } = useTranslation()
  const copy = (key: string, fallback: string) =>
    t(`transparency.portal.${key}`, { defaultValue: fallback })
  const [disclosure, setDisclosure] = useState<TransparencyDisclosure | null>(
    null,
  )
  const [disclosureError, setDisclosureError] = useState(false)
  const [disclosureLoading, setDisclosureLoading] = useState(true)
  const [documents, setDocuments] = useState<PublicDocument[]>([])
  const [failedSources, setFailedSources] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('all')
  const [category, setCategory] = useState('all')
  const [partnershipSearch, setPartnershipSearch] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState(false)
  const [printDate, setPrintDate] = useState(() =>
    new Date().toLocaleString('pt-BR'),
  )

  useEffect(() => {
    document.body.classList.add('transparency-view')
    const previousTitle = document.title
    document.title = 'Transparência | Instituto Estação'
    let opened: HTMLDetailsElement[] = []
    const beforePrint = () => {
      setPrintDate(new Date().toLocaleString('pt-BR'))
      opened = Array.from(
        document.querySelectorAll<HTMLDetailsElement>('.tp-details'),
      ).filter((detail) => !detail.open)
      opened.forEach((detail) => {
        detail.open = true
      })
    }
    const afterPrint = () =>
      opened.forEach((detail) => {
        detail.open = false
      })
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    return () => {
      document.body.classList.remove('transparency-view')
      document.title = previousTitle
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
    }
  }, [])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    setLoading(true)
    setFailedSources([])
    setDisclosureError(false)
    setDisclosureLoading(true)
    loadDisclosure(controller.signal)
      .then((value) => {
        if (active) {
          setDisclosure(value)
          setDisclosureLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setDisclosure(null)
          setDisclosureError(true)
          setDisclosureLoading(false)
        }
      })
    Promise.allSettled([
      financialService.getAll(),
      documentService.getAll(),
    ]).then(([financial, institutional]) => {
      if (!active) return
      setDocuments(
        [
          ...(financial.status === 'fulfilled'
            ? financial.value.map(financialToPublic)
            : []),
          ...(institutional.status === 'fulfilled'
            ? institutional.value.map(institutionalToPublic)
            : []),
        ].sort(
          (a, b) =>
            (b.year || 0) - (a.year || 0) ||
            (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0),
        ),
      )
      setFailedSources([
        ...(financial.status === 'rejected' ? ['financial'] : []),
        ...(institutional.status === 'rejected' ? ['institutional'] : []),
      ])
      setLoading(false)
    })
    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  const categoryLabels: Record<string, string> = {
    receipt: t('transparency.document_types.receipt'),
    report: t('transparency.document_types.report'),
    statement: t('transparency.document_types.statement'),
    other: t('transparency.document_types.other'),
    estatuto: t('documents.categories.estatuto'),
    ata: t('documents.categories.ata'),
    relatorio: t('documents.categories.relatorio'),
    certidao: t('documents.categories.certidao'),
    outros: t('documents.categories.outros'),
  }
  const years = useMemo(
    () =>
      [
        ...new Set(
          documents.flatMap((document) =>
            document.year ? [document.year] : [],
          ),
        ),
      ].sort((a, b) => b - a),
    [documents],
  )
  const categories = [
    ...new Set(documents.map((document) => document.category)),
  ]
  const visibleDocuments = documents.filter(
    (document) =>
      (year === 'all' || String(document.year) === year) &&
      (category === 'all' || document.category === category) &&
      normalizeSearch(`${document.title} ${document.description}`).includes(
        normalizeSearch(search),
      ),
  )
  const visiblePartnerships = (disclosure?.partnerships || []).filter(
    (partnership) =>
      normalizeSearch(
        `${partnership.title} ${partnership.agency} ${partnership.instrument} ${partnership.object}`,
      ).includes(normalizeSearch(partnershipSearch)),
  )
  const clearFilters = () => {
    setSearch('')
    setYear('all')
    setCategory('all')
  }
  const retry = () => setAttempt((value) => value + 1)
  const download = async (document: PublicDocument) => {
    setDownloading(document.id)
    setDownloadError(false)
    try {
      await downloadPublicDocument(document)
    } catch {
      setDownloadError(true)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="transparency-page">
      <div className="tp-container">
        <section className="tp-hero" aria-labelledby="tp-title">
          <div>
            <span className="tp-kicker">
              {copy('kicker', 'Acesso à informação')}
            </span>
            <h1 id="tp-title">{copy('title', 'Transparência')}</h1>
            <p>
              {copy(
                'intro',
                'Consulte as parcerias públicas, a aplicação dos recursos e os documentos institucionais do Instituto Estação.',
              )}
            </p>
          </div>
          <button
            className="tp-button tp-no-print"
            onClick={() => window.print()}
          >
            <Printer size={18} aria-hidden="true" />
            {copy('print', 'Imprimir consulta')}
          </button>
        </section>
        <div className="tp-print-only">
          {copy('consulted_at', 'Consulta realizada em')}: {printDate}
          <br />
          {window.location.href}
        </div>
        <nav
          className="tp-nav tp-no-print"
          aria-label={copy('page_navigation', 'Nesta página')}
        >
          <a href="#parcerias">{copy('partnerships', 'Parcerias públicas')}</a>
          <a href="#documentos">
            {copy('documents', 'Documentos e relatórios')}
          </a>
          <a href="#instituicao">
            {copy('institution', 'Identificação institucional')}
          </a>
        </nav>

        <section
          id="parcerias"
          className="tp-panel"
          aria-labelledby="tp-partnerships-title"
        >
          <div className="tp-section-heading">
            <div>
              <h2 id="tp-partnerships-title">
                {copy('partnerships', 'Parcerias públicas')}
              </h2>
              <p>
                {copy(
                  'partnerships_intro',
                  'Informações por instrumento: órgão parceiro, objeto, valores, prestação de contas e equipe vinculada à execução.',
                )}
              </p>
            </div>
            {disclosure && disclosure.partnerships.length > 0 && (
              <span className="tp-count">
                {disclosure.partnerships.length}{' '}
                {copy('published', 'publicadas')}
              </span>
            )}
          </div>
          {disclosureLoading ? (
            <p role="status">
              {copy(
                'loading_partnerships',
                'Carregando informações de parcerias...',
              )}
            </p>
          ) : disclosureError ? (
            <div className="tp-empty tp-error" role="alert">
              <h3>
                {copy(
                  'partnerships_error',
                  'Não foi possível carregar as parcerias',
                )}
              </h3>
              <p>
                {copy(
                  'retry_help',
                  'Tente novamente ou entre em contato para solicitar as informações.',
                )}
              </p>
              <button className="tp-button tp-no-print" onClick={retry}>
                {copy('retry', 'Tentar novamente')}
              </button>
            </div>
          ) : disclosure && disclosure.partnerships.length > 0 ? (
            <>
              <div className="tp-filters tp-no-print">
                <label htmlFor="tp-partnership-search">
                  {copy(
                    'search_partnerships',
                    'Buscar parceria, órgão ou instrumento',
                  )}
                  <input
                    id="tp-partnership-search"
                    type="search"
                    value={partnershipSearch}
                    onChange={(event) =>
                      setPartnershipSearch(event.target.value)
                    }
                    placeholder={copy(
                      'partnership_placeholder',
                      'Digite o nome, órgão ou número',
                    )}
                  />
                </label>
              </div>
              {visiblePartnerships.map((partnership) => (
                <PartnershipCard
                  key={partnership.id}
                  partnership={partnership}
                />
              ))}
              {visiblePartnerships.length === 0 && (
                <p role="status">
                  {copy(
                    'no_partnership_matches',
                    'Nenhuma parceria corresponde à busca.',
                  )}{' '}
                  <button
                    className="tp-button tp-no-print"
                    onClick={() => setPartnershipSearch('')}
                  >
                    {copy('clear_search', 'Limpar busca')}
                  </button>
                </p>
              )}
            </>
          ) : disclosure?.absenceDeclaration ? (
            <div className="tp-empty">
              <h3>{disclosure.absenceDeclaration.title}</h3>
              <p>
                {copy('period', 'Período')}:{' '}
                {disclosure.absenceDeclaration.period} ·{' '}
                {formatPublicDate(disclosure.absenceDeclaration.issuedAt)}
              </p>
              <a
                className="tp-button"
                href={disclosure.absenceDeclaration.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText size={18} aria-hidden="true" />
                {copy('open_declaration', 'Abrir declaração oficial')}
              </a>
            </div>
          ) : (
            <div className="tp-empty">
              <Building2 size={28} aria-hidden="true" />
              <h3>
                {copy(
                  'partnerships_pending',
                  'Informações de parcerias aguardando publicação',
                )}
              </h3>
              <p>
                {copy(
                  'partnerships_pending_help',
                  'A relação de parcerias públicas ainda não foi disponibilizada nesta página. Para consultar instrumentos, valores e prestações de contas, solicite as informações ao Instituto.',
                )}
              </p>
              <Link className="tp-button tp-no-print" to="/contato">
                {copy('request_information', 'Solicitar informações')}
              </Link>
            </div>
          )}
          <p className="tp-muted tp-help">
            {copy('disclosure_updated', 'Atualização das informações')}:{' '}
            {formatPublicDate(
              disclosure?.updatedAt || null,
              copy('not_informed', 'Não informado'),
            )}
          </p>
        </section>

        <section
          id="documentos"
          className="tp-panel"
          aria-labelledby="tp-documents-title"
        >
          <div className="tp-section-heading">
            <div>
              <h2 id="tp-documents-title">
                {copy('documents', 'Documentos e relatórios')}
              </h2>
              <p>
                {copy(
                  'documents_intro',
                  'Documentos financeiros e institucionais publicados, organizados por categoria e ano de referência.',
                )}
              </p>
            </div>
            {!loading && (
              <span className="tp-count">
                {failedSources.length > 0
                  ? copy('incomplete_query', 'Consulta incompleta')
                  : `${documents.length} ${copy('available', 'disponíveis')}`}
              </span>
            )}
          </div>
          {failedSources.length > 0 && (
            <div className="tp-empty tp-error" role="alert">
              <AlertCircle size={24} aria-hidden="true" />
              <h3>
                {copy(
                  'documents_error',
                  'Parte do acervo não pôde ser carregada',
                )}
              </h3>
              <p>
                {failedSources
                  .map((source) =>
                    source === 'financial'
                      ? copy('financial_source', 'Documentos financeiros')
                      : copy(
                          'institutional_source',
                          'Documentos institucionais',
                        ),
                  )
                  .join(' · ')}
                .{' '}
                {copy(
                  'documents_error_help',
                  'A consulta está incompleta. Tente novamente ou solicite os documentos à instituição.',
                )}
              </p>
              <button className="tp-button tp-no-print" onClick={retry}>
                {copy('retry', 'Tentar novamente')}
              </button>
            </div>
          )}
          <div className="tp-filters tp-no-print">
            <label htmlFor="tp-document-search">
              {copy('search_documents', 'Buscar documento')}
              <input
                id="tp-document-search"
                type="search"
                placeholder={t('documents.search_placeholder')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label htmlFor="tp-document-year">
              {t('documents.year_label')}
              <select
                id="tp-document-year"
                aria-label={t('documents.year_label')}
                value={year}
                onChange={(event) => setYear(event.target.value)}
              >
                <option value="all">{t('documents.all_years')}</option>
                {years.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="tp-document-category">
              {t('documents.category_label')}
              <select
                id="tp-document-category"
                aria-label={t('documents.category_label')}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">{t('documents.all_categories')}</option>
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {categoryLabels[value] || value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {loading ? (
            <p role="status">{t('transparency.loading')}</p>
          ) : (
            <>
              <div className="tp-results">
                <p role="status" aria-live="polite">
                  {failedSources.length > 0
                    ? `${copy('showing', 'Exibindo')} ${visibleDocuments.length} ${copy('loaded_documents', 'documentos carregados; consulta incompleta')}`
                    : `${copy('showing', 'Exibindo')} ${visibleDocuments.length} ${copy('of', 'de')} ${documents.length} ${copy('documents_count', 'documentos')}`}
                </p>
                <button className="tp-no-print" onClick={clearFilters}>
                  {copy('clear_filters', 'Limpar filtros')}
                </button>
              </div>
              {downloadError && (
                <p className="tp-note tp-error" role="alert">
                  {copy(
                    'download_error',
                    'Não foi possível baixar o arquivo. Tente abrir o documento ou solicite uma cópia à instituição.',
                  )}
                </p>
              )}
              <div className="tp-document-grid">
                {visibleDocuments.map((document) => (
                  <article key={document.id} className="tp-document">
                    <span className="tp-badge">
                      {categoryLabels[document.category] || document.category}
                    </span>
                    <h3>{document.title}</h3>
                    {document.description && <p>{document.description}</p>}
                    <div className="tp-document-meta">
                      <span>
                        {copy('reference_year', 'Ano de referência')}:{' '}
                        {document.year || copy('not_informed', 'Não informado')}
                      </span>
                      <span>· {formatPublicDate(document.date)}</span>
                    </div>
                    {document.url ? (
                      <div className="tp-document-actions tp-no-print">
                        <a
                          className="tp-button"
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t('transparency.view')}: ${document.title}`}
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                          {t('transparency.view')}
                        </a>
                        <button
                          className="tp-button"
                          onClick={() => download(document)}
                          disabled={downloading !== null}
                          aria-label={`${t('transparency.download')}: ${document.title}`}
                        >
                          <Download size={16} aria-hidden="true" />
                          {downloading === document.id
                            ? copy('downloading', 'Baixando...')
                            : t('transparency.download')}
                        </button>
                      </div>
                    ) : (
                      <p className="tp-note">
                        {copy(
                          'file_unavailable',
                          'Arquivo ainda não disponibilizado.',
                        )}
                      </p>
                    )}
                    {document.url && (
                      <p className="tp-print-only">{document.url}</p>
                    )}
                  </article>
                ))}
              </div>
              {visibleDocuments.length === 0 && failedSources.length === 0 && (
                <div className="tp-empty">
                  <FileText size={28} aria-hidden="true" />
                  <h3>
                    {documents.length > 0
                      ? t('documents.no_documents')
                      : copy(
                          'documents_pending',
                          'Documentos aguardando publicação',
                        )}
                  </h3>
                  <p>
                    {documents.length > 0
                      ? t('documents.adjust_filters')
                      : copy(
                          'documents_pending_help',
                          'Ainda não foram disponibilizados documentos no acervo desta página.',
                        )}
                  </p>
                </div>
              )}
            </>
          )}
          <p className="tp-help">
            <Link to="/documentos">
              {copy(
                'institutional_library',
                'Consultar também a biblioteca de documentos institucionais',
              )}{' '}
              →
            </Link>
          </p>
        </section>

        <section
          id="instituicao"
          className="tp-panel"
          aria-labelledby="tp-institution-title"
        >
          <div className="tp-section-heading">
            <div>
              <h2 id="tp-institution-title">
                {copy('institution', 'Identificação institucional')}
              </h2>
              <p>{transparencyInstitution.legalName}</p>
            </div>
          </div>
          <dl className="tp-fields">
            <div>
              <dt>{copy('organization', 'Organização')}</dt>
              <dd>{transparencyInstitution.name}</dd>
            </div>
            <div>
              <dt>CNPJ</dt>
              <dd>{transparencyInstitution.cnpj}</dd>
            </div>
            <div>
              <dt>{copy('information_contact', 'Canal de informações')}</dt>
              <dd>
                <a href={`mailto:${transparencyInstitution.email}`}>
                  {transparencyInstitution.email}
                </a>
              </dd>
            </div>
          </dl>
          <div className="tp-note tp-help">
            <Info size={20} aria-hidden="true" />
            <p>
              {copy(
                'institution_note',
                'Confira a situação cadastral, as datas e a validade no cartão CNPJ, estatuto e certidões oficiais da instituição.',
              )}
            </p>
          </div>
        </section>

        <section className="tp-panel" aria-labelledby="tp-publication-title">
          <div className="tp-section-heading">
            <div>
              <h2 id="tp-publication-title">
                {copy('publication', 'Publicidade e prestação de contas')}
              </h2>
              <p>
                {copy(
                  'publication_intro',
                  'A informação acessível permite acompanhar cada parceria e a aplicação dos recursos públicos.',
                )}
              </p>
            </div>
          </div>
          <div className="tp-proof">
            <div>
              <h3>{copy('online_publication', 'Consulta e impressão')}</h3>
              <p>
                {copy(
                  'online_publication_help',
                  'Esta página pode ser impressa ou salva em PDF com a data da consulta, o endereço e os resultados exibidos. Os detalhes das parcerias são incluídos na impressão.',
                )}
              </p>
            </div>
            <div>
              <h3>{copy('physical_publication', 'Divulgação na sede')}</h3>
              <p>
                {copy(
                  'physical_publication_help',
                  'As informações das parcerias abrangidas pela Lei 13.019/2014 também devem ser divulgadas em local visível na sede e nos estabelecimentos onde as ações são realizadas.',
                )}
              </p>
            </div>
          </div>
          <p className="tp-help">
            <a
              href={transparencyInstitution.legalReference}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy('legal_reference', 'Consultar a Lei 13.019/2014, art. 11')}{' '}
              <ExternalLink size={14} className="inline" aria-hidden="true" />
            </a>
          </p>
          <p className="tp-help tp-no-print">
            <Link className="tp-button" to="/contato">
              {copy('request_information', 'Solicitar informações')}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}

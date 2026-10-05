import type { Document, FinancialDocument } from './types'
import type {
  PublicDocument,
  PublicPartnership,
  TransparencyDisclosure,
} from '../types/transparency'

export function safeDocumentUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  if (!/^(https?:\/\/|\/(?!\/))/.test(value.trim())) return null
  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null
  } catch {
    return null
  }
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null
const amount = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : null

export function parseDisclosure(value: unknown): TransparencyDisclosure {
  if (!record(value) || !Array.isArray(value.partnerships))
    throw new Error('Invalid partnership disclosure')
  const partnerships: PublicPartnership[] = value.partnerships.map((item) => {
    if (
      !record(item) ||
      !text(item.id) ||
      !text(item.title) ||
      !text(item.agency) ||
      !text(item.instrument) ||
      !text(item.object)
    )
      throw new Error('Incomplete partnership identification')
    const accounts = record(item.accountability) ? item.accountability : {}
    const team = record(item.team) ? item.team : {}
    return {
      id: text(item.id)!,
      title: text(item.title)!,
      agency: text(item.agency)!,
      instrument: text(item.instrument)!,
      object: text(item.object)!,
      signedAt: text(item.signedAt),
      startsAt: text(item.startsAt),
      endsAt: text(item.endsAt),
      status: text(item.status),
      totalAmount: amount(item.totalAmount),
      releasedAmount: amount(item.releasedAmount),
      accountability: {
        status: text(accounts.status),
        dueAt: text(accounts.dueAt),
        submittedAt: text(accounts.submittedAt),
        analysisDueAt: text(accounts.analysisDueAt),
        conclusion: text(accounts.conclusion),
      },
      team: {
        funding:
          team.funding === 'partnership' || team.funding === 'not-funded'
            ? team.funding
            : 'not-informed',
        totalAmount: amount(team.totalAmount),
        roles: Array.isArray(team.roles)
          ? team.roles.map((role) => {
              if (!record(role) || !text(role.role))
                throw new Error('Invalid team role')
              return {
                role: text(role.role)!,
                plannedAmount: amount(role.plannedAmount),
              }
            })
          : [],
      },
      attachments: Array.isArray(item.attachments)
        ? item.attachments.map((attachment) => {
            if (
              !record(attachment) ||
              !text(attachment.title) ||
              !safeDocumentUrl(attachment.url)
            )
              throw new Error('Invalid partnership attachment')
            return {
              title: text(attachment.title)!,
              url: safeDocumentUrl(attachment.url)!,
            }
          })
        : [],
    }
  })
  if (
    new Set(partnerships.map((partnership) => partnership.id)).size !==
    partnerships.length
  )
    throw new Error('Duplicate partnership identification')
  const declaration = value.absenceDeclaration
  if (
    declaration != null &&
    (!record(declaration) ||
      !text(declaration.title) ||
      !text(declaration.period) ||
      !text(declaration.issuedAt) ||
      !safeDocumentUrl(declaration.url))
  )
    throw new Error('Invalid absence declaration')
  return {
    updatedAt: text(value.updatedAt),
    partnerships,
    absenceDeclaration: record(declaration)
      ? {
          title: text(declaration.title)!,
          period: text(declaration.period)!,
          issuedAt: text(declaration.issuedAt)!,
          url: safeDocumentUrl(declaration.url)!,
        }
      : null,
  }
}

export async function loadDisclosure(
  signal?: AbortSignal,
): Promise<TransparencyDisclosure> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}transparency/partnerships.json`,
    { signal, cache: 'no-cache' },
  )
  if (!response.ok) throw new Error('Failed to load partnership disclosure')
  return parseDisclosure(await response.json())
}

export function financialToPublic(document: FinancialDocument): PublicDocument {
  return {
    id: `financial-${document.id}`,
    title: document.title,
    description: document.description || '',
    category: document.document_type,
    year: document.year || null,
    date: document.upload_date,
    url: safeDocumentUrl(document.file_url),
    fileName: document.file_name || document.title,
    source: 'financial',
  }
}

export function institutionalToPublic(document: Document): PublicDocument {
  return {
    id: `institutional-${document.id}`,
    title: document.title,
    description: document.description || '',
    category: document.category,
    year: document.year || null,
    date: document.upload_date,
    url: safeDocumentUrl(document.file_url),
    fileName: document.file_name || document.title,
    source: 'institutional',
  }
}

export const normalizeSearch = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function formatPublicDate(
  value: string | null,
  missing = 'Não informado',
): string {
  if (!value) return missing
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value,
  )
  return Number.isNaN(date.getTime())
    ? missing
    : date.toLocaleDateString('pt-BR')
}

export function formatPublicAmount(
  value: number | null,
  missing = 'Não informado',
): string {
  return value === null
    ? missing
    : value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export async function downloadPublicDocument(
  document: PublicDocument,
): Promise<void> {
  if (!document.url) throw new Error('Document unavailable')
  const response = await fetch(document.url)
  if (!response.ok) throw new Error('Failed to download document')
  const url = URL.createObjectURL(await response.blob())
  const link = window.document.createElement('a')
  link.href = url
  link.download = document.fileName.replace(/[<>:"/\\|?*]/g, '-')
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

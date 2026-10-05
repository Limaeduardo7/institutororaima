export interface PublicPartnership {
  id: string
  title: string
  agency: string
  instrument: string
  object: string
  signedAt: string | null
  startsAt: string | null
  endsAt: string | null
  status: string | null
  totalAmount: number | null
  releasedAmount: number | null
  accountability: {
    status: string | null
    dueAt: string | null
    submittedAt: string | null
    analysisDueAt: string | null
    conclusion: string | null
  }
  team: {
    funding: 'partnership' | 'not-funded' | 'not-informed'
    totalAmount: number | null
    roles: { role: string; plannedAmount: number | null }[]
  }
  attachments: { title: string; url: string }[]
}

export interface TransparencyDisclosure {
  updatedAt: string | null
  absenceDeclaration: {
    title: string
    period: string
    issuedAt: string
    url: string
  } | null
  partnerships: PublicPartnership[]
}

export interface PublicDocument {
  id: string
  title: string
  description: string
  category: string
  year: number | null
  date: string
  url: string | null
  fileName: string
  source: 'financial' | 'institutional'
}

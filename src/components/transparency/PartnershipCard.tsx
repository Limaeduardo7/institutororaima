import { Building2, ChevronDown, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { transparencyInstitution } from '../../data/transparency'
import { formatPublicAmount, formatPublicDate } from '../../lib/transparency'
import type { PublicPartnership } from '../../types/transparency'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export default function PartnershipCard({
  partnership,
}: {
  partnership: PublicPartnership
}) {
  const { t } = useTranslation()
  const copy = (key: string, fallback: string) =>
    t(`transparency.portal.${key}`, { defaultValue: fallback })
  const missing = copy('not_informed', 'Não informado')
  return (
    <article className="tp-partnership">
      <div className="tp-partnership-heading">
        <span className="tp-icon">
          <Building2 size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="tp-eyebrow">{partnership.agency}</p>
          <h3>{partnership.title}</h3>
          <p>{partnership.instrument}</p>
        </div>
        <span className="tp-badge">{partnership.status || missing}</span>
      </div>
      <p className="tp-object">{partnership.object}</p>
      <dl className="tp-fields tp-summary-fields">
        <Field
          label={copy('total_value', 'Valor total')}
          value={formatPublicAmount(partnership.totalAmount, missing)}
        />
        <Field
          label={copy('released_value', 'Valores liberados')}
          value={formatPublicAmount(partnership.releasedAmount, missing)}
        />
        <Field
          label={copy('signature_date', 'Data de assinatura')}
          value={formatPublicDate(partnership.signedAt, missing)}
        />
      </dl>
      <details className="tp-details">
        <summary>
          {copy('partnership_details', 'Ver prestação de contas e equipe')}
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <div className="tp-details-content">
          <h4>{copy('identification', 'Identificação da parceria')}</h4>
          <dl className="tp-fields">
            <Field
              label={copy('organization', 'Organização')}
              value={`${transparencyInstitution.name} · CNPJ ${transparencyInstitution.cnpj}`}
            />
            <Field
              label={copy('agency', 'Órgão parceiro')}
              value={partnership.agency}
            />
            <Field
              label={copy('instrument', 'Instrumento e número')}
              value={partnership.instrument}
            />
            <Field
              label={copy('starts_at', 'Início da vigência')}
              value={formatPublicDate(partnership.startsAt, missing)}
            />
            <Field
              label={copy('ends_at', 'Fim da vigência')}
              value={formatPublicDate(partnership.endsAt, missing)}
            />
          </dl>
          <h4>{copy('accountability', 'Prestação de contas')}</h4>
          <dl className="tp-fields">
            <Field
              label={copy('status', 'Situação')}
              value={partnership.accountability.status || missing}
            />
            <Field
              label={copy('accounts_due', 'Data prevista de apresentação')}
              value={formatPublicDate(
                partnership.accountability.dueAt,
                missing,
              )}
            />
            <Field
              label={copy('accounts_submitted', 'Data de apresentação')}
              value={formatPublicDate(
                partnership.accountability.submittedAt,
                missing,
              )}
            />
            <Field
              label={copy('analysis_due', 'Prazo para análise')}
              value={formatPublicDate(
                partnership.accountability.analysisDueAt,
                missing,
              )}
            />
            <Field
              label={copy('conclusion', 'Resultado conclusivo')}
              value={partnership.accountability.conclusion || missing}
            />
          </dl>
          <h4>{copy('team', 'Equipe remunerada com recursos da parceria')}</h4>
          {partnership.team.funding === 'not-funded' ? (
            <p>
              {copy(
                'team_not_funded',
                'Não há remuneração de equipe com recursos desta parceria, conforme informação publicada pela instituição.',
              )}
            </p>
          ) : (
            <>
              <dl className="tp-fields">
                <Field
                  label={copy('team_total', 'Valor total da remuneração')}
                  value={formatPublicAmount(
                    partnership.team.totalAmount,
                    missing,
                  )}
                />
              </dl>
              {partnership.team.roles.length > 0 ? (
                <dl className="tp-fields">
                  {partnership.team.roles.map((role, index) => (
                    <Field
                      key={`${role.role}-${index}`}
                      label={role.role}
                      value={`${copy('planned_pay', 'Remuneração prevista')}: ${formatPublicAmount(role.plannedAmount, missing)}`}
                    />
                  ))}
                </dl>
              ) : (
                <p className="tp-muted">
                  {copy(
                    'team_pending',
                    'Funções e remuneração prevista ainda não informadas.',
                  )}
                </p>
              )}
            </>
          )}
          <h4>{copy('supporting_documents', 'Documentos da parceria')}</h4>
          {partnership.attachments.length > 0 ? (
            <ul className="tp-attachments">
              {partnership.attachments.map((attachment) => (
                <li key={`${attachment.title}-${attachment.url}`}>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attachment.title}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tp-muted">
              {copy(
                'attachments_pending',
                'Documentos da parceria ainda não disponibilizados.',
              )}
            </p>
          )}
        </div>
      </details>
    </article>
  )
}

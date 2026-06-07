import { useGameStore } from '../../store/gameStore'
import { useTranslation } from '../../i18n'
import { ALL_EVIDENCE } from '../../data/evidence'
import type { EvidenceType } from '../../types/game'

const TYPE_ICONS: Record<EvidenceType, string> = {
  anomaly: '🔍',
  contradiction: '⚡',
  prediction: '👁',
  origin: '?',
}

const TYPE_LABELS: Record<EvidenceType, { en: string; zh: string; de: string }> = {
  anomaly: { en: 'Anomaly', zh: '异常', de: 'Anomalie' },
  contradiction: { en: 'Contradiction', zh: '矛盾', de: 'Widerspruch' },
  prediction: { en: 'Prediction', zh: '预言', de: 'Vorhersage' },
  origin: { en: 'Origin', zh: '起源', de: 'Ursprung' },
}

export function EvidenceTab() {
  const evidence = useGameStore(s => s.evidence)
  const t = useTranslation()

  if (evidence.length === 0) {
    return (
      <p className="text-sm text-stone-600 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
        {t('evidence.none')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {t('evidence.title')} ({evidence.length}/{ALL_EVIDENCE.length})
        </h3>
      </div>

      {(['anomaly', 'contradiction', 'prediction', 'origin'] as EvidenceType[]).map(type => {
        const typeEvidence = evidence.filter(e => e.type === type)
        if (typeEvidence.length === 0) return null
        return (
          <div key={type}>
            <h4 className="text-[10px] text-stone-600 uppercase tracking-wider mb-2">
              {TYPE_ICONS[type]} {TYPE_LABELS[type].zh}
            </h4>
            <div className="space-y-2">
              {typeEvidence.map(ev => {
                return (
                  <div
                    key={ev.id}
                    className={`rounded border px-4 py-3 list-item-enter ${
                      ev.isKeyEvidence
                        ? 'border-amber-800/30 bg-amber-900/8'
                        : 'border-stone-700/20 bg-stone-800/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {ev.isKeyEvidence && <span className="text-amber-500 text-xs">◆</span>}
                      <span className="text-xs text-stone-200 font-medium">{ev.title}</span>
                      <span className="text-[10px] text-stone-600 ml-auto">
                        {t('evidence.chapter')} {ev.chapterId.replace('ch', '')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                      {ev.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

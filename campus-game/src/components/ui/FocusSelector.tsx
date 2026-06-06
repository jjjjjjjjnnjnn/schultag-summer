import type { FocusType } from '../../types/game'
import { useTranslation } from '../../i18n'

const FOCUS_KEYS: { type: FocusType; labelKey: string; subKey: string; hintKey: string; color: string }[] = [
  { type: 'maya', labelKey: 'focus.maya', subKey: 'focus.mayaSub', hintKey: 'focus.mayaHint', color: '#8b5cf6' },
  { type: 'ludwig', labelKey: 'focus.ludwig', subKey: 'focus.ludwigSub', hintKey: 'focus.ludwigHint', color: '#3b82f6' },
  { type: 'environment', labelKey: 'focus.env', subKey: 'focus.envSub', hintKey: 'focus.envHint', color: '#a8a29e' },
]

interface Props {
  onSelect: (f: FocusType) => void
  budget?: number
}

export function FocusSelector({ onSelect, budget = 3 }: Props) {
  const t = useTranslation()

  return (
    <div className="max-w-2xl mx-auto mt-8 scene-fade-in">
      <div className="text-center mb-6">
        <p className="text-stone-300 text-sm mb-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {t('focus.title')}
        </p>
        <p className="text-stone-500 text-xs">
          {t('focus.budget', { n: budget })}
        </p>
      </div>

      <div className="flex justify-center gap-4 sm:gap-6">
        {FOCUS_KEYS.map(f => (
          <button
            key={f.type}
            onClick={() => onSelect(f.type)}
            className="group flex flex-col items-center gap-2 px-5 py-4 rounded-lg border border-stone-700/50 hover:border-stone-500 transition-all duration-300 hover:bg-stone-800/30"
          >
            <div
              className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: f.color }}
            />
            <span
              className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors"
              style={{ fontFamily: 'var(--font-serif-cn)' }}
            >
              {t(f.labelKey)}
            </span>
            <span className="text-[10px] text-stone-500">{t(f.subKey)}</span>
            <span className="text-[10px] text-stone-600 group-hover:text-stone-500 transition-colors">{t(f.hintKey)}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-[10px] text-stone-700 mt-4">
        {t('focus.footnote')}
      </p>
    </div>
  )
}

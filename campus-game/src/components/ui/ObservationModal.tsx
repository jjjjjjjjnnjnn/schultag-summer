import { useTypewriter } from '../../hooks/useTypewriter'
import { useGameStore } from '../../store/gameStore'
import { useTranslation } from '../../i18n'

export function ObservationModal() {
  const { modalObservationId, closeObservation, confirmObservation, previousFocus, focusHistory } = useGameStore()
  const t = useTranslation()

  if (!modalObservationId) return null

  const dayScene = useGameStore.getState().getDayScene()
  if (!dayScene) return null

  const obs = dayScene.observations.find(o => o.id === modalObservationId)
  if (!obs) return null

  // 计算焦点连续 streak
  let streak = 0
  let lastFocus: string | null = null
  for (const f of focusHistory) {
    if (f === lastFocus) { streak++ } else { streak = 1; lastFocus = f }
  }

  // 观察偏见：根据 streak 显示不同深度的追加文本
  let addon = ''
  if (obs.focusAddendum && previousFocus === obs.focusGroup) {
    addon = obs.focusAddendum
  }
  if (obs.focusAddendumDeep && previousFocus === obs.focusGroup && streak >= 2) {
    addon = obs.focusAddendumDeep
  }
  const fullText = addon ? obs.observationText + '\n\n' + addon : obs.observationText

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={closeObservation}
    >
      <div
        className="bg-[#2a2520] max-w-lg w-full mx-4 scene-fade-in rounded-lg overflow-hidden shadow-2xl border border-stone-700/50"
        style={{ fontFamily: 'var(--font-serif-cn)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 pt-6 pb-2 flex items-center gap-3">
          <span className="text-sm text-stone-300 font-semibold">{obs.name}</span>
        </div>

        {/* 观察文本 — 打字机效果 */}
        <div className="px-6 py-4">
          <ObservationText text={fullText} />
        </div>

        {/* 分割线 */}
        <div className="px-6">
          <div className="h-px bg-stone-700/50" />
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={closeObservation}
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            {t('observe.close')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-stone-600">{t('observe.materialHint')}</span>
            <button
              onClick={confirmObservation}
              className="px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-400 hover:bg-amber-900/50 transition-all text-sm rounded"
            >
              {t('observe.addNotebook')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ObservationText({ text }: { text: string }) {
  const { displayed, isComplete, skip } = useTypewriter(text, 30)

  return (
    <div onClick={!isComplete ? skip : undefined} className="cursor-pointer">
      <p
        className="text-stone-300 leading-[1.9] text-sm"
        style={{ fontFamily: 'var(--font-serif-cn)' }}
      >
        {displayed}
        {!isComplete && <span className="cursor-blink" />}
      </p>
    </div>
  )
}

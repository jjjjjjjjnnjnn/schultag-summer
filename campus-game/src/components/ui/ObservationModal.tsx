import { useEffect } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useGameStore } from '../../store/gameStore'
import { useTranslation, useContent } from '../../i18n'
import { audio } from '../../lib/audio'

export function ObservationModal() {
  const { modalObservationId, closeObservation, confirmObservation, previousFocus, focusHistory, behaviorStates } = useGameStore()
  const t = useTranslation()
  const { co } = useContent()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        closeObservation()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeObservation])

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
  const addonText = obs.cid ? co(obs.cid, 'addon', obs.focusAddendum || '') : (obs.focusAddendum || '')
  const addonDeepText = obs.cid ? co(obs.cid, 'addonDeep', obs.focusAddendumDeep || '') : (obs.focusAddendumDeep || '')
  if (addonText && previousFocus === obs.focusGroup) {
    addon = addonText
  }
  if (addonDeepText && previousFocus === obs.focusGroup && streak >= 2) {
    addon = addonDeepText
  }
  const obsText = obs.cid ? co(obs.cid, 'text', obs.observationText) : obs.observationText
  const fullText = addon ? obsText + '\n\n' + addon : obsText
  const obsName = obs.cid ? co(obs.cid, 'name', obs.name) : obs.name

  // V1.1: 检查行为效果
  const characterEffects = behaviorStates[obs.focusGroup] || []
  const consequenceHint = characterEffects.length > 0
    ? characterEffects[characterEffects.length - 1]?.behaviorDescription
    : undefined

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={closeObservation}
    >
      <div
        className="bg-[#2a2520] max-w-lg w-full mx-4 scene-fade-in rounded-lg shadow-2xl border border-stone-700/50 max-h-[85vh] flex flex-col animate-modal-enter"
        style={{ fontFamily: 'var(--font-serif-cn)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 pt-5 pb-3 flex items-center gap-3 shrink-0">
          <span className="text-[15px] text-stone-200 font-medium tracking-wide">{obsName}</span>
        </div>

        {/* 观察文本 — 打字机效果 */}
        <div className="px-6 py-4 overflow-y-auto flex-1 scrollbar-thin">
          <ObservationText text={fullText} />
        </div>

        {/* V1.1: 因果标注 */}
        {consequenceHint && (
          <div className="px-6 pb-2 shrink-0">
            <p className="text-xs text-amber-600/70 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
              （{consequenceHint}）
            </p>
          </div>
        )}

        {/* 分割线 */}
        <div className="px-6 shrink-0">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={closeObservation}
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            {t('observe.close')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-stone-600">{t('observe.materialHint')}</span>
            <button
              onClick={() => { audio.play('observe'); confirmObservation() }}
              className="px-4 py-2 bg-amber-900/20 border border-amber-700/40 text-amber-400 hover:bg-amber-900/40 transition-all text-sm rounded-sm"
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
        className="text-stone-300 leading-[1.9] text-sm break-words"
        style={{ fontFamily: 'var(--font-serif-cn)' }}
      >
        {displayed}
        {!isComplete && <span className="cursor-blink" />}
      </p>
    </div>
  )
}

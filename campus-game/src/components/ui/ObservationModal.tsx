import { useTypewriter } from '../../hooks/useTypewriter'
import { useGameStore } from '../../store/gameStore'

export function ObservationModal() {
  const { modalObservationId, closeObservation, confirmObservation } = useGameStore()

  if (!modalObservationId) return null

  const dayScene = useGameStore.getState().getDayScene()
  if (!dayScene) return null

  const obs = dayScene.observations.find(o => o.id === modalObservationId)
  if (!obs) return null

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
          <span className="text-amber-600 text-lg">👁</span>
          <span className="text-xs text-stone-500 uppercase tracking-wider">观察</span>
          <span className="text-xs text-stone-600">·</span>
          <span className="text-sm text-stone-300 font-semibold">{obs.name}</span>
        </div>

        {/* 观察文本 — 打字机效果 */}
        <div className="px-6 py-4">
          <ObservationText text={obs.observationText} />
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
            暂时放过
          </button>
          <button
            onClick={confirmObservation}
            className="px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-400 hover:bg-amber-900/50 transition-all text-sm rounded"
          >
            加入笔记本
          </button>
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

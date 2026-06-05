import { useGameStore } from '../../store/gameStore'
import { DialogBox } from './DialogBox'
import type { NightScene } from '../../types/game'
import { scenes } from '../../data/chapters'

export function SceneView() {
  const { getCurrentScene, currentLine, advanceLine, isExploring } = useGameStore()
  const scene = getCurrentScene()
  const line = currentLine()

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-stone-500 text-lg">章节结束</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col scene-fade-in" key={scene.id}>
      {/* 场景信息栏 */}
      <div className="px-6 py-3 border-b border-stone-800/50 flex items-center gap-3">
        <span className="text-sm">{scene.mode === 'day' ? '☀' : '🌙'}</span>
        <span className="text-sm text-stone-400">{scene.location}</span>
        {'timeOfDay' in scene && scene.timeOfDay && (
          <span className="text-xs text-stone-600">· {scene.timeOfDay}</span>
        )}
      </div>

      {scene.mode === 'day' ? (
        <DaySceneView line={line} onAdvance={advanceLine} isExploring={isExploring} />
      ) : (
        <NightSceneView onAdvance={advanceLine} />
      )}
    </div>
  )
}

// ── 白天场景：固定叙事 + 观察点 ──
function DaySceneView({
  line,
  onAdvance,
  isExploring,
}: {
  line: { type: string; text: string; speaker?: string } | null
  onAdvance: () => void
  isExploring: boolean
}) {
  const { observedIds, currentLineIndex } = useGameStore()
  const dayScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'day' ? scene : null
  })

  if (!dayScene) return null

  const introLength = (dayScene.intro || []).length
  const totalObservations = dayScene.observations.length
  const observedCount = observedIds.length
  const introDone = currentLineIndex >= introLength - 1

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {/* 固定叙事 */}
        {line && (
          <div className="max-w-2xl mx-auto scene-fade-in">
            <DialogBox line={line} onAdvance={onAdvance} />
          </div>
        )}

        {/* 观察面板：intro 播完且处于探索模式时显示 */}
        {isExploring && introDone && (
          <div className="max-w-2xl mx-auto mt-8 scene-fade-in">
            <div className="text-center mb-8">
              <p className="text-amber-500/80 text-sm mb-2">观察模式</p>
              <p className="text-stone-500 text-xs">
                点击下方你感兴趣的对象进行观察
                {observedCount > 0 && ` · 已观察 ${observedCount}/${totalObservations}`}
              </p>
            </div>

            {/* 观察点列表 */}
            <div className="space-y-2">
              {dayScene.observations.map(obs => {
                const isObserved = observedIds.includes(obs.id)
                const isLocked = !!(obs.requires && !observedIds.includes(obs.requires))

                return (
                  <button
                    key={obs.id}
                    disabled={isLocked}
                    onClick={() => useGameStore.getState().observe(obs.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg border transition-all duration-300
                      ${isLocked
                        ? 'border-stone-800 text-stone-700 cursor-not-allowed opacity-40'
                        : isObserved
                          ? 'border-amber-800/50 bg-amber-900/10 text-stone-300'
                          : 'border-stone-700 hover:border-amber-700 hover:bg-stone-800/50 text-stone-300 hover:text-stone-100 cursor-pointer'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        {isObserved ? '✓' : isLocked ? '🔒' : '👁'}
                      </span>
                      <span className="text-sm font-medium">{obs.name}</span>
                      {!isObserved && !isLocked && (
                        <span className="text-xs text-stone-600 ml-auto">观察</span>
                      )}
                      {isObserved && (
                        <span className="text-xs text-amber-600 ml-auto">已记录</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 ml-8">{obs.description}</p>
                  </button>
                )
              })}
            </div>

            {/* 观察完毕按钮 */}
            {observedCount > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => useGameStore.getState().finishExploring()}
                  className="px-6 py-2.5 border border-amber-700 text-amber-400 hover:bg-amber-900/20 transition-all text-sm rounded"
                >
                  结束观察，继续 →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── 夜晚场景：固定叙事 + 写作阶段 ──
function NightSceneView({ onAdvance }: { onAdvance: () => void }) {
  const { currentLineIndex } = useGameStore()
  const nightScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'night' ? scene : null
  })

  if (!nightScene) return null

  const hasReachedWritingPhase = !!(
    nightScene.writingPhase && currentLineIndex >= nightScene.lines.length - 1
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 固定叙事 */}
          {nightScene.lines.map((l, i) => {
            if (i > currentLineIndex && !hasReachedWritingPhase) return null
            return i === currentLineIndex && !hasReachedWritingPhase ? (
              <div key={i} className="scene-fade-in">
                <DialogBox line={l} onAdvance={onAdvance} />
              </div>
            ) : (
              <div key={i} className="pl-4 border-l-2 border-transparent opacity-40">
                <span className="text-sm text-stone-500 leading-relaxed">
                  {l.type === 'dialogue' && l.speaker && (
                    <span className="mr-1">
                      {l.speaker === 'robert' ? '我：' :
                       l.speaker === 'ludwig' ? '王：' :
                       l.speaker === 'maya' ? '兰：' : ''}
                    </span>
                  )}
                  {l.text.slice(0, 80)}{l.text.length > 80 ? '…' : ''}
                </span>
              </div>
            )
          })}

          {/* 写作阶段 */}
          {hasReachedWritingPhase && nightScene.writingPhase && (
            <WritingPhase nightScene={nightScene} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── 写作阶段组件 ──
function WritingPhase({ nightScene }: { nightScene: NightScene }) {
  const { selectedEntryIds, notebook, writings, toggleEntrySelection, submitWriting } = useGameStore()
  const wp = nightScene.writingPhase!
  const lastWriting = writings[writings.length - 1]
  const hasWritten = writings.length > 0 && !!lastWriting

  if (hasWritten) {
    return (
      <div className="scene-fade-in space-y-4">
        <div className="text-center mb-6">
          <p className="text-xs text-stone-600">你的写作</p>
        </div>
        <div
          className="notebook-paper rounded-lg px-6 py-4 text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-serif-cn)' }}
        >
          {lastWriting}
        </div>
        {nightScene.nextSceneId && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const nextId = nightScene.nextSceneId
                if (nextId) {
                  const nextScene = scenes[nextId]
                  useGameStore.setState({
                    currentSceneId: nextId,
                    currentLineIndex: 0,
                    isExploring: nextScene?.mode === 'day',
                    observedIds: [],
                    selectedEntryIds: [],
                  })
                }
              }}
              className="px-6 py-2.5 border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-all text-sm rounded"
            >
              下一天 →
            </button>
          </div>
        )}
        {!nightScene.nextSceneId && (
          <div className="text-center mt-8">
            <p className="text-xs text-stone-600">Demo 结束</p>
            <p className="text-xs text-stone-700 mt-1">感谢试玩</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="scene-fade-in space-y-6">
      <div className="text-center">
        <p className="text-amber-500/80 text-sm mb-1">✎ 写作时间</p>
        <p className="text-stone-400 text-sm">{wp.prompt}</p>
      </div>

      {/* 可选素材列表 */}
      <div>
        <h3 className="text-xs text-stone-600 uppercase tracking-wider mb-3">
          笔记本素材
        </h3>
        <div className="space-y-1.5">
          {notebook.map(entry => (
            <button
              key={entry.id}
              onClick={() => toggleEntrySelection(entry.id)}
              className={`
                w-full text-left px-3 py-2 rounded border text-sm transition-all
                ${selectedEntryIds.includes(entry.id)
                  ? 'border-amber-600 bg-amber-900/20 text-amber-200'
                  : 'border-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-300'
                }
              `}
            >
              <span className="mr-2">{selectedEntryIds.includes(entry.id) ? '■' : '□'}</span>
              <span className="font-medium">{entry.label}</span>
              <span className="text-xs text-stone-600 ml-2">· {entry.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 提交写作 */}
      <div className="text-center">
        <button
          onClick={submitWriting}
          className="px-6 py-2.5 border border-amber-700 text-amber-400 hover:bg-amber-900/20 transition-all text-sm rounded"
        >
          写成文字 ({selectedEntryIds.length} 项素材)
        </button>
      </div>
    </div>
  )
}

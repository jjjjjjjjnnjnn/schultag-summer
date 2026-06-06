import { useEffect, useRef, useMemo, useState } from 'react'
import { useGameStore, getVisibleLines } from '../../store/gameStore'
import { DialogBox } from './DialogBox'
import { ObservationModal } from './ObservationModal'
import { FocusSelector } from './FocusSelector'
import type { NightScene, SceneLayout } from '../../types/game'

const SCENE_BG: Record<string, string> = {
  'prologue-day': 'scene-bg-prologue-day',
  'prologue-night': 'scene-bg-prologue-night',
  'ch01-day': 'scene-bg-ch01-day',
  'ch02-day': 'scene-bg-ch02-day',
  'ch03-day': 'scene-bg-ch03-day',
  'ch04-day': 'scene-bg-ch04-day',
}

const ENV_LAYER: Record<string, string> = {
  'prologue-day': 'env-light-warm',
  'prologue-night': 'env-light-cool',
  'ch01-day': 'env-light-warm',
  'ch02-day': 'env-light-warm',
  'ch03-day': 'env-light-warm',
  'ch04-day': 'env-light-screen',
}

export function SceneView() {
  const { getCurrentScene, currentLine, advanceLine, isExploring, goToNextScene } = useGameStore()
  const scene = getCurrentScene()
  const line = currentLine()
  const prevSceneId = useRef<string | null>(null)
  const [showTitleCard, setShowTitleCard] = useState(false)
  const titleCardTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 用 ref 稳定 goToNextScene 引用
  const goToNextRef = useRef(goToNextScene)
  goToNextRef.current = goToNextScene

  // 自动转场
  useEffect(() => {
    if (!scene || isExploring || line !== null) return
    const nextId = 'nextSceneId' in scene ? scene.nextSceneId : undefined
    if (!nextId) return
    const t = setTimeout(() => goToNextRef.current(), 50)
    return () => clearTimeout(t)
  }, [scene, line, isExploring])

  // 标题卡：场景切换时显示，2.2秒后隐藏
  useEffect(() => {
    if (!scene) return
    if (prevSceneId.current === scene.id) return
    prevSceneId.current = scene.id
    setShowTitleCard(true)
    if (titleCardTimer.current) clearTimeout(titleCardTimer.current)
    titleCardTimer.current = setTimeout(() => setShowTitleCard(false), 3000)
    return () => {
      if (titleCardTimer.current) clearTimeout(titleCardTimer.current)
    }
  }, [scene?.id])

  if (!scene) {
    return (
      <div className="flex-1 flex items-center justify-center scene-fade-in">
        <div className="text-center">
          <p className="text-stone-400 text-lg" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            第一卷 完
          </p>
          <p className="text-stone-600 text-xs mt-2">异乡校园 · 夏天</p>
        </div>
      </div>
    )
  }

  const bgClass = SCENE_BG[scene.id] || 'scene-bg-default'
  const envClass = ENV_LAYER[scene.id] || ''

  return (
    <div className={`flex-1 flex flex-col relative ${bgClass}`}>
      {/* 环境层 */}
      {envClass && <div className={`env-layer ${envClass}`} />}

      {/* 标题卡 */}
      {showTitleCard && 'titleCard' in scene && scene.titleCard && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="text-center title-card">
            <p className="text-stone-400 text-sm tracking-widest">{scene.titleCard.day}</p>
            <p className="text-stone-300 text-lg mt-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
              {scene.location}
            </p>
            <p className="text-stone-600 text-xs mt-1">{scene.titleCard.time}</p>
          </div>
        </div>
      )}

      {/* 观察弹窗 */}
      <ObservationModal />

      {/* 场景信息栏（标题卡期间隐藏） */}
      {!showTitleCard && (
      <div className="px-6 py-3 border-b border-stone-800/50 flex items-center gap-3 relative z-10">
        <span className="text-sm">{scene.mode === 'day' ? '☀' : '🌙'}</span>
        <span className="text-sm text-stone-400">{scene.location}</span>
        {'timeOfDay' in scene && scene.timeOfDay && (
          <span className="text-xs text-stone-600">· {scene.timeOfDay}</span>
        )}
      </div>
      )}

      {scene.mode === 'day' ? (
        <DaySceneView line={line} onAdvance={advanceLine} isExploring={isExploring} />
      ) : (
        <NightSceneView onAdvance={advanceLine} />
      )}
    </div>
  )
}

// ── 场景骨架：渲染空间布局参考线 ──
function SceneSkeleton({ layout }: { layout: SceneLayout }) {
  return (
    <>
      {layout.elements.map((el, i) => (
        <div
          key={i}
          className={`pointer-events-none ${el.className || ''}`}
          style={el.style}
        >
          {el.label && (
            <span
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-stone-600 whitespace-nowrap select-none"
              style={{ fontFamily: 'var(--font-sans-cn)' }}
            >
              {el.label}
            </span>
          )}
        </div>
      ))}
    </>
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
  const { observedIds, currentLineIndex, feedback, writingTags, imprints, currentFocus, attentionRemaining, selectFocus, focusHistory, exposure, focusPulseColor, allNotebookEntries } = useGameStore()
  const dayScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'day' ? scene : null
  })

  if (!dayScene) return null

  const intro = dayScene.intro || []
  const visibleIntroLength = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure).length
  const totalObservations = dayScene.observations.length
  const observedCount = observedIds.length
  const introDone = currentLineIndex >= visibleIntroLength - 1

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {/* 固定叙事 */}
        {line && (
          <div className="max-w-2xl mx-auto scene-fade-in">
            <DialogBox line={line} onAdvance={onAdvance} />
          </div>
        )}

        {/* 焦点选择：intro 播完后、观察前 */}
        {isExploring && introDone && !currentFocus && (
          <FocusSelector onSelect={selectFocus} budget={dayScene.attentionBudget ?? 3} />
        )}

        {/* 观察面板：intro 播完且选了焦点后显示 */}
        {isExploring && introDone && currentFocus && (
          <div className="max-w-2xl mx-auto mt-8 scene-fade-in">
            <div className="text-center mb-8">
              <p className="text-amber-500/80 text-sm mb-2">你看到了什么？</p>
              {/* 注意力指示器 */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {Array.from({ length: dayScene.attentionBudget ?? 3 }).map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < attentionRemaining
                      ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                      : 'bg-stone-700'
                  }`} />
                ))}
                <span className="text-xs text-stone-600 ml-1">注意力</span>
              </div>
              <p className="text-stone-500 text-xs">
                {dayScene.observations.some(o => o.position)
                  ? '点击场景中你感兴趣的对象'
                  : '点击下方你感兴趣的对象进行观察'}
                {observedCount > 0 && ` · 已观察 ${observedCount}/${totalObservations}`}
              </p>
            </div>

            {/* 热点模式：有 position 的观察点 */}
            {dayScene.observations.some(o => o.position) ? (
              <div className={`relative w-full aspect-[16/9] rounded-lg border border-stone-700/30 overflow-hidden ${
                dayScene.sceneLayout ? 'bg-stone-900/40' : 'bg-stone-800/30'
              } ${focusPulseColor ? `animate-focus-pulse-${focusPulseColor}` : ''}`}>
                {/* 场景骨架 */}
                {dayScene.sceneLayout && <SceneSkeleton layout={dayScene.sceneLayout} />}
                {dayScene.observations.map(obs => {
                  if (!obs.position) return null
                  const isObserved = observedIds.includes(obs.id)
                  const isLocked = !!(obs.requires && !observedIds.includes(obs.requires))
                  const cost = (currentFocus && obs.focusGroup === currentFocus) ? 1 : 2
                  const tooExpensive = attentionRemaining < cost
                  const isFocused = currentFocus === obs.focusGroup
                  const isDisabled = isLocked || tooExpensive
                  return (
                    <button
                      key={obs.id}
                      disabled={isDisabled}
                      onClick={() => useGameStore.getState().openObservation(obs.id)}
                      className={`absolute w-5 h-5 rounded-full transition-all duration-300 -translate-x-1/2 -translate-y-1/2
                        ${isDisabled
                          ? 'bg-stone-700 cursor-not-allowed opacity-30'
                          : isObserved
                            ? 'bg-amber-500/60 shadow-[0_0_8px_rgba(217,119,6,0.4)]'
                            : isFocused
                              ? 'bg-amber-300/90 shadow-[0_0_14px_rgba(251,191,36,0.5)] hover:scale-150 cursor-pointer animate-pulse'
                              : 'bg-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.3)] hover:scale-150 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer'
                        }
                      `}
                      style={{ left: `${obs.position.x}%`, top: `${obs.position.y}%` }}
                      title={`${obs.name}（消耗 ${cost} 注意力）`}
                    />
                  )
                })}
                {/* 热点名称提示 */}
                {dayScene.observations.filter(o => o.position && !observedIds.includes(o.id)).length > 0 && (
                  <div className="absolute bottom-2 left-2 text-xs text-stone-500">
                    {dayScene.observations.filter(o => o.position && !observedIds.includes(o.id)).length} 个可观察对象
                  </div>
                )}
              </div>
            ) : (
              /* 列表模式：无 position 的观察点 */
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {dayScene.observations.map(obs => {
                const isObserved = observedIds.includes(obs.id)
                const isLocked = !!(obs.requires && !observedIds.includes(obs.requires))
                const cost = (currentFocus && obs.focusGroup === currentFocus) ? 1 : 2
                const tooExpensive = attentionRemaining < cost
                const isDisabled = isLocked || tooExpensive

                return (
                  <button
                    key={obs.id}
                    disabled={isDisabled}
                    onClick={() => useGameStore.getState().openObservation(obs.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg border transition-all duration-300
                      ${isDisabled
                        ? 'border-stone-800 text-stone-700 cursor-not-allowed opacity-40'
                        : isObserved
                          ? 'border-amber-800/50 bg-amber-900/10 text-stone-300'
                          : 'border-stone-700 hover:border-amber-700 hover:bg-stone-800/50 text-stone-300 hover:text-stone-100 cursor-pointer'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        {isObserved ? '✓' : isLocked ? '🔒' : tooExpensive ? '·' : '👁'}
                      </span>
                      <span className="text-sm font-medium">{obs.name}</span>
                      {!isObserved && !isDisabled && (
                        <span className="text-xs text-stone-600 ml-auto">{cost} 注意力</span>
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
            )}

            {/* 暴露度提示 */}
            {exposure >= 32 && (
              <p className="text-xs text-amber-700 italic text-center mt-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                你开始在意自己观察的方式。
              </p>
            )}
            {exposure >= 16 && exposure < 32 && (
              <p className="text-xs text-stone-600 italic text-center mt-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                你感觉有人在看你。
              </p>
            )}

            {/* 观察完毕按钮 */}
            {observedCount >= 1 && (
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

      {/* 观察成功反馈 */}
      {feedback.visible && (
        <div className="absolute top-16 right-6 z-20 scene-fade-in">
          <div className="bg-amber-900/30 border border-amber-700/50 text-amber-300 px-4 py-2 rounded-lg text-sm shadow-lg whitespace-pre-line">
            {feedback.text}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 夜晚场景：固定叙事 + 写作阶段 ──
function NightSceneView({ onAdvance }: { onAdvance: () => void }) {
  const { currentLineIndex, isWritingPhaseReady, writingTags, imprints, focusHistory, allNotebookEntries, exposure } = useGameStore()
  const nightScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'night' ? scene : null
  })
  const filteredLines = useMemo(() => {
    if (!nightScene) return []
    return getVisibleLines(nightScene.lines, writingTags, imprints, focusHistory, allNotebookEntries, exposure)
  }, [nightScene, writingTags, imprints])

  if (!nightScene) return null

  const showWritingPhase = isWritingPhaseReady && !!nightScene.writingPhase
  const isEnding = currentLineIndex >= filteredLines.length && !nightScene.writingPhase && !nightScene.nextSceneId

  // 卷一结尾：显示"第一卷 完"
  if (isEnding) {
    return (
      <div className="flex-1 flex items-center justify-center scene-fade-in">
        <div className="text-center">
          <p className="text-stone-400 text-lg" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            第一卷 完
          </p>
          <p className="text-stone-600 text-xs mt-2">异乡校园 · 夏天</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 固定叙事 */}
          {filteredLines.map((l, i) => {
            if (i > currentLineIndex && !showWritingPhase) return null
            return i === currentLineIndex && !showWritingPhase ? (
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
          {showWritingPhase && nightScene.writingPhase && (
            <WritingPhase nightScene={nightScene} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── 写作阶段组件 ──
function WritingPhase({ nightScene }: { nightScene: NightScene }) {
  const { selectedEntryIds, notebook, writings, writingFeedback, toggleEntrySelection, submitWriting, currentFocus } = useGameStore()
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

        {/* 叙事反馈 */}
        {writingFeedback && (
          <div className="mt-6 px-4 py-3 border-l-2 border-stone-700 scene-fade-in">
            <p className="text-sm text-stone-400 italic leading-relaxed"
               style={{ fontFamily: 'var(--font-serif-cn)' }}>
              {writingFeedback}
            </p>
          </div>
        )}

        {nightScene.nextSceneId && (
          <div className="text-center mt-8">
            <button
              onClick={() => useGameStore.getState().goToNextScene()}
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
            <button
              onClick={() => useGameStore.getState().resetGame()}
              className="mt-4 px-4 py-2 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-all text-xs rounded"
            >
              返回标题
            </button>
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
              {currentFocus && entry.focusGroup === currentFocus && (
                <span className="w-1.5 h-1.5 rounded-full inline-block ml-2" style={{
                  backgroundColor: entry.focusGroup === 'maya' ? '#8b5cf6' : entry.focusGroup === 'ludwig' ? '#3b82f6' : '#a8a29e'
                }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 提交写作 */}
      <div className="text-center space-y-3">
        <button
          onClick={submitWriting}
          className="px-6 py-2.5 border border-amber-700 text-amber-400 hover:bg-amber-900/20 transition-all text-sm rounded"
        >
          写成文字 ({selectedEntryIds.length} 项素材)
        </button>
        <div>
          <button
            onClick={submitWriting}
            className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
          >
            今晚不写了 →
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useMemo, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getVisibleLines } from '../../store/selectors'
import { useTranslation, useContent } from '../../i18n'
import { DialogBox } from './DialogBox'
import { ObservationModal } from './ObservationModal'
import { FocusSelector } from './FocusSelector'
import { audio } from '../../lib/audio'
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
  const { c, co } = useContent()

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
            {c('ui.volumeComplete', '第一卷 完')}
          </p>
          <p className="text-stone-600 text-xs mt-2">{c('ui.gameTitle', '异乡校园 · 夏天')}</p>
        </div>
      </div>
    )
  }

  const bgClass = SCENE_BG[scene.id] || 'scene-bg-default'
  const envClass = ENV_LAYER[scene.id] || ''
  const sceneCid = scene.cid || ''

  // Translated scene properties
  const sceneLocation = sceneCid ? c(sceneCid + '.location', scene.location) : scene.location
  const sceneTimeOfDay = ('timeOfDay' in scene && scene.timeOfDay)
    ? (sceneCid ? c(sceneCid + '.time', scene.timeOfDay) : scene.timeOfDay)
    : undefined
  const titleCardDay = ('titleCard' in scene && scene.titleCard?.day)
    ? (sceneCid ? co(sceneCid, 'titleCard.day', scene.titleCard.day) : scene.titleCard.day)
    : ''
  const titleCardTime = ('titleCard' in scene && scene.titleCard?.time)
    ? (sceneCid ? co(sceneCid, 'titleCard.time', scene.titleCard.time) : scene.titleCard.time)
    : ''

  return (
    <div className={`flex-1 flex flex-col relative ${bgClass}`}>
      {/* 环境层 */}
      {envClass && <div className={`env-layer ${envClass}`} />}

      {/* 标题卡 */}
      {showTitleCard && 'titleCard' in scene && scene.titleCard && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="text-center title-card">
            <p className="text-stone-400 text-sm tracking-widest">{titleCardDay}</p>
            <p className="text-stone-300 text-lg mt-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
              {sceneLocation}
            </p>
            <p className="text-stone-600 text-xs mt-1">{titleCardTime}</p>
          </div>
        </div>
      )}

      {/* 观察弹窗 */}
      <ObservationModal />

      {/* 场景信息栏（标题卡期间隐藏） */}
      {!showTitleCard && (
      <div className="px-6 py-3 border-b border-stone-800/50 flex items-center gap-3 relative z-10">
        <span className="text-sm">{scene.mode === 'day' ? '☀' : '🌙'}</span>
        <span className="text-sm text-stone-400">{sceneLocation}</span>
        {sceneTimeOfDay && (
          <span className="text-xs text-stone-600">· {sceneTimeOfDay}</span>
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
  const { c } = useContent()
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
              {c('layout.' + el.label, el.label)}
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
  const { observedIds, currentLineIndex, feedback, writingTags, imprints, currentFocus, attentionRemaining, selectFocus, focusHistory, exposure, focusPulseColor, allNotebookEntries, completedMilestones } = useGameStore()
  const t = useTranslation()
  const { c, co } = useContent()
  const dayScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'day' ? scene : null
  })

  if (!dayScene) return null

  const intro = dayScene.intro || []
  const visibleIntroLength = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones).length
  const totalObservations = dayScene.observations.length
  const observedCount = observedIds.length
  const introDone = currentLineIndex >= visibleIntroLength - 1

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 pt-8 pb-24 overflow-y-auto">
        {/* 固定叙事 */}
        {line && (
          <div className="max-w-2xl mx-auto scene-fade-in relative z-10">
            <DialogBox line={line} onAdvance={onAdvance} />
          </div>
        )}

        {/* 焦点选择：intro 播完后、观察前 */}
        {isExploring && introDone && !currentFocus && (
          <>
            {/* 新手引导提示 */}
            {focusHistory.length === 0 && !currentFocus && (
              <div className="mb-4 px-4 py-3 bg-stone-800/30 rounded-lg border border-stone-700/30 max-w-2xl mx-auto">
                <p className="text-xs text-stone-500 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                  {c('tutorial.focusHint', '选择今天更留意谁。这会影响你看到的观察内容。')}
                </p>
              </div>
            )}
            <FocusSelector onSelect={selectFocus} budget={dayScene.attentionBudget ?? 3} focusCosts={dayScene.focusCosts} />
          </>
        )}

        {/* 观察面板：intro 播完且选了焦点后显示 */}
        {isExploring && introDone && currentFocus && (
          <div className="max-w-2xl mx-auto mt-8 scene-fade-in">
            <div className="text-center mb-8">
              <p className="text-amber-500/80 text-sm mb-2">{t('observe.title')}</p>
              {/* 注意力指示器 */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {Array.from({ length: dayScene.attentionBudget ?? 3 }).map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i < attentionRemaining
                      ? 'bg-amber-400'
                      : 'bg-stone-700'
                  }`} />
                ))}
                <span className="text-xs text-stone-600 ml-1">{t('observe.attention')}</span>
              </div>
              <p className="text-stone-500 text-xs">
                {dayScene.observations.some(o => o.position)
                  ? c('ui.clickHotspot', '点击场景中你感兴趣的对象')
                  : c('ui.clickToObserve', '点击下方你感兴趣的对象进行观察')}
                {observedCount > 0 && ` · ${c('ui.observed', '已观察')} ${observedCount}/${totalObservations}`}
              </p>
              {/* 第一次观察引导 */}
              {observedCount === 0 && allNotebookEntries.length === 0 && (
                <div className="mt-3 px-3 py-2 bg-amber-900/10 rounded border border-amber-800/20">
                  <p className="text-xs text-amber-600/80" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                    {c('tutorial.observeHint', '点击场景中的亮点，记录你观察到的事物。')}
                  </p>
                </div>
              )}
            </div>

            {/* 热点模式：有 position 的观察点 */}
            {dayScene.observations.some(o => o.position) ? (
              <div className={`relative w-full aspect-[16/9] rounded-lg border border-stone-700/30 ${
                dayScene.sceneLayout ? 'bg-stone-900/40' : 'bg-stone-800/30'
              } ${focusPulseColor ? `animate-focus-pulse-${focusPulseColor}` : ''}`}>
                {/* 场景骨架 */}
                {dayScene.sceneLayout && <SceneSkeleton layout={dayScene.sceneLayout} />}
                {dayScene.observations.map(obs => {
                  if (!obs.position) return null
                  const isObserved = observedIds.includes(obs.id)
                  const isLocked = !!(obs.requires && !observedIds.includes(obs.requires))
                  const cost = dayScene.focusCosts && currentFocus && obs.focusGroup === currentFocus
                    ? dayScene.focusCosts[obs.focusGroup]
                    : 2
                  const tooExpensive = attentionRemaining < cost
                  const isFocused = currentFocus === obs.focusGroup
                  const isDisabled = isLocked || tooExpensive
                  return (
                    <button
                      key={obs.id}
                      disabled={isDisabled}
                      onClick={() => useGameStore.getState().openObservation(obs.id)}
                      className={`absolute w-4 h-4 rounded-full transition-all duration-300 -translate-x-1/2 -translate-y-1/2 btn-press
                        ${isDisabled
                          ? 'bg-stone-700 cursor-not-allowed opacity-30'
                          : isObserved
                            ? 'bg-amber-600/30 opacity-60 cursor-default'
                            : isFocused
                              ? 'bg-amber-400/70 hover:scale-125 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)] cursor-pointer'
                              : 'bg-amber-500/50 hover:scale-125 hover:shadow-[0_0_8px_rgba(251,191,36,0.25)] cursor-pointer'
                        }
                      `}
                      style={{ left: `${obs.position.x}%`, top: `${obs.position.y}%` }}
                      title={`${obs.cid ? co(obs.cid, 'name', obs.name) : obs.name}（${t('observe.attention')} ${cost}）`}
                    />
                  )
                })}
                {/* 热点名称提示 */}
                {dayScene.observations.filter(o => o.position && !observedIds.includes(o.id)).length > 0 && (
                  <div className="absolute bottom-2 left-2 text-xs text-stone-500">
                    {dayScene.observations.filter(o => o.position && !observedIds.includes(o.id)).length} {t('observe.remaining')}
                  </div>
                )}
              </div>
            ) : (
              /* 列表模式：无 position 的观察点 */
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {dayScene.observations.map((obs) => {
                const isObserved = observedIds.includes(obs.id)
                const isLocked = !!(obs.requires && !observedIds.includes(obs.requires))
                const cost = dayScene.focusCosts && currentFocus && obs.focusGroup === currentFocus
                  ? dayScene.focusCosts[obs.focusGroup]
                  : 2
                const tooExpensive = attentionRemaining < cost
                const isDisabled = isLocked || tooExpensive
                const focusColor = obs.focusGroup === 'maya' ? '#8b5cf6' : obs.focusGroup === 'ludwig' ? '#3b82f6' : '#a8a29e'

                return (
                  <button
                    key={obs.id}
                    disabled={isDisabled}
                    onClick={() => useGameStore.getState().openObservation(obs.id)}
                    className={`
                      w-full text-left pl-5 pr-4 py-3 rounded-r-lg border transition-all duration-300 btn-press list-item-enter
                      ${isDisabled
                        ? 'border-stone-800 text-stone-700 cursor-not-allowed opacity-40'
                        : isObserved
                          ? 'border-stone-700/30 bg-stone-800/20 text-stone-400'
                          : 'border-stone-700/30 hover:bg-stone-800/40 hover:border-stone-600/30 text-stone-300 hover:text-stone-100 cursor-pointer'
                      }
                    `}
                    style={{ borderLeftWidth: '2px', borderLeftColor: isDisabled ? 'transparent' : focusColor }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        {isObserved ? '✓' : isLocked ? '🔒' : tooExpensive ? '·' : '○'}
                      </span>
                      <span className="text-sm font-medium">{obs.cid ? co(obs.cid, 'name', obs.name) : obs.name}</span>
                      {!isObserved && !isDisabled && (
                        <span className="text-xs text-stone-600 ml-auto">{cost} {t('observe.attention')}</span>
                      )}
                      {isObserved && (
                        <span className="text-xs text-stone-500 ml-auto">{c('ui.observed', '已记录')}</span>
                      )}
                    </div>
                    <p className="text-[13px] text-stone-500 mt-1 ml-8 leading-relaxed">{obs.cid ? co(obs.cid, 'desc', obs.description) : obs.description}</p>
                  </button>
                )
              })}
              </div>
            )}

            {/* 暴露度提示 */}
            {exposure >= 32 && (
              <p className="text-xs text-amber-700 italic text-center mt-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                {t('feedback.watched')}
              </p>
            )}
            {exposure >= 16 && exposure < 32 && (
              <p className="text-xs text-stone-600 italic text-center mt-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                {t('feedback.noticed')}
              </p>
            )}

            {/* 观察完毕按钮 */}
            {observedCount >= 1 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => useGameStore.getState().finishExploring()}
                  className="px-6 py-2.5 border border-amber-700 text-amber-400 hover:bg-amber-900/20 transition-all text-sm rounded btn-press"
                >
                  {t('observe.endExplore')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 观察成功反馈 */}
      {feedback.visible && (
        <div className="absolute top-16 right-6 z-20 scene-fade-in">
          <div className="bg-[#2a2520]/90 border border-stone-700/40 text-stone-300 px-4 py-2 rounded-lg text-sm shadow-lg whitespace-pre-line backdrop-blur-sm">
            {feedback.text}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 夜晚场景：固定叙事 + 写作阶段 ──
function NightSceneView({ onAdvance }: { onAdvance: () => void }) {
  const { currentLineIndex, isWritingPhaseReady, writingTags, imprints, focusHistory, allNotebookEntries, exposure, settings, writings, completedMilestones } = useGameStore()
  const { c } = useContent()
  const isForeignLang = settings.language === 'en' || settings.language === 'de'
  const nightScene = useGameStore(s => {
    const scene = s.getCurrentScene()
    return scene?.mode === 'night' ? scene : null
  })
  const filteredLines = useMemo(() => {
    if (!nightScene) return []
    return getVisibleLines(nightScene.lines, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
  }, [nightScene, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones])

  // Safety: if filteredLines is empty but nightScene has lines, use them directly
  const displayLines = filteredLines.length > 0 ? filteredLines : (nightScene?.lines || [])

  // Safety: ensure currentLineIndex doesn't exceed displayLines range
  const safeLineIndex = Math.min(currentLineIndex, Math.max(displayLines.length - 1, 0))

  // Echo sound: play once when an echo line first appears
  useEffect(() => {
    const currentLine = displayLines[safeLineIndex]
    if (!currentLine) return
    const isEcho = !!(currentLine as any).requiresFocusHistory
    if (isEcho) {
      const lineId = `${nightScene?.id}-${safeLineIndex}`
      const played = useGameStore.getState().playedEchoIds
      if (!played.includes(lineId)) {
        audio.play('echo')
        useGameStore.setState({ playedEchoIds: [...played, lineId] })
      }
    }
  }, [safeLineIndex, displayLines])

  if (!nightScene) return null

  const showWritingPhase = isWritingPhaseReady && !!nightScene.writingPhase
  const isEnding = currentLineIndex >= displayLines.length && !nightScene.writingPhase && !nightScene.nextSceneId

  // 卷一结尾：显示"第一卷 完"
  if (isEnding) {
    return (
      <div className="flex-1 flex items-center justify-center scene-fade-in">
        <div className="text-center">
          <p className="text-stone-400 text-lg" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            {c('ui.volumeComplete', '第一卷 完')}
          </p>
          <p className="text-stone-600 text-xs mt-2">{c('ui.gameTitle', '异乡校园 · 夏天')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 pt-8 pb-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {/* 第一次 Echo 提示 */}
          {safeLineIndex === 0 && displayLines.some(l => l.requiresTag) && writings.length === 1 && (
            <div className="mb-4 px-3 py-2 bg-stone-800/30 rounded border border-stone-700/30">
              <p className="text-xs text-stone-500 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                {c('tutorial.echoHint', '你写下的文字开始影响你看到的现实。注意观察变化。')}
              </p>
            </div>
          )}

          {/* 固定叙事 — 终章时不渲染 */}
          {!isEnding && displayLines.map((l, i) => {
            if (i > safeLineIndex && !showWritingPhase) return null
            return i === safeLineIndex && !showWritingPhase ? (
              <div key={i} className="scene-fade-in">
                <DialogBox line={l} onAdvance={onAdvance} />
              </div>
            ) : (
              <div key={i} className="pl-4 border-l-2 border-transparent opacity-40">
                <span className="text-sm text-stone-500 leading-relaxed">
                  {l.type === 'dialogue' && l.speaker && (
                    <span className="mr-1">
                      {l.speaker === 'robert' ? (isForeignLang ? 'R: ' : '我：') :
                       l.speaker === 'ludwig' ? (isForeignLang ? 'L: ' : '王：') :
                       l.speaker === 'maya' ? (isForeignLang ? 'M: ' : '兰：') : ''}
                    </span>
                  )}
                  {(l.cid ? c(l.cid, l.text) : l.text).slice(0, 80)}{(l.cid ? c(l.cid, l.text) : l.text).length > 80 ? '…' : ''}
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
  const { selectedEntryIds, allNotebookEntries, writings, writingFeedback, toggleEntrySelection, submitWriting, currentFocus, selectedPerspective, togglePerspective } = useGameStore()
  const t = useTranslation()
  const { c, co } = useContent()
  const wp = nightScene.writingPhase!
  const wpCid = wp.cid || ''
  const lastWriting = writings[writings.length - 1]
  const hasWritten = writings.length > 0 && !!lastWriting

  // 只显示当前章节收集的笔记（按日间场景 ID 过滤）
  const currentDaySceneId = nightScene.id.replace('-night', '-day')
  const chapterEntries = allNotebookEntries.filter(e => e.sceneId === currentDaySceneId)

  if (hasWritten) {
    return (
      <div className="scene-fade-in space-y-4">
        <div className="text-center mb-6">
          <p className="text-xs text-stone-600">{t('write.yourWriting')}</p>
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
              className="px-6 py-2.5 border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition-all text-sm rounded btn-press"
            >
              {t('write.nextDay')}
            </button>
          </div>
        )}
        {!nightScene.nextSceneId && (
          <div className="text-center mt-8">
            <p className="text-xs text-stone-600">{t('write.demoEnd')}</p>
            <p className="text-xs text-stone-700 mt-1">{t('write.thanks')}</p>
            <button
              onClick={() => useGameStore.getState().resetGame()}
              className="mt-4 px-4 py-2 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-all text-xs rounded btn-press"
            >
              {t('write.returnTitle')}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="scene-fade-in space-y-6">
      <div className="text-center">
        <p className="text-amber-500/80 text-sm mb-1">✎ {t('write.title')}</p>
        <p className="text-stone-400 text-sm">{wpCid ? c(wpCid + '.prompt', wp.prompt) : wp.prompt}</p>
      </div>

      {/* 第一次写作引导 */}
      {writings.length === 0 && !hasWritten && (
        <div className="px-3 py-2 bg-violet-900/10 rounded border border-violet-800/20">
          <p className="text-xs text-violet-600/80" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            {c('tutorial.writeHint', '选择今天观察到的素材，组合成文字。不同的组合会产生不同的故事。')}
          </p>
        </div>
      )}

      {/* 可选素材列表 */}
      <div>
        <h3 className="text-xs text-stone-600 uppercase tracking-wider mb-3">
          {t('write.materials')}
        </h3>
        <div className="space-y-1.5">
          {chapterEntries.map(entry => (
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
              <span className="font-medium">{entry.cid ? co(entry.cid, 'label', entry.label) : entry.label}</span>
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

      {/* V1.5: 写作视角选择 */}
      <div className="border-t border-stone-800/30 pt-3">
        <p className="text-xs text-stone-600 mb-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {c('write.perspectivePrompt', '你想怎么写？')}
        </p>
        <div className="flex gap-2">
          {(['objective', 'literary', 'analytical', 'projection'] as const).map(p => (
            <button
              key={p}
              onClick={() => togglePerspective(p)}
              className={`px-3 py-1.5 text-xs rounded border transition-all ${
                selectedPerspective === p
                  ? 'border-amber-700 bg-amber-900/20 text-amber-400'
                  : 'border-stone-700 text-stone-500 hover:text-stone-300 hover:border-stone-500'
              }`}
            >
              {t('perspective.' + p)}
            </button>
          ))}
        </div>
      </div>

      {/* 提交写作 */}
      <div className="text-center space-y-3">
        <button
          onClick={() => { audio.play('write'); submitWriting() }}
          className="px-6 py-2.5 border border-amber-700 text-amber-400 hover:bg-amber-900/20 transition-all text-sm rounded btn-press"
        >
          {t('write.submit', { n: selectedEntryIds.length })}
        </button>
        <div>
          <button
            onClick={submitWriting}
            className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
          >
            {t('write.skip')}
          </button>
        </div>
      </div>
    </div>
  )
}

import { create } from 'zustand'
import type { GameState, Scene, DayScene, NightScene, FocusType, WritingPerspective, Settings, SaveData } from '../types/game'
import { scenes, CHAPTERS } from '../data/chapters'
import { characters } from '../data/characters'
import { evaluateAchievements } from '../data/achievements'
import { evaluateConsequences, distributeEffects } from '../lib/consequenceEngine'
import { evaluatePerceptions } from '../lib/perceptionEngine'
import { evaluateEvidence } from '../lib/evidenceEngine'
import { DAILY_OBJECTIVES, CHAPTER_GOALS, MAIN_QUESTS } from '../data/quests'
import { evaluateDailyObjectives, evaluateChapterGoal } from '../lib/questLogic'
import { calculateObservationCost, applyImprint, applyExposure, applyImpression } from '../lib/observationLogic'
import { matchRecipe, generateImprovText, scanImprints } from '../lib/writingLogic'
import { getVisibleLines } from './selectors'
import enContent from '../i18n/content/en'
import deContent from '../i18n/content/de'

const contentLocales: Record<string, Record<string, string>> = { en: enContent, de: deContent }

/** Direct content lookup for store (no React hooks) */
function getC(lang: string, cid: string, fallback: string): string {
  const t = contentLocales[lang]
  return (t && t[cid]) || fallback
}

/** 统一的行可见性过滤（已移至 selectors.ts） */

interface GameStore extends GameState {
  // ── 游戏流程 ──
  startGame: () => void
  advanceLine: () => void
  goToNextScene: () => void
  jumpToChapter: (chapterId: string) => void
  saveGame: () => void
  loadGame: () => boolean
  resetGame: () => void

  // ── 白天：观察系统 ──
  selectFocus: (focus: FocusType) => void
  openObservation: (observationId: string) => void
  closeObservation: () => void
  confirmObservation: () => void
  finishExploring: () => void

  // ── 夜晚：写作系统 ──
  toggleEntrySelection: (entryId: string) => void
  togglePerspective: (p: WritingPerspective) => void
  submitWriting: () => void

  // ── 成就系统 ──
  unlockAchievement: (id: string) => void

  // ── 设置系统 ──
  updateSettings: (patch: Partial<Settings>) => void

  // ── 查询 ──
  getCurrentScene: () => Scene | null
  getDayScene: () => DayScene | null
  getNightScene: () => NightScene | null
  currentLine: () => { type: string; text: string; speaker?: string } | null
  getFilteredLines: () => { type: string; text: string; speaker?: string; requiresTag?: string }[]
}

// NOTE: SAVE_KEY remains 'schultag-save-v2' for backward compatibility with old saves,
// even though the save data format has been updated to version 3.
const SAVE_KEY = 'schultag-save-v2'
const SETTINGS_KEY = 'schultag-settings'

const defaultSettings: Settings = { textSpeed: 'normal', fontSize: 'medium', language: 'zh', soundEnabled: true, reducedMotion: false }

function loadSettingsFromStorage(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch { /* corrupted */ }
  return defaultSettings
}

const initialState: GameState = {
  currentSceneId: 'prologue-day',
  currentLineIndex: 0,
  observedIds: [],
  isExploring: true,
  modalObservationId: null,
  feedback: { text: '', visible: false },
  selectedEntryIds: [],
  notebook: [],  // legacy field, kept for old saves
  allNotebookEntries: [],
  writings: [],
  writingTags: [],
  flags: {},
  impressions: { ludwig: 0, maya: 0 },
  imprints: {
    ludwig: { characterId: 'ludwig', observationCount: 0, writingCount: 0 },
    maya: { characterId: 'maya', observationCount: 0, writingCount: 0 },
  },
  isWritingPhaseReady: false,
  selectedPerspective: 'objective',
  writingFeedback: '',
  exposure: 0,
  attentionRemaining: 3,
  currentFocus: null,
  previousFocus: null,
  focusHistory: [],
  focusPulseColor: null,
  isTransitioning: false,
  transitionText: '',
  unlockedAchievements: [],
  completedChapters: [],
  settings: loadSettingsFromStorage(),
  isPlaying: false,
  playedEchoIds: [],
  playTimeMs: 0,
  gameStartTime: Date.now(),
  behaviorStates: {},
  activatedConsequences: [],
  perceptions: [],
  perceptionHistory: [],
  observationGeneration: 0,
  completedMilestones: [],
  completedDailyObjectives: [],
  unlockedChapterRewards: [],
  evidence: [],
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // ══════════════════════════════════════
  // 游戏流程
  // ══════════════════════════════════════

  startGame: () => {
    set({ ...initialState, settings: loadSettingsFromStorage(), isPlaying: true })
  },

  selectFocus: (focus: FocusType) => {
    const scene = get().getCurrentScene()
    const budget = scene?.mode === 'day' ? ((scene as DayScene).attentionBudget ?? 3) : 3
    set({
      currentFocus: focus,
      focusHistory: [...get().focusHistory, focus],
      attentionRemaining: budget,
      isExploring: true,
    })
  },

  advanceLine: () => {
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return

    // 白天场景
    if (scene.mode === 'day') {
      const dayScene = scene as DayScene

      // intro 播完且正在探索 → 停住（等待观察面板）
      if (isExploring) {
        const intro = dayScene.intro || []
        const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
        if (currentLineIndex >= visibleIntro.length - 1) return
        set({ currentLineIndex: currentLineIndex + 1 })
        return
      }

      // 非探索阶段：推进 index
      const nextIndex = currentLineIndex + 1
      const filteredLines = get().getFilteredLines()

      if (nextIndex >= filteredLines.length) {
        // outro 播完 → 直接转场（在同一事件处理器内完成）
        if (dayScene.nextSceneId) {
          const nextScene = scenes[dayScene.nextSceneId]
          set({
            currentSceneId: dayScene.nextSceneId,
            currentLineIndex: 0,
            isExploring: nextScene?.mode === 'day',
            observedIds: [],
            selectedEntryIds: [],
            isWritingPhaseReady: false,
            writingFeedback: '',
          })
        }
      } else {
        set({ currentLineIndex: nextIndex })
      }
      return
    }

    // 夜晚场景
    if (scene.mode === 'night') {
      const nightScene = scene as NightScene
      const filteredLines = get().getFilteredLines()

      // 到达最后一行且有写作阶段 → 标记就绪，由 WritingPhase 接管
      if (nightScene.writingPhase && currentLineIndex >= filteredLines.length - 1) {
        set({ isWritingPhaseReady: true })
        return
      }

      // 已经超出范围 → 停止推进（防止卡死）
      if (currentLineIndex >= filteredLines.length) {
        return
      }

      // 正常推进
      set({ currentLineIndex: currentLineIndex + 1 })
    }
  },

  goToNextScene: () => {
    const { currentSceneId, currentFocus, completedChapters } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return

    // 记录已完成的章节
    const sceneChapterId = currentSceneId.replace(/-day|-night/, '')
    const newCompleted = completedChapters.includes(sceneChapterId)
      ? completedChapters
      : [...completedChapters, sceneChapterId]

    const nextId = 'nextSceneId' in scene ? scene.nextSceneId : undefined
    if (!nextId) return
    const nextScene = scenes[nextId]
    const isNextDay = nextScene?.mode === 'day'
    const nextBudget = isNextDay && nextScene.mode === 'day'
      ? ((nextScene as DayScene).attentionBudget ?? 3)
      : 3

    // V1.2: 计算认知快照（在 set 之前，使用当前场景状态）
    const newPerceptions = evaluatePerceptions(get())
    const perceptionSnapshot = {
      chapterId: sceneChapterId,
      perceptions: newPerceptions,
    }

    set({
      currentSceneId: nextId,
      currentLineIndex: 0,
      isExploring: isNextDay,
      observedIds: [],
      selectedEntryIds: [],
      writings: [],
      isWritingPhaseReady: false,
      writingFeedback: '',
      previousFocus: currentFocus,
      currentFocus: null,
      attentionRemaining: nextBudget,
      focusPulseColor: null,
      isTransitioning: false,
      transitionText: '',
      completedChapters: newCompleted,
      perceptions: newPerceptions,
      perceptionHistory: [...get().perceptionHistory, perceptionSnapshot],
    })

    // 检查章节目标
    const chapterGoal = CHAPTER_GOALS.find(g => g.chapterId === sceneChapterId)
    if (chapterGoal) {
      const goalMet = evaluateChapterGoal(
        chapterGoal,
        get().allNotebookEntries,
        get().writings,
        get().focusHistory,
        sceneChapterId,
      )
      if (goalMet && !get().unlockedChapterRewards.includes(chapterGoal.reward.value)) {
        const newRewards = [...get().unlockedChapterRewards, chapterGoal.reward.value]
        const newWritingTags = [...get().writingTags]
        if (!newWritingTags.includes(chapterGoal.reward.value)) {
          newWritingTags.push(chapterGoal.reward.value)
        }
        set({
          unlockedChapterRewards: newRewards,
          writingTags: newWritingTags,
        })
      }
    }

    // 检查主线里程碑
    const allCompleted = [...get().completedChapters, sceneChapterId]
    for (const milestone of MAIN_QUESTS) {
      if (!get().completedMilestones.includes(milestone.id)) {
        const allMet = milestone.requiresChapters.every(c => allCompleted.includes(c))
        if (allMet) {
          const newMilestones = [...get().completedMilestones, milestone.id]
          const newWritingTags = [...get().writingTags]

          // 处理奖励
          if (milestone.reward.type === 'writingTag') {
            if (!newWritingTags.includes(milestone.reward.value)) {
              newWritingTags.push(milestone.reward.value)
            }
          }

          set({
            completedMilestones: newMilestones,
            writingTags: newWritingTags,
          })
        }
      }
    }

    // V1.4: 证据检查
    const newEvidence = evaluateEvidence(get())
    if (newEvidence.length > 0) {
      set({ evidence: [...get().evidence, ...newEvidence] })
    }

    // 成就检查
    const newAchievements = evaluateAchievements(get())
    newAchievements.forEach(id => get().unlockAchievement(id))
  },

  jumpToChapter: (chapterId: string) => {
    const chapter = CHAPTERS.find(c => c.id === chapterId)
    if (!chapter) return
    const nextScene = scenes[chapter.startSceneId]
    const isDay = nextScene?.mode === 'day'
    const budget = isDay && nextScene.mode === 'day'
      ? ((nextScene as DayScene).attentionBudget ?? 3)
      : 3
    set({
      currentSceneId: chapter.startSceneId,
      currentLineIndex: 0,
      isExploring: isDay,
      observedIds: [],
      selectedEntryIds: [],
      writings: [],
      writingTags: [],
      isWritingPhaseReady: false,
      writingFeedback: '',
      currentFocus: null,
      focusHistory: [],
      previousFocus: null,
      attentionRemaining: budget,
      focusPulseColor: null,
      isPlaying: true,
      behaviorStates: {},
      activatedConsequences: [],
      perceptions: [],
      perceptionHistory: [],
      evidence: [],
    })
  },

  unlockAchievement: (id: string) => {
    const { unlockedAchievements } = get()
    if (unlockedAchievements.includes(id)) return
    const updated = [...unlockedAchievements, id]
    set({ unlockedAchievements: updated })
    localStorage.setItem('schultag-achievements', JSON.stringify(updated))
  },

  updateSettings: (patch: Partial<Settings>) => {
    const newSettings = { ...get().settings, ...patch }
    set({ settings: newSettings })
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings))
  },

  // ══════════════════════════════════════
  // 白天：观察系统
  // ══════════════════════════════════════

  openObservation: (observationId: string) => {
    const { observedIds } = get()
    if (observedIds.includes(observationId)) return
    set({ modalObservationId: observationId })
  },

  closeObservation: () => {
    set({ modalObservationId: null })
  },

  confirmObservation: () => {
    const { modalObservationId, observedIds, allNotebookEntries, impressions, imprints, exposure, currentFocus, attentionRemaining, settings } = get()
    const observationGeneration = get().observationGeneration || 0
    if (!modalObservationId || observedIds.includes(modalObservationId)) return

    const scene = get().getDayScene()
    if (!scene) return

    const obs = scene.observations.find(o => o.id === modalObservationId)
    if (!obs) return

    const lang = settings.language

    // V1.5: 消耗值由 focusCosts 决定（若存在）
    const dayScene = get().getDayScene()
    const focusCosts = dayScene?.focusCosts
    const cost = calculateObservationCost(obs, focusCosts, currentFocus)
    if (attentionRemaining < cost) return

    // 推进人物印象 + 印记
    let newImpressions = { ...impressions }
    let newImprints = { ...imprints }
    if (obs.relationshipEffect) {
      const { characterId } = obs.relationshipEffect
      const char = characters[characterId]
      if (char && char.impressionLevels.length > 0) {
        newImpressions = applyImpression(newImpressions, characterId)
      }
      newImprints = applyImprint(newImprints, characterId)
    }

    // 暴露度：基于侵入度增加
    const invasionGain = obs.invasionLevel || 0
    const newExposure = applyExposure(exposure, invasionGain)

    const entryExists = allNotebookEntries.find(e => e.id === obs.notebookEntry.id)

    const newEntry = entryExists ? null : {
      ...obs.notebookEntry,
      invasionLevel: obs.invasionLevel,
      focusGroup: obs.focusGroup,
      sceneId: get().currentSceneId,
      timestamp: Date.now(),
    }

    // 焦点脉动：焦点匹配时触发视觉反馈
    const isFocusMatch = currentFocus && obs.focusGroup === currentFocus

    // 暴露度反馈
    const entryLabel = obs.notebookEntry.cid ? getC(lang, obs.notebookEntry.cid + '.label', obs.notebookEntry.label) : obs.notebookEntry.label
    const recordedSuffix = getC(lang, 'feedback.recordedSuffix', '已记录')
    let feedbackText = `✓ ${entryLabel} ${recordedSuffix}`
    if (newExposure >= 32) {
      feedbackText += '\n' + getC(lang, 'feedback.watched', '你记录了太多关于她的东西。')
    } else if (newExposure >= 16) {
      feedbackText += '\n' + getC(lang, 'feedback.noticed', '有人开始注意到你了。')
    }

    set({
      observedIds: [...observedIds, modalObservationId],
      allNotebookEntries: newEntry ? [...get().allNotebookEntries, newEntry] : get().allNotebookEntries,
      impressions: newImpressions,
      imprints: newImprints,
      exposure: newExposure,
      attentionRemaining: attentionRemaining - cost,
      modalObservationId: null,
      focusPulseColor: isFocusMatch ? currentFocus : null,
      feedback: { text: feedbackText, visible: true },
      observationGeneration: observationGeneration + 1,
    })

    // 检查每日目标
    const newObservedIds = [...observedIds, modalObservationId]
    const currentObjectives = DAILY_OBJECTIVES.find(d => d.sceneId === get().currentSceneId)
    if (currentObjectives) {
      const justCompleted = evaluateDailyObjectives(
        currentObjectives.objectives,
        newObservedIds,
      )
      if (justCompleted.length > 0) {
        set({
          completedDailyObjectives: [...new Set([...get().completedDailyObjectives, ...justCompleted])],
        })
      }
    }

    // 自动隐藏反馈 + 脉动 1.5 秒后（仅在同一观察确认周期内才清除）
    const currentGen = observationGeneration + 1
    setTimeout(() => {
      if (get().observationGeneration === currentGen) {
        set({ feedback: { text: '', visible: false }, focusPulseColor: null })
      }
    }, 1500)

    // 成就检查
    const newAchievements = evaluateAchievements(get())
    newAchievements.forEach(id => get().unlockAchievement(id))

    // V1.4: 证据检查
    const newEvidence = evaluateEvidence(get())
    if (newEvidence.length > 0) {
      set({ evidence: [...get().evidence, ...newEvidence] })
    }
  },

  finishExploring: () => {
    const { isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones } = get()
    if (!isExploring) return
    const scene = get().getDayScene()
    if (!scene) return
    const intro = scene.intro || []
    const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
    set({
      currentLineIndex: visibleIntro.length,
      isExploring: false,
    })
  },

  // ══════════════════════════════════════
  // 夜晚：写作系统
  // ══════════════════════════════════════

  toggleEntrySelection: (entryId: string) => {
    const { selectedEntryIds } = get()
    if (selectedEntryIds.includes(entryId)) {
      set({ selectedEntryIds: selectedEntryIds.filter(id => id !== entryId) })
    } else {
      set({ selectedEntryIds: [...selectedEntryIds, entryId] })
    }
  },

  togglePerspective: (p: WritingPerspective) => {
    set({ selectedPerspective: p })
  },

  submitWriting: () => {
    const { selectedEntryIds, allNotebookEntries, writings, writingTags, currentSceneId, imprints, exposure, currentFocus, settings, selectedPerspective } = get()
    const scene = scenes[currentSceneId]
    if (!scene || scene.mode !== 'night') return

    const nightScene = scene as NightScene
    if (!nightScene.writingPhase) return

    const lang = settings.language

    const selectedEntries = allNotebookEntries.filter(e => selectedEntryIds.includes(e.id))
    const selectedLabels = selectedEntries.map(e => e.cid ? getC(lang, e.cid + '.label', e.label) : e.label)

    // 检查是否有匹配的配方（焦点专属优先，然后通用）
    const { result } = matchRecipe(
      nightScene.writingPhase.recipes,
      selectedEntryIds,
      currentFocus,
      selectedPerspective,
      getC,
      lang,
    )

    let composedText = result.composedText
    let matchedTag = result.matchedTag

    // 无配方匹配时生成即兴文本
    if (!matchedTag) {
      composedText = generateImprovText(selectedEntries, selectedLabels, selectedEntryIds)
    }

    // 收集印记：扫描写作中提及的角色
    const { newImprints } = scanImprints(composedText, imprints, characters)

    // 生成叙事反馈（基于侵入度）
    let feedback = ''
    const invasionLevel = get().exposure
    if (selectedEntryIds.length === 0) {
      feedback = getC(lang, 'feedback.noWriting', '有些夜晚，笔尖落不下来。')
    } else if (invasionLevel < 16) {
      feedback = getC(lang, 'feedback.writingLow', '你写下这些句子。它们好像停留得比平时更久。')
    } else if (invasionLevel < 32) {
      feedback = getC(lang, 'feedback.writingMid', '你写下这些句子。\n\n突然有种被人看见的感觉。')
    } else {
      feedback = getC(lang, 'feedback.writingHigh', '你写下这些句子。\n\n关掉文档的时候，迟疑了一下。')
    }

    const newTags = matchedTag && !writingTags.includes(matchedTag)
      ? [...writingTags, matchedTag]
      : writingTags

    // 暴露度：基于所选素材的侵入度增加
    const invasionGain = selectedEntries.reduce((sum: number, e: { invasionLevel?: number }) => sum + (e.invasionLevel || 0), 0)
    const newExposure = Math.min(exposure + invasionGain, 100)

    set({
      writings: [...writings, composedText],
      writingTags: newTags,
      imprints: newImprints,
      writingFeedback: feedback,
      exposure: newExposure,
      selectedEntryIds: [],
      selectedPerspective: 'objective',
      isWritingPhaseReady: false,
    })

    // V1.1: 评估后果 — 使用计算出的新状态而非 get() 以避免读取过期状态
    const newWritingTags = matchedTag && !writingTags.includes(matchedTag)
      ? [...writingTags, matchedTag]
      : writingTags
    const stateForConsequences = {
      ...get(),
      writingTags: newWritingTags,
      writings: [...writings, composedText],
    }
    const newEffects = evaluateConsequences(stateForConsequences)
    if (newEffects.length > 0) {
      const distributed = distributeEffects(newEffects)
      const currentStates = get().behaviorStates
      const mergedStates = { ...currentStates }
      for (const [charId, effects] of Object.entries(distributed)) {
        mergedStates[charId] = [...(mergedStates[charId] || []), ...effects]
      }
      set({
        behaviorStates: mergedStates,
        activatedConsequences: [
          ...get().activatedConsequences,
          ...newEffects.map(e => e.id),
        ],
      })
    }

    // 成就检查
    const newAchievements = evaluateAchievements(get())
    newAchievements.forEach(id => get().unlockAchievement(id))
  },

  // ══════════════════════════════════════
  // 查询
  // ══════════════════════════════════════

  getCurrentScene: () => {
    return scenes[get().currentSceneId] || null
  },

  getDayScene: () => {
    const scene = get().getCurrentScene()
    return scene?.mode === 'day' ? scene : null
  },

  getNightScene: () => {
    const scene = get().getCurrentScene()
    return scene?.mode === 'night' ? scene : null
  },

  currentLine: () => {
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return null

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      const intro = dayScene.intro || []
      const outro = dayScene.outro || []
      const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
      const visibleOutro = getVisibleLines(outro, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)

      if (isExploring || currentLineIndex < visibleIntro.length) {
        return visibleIntro[currentLineIndex] || null
      }

      const outroIndex = currentLineIndex - visibleIntro.length
      return visibleOutro[outroIndex] || null
    }

    if (scene.mode === 'night') {
      const nightScene = scene as NightScene
      const filteredLines = getVisibleLines(nightScene.lines, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
      return filteredLines[currentLineIndex] || null
    }

    return null
  },

  /** 返回过滤后的场景行数组（requiresTag + requiresImprint + requiresMilestone） */
  getFilteredLines: () => {
    const { currentSceneId, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return []

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      return [
        ...getVisibleLines(dayScene.intro || [], writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones),
        ...getVisibleLines(dayScene.outro || [], writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones),
      ]
    }
    if (scene.mode === 'night') {
      return getVisibleLines((scene as NightScene).lines, writingTags, imprints, focusHistory, allNotebookEntries, exposure, completedMilestones)
    }
    return []
  },

  // ══════════════════════════════════════
  // 存档
  // ══════════════════════════════════════

  saveGame: () => {
    const state = get()
    const saveData: SaveData = {
      version: 3,
      timestamp: Date.now(),
      playTimeMs: state.playTimeMs + (Date.now() - state.gameStartTime),
      chapterId: state.currentSceneId.replace(/-day|-night/, ''),
      state: {
        currentSceneId: state.currentSceneId,
        currentLineIndex: state.currentLineIndex,
        observedIds: state.observedIds,
        isExploring: state.isExploring,
        selectedEntryIds: state.selectedEntryIds,
        selectedPerspective: state.selectedPerspective,
        allNotebookEntries: state.allNotebookEntries,
        writings: state.writings,
        writingTags: state.writingTags,
        flags: state.flags,
        impressions: state.impressions,
        imprints: state.imprints,
        exposure: state.exposure,
        attentionRemaining: state.attentionRemaining,
        currentFocus: state.currentFocus,
        previousFocus: state.previousFocus,
        focusHistory: state.focusHistory,
        unlockedAchievements: state.unlockedAchievements,
        completedChapters: state.completedChapters,
        completedMilestones: state.completedMilestones,
        completedDailyObjectives: state.completedDailyObjectives,
        unlockedChapterRewards: state.unlockedChapterRewards,
        playedEchoIds: state.playedEchoIds,
        behaviorStates: state.behaviorStates,
        activatedConsequences: state.activatedConsequences,
        perceptions: state.perceptions,
        perceptionHistory: state.perceptionHistory,
        evidence: state.evidence,
      },
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
  },

  loadGame: () => {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    try {
      const save = JSON.parse(raw)
      // v3 格式
      if (save.version === 3) {
        let savedAchievements: string[] = []
        try {
          const raw = localStorage.getItem('schultag-achievements')
          if (raw) {
            savedAchievements = JSON.parse(raw)
          }
        } catch { /* corrupted achievements */ }
        set({
          ...initialState,
          ...save.state,
          unlockedAchievements: savedAchievements.length > 0 ? savedAchievements : (save.state.unlockedAchievements || []),
          completedChapters: save.state.completedChapters || [],
          allNotebookEntries: save.state.allNotebookEntries || [],
          evidence: save.state.evidence || [],
          settings: loadSettingsFromStorage(),
          isPlaying: true,
          playTimeMs: save.playTimeMs || 0,
          gameStartTime: Date.now(),
        })
        return true
      }
      // v2 兼容
      if (save.version === 2) {
        let savedAchievements: string[] = []
        try {
          const raw = localStorage.getItem('schultag-achievements')
          if (raw) {
            savedAchievements = JSON.parse(raw)
          }
        } catch { /* corrupted achievements */ }
        set({
          ...initialState,
          ...save.state,
          unlockedAchievements: savedAchievements.length > 0 ? savedAchievements : (save.state.unlockedAchievements || []),
          completedChapters: save.state.completedChapters || [],
          allNotebookEntries: save.state.allNotebookEntries || [],
          settings: loadSettingsFromStorage(),
          isPlaying: true,
          playTimeMs: 0,
          gameStartTime: Date.now(),
        })
        return true
      }
    } catch { /* corrupted */ }
    return false
  },

  resetGame: () => {
    const currentSettings = get().settings
    set({ ...initialState, settings: currentSettings, isPlaying: false })
  },
}))

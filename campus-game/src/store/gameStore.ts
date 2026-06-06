import { create } from 'zustand'
import type { GameState, Scene, DayScene, NightScene, StoryLine, CharacterImprint, FocusType, Settings } from '../types/game'
import { scenes, CHAPTERS } from '../data/chapters'
import { characters } from '../data/characters'
import { evaluateAchievements } from '../data/achievements'

/** 统一的行可见性过滤：requiresTag + requiresImprint + requiresFocusHistory + requiresObservation + requiresExposure */
export function getVisibleLines(
  lines: StoryLine[],
  writingTags: string[],
  imprints: Record<string, CharacterImprint>,
  focusHistory: FocusType[] = [],
  allNotebookEntries: import('../types/game').NotebookEntry[] = [],
  exposure: number = 0,
): StoryLine[] {
  // 计算连续焦点 streak
  const streakMap: Record<string, number> = {}
  let streak = 0
  let lastFocus: FocusType | null = null
  for (const f of focusHistory) {
    if (f === lastFocus) {
      streak++
    } else {
      streak = 1
      lastFocus = f
    }
    streakMap[f] = Math.max(streakMap[f] || 0, streak)
  }

  return lines.filter(l => {
    if (l.requiresTag && !writingTags.includes(l.requiresTag)) return false
    if (l.requiresImprint) {
      const imprint = imprints[l.requiresImprint.characterId]
      if (!imprint) return false
      const count = l.requiresImprint.type === 'observation'
        ? imprint.observationCount
        : imprint.writingCount
      if (count < l.requiresImprint.threshold) return false
    }
    if (l.requiresFocusHistory) {
      const s = streakMap[l.requiresFocusHistory.characterId] || 0
      if (s < l.requiresFocusHistory.count) return false
    }
    if (l.requiresObservation) {
      if (!allNotebookEntries.some(e => e.id === l.requiresObservation)) return false
    }
    if (l.requiresExposure !== undefined) {
      if (exposure < l.requiresExposure) return false
    }
    return true
  })
}

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

const SAVE_KEY = 'schultag-save-v2'
const SETTINGS_KEY = 'schultag-settings'

const defaultSettings: Settings = { textSpeed: 'normal', fontSize: 'medium' }

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
  notebook: [],
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
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // ══════════════════════════════════════
  // 游戏流程
  // ══════════════════════════════════════

  startGame: () => {
    set({ ...initialState, isPlaying: true })
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
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return

    // 白天场景
    if (scene.mode === 'day') {
      const dayScene = scene as DayScene

      // intro 播完且正在探索 → 停住（等待观察面板）
      if (isExploring) {
        const intro = dayScene.intro || []
        const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure)
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

      // 正常推进（包括无 writingPhase 的场景，如卷一结尾）
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
    set({
      currentSceneId: nextId,
      currentLineIndex: 0,
      isExploring: isNextDay,
      observedIds: [],
      selectedEntryIds: [],
      notebook: isNextDay ? [] : get().notebook,
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
    })

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
      notebook: [],
      writings: [],
      writingTags: [],
      isWritingPhaseReady: false,
      writingFeedback: '',
      currentFocus: null,
      attentionRemaining: budget,
      focusPulseColor: null,
      isPlaying: true,
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
    const { modalObservationId, observedIds, notebook, impressions, imprints, exposure, currentFocus, attentionRemaining } = get()
    if (!modalObservationId || observedIds.includes(modalObservationId)) return

    const scene = get().getDayScene()
    if (!scene) return

    const obs = scene.observations.find(o => o.id === modalObservationId)
    if (!obs) return

    // 注意力消耗：同类 1 点，异类 2 点
    const cost = (currentFocus && obs.focusGroup === currentFocus) ? 1 : 2
    if (attentionRemaining < cost) return

    // 推进人物印象 + 印记
    const newImpressions = { ...impressions }
    const newImprints = { ...imprints }
    if (obs.relationshipEffect) {
      const { characterId } = obs.relationshipEffect
      const char = characters[characterId]
      if (char && char.impressionLevels.length > 0) {
        const current = newImpressions[characterId] || 0
        const maxLevel = char.impressionLevels.length - 1
        newImpressions[characterId] = Math.min(current + 1, maxLevel)
      }
      // 收集印记：观察计数 +1
      if (newImprints[characterId]) {
        newImprints[characterId] = {
          ...newImprints[characterId],
          observationCount: newImprints[characterId].observationCount + 1,
        }
      }
    }

    // 暴露度：基于侵入度增加
    const invasionGain = obs.invasionLevel || 0
    const newExposure = Math.min(exposure + invasionGain, 100)

    const entryExists = notebook.find(e => e.id === obs.notebookEntry.id)

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
    let feedbackText = `✓ ${obs.notebookEntry.label} 已记录`
    if (newExposure >= 32) {
      feedbackText += '\n你记录了太多关于她的东西。'
    } else if (newExposure >= 16) {
      feedbackText += '\n有人开始注意到你了。'
    }

    set({
      observedIds: [...observedIds, modalObservationId],
      notebook: newEntry ? [...notebook, newEntry] : notebook,
      allNotebookEntries: newEntry ? [...get().allNotebookEntries, newEntry] : get().allNotebookEntries,
      impressions: newImpressions,
      imprints: newImprints,
      exposure: newExposure,
      attentionRemaining: attentionRemaining - cost,
      modalObservationId: null,
      focusPulseColor: isFocusMatch ? currentFocus : null,
      feedback: { text: feedbackText, visible: true },
    })

    // 自动隐藏反馈 + 脉动 1.5 秒后
    setTimeout(() => {
      set({ feedback: { text: '', visible: false }, focusPulseColor: null })
    }, 1500)

    // 成就检查
    const newAchievements = evaluateAchievements(get())
    newAchievements.forEach(id => get().unlockAchievement(id))
  },

  finishExploring: () => {
    const { isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure } = get()
    if (!isExploring) return
    const scene = get().getDayScene()
    if (!scene) return
    const intro = scene.intro || []
    const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure)
    set({
      isExploring: false,
      currentLineIndex: visibleIntro.length,
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

  submitWriting: () => {
    const { selectedEntryIds, notebook, writings, writingTags, currentSceneId, imprints, exposure, currentFocus } = get()
    const scene = scenes[currentSceneId]
    if (!scene || scene.mode !== 'night') return

    const nightScene = scene as NightScene
    if (!nightScene.writingPhase) return

    const selectedLabels = notebook
      .filter(e => selectedEntryIds.includes(e.id))
      .map(e => e.label)

    // 检查是否有匹配的配方（焦点专属优先）
    let composedText = nightScene.writingPhase.defaultText
    let matchedTag: string | undefined
    // 先尝试焦点专属配方
    for (const recipe of nightScene.writingPhase.recipes) {
      if (recipe.requiresFocus && recipe.requiresFocus !== currentFocus) continue
      const allMatch = recipe.requiredEntries.every(id => selectedEntryIds.includes(id))
      if (allMatch && recipe.requiredEntries.length <= selectedEntryIds.length) {
        composedText = recipe.composedText
        matchedTag = recipe.influenceTag
        break
      }
    }
    // 若无焦点专属匹配，尝试通用配方
    if (!matchedTag) {
      for (const recipe of nightScene.writingPhase.recipes) {
        if (recipe.requiresFocus) continue
        const allMatch = recipe.requiredEntries.every(id => selectedEntryIds.includes(id))
        if (allMatch && recipe.requiredEntries.length <= selectedEntryIds.length) {
          composedText = recipe.composedText
          matchedTag = recipe.influenceTag
          break
        }
      }
    }

    // 如果只选了一两个，生成简单版
    if (selectedEntryIds.length <= 1 && selectedLabels.length > 0) {
      composedText = `今天记下了：${selectedLabels.join('、')}。`
    }
    if (selectedEntryIds.length === 0) {
      composedText = '今天什么也没写。有些日子就是这样。'
    }

    // 收集印记：扫描写作中提及的角色
    const newImprints = { ...imprints }
    const mentionedChars: string[] = []
    for (const [charId, char] of Object.entries(characters)) {
      if (newImprints[charId] && composedText.includes(char.name)) {
        newImprints[charId] = {
          ...newImprints[charId],
          writingCount: newImprints[charId].writingCount + 1,
        }
        mentionedChars.push(char.name)
      }
    }

    // 生成叙事反馈（基于侵入度）
    let feedback = ''
    const invasionLevel = get().exposure
    if (selectedEntryIds.length === 0) {
      feedback = '有些夜晚，笔尖落不下来。'
    } else if (invasionLevel < 16) {
      feedback = '你写下这些句子。它们好像停留得比平时更久。'
    } else if (invasionLevel < 32) {
      feedback = '你写下这些句子。\n\n突然有种被人看见的感觉。'
    } else {
      feedback = '你写下这些句子。\n\n关掉文档的时候，迟疑了一下。'
    }

    const newTags = matchedTag && !writingTags.includes(matchedTag)
      ? [...writingTags, matchedTag]
      : writingTags

    // 暴露度：基于所选素材的侵入度增加
    const selectedEntries = notebook.filter(e => selectedEntryIds.includes(e.id))
    const invasionGain = selectedEntries.reduce((sum, e) => sum + (e.invasionLevel || 0), 0)
    const newExposure = Math.min(exposure + invasionGain, 100)

    set({
      writings: [...writings, composedText],
      writingTags: newTags,
      imprints: newImprints,
      writingFeedback: feedback,
      exposure: newExposure,
      selectedEntryIds: [],
      isWritingPhaseReady: false,
    })

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
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints, focusHistory, allNotebookEntries, exposure } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return null

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      const intro = dayScene.intro || []
      const outro = dayScene.outro || []
      const visibleIntro = getVisibleLines(intro, writingTags, imprints, focusHistory, allNotebookEntries, exposure)

      if (isExploring || currentLineIndex < visibleIntro.length) {
        return visibleIntro[currentLineIndex] || null
      }

      const outroIndex = currentLineIndex - visibleIntro.length
      return outro[outroIndex] || null
    }

    if (scene.mode === 'night') {
      const nightScene = scene as NightScene
      return nightScene.lines[currentLineIndex] || null
    }

    return null
  },

  /** 返回过滤后的场景行数组（requiresTag + requiresImprint） */
  getFilteredLines: () => {
    const { currentSceneId, writingTags, imprints, focusHistory, allNotebookEntries, exposure } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return []

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      return [
        ...getVisibleLines(dayScene.intro || [], writingTags, imprints, focusHistory, allNotebookEntries, exposure),
        ...getVisibleLines(dayScene.outro || [], writingTags, imprints, focusHistory, allNotebookEntries, exposure),
      ]
    }
    if (scene.mode === 'night') {
      return getVisibleLines((scene as NightScene).lines, writingTags, imprints, focusHistory, allNotebookEntries, exposure)
    }
    return []
  },

  // ══════════════════════════════════════
  // 存档
  // ══════════════════════════════════════

  saveGame: () => {
    const s = get()
    const save = {
      version: 2,
      timestamp: Date.now(),
      state: {
        currentSceneId: s.currentSceneId,
        currentLineIndex: s.currentLineIndex,
        observedIds: s.observedIds,
        isExploring: s.isExploring,
        selectedEntryIds: s.selectedEntryIds,
        notebook: s.notebook,
        allNotebookEntries: s.allNotebookEntries,
        writings: s.writings,
        writingTags: s.writingTags,
        flags: s.flags,
        impressions: s.impressions,
        imprints: s.imprints,
        isWritingPhaseReady: s.isWritingPhaseReady,
        writingFeedback: s.writingFeedback,
        exposure: s.exposure,
        attentionRemaining: s.attentionRemaining,
        currentFocus: s.currentFocus,
        previousFocus: s.previousFocus,
        focusHistory: s.focusHistory,
        completedChapters: s.completedChapters,
        isPlaying: s.isPlaying,
      },
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  },

  loadGame: () => {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    try {
      const save = JSON.parse(raw)
      if (save.version === 2) {
        // 兼容旧存档：缺失字段用默认值
        const savedAchievements = localStorage.getItem('schultag-achievements')
        set({
          ...initialState,
          ...save.state,
          unlockedAchievements: savedAchievements ? JSON.parse(savedAchievements) : (save.state.unlockedAchievements || []),
          completedChapters: save.state.completedChapters || [],
          allNotebookEntries: save.state.allNotebookEntries || [],
          settings: loadSettingsFromStorage(),
          isPlaying: true,
        })
        return true
      }
    } catch { /* corrupted */ }
    return false
  },

  resetGame: () => set(initialState),
}))

import { create } from 'zustand'
import type { GameState, Scene, DayScene, NightScene, StoryLine, CharacterImprint } from '../types/game'
import { scenes } from '../data/chapters'
import { characters } from '../data/characters'

/** 统一的行可见性过滤：requiresTag + requiresImprint */
export function getVisibleLines(
  lines: StoryLine[],
  writingTags: string[],
  imprints: Record<string, CharacterImprint>,
): StoryLine[] {
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
    return true
  })
}

interface GameStore extends GameState {
  // ── 游戏流程 ──
  startGame: () => void
  advanceLine: () => void
  goToNextScene: () => void
  saveGame: () => void
  loadGame: () => boolean
  resetGame: () => void

  // ── 白天：观察系统 ──
  openObservation: (observationId: string) => void
  closeObservation: () => void
  confirmObservation: () => void
  finishExploring: () => void

  // ── 夜晚：写作系统 ──
  toggleEntrySelection: (entryId: string) => void
  submitWriting: () => void

  // ── 查询 ──
  getCurrentScene: () => Scene | null
  getDayScene: () => DayScene | null
  getNightScene: () => NightScene | null
  currentLine: () => { type: string; text: string; speaker?: string } | null
  getFilteredLines: () => { type: string; text: string; speaker?: string; requiresTag?: string }[]
}

const SAVE_KEY = 'schultag-save-v2'

const initialState: GameState = {
  currentSceneId: 'prologue-day',
  currentLineIndex: 0,
  observedIds: [],
  isExploring: true,
  modalObservationId: null,
  feedback: { text: '', visible: false },
  selectedEntryIds: [],
  notebook: [],
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

  advanceLine: () => {
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return

    // 白天场景
    if (scene.mode === 'day') {
      const dayScene = scene as DayScene

      // intro 播完且正在探索 → 停住（等待观察面板）
      if (isExploring) {
        const intro = dayScene.intro || []
        const visibleIntro = getVisibleLines(intro, writingTags, imprints)
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
    const { currentSceneId } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return
    const nextId = 'nextSceneId' in scene ? scene.nextSceneId : undefined
    if (!nextId) return
    const nextScene = scenes[nextId]
    const isNextDay = nextScene?.mode === 'day'
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
    })
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
    const { modalObservationId, observedIds, notebook, impressions, imprints, exposure } = get()
    if (!modalObservationId || observedIds.includes(modalObservationId)) return

    const scene = get().getDayScene()
    if (!scene) return

    const obs = scene.observations.find(o => o.id === modalObservationId)
    if (!obs) return

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
    }

    set({
      observedIds: [...observedIds, modalObservationId],
      notebook: newEntry ? [...notebook, newEntry] : notebook,
      impressions: newImpressions,
      imprints: newImprints,
      exposure: newExposure,
      modalObservationId: null,
      feedback: { text: `✓ ${obs.notebookEntry.label} 已记录`, visible: true },
    })

    // 自动隐藏反馈 2 秒后
    setTimeout(() => {
      set({ feedback: { text: '', visible: false } })
    }, 2000)
  },

  finishExploring: () => {
    const { isExploring, writingTags, imprints } = get()
    if (!isExploring) return
    const scene = get().getDayScene()
    if (!scene) return
    const intro = scene.intro || []
    const visibleIntro = getVisibleLines(intro, writingTags, imprints)
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
    const { selectedEntryIds, notebook, writings, writingTags, currentSceneId, imprints, exposure } = get()
    const scene = scenes[currentSceneId]
    if (!scene || scene.mode !== 'night') return

    const nightScene = scene as NightScene
    if (!nightScene.writingPhase) return

    const selectedLabels = notebook
      .filter(e => selectedEntryIds.includes(e.id))
      .map(e => e.label)

    // 检查是否有匹配的配方
    let composedText = nightScene.writingPhase.defaultText
    let matchedTag: string | undefined
    for (const recipe of nightScene.writingPhase.recipes) {
      const allMatch = recipe.requiredEntries.every(id => selectedEntryIds.includes(id))
      if (allMatch && recipe.requiredEntries.length <= selectedEntryIds.length) {
        composedText = recipe.composedText
        matchedTag = recipe.influenceTag
        break
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
    const { currentSceneId, currentLineIndex, isExploring, writingTags, imprints } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return null

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      const intro = dayScene.intro || []
      const outro = dayScene.outro || []
      const visibleIntro = getVisibleLines(intro, writingTags, imprints)

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
    const { currentSceneId, writingTags, imprints } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return []

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      return [
        ...getVisibleLines(dayScene.intro || [], writingTags, imprints),
        ...getVisibleLines(dayScene.outro || [], writingTags, imprints),
      ]
    }
    if (scene.mode === 'night') {
      return getVisibleLines((scene as NightScene).lines, writingTags, imprints)
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
        writings: s.writings,
        writingTags: s.writingTags,
        flags: s.flags,
        impressions: s.impressions,
        imprints: s.imprints,
        isWritingPhaseReady: s.isWritingPhaseReady,
        writingFeedback: s.writingFeedback,
        exposure: s.exposure,
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
        set({ ...initialState, ...save.state, isPlaying: true })
        return true
      }
    } catch { /* corrupted */ }
    return false
  },

  resetGame: () => set(initialState),
}))

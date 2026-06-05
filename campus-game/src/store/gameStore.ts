import { create } from 'zustand'
import type { GameState, Scene, DayScene, NightScene } from '../types/game'
import { scenes } from '../data/chapters'
import { characters } from '../data/characters'

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
    const { currentSceneId, currentLineIndex, isExploring } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return

    // 白天场景
    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      const intro = dayScene.intro || []

      // intro 播完且正在探索 → 停住（使用过滤后行数）
      if (isExploring) {
        const { writingTags } = get()
        const visibleIntro = intro.filter(
          l => !l.requiresTag || writingTags.includes(l.requiresTag)
        )
        if (currentLineIndex >= visibleIntro.length - 1) return
      }

      set({ currentLineIndex: currentLineIndex + 1 })
      return
    }

    // 夜晚场景：只推进，不处理转场
    if (scene.mode === 'night') {
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
    set({
      currentSceneId: nextId,
      currentLineIndex: 0,
      isExploring: nextScene?.mode === 'day',
      observedIds: [],
      selectedEntryIds: [],
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
    const { modalObservationId, observedIds, notebook, impressions } = get()
    if (!modalObservationId || observedIds.includes(modalObservationId)) return

    const scene = get().getDayScene()
    if (!scene) return

    const obs = scene.observations.find(o => o.id === modalObservationId)
    if (!obs) return

    // 推进人物印象
    const newImpressions = { ...impressions }
    if (obs.relationshipEffect) {
      const { characterId } = obs.relationshipEffect
      const char = characters[characterId]
      if (char && char.impressionLevels.length > 0) {
        const current = newImpressions[characterId] || 0
        const maxLevel = char.impressionLevels.length - 1
        newImpressions[characterId] = Math.min(current + 1, maxLevel)
      }
    }

    const entryExists = notebook.find(e => e.id === obs.notebookEntry.id)

    set({
      observedIds: [...observedIds, modalObservationId],
      notebook: entryExists ? notebook : [...notebook, obs.notebookEntry],
      impressions: newImpressions,
      modalObservationId: null,
      feedback: { text: `✓ ${obs.notebookEntry.label} 已记录`, visible: true },
    })

    // 自动隐藏反馈 2 秒后
    setTimeout(() => {
      set({ feedback: { text: '', visible: false } })
    }, 2000)
  },

  finishExploring: () => {
    const { isExploring } = get()
    if (!isExploring) return
    const scene = get().getDayScene()
    if (!scene) return
    // 使用过滤后的 intro 行数（requiresTag 不满足的行被跳过）
    const { writingTags } = get()
    const intro = (scene.intro || []).filter(
      l => !l.requiresTag || writingTags.includes(l.requiresTag)
    )
    set({
      isExploring: false,
      currentLineIndex: intro.length,
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
    const { selectedEntryIds, notebook, writings, writingTags, currentSceneId } = get()
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

    const newTags = matchedTag && !writingTags.includes(matchedTag)
      ? [...writingTags, matchedTag]
      : writingTags

    set({
      writings: [...writings, composedText],
      writingTags: newTags,
      selectedEntryIds: [],
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
    const { currentSceneId, currentLineIndex, isExploring } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return null

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      const intro = dayScene.intro || []
      const outro = dayScene.outro || []

      // 还在 intro 阶段
      if (isExploring || currentLineIndex < intro.length) {
        return intro[currentLineIndex] || null
      }

      // outro 阶段（探索结束）
      const outroIndex = currentLineIndex - intro.length
      return outro[outroIndex] || null
    }

    if (scene.mode === 'night') {
      const nightScene = scene as NightScene
      return nightScene.lines[currentLineIndex] || null
    }

    return null
  },

  /** 返回按 writingTags 过滤后的场景行数组 */
  getFilteredLines: () => {
    const { currentSceneId, writingTags } = get()
    const scene = scenes[currentSceneId]
    if (!scene) return []

    const filter = (l: { requiresTag?: string }) =>
      !l.requiresTag || writingTags.includes(l.requiresTag)

    if (scene.mode === 'day') {
      const dayScene = scene as DayScene
      return [...(dayScene.intro || []).filter(filter), ...(dayScene.outro || []).filter(filter)]
    }
    if (scene.mode === 'night') {
      return (scene as NightScene).lines.filter(filter)
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

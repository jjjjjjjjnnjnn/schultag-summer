// ── 观察点：白天场景中玩家可以自由点击观察的对象 ──
export interface ObservationPoint {
  id: string
  name: string
  description: string
  /** 观察后显示的文本 */
  observationText: string
  /** 观察后收录进笔记本的素材 */
  notebookEntry: NotebookEntry
  /** 可选：需要先观察某个对象才能看到此点 */
  requires?: string
  /** 观察此点是否影响角色关系 */
  relationshipEffect?: { characterId: string; delta: number }
}

// ── 笔记本素材条目 ──
export interface NotebookEntry {
  id: string
  /** 简短标签（如 "光" "兰若瑶" "九十万字"） */
  label: string
  /** 完整观察文本 */
  text: string
  /** 素材类别 */
  category: 'visual' | 'dialogue' | 'thought' | 'sound' | 'smell' | 'action'
}

// ── 场景叙事行（固定推进的剧情线） ──
export interface StoryLine {
  type: 'narration' | 'dialogue' | 'thought' | 'observe' | 'notebook'
  speaker?: string
  text: string
}

// ── 写作配方：玩家从笔记本选择素材后自动组合成文 ──
export interface WritingRecipe {
  /** 需要选中的素材 ID 列表 */
  requiredEntries: string[]
  /** 组合后生成的文字 */
  composedText: string
}

// ── 白天场景 ──
export interface DayScene {
  id: string
  mode: 'day'
  location: string
  timeOfDay?: string
  /** 固定叙事（开场、过渡等不可跳过的文本） */
  intro?: StoryLine[]
  /** 玩家可自由点击的观察点 */
  observations: ObservationPoint[]
  /** 固定叙事（观察结束后的收束） */
  outro?: StoryLine[]
  /** 观察结束/进入夜晚后的下一场景 */
  nextSceneId: string
}

// ── 夜晚场景 ──
export interface NightScene {
  id: string
  mode: 'night'
  location: string
  timeOfDay?: string
  /** 固定叙事 */
  lines: StoryLine[]
  /** 写作阶段：玩家选择素材组合成文 */
  writingPhase?: {
    prompt: string
    /** 可选的写作配方（不同组合产生不同文字） */
    recipes: WritingRecipe[]
    /** 默认组合文案（如果没匹配任何配方） */
    defaultText: string
  }
  nextSceneId?: string
}

export type Scene = DayScene | NightScene

// ── 角色 ──
export interface Character {
  id: string
  name: string
  nameEn: string
  age?: number
  role: 'protagonist' | 'main' | 'supporting' | 'teacher'
  color: string
  traits: string[]
}

// ── 游戏状态 ──
export interface GameState {
  currentSceneId: string
  currentLineIndex: number
  /** 白天场景：已观察的观察点 ID 列表 */
  observedIds: string[]
  /** 当前场景是否处于探索模式 */
  isExploring: boolean
  /** 夜晚场景：已选中的笔记本素材 ID */
  selectedEntryIds: string[]
  /** 笔记本中所有素材 */
  notebook: NotebookEntry[]
  /** 已写成的文字 */
  writings: string[]
  /** 游戏标记 */
  flags: Record<string, boolean>
  /** 好感度 */
  relationships: Record<string, number>
  isPlaying: boolean
}

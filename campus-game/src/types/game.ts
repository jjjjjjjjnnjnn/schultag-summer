// ── 焦点类型 ──
export type FocusType = 'maya' | 'ludwig' | 'environment'

// ── 游戏设置 ──
export interface Settings {
  textSpeed: 'slow' | 'normal' | 'fast'
  fontSize: 'small' | 'medium' | 'large'
}

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
  /** 侵入度：0=环境 1=对话 2=行为 3=习惯 5=内心推测 */
  invasionLevel?: number
  /** 热点位置（百分比坐标，用于空间化场景） */
  position?: { x: number; y: number }
  /** 焦点分类：此观察点属于哪个焦点 */
  focusGroup: FocusType
  /** 若存在，仅当上一章焦点匹配时显示此追加文本 */
  focusAddendum?: string
  /** 若存在，焦点叠加 2+ 章时显示此深度偏见文本 */
  focusAddendumDeep?: string
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
  /** 侵入度：0=环境 1=对话 2=行为 3=习惯 5=内心推测 */
  invasionLevel?: number
  /** 焦点分类（由观察点传入） */
  focusGroup?: FocusType
  /** 来源场景 ID */
  sceneId?: string
  /** 时间戳（排序用） */
  timestamp?: number
}

// ── 场景叙事行（固定推进的剧情线） ──
export interface StoryLine {
  type: 'narration' | 'dialogue' | 'thought' | 'observe' | 'notebook'
  speaker?: string
  text: string
  /** 若存在，仅当玩家 writingTags 中包含此标签时才渲染 */
  requiresTag?: string
  /** 若存在，仅当角色印记达到阈值时才渲染 */
  requiresImprint?: {
    characterId: string
    type: 'observation' | 'writing'
    threshold: number
  }
  /** 打字机速度：'slow'=55ms 'normal'=35ms 'fast'=25ms 或直接指定数字 */
  speed?: 'slow' | 'normal' | 'fast' | number
  /** 若存在，仅当焦点历史连续达到阈值时才渲染 */
  requiresFocusHistory?: {
    characterId: string
    count: number
  }
  /** 若存在，仅当玩家观察过此笔记本条目时才渲染 */
  requiresObservation?: string
  /** 若存在，仅当暴露度 >= 此阈值时才渲染 */
  requiresExposure?: number
}

// ── 写作配方：玩家从笔记本选择素材后自动组合成文 ──
export interface WritingRecipe {
  /** 需要选中的素材 ID 列表 */
  requiredEntries: string[]
  /** 组合后生成的文字 */
  composedText: string
  /** 若存在，写入此标签，影响后续场景叙事 */
  influenceTag?: string
  /** 若存在，仅当玩家焦点匹配时才匹配此配方 */
  requiresFocus?: FocusType
}

// ── 场景骨架元素 ──
export interface SceneLayoutElement {
  className?: string
  style: React.CSSProperties
  label?: string
}

// ── 场景骨架布局 ──
export interface SceneLayout {
  elements: SceneLayoutElement[]
}

// ── 白天场景 ──
export interface DayScene {
  id: string
  mode: 'day'
  location: string
  timeOfDay?: string
  /** 场景标题卡：进入时先显示 */
  titleCard?: { day: string; time: string }
  /** 固定叙事（开场、过渡等不可跳过的文本） */
  intro?: StoryLine[]
  /** 玩家可自由点击的观察点 */
  observations: ObservationPoint[]
  /** 固定叙事（观察结束后的收束） */
  outro?: StoryLine[]
  /** 观察结束/进入夜晚后的下一场景 */
  nextSceneId: string
  /** 场景骨架：空间布局参考线和固定元素 */
  sceneLayout?: SceneLayout
  /** 每日注意力预算（默认 3） */
  attentionBudget?: number
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
  /** 人物印象等级，从低到高 */
  impressionLevels: string[]
}

// ── 角色印记 ──
export interface CharacterImprint {
  characterId: string
  observationCount: number
  writingCount: number
}

// ── 游戏状态 ──
export interface GameState {
  currentSceneId: string
  currentLineIndex: number
  /** 白天场景：已观察的观察点 ID 列表 */
  observedIds: string[]
  /** 当前场景是否处于探索模式 */
  isExploring: boolean
  /** 观察弹窗：当前打开的观察点 ID（null = 无弹窗） */
  modalObservationId: string | null
  /** 观察成功反馈 */
  feedback: { text: string; visible: boolean }
  /** 夜晚场景：已选中的笔记本素材 ID */
  selectedEntryIds: string[]
  /** 笔记本中所有素材（当前章，用于写作选择） */
  notebook: NotebookEntry[]
  /** 永久笔记本（全部历史素材，用于笔记本展示） */
  allNotebookEntries: NotebookEntry[]
  /** 已写成的文字 */
  writings: string[]
  /** 写作产生的标签（影响后续场景叙事） */
  writingTags: string[]
  /** 游戏标记 */
  flags: Record<string, boolean>
  /** 人物印象等级（每个角色当前的等级索引） */
  impressions: Record<string, number>
  /** 角色印记（观察/写作计数） */
  imprints: Record<string, CharacterImprint>
  /** 夜晚场景：写作阶段就绪标记 */
  isWritingPhaseReady: boolean
  /** 写作完成后的叙事反馈 */
  writingFeedback: string
  /** 暴露度：被看见的程度 (0-100) */
  exposure: number
  /** 当前注意力剩余 */
  attentionRemaining: number
  /** 当天选择的焦点 */
  currentFocus: FocusType | null
  /** 上一章的焦点（影响观察文本） */
  previousFocus: FocusType | null
  /** 焦点历史（跨章保留） */
  focusHistory: FocusType[]
  /** 焦点脉动颜色（观察确认时触发） */
  focusPulseColor: FocusType | null
  /** Day→Night 过渡状态 */
  isTransitioning: boolean
  transitionText: string
  /** 已解锁的成就 ID 列表 */
  unlockedAchievements: string[]
  /** 已完成的章节 ID 列表 */
  completedChapters: string[]
  /** 游戏设置 */
  settings: Settings
  isPlaying: boolean
}

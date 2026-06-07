// ── 焦点类型 ──
export type FocusType = 'maya' | 'ludwig' | 'environment'

// ── V1.1 后果系统 ──

/** 行为效果：角色因 Robert 的写作而产生的行为改变 */
export interface BehaviorEffect {
  id: string
  source: 'writing' | 'observation' | 'consequence'
  /** 触发条件（由哪个 writingTag 触发） */
  triggerTag: string
  /** 行为描述（出现在观察文本中） */
  behaviorDescription: string
  /** 影响的观察点 ID 列表 */
  affectedObservations: string[]
  /** 持续时间 */
  duration: 'chapter' | 'permanent'
  /** 时间戳 */
  activatedAt: number
}

/** 后果规则：定义 writingTag 如何转化为行为效果 */
export interface ConsequenceRule {
  /** 触发条件 */
  trigger: {
    type: 'writingTag' | 'imprintThreshold'
    value: string | number
  }
  /** 产生的行为效果 */
  effect: Omit<BehaviorEffect, 'activatedAt'>
  /** 延迟几章后生效（制造时间差） */
  delayChapters: number
}

// ── V1.2 认知网络 ──

/** 认知标签：定性描述角色间的认知状态 */
export type PerceptionTag =
  | 'curious'      // 好奇
  | 'distant'      // 保持距离
  | 'trusting'     // 信任
  | 'wary'         // 警觉
  | 'admiring'     // 欣赏
  | 'confused'     // 困惑
  | 'indifferent'  // 无所谓
  | 'guilty'       // 内疚（Robert 独有）

/** 认知关系：一个角色对另一个角色的看法 */
export interface Perception {
  from: string       // 观察者角色 ID
  to: string         // 被观察者角色 ID
  tags: PerceptionTag[]
  /** 认知来源 */
  source: 'observation' | 'writing' | 'consequence' | 'dialogue'
  /** 认知强度：0-1，影响标签显示的权重 */
  intensity: number
}

/** 认知快照：某时刻的认知矩阵状态 */
export interface PerceptionSnapshot {
  chapterId: string
  perceptions: Perception[]
}

/** 认知变化：两个快照之间的差异 */
export interface PerceptionChange {
  from: string
  to: string
  addedTags: PerceptionTag[]
  removedTags: PerceptionTag[]
}

// ── 游戏设置 ──
export interface Settings {
  textSpeed: 'slow' | 'normal' | 'fast'
  fontSize: 'small' | 'medium' | 'large'
  language: 'zh' | 'en' | 'de'
  soundEnabled: boolean
  reducedMotion: boolean
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
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
  /** V1.1: 被行为效果修改时的替代观察文本 */
  alternateText?: string
  /** V1.1: 被行为效果修改时的替代笔记本条目 */
  alternateEntry?: NotebookEntry
  /** V1.1: 受哪些行为效果影响（效果 ID 列表） */
  affectedBy?: string[]
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
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
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
    /** 内容翻译 key */
    cid?: string
  }
  /** 打字机速度：'slow'=55ms 'normal'=35ms 'fast'=25ms 或直接指定数字 */
  speed?: 'slow' | 'normal' | 'fast' | number
  /** 若存在，仅当焦点历史连续达到阈值时才渲染 */
  requiresFocusHistory?: {
    characterId: string
    count: number
    /** 内容翻译 key */
    cid?: string
  }
  /** 若存在，仅当玩家观察过此笔记本条目时才渲染 */
  requiresObservation?: string
  /** 若存在，仅当暴露度 >= 此阈值时才渲染 */
  requiresExposure?: number
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
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
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
}

// ── 场景骨架元素 ──
export interface SceneLayoutElement {
  className?: string
  style: React.CSSProperties
  label?: string
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
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
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
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
    /** 内容翻译 key（用于多语言查找 .prompt / .default） */
    cid?: string
  }
  nextSceneId?: string
  /** 内容翻译 key（用于多语言查找） */
  cid?: string
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
  /** 内容翻译 key（用于多语言查找 .traits.0 / .imp.0 等） */
  cid?: string
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
  /** 已播放过音效的 Echo 行 ID（防重复播放） */
  playedEchoIds: string[]
  /** 累计游玩时间（毫秒） */
  playTimeMs: number
  /** 当前游戏会话开始时间 */
  gameStartTime: number
  /** V1.1: 行为状态（角色 ID → 激活的行为效果列表） */
  behaviorStates: Record<string, BehaviorEffect[]>
  /** V1.1: 已激活的后果规则 ID 列表 */
  activatedConsequences: string[]
  /** V1.2: 当前认知矩阵 */
  perceptions: Perception[]
  /** V1.2: 认知快照历史（每个章节结束时保存） */
  perceptionHistory: PerceptionSnapshot[]
  /** 观察确认代数（用于防止 setTimeout 跨场景覆盖） */
  observationGeneration: number

  /** 已完成的主线里程碑 */
  completedMilestones: string[]
  /** 当前场景已完成的任务目标 */
  completedDailyObjectives: string[]
  /** 已解锁的章节目标奖励 */
  unlockedChapterRewards: string[]
}

// ── 存档数据结构 ──
export interface SaveData {
  version: 3
  timestamp: number
  playTimeMs: number
  chapterId: string
  state: Partial<GameState>
}

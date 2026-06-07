import type { FocusType } from '../types/game'

// ── 主线里程碑 ──
export interface MainMilestone {
  id: string
  /** 达成条件：已完成章节列表 */
  requiresChapters: string[]
  /** 完成后解锁什么 */
  reward: {
    type: 'writingTag' | 'scene' | 'dialogue'
    value: string
  }
  /** 描述文本 */
  description: string
  /** cid */
  cid?: string
}

export const MAIN_QUESTS: MainMilestone[] = [
  {
    id: 'first-writing',
    requiresChapters: ['prologue'],
    reward: { type: 'writingTag', value: 'unlocked-prologue' },
    description: '完成第一篇文字',
  },
  {
    id: 'meet-maya',
    requiresChapters: ['prologue', 'ch01'],
    reward: { type: 'dialogue', value: 'quest-meet-maya' },
    description: '认识新同学',
  },
  {
    id: 'understand-dynamics',
    requiresChapters: ['prologue', 'ch01', 'ch02'],
    reward: { type: 'writingTag', value: 'unlocked-ch02' },
    description: '理解三人之间的微妙关系',
  },
  {
    id: 'echo-awakening',
    requiresChapters: ['prologue', 'ch01', 'ch02', 'ch03'],
    reward: { type: 'dialogue', value: 'quest-echo-awakening' },
    description: '察觉写作正在改变现实',
  },
  {
    id: 'final-chapter',
    requiresChapters: ['prologue', 'ch01', 'ch02', 'ch03', 'ch04'],
    reward: { type: 'scene', value: 'ch05-epilogue' },
    description: '面对写作的后果',
  },
]

// ── 章节目标 ──
export interface ChapterGoal {
  chapterId: string
  /** 目标描述 */
  description: string
  /** 与哪个焦点相关 */
  focusRelated?: FocusType
  /** 达成条件 */
  condition: {
    type: 'observationCount' | 'writingCount' | 'focusStreak'
    target: number
    focusType?: FocusType
  }
  /** 奖励 */
  reward: {
    type: 'specialObs' | 'bonusLine'
    value: string
  }
}

export const CHAPTER_GOALS: ChapterGoal[] = [
  {
    chapterId: 'prologue',
    description: '观察走廊和食堂的氛围',
    condition: { type: 'observationCount', target: 2 },
    reward: { type: 'specialObs', value: '观察敏锐' },
  },
  {
    chapterId: 'ch01',
    description: '了解新同学',
    focusRelated: 'maya',
    condition: { type: 'observationCount', target: 2, focusType: 'maya' },
    reward: { type: 'bonusLine', value: 'quest-maya-first-impression' },
  },
  {
    chapterId: 'ch02',
    description: '理解三个人之间的关系',
    condition: { type: 'observationCount', target: 3 },
    reward: { type: 'bonusLine', value: 'quest-understand-dynamics' },
  },
  {
    chapterId: 'ch03',
    description: '深入观察一个角色',
    condition: { type: 'focusStreak', target: 2 },
    reward: { type: 'bonusLine', value: 'quest-deep-focus' },
  },
  {
    chapterId: 'ch04',
    description: '完成你的观察记录',
    condition: { type: 'writingCount', target: 1 },
    reward: { type: 'bonusLine', value: 'quest-final-observation' },
  },
]

// ── 每日目标 ──
export interface DailyObjective {
  sceneId: string
  objectives: {
    id: string
    /** 目标描述 */
    description: string
    /** 达成条件 */
    condition: {
      type: 'observe' | 'collect' | 'write'
      targetId?: string  // 具体的观察点ID或笔记标签
    }
    /** 完成后的反馈文本 */
    completionText: string
    cid?: string
  }[]
}

export const DAILY_OBJECTIVES: DailyObjective[] = [
  {
    sceneId: 'prologue-day',
    objectives: [
      {
        id: 'prologue-obj-1',
        description: '观察走廊的光线',
        condition: { type: 'observe', targetId: 'prologue-light' },
        completionText: '你注意到了走廊里的光。',
      },
      {
        id: 'prologue-obj-2',
        description: '听听Ludwig在说什么',
        condition: { type: 'observe', targetId: 'prologue-ludwig-tease' },
        completionText: 'Ludwig又在开玩笑了。',
      },
    ],
  },
  {
    sceneId: 'ch01-day',
    objectives: [
      {
        id: 'ch01-obj-1',
        description: '观察新同学的样子',
        condition: { type: 'observe', targetId: 'ch01-maya-appearance' },
        completionText: '你记住了她的样子。',
      },
      {
        id: 'ch01-obj-2',
        description: '听她说话',
        condition: { type: 'observe', targetId: 'ch01-maya-voice' },
        completionText: '她的声音很清晰。',
      },
      {
        id: 'ch01-obj-3',
        description: '看教室里的光线',
        condition: { type: 'observe', targetId: 'ch01-window-light' },
        completionText: '今天的光线很特别。',
      },
    ],
  },
]

/** 检查每日目标完成状态 */
export function evaluateDailyObjectives(
  objectives: { id: string; condition: { type: string; targetId?: string } }[],
  observedIds: string[],
  _allNotebookEntries: { id: string }[],
): string[] {
  const completed: string[] = []
  for (const obj of objectives) {
    if (obj.condition.type === 'observe' && obj.condition.targetId) {
      if (observedIds.some(id => id.startsWith(obj.condition.targetId!))) {
        completed.push(obj.id)
      }
    }
  }
  return completed
}

/** 检查章节目标是否达成 */
export function evaluateChapterGoal(
  goal: ChapterGoal,
  allNotebookEntries: { id: string; sceneId?: string; focusGroup?: FocusType }[],
  writings: string[],
  focusHistory: FocusType[],
  chapterId: string,
): boolean {
  const { condition } = goal
  switch (condition.type) {
    case 'observationCount': {
      // 统计本章的观察数
      const chapterObs = allNotebookEntries.filter(e => e.sceneId?.startsWith(chapterId))
      return chapterObs.length >= condition.target
    }
    case 'writingCount': {
      return writings.length >= condition.target
    }
    case 'focusStreak': {
      let maxStreak = 0
      let streak = 0
      let lastFocus: FocusType | null = null
      for (const f of focusHistory) {
        if (lastFocus === null || f === lastFocus) {
          streak++
        } else {
          streak = 1
        }
        lastFocus = f
        maxStreak = Math.max(maxStreak, streak)
      }
      return maxStreak >= condition.target
    }
    default:
      return false
  }
}

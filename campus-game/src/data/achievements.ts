import type { GameState } from '../types/game'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-observation',
    name: '第一次观察',
    description: '完成你的第一次观察',
    icon: '👁',
  },
  {
    id: 'first-writing',
    name: '第一次写作',
    description: '完成你的第一篇文字',
    icon: '✎',
  },
  {
    id: 'epilogue',
    name: '第一卷完',
    description: '到达卷一结尾',
    icon: '📖',
  },
]

/** 集中检查所有成就，返回新解锁的 ID 列表 */
export function evaluateAchievements(state: GameState): string[] {
  const unlocked: string[] = []

  if (state.notebook.length >= 1 && !state.unlockedAchievements.includes('first-observation')) {
    unlocked.push('first-observation')
  }
  if (state.writings.length >= 1 && !state.unlockedAchievements.includes('first-writing')) {
    unlocked.push('first-writing')
  }
  if (state.currentSceneId === 'ch05-epilogue' && !state.unlockedAchievements.includes('epilogue')) {
    unlocked.push('epilogue')
  }

  return unlocked
}

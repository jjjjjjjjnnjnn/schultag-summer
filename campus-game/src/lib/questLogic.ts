import type { FocusType } from '../types/game'
import type { ChapterGoal, DailyObjective } from '../data/quests'

export function evaluateChapterGoal(
  goal: ChapterGoal,
  allNotebookEntries: { id: string; focusGroup?: string; sceneId?: string }[],
  writings: string[],
  focusHistory: FocusType[],
  chapterId: string,
): boolean {
  if (goal.condition.type === 'observationCount') {
    const chapterEntries = allNotebookEntries.filter(e => e.sceneId?.startsWith(chapterId))
    const targetEntries = goal.condition.focusType
      ? chapterEntries.filter(e => e.focusGroup === goal.condition.focusType)
      : chapterEntries
    return targetEntries.length >= goal.condition.target
  }
  if (goal.condition.type === 'writingCount') {
    return writings.length >= goal.condition.target
  }
  if (goal.condition.type === 'focusStreak') {
    let streak = 0
    for (const f of focusHistory) {
      if (goal.condition.focusType && f === goal.condition.focusType) {
        streak++
        if (streak >= goal.condition.target) return true
      } else {
        streak = 0
      }
    }
    return false
  }
  return false
}

export function evaluateDailyObjectives(
  objectives: DailyObjective['objectives'],
  observedIds: string[],
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

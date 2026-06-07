import type { StoryLine, CharacterImprint, FocusType, NotebookEntry } from '../types/game'

/** 统一的行可见性过滤：requiresTag + requiresImprint + requiresFocusHistory + requiresObservation + requiresExposure + requiresMilestone */
export function getVisibleLines(
  lines: StoryLine[],
  writingTags: string[],
  imprints: Record<string, CharacterImprint>,
  focusHistory: FocusType[] = [],
  allNotebookEntries: NotebookEntry[] = [],
  exposure: number = 0,
  completedMilestones: string[] = [],
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
    if (l.requiresMilestone && !completedMilestones.includes(l.requiresMilestone)) return false
    return true
  })
}

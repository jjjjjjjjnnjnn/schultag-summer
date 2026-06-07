import type { GameState, Evidence } from '../types/game'
import { ALL_EVIDENCE, EVIDENCE_TRIGGERS } from '../data/evidence'

/**
 * 检查哪些新证据可以解锁
 * 在 goToNextScene 和 confirmObservation 后调用
 */
export function evaluateEvidence(state: GameState): Evidence[] {
  const { evidence, completedMilestones, writingTags, observedIds, currentSceneId } = state
  const newEvidence: Evidence[] = []
  const existingIds = evidence.map(e => e.id)

  for (const trigger of EVIDENCE_TRIGGERS) {
    if (existingIds.includes(trigger.evidenceId)) continue

    let met = false

    switch (trigger.condition.type) {
      case 'milestone':
        met = completedMilestones.includes(trigger.condition.value as string)
        break
      case 'tag':
        met = writingTags.includes(trigger.condition.value as string)
        break
      case 'observation':
        met = observedIds.some(id => id.startsWith(trigger.condition.value as string))
        break
      case 'exposure':
        met = state.exposure >= (trigger.condition.value as number)
        break
      case 'scene':
        met = currentSceneId === trigger.condition.value
        break
      case 'keyCount':
        met = evidence.filter(e => e.isKeyEvidence && e.chapterId !== 'ch05').length >= (trigger.condition.value as number)
        break
    }

    if (met) {
      const ev = ALL_EVIDENCE.find(e => e.id === trigger.evidenceId)
      if (ev) newEvidence.push(ev)
    }
  }

  return newEvidence
}

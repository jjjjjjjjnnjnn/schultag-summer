import type { GameState, BehaviorEffect, ObservationPoint } from '../types/game'
import { CONSEQUENCE_RULES } from '../data/consequences'

/**
 * 评估后果：根据当前 writingTags 和 imprints 激活行为效果
 * 在 submitWriting 和 goToNextScene 后调用
 */
export function evaluateConsequences(state: GameState): BehaviorEffect[] {
  const newEffects: BehaviorEffect[] = []
  const { writingTags, imprints, activatedConsequences, completedChapters } = state
  const chapterCount = completedChapters.length

  for (const rule of CONSEQUENCE_RULES) {
    // 跳过已激活的后果
    if (activatedConsequences.includes(rule.effect.id)) continue

    let triggered = false

    if (rule.trigger.type === 'writingTag') {
      triggered = writingTags.includes(rule.trigger.value as string)
    } else if (rule.trigger.type === 'imprintThreshold') {
      const threshold = rule.trigger.value as number
      const totalImprints = Object.values(imprints).reduce(
        (sum, imp) => sum + imp.observationCount + imp.writingCount, 0
      )
      triggered = totalImprints >= threshold
    }

    if (triggered && chapterCount >= rule.delayChapters) {
      newEffects.push({
        ...rule.effect,
        activatedAt: Date.now(),
      })
    }
  }

  return newEffects
}

/**
 * 获取角色当前激活的行为效果
 */
export function getActiveEffects(
  behaviorStates: Record<string, BehaviorEffect[]>,
  characterId: string
): BehaviorEffect[] {
  return behaviorStates[characterId] || []
}

/**
 * 根据激活效果修改观察点
 */
export function getModifiedObservation(
  obs: ObservationPoint,
  allEffects: BehaviorEffect[]
): { obs: ObservationPoint; consequenceHint?: string } {
  // 找到影响此观察点的效果
  const affectingEffects = allEffects.filter(
    e => e.affectedObservations.includes(obs.id)
  )

  if (affectingEffects.length === 0) {
    return { obs }
  }

  // 使用最新的效果
  const latestEffect = affectingEffects[affectingEffects.length - 1]

  // 如果有 alternateText，替换观察文本
  if (obs.alternateText) {
    return {
      obs: {
        ...obs,
        observationText: obs.alternateText,
      },
      consequenceHint: latestEffect.behaviorDescription,
    }
  }

  // 否则只返回因果提示
  return {
    obs,
    consequenceHint: latestEffect.behaviorDescription,
  }
}

/**
 * 将行为效果分配到对应角色
 */
export function distributeEffects(effects: BehaviorEffect[]): Record<string, BehaviorEffect[]> {
  const states: Record<string, BehaviorEffect[]> = {}

  for (const effect of effects) {
    // 从 affectedObservations 推断角色 ID
    // 观察点 ID 格式：obs-{角色}-{描述}
    const parts = effect.affectedObservations[0]?.split('-')
    if (parts && parts.length >= 2) {
      const characterId = parts[1]
      if (!states[characterId]) states[characterId] = []
      states[characterId].push(effect)
    }
  }

  return states
}

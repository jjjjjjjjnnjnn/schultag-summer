import type { GameState, Perception, PerceptionSnapshot, PerceptionChange, PerceptionTag } from '../types/game'
import { INITIAL_PERCEPTIONS, PERCEPTION_TRIGGERS } from '../data/perceptions'

/**
 * 评估认知：根据当前状态计算认知矩阵
 * 在 goToNextScene 后调用
 */
export function evaluatePerceptions(state: GameState): Perception[] {
  // 从快照恢复基础认知
  const basePerceptions = state.perceptionHistory.length > 0
    ? [...state.perceptionHistory[state.perceptionHistory.length - 1].perceptions]
    : [...INITIAL_PERCEPTIONS]

  const perceptions = basePerceptions.map(p => ({ ...p, tags: [...p.tags] }))
  const { writingTags, activatedConsequences, imprints } = state

  for (const trigger of PERCEPTION_TRIGGERS) {
    let conditionMet = false

    if (trigger.condition.type === 'writingTag') {
      conditionMet = writingTags.includes(trigger.condition.value as string)
    } else if (trigger.condition.type === 'consequence') {
      conditionMet = activatedConsequences.includes(trigger.condition.value as string)
    } else if (trigger.condition.type === 'imprintThreshold') {
      const total = Object.values(imprints).reduce(
        (sum, imp) => sum + imp.observationCount + imp.writingCount, 0
      )
      conditionMet = total >= (trigger.condition.value as number)
    }

    if (conditionMet) {
      applyPerceptionChange(perceptions, trigger.change)
    }
  }

  return perceptions
}

/**
 * 应用单个认知变化
 */
function applyPerceptionChange(
  perceptions: Perception[],
  change: {
    from: string
    to: string
    addTags: PerceptionTag[]
    removeTags: PerceptionTag[]
    intensityDelta: number
  }
): void {
  const existing = perceptions.find(p => p.from === change.from && p.to === change.to)

  if (existing) {
    // 移除旧标签
    existing.tags = existing.tags.filter(t => !change.removeTags.includes(t))
    // 添加新标签
    for (const tag of change.addTags) {
      if (!existing.tags.includes(tag)) {
        existing.tags.push(tag)
      }
    }
    // 调整强度
    existing.intensity = Math.min(1, Math.max(0, existing.intensity + change.intensityDelta))
  } else {
    // 创建新认知关系
    perceptions.push({
      from: change.from,
      to: change.to,
      tags: change.addTags,
      source: 'writing',
      intensity: 0.5 + change.intensityDelta,
    })
  }
}

/**
 * 计算两个认知快照之间的差异
 */
export function diffPerceptions(
  before: Perception[],
  after: Perception[]
): PerceptionChange[] {
  const changes: PerceptionChange[] = []

  // 收集所有角色对
  const pairs = new Set<string>()
  for (const p of before) pairs.add(`${p.from}-${p.to}`)
  for (const p of after) pairs.add(`${p.from}-${p.to}`)

  for (const pair of pairs) {
    const [from, to] = pair.split('-')
    const b = before.find(p => p.from === from && p.to === to)
    const a = after.find(p => p.from === from && p.to === to)

    const beforeTags = b?.tags || []
    const afterTags = a?.tags || []

    const addedTags = afterTags.filter(t => !beforeTags.includes(t))
    const removedTags = beforeTags.filter(t => !afterTags.includes(t))

    if (addedTags.length > 0 || removedTags.length > 0) {
      changes.push({ from, to, addedTags, removedTags })
    }
  }

  return changes
}

/**
 * 保存认知快照
 */
export function savePerceptionSnapshot(
  state: GameState,
  chapterId: string
): PerceptionSnapshot {
  return {
    chapterId,
    perceptions: evaluatePerceptions(state),
  }
}

/**
 * 认知标签的中文翻译
 */
export const PERCEPTION_TAG_LABELS: Record<PerceptionTag, { zh: string; en: string; de: string }> = {
  curious: { zh: '好奇', en: 'Curious', de: 'Neugierig' },
  distant: { zh: '保持距离', en: 'Distant', de: 'Distanziert' },
  trusting: { zh: '信任', en: 'Trusting', de: 'Vertrauend' },
  wary: { zh: '警觉', en: 'Wary', de: 'Vorsichtig' },
  admiring: { zh: '欣赏', en: 'Admiring', de: 'Bewundernd' },
  confused: { zh: '困惑', en: 'Confused', de: 'Verwirrt' },
  indifferent: { zh: '无所谓', en: 'Indifferent', de: 'Gleichgültig' },
  guilty: { zh: '内疚', en: 'Guilty', de: 'Schuldig' },
}

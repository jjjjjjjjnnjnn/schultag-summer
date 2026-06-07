import type { ObservationPoint, FocusType, CharacterImprint } from '../types/game'

export function calculateObservationCost(
  obs: ObservationPoint,
  _focusCosts: Record<string, number> | undefined,
  currentFocus: FocusType | null,
): number {
  // 同焦点消耗 1 点，异焦点消耗 2 点
  // focusCosts 仅用于焦点选择界面显示，不影响观察消耗
  if (currentFocus && obs.focusGroup === currentFocus) return 1
  return 2
}

export function applyImprint(
  imprints: Record<string, CharacterImprint>,
  characterId: string,
): Record<string, CharacterImprint> {
  const existing = imprints[characterId]
  if (existing) {
    return {
      ...imprints,
      [characterId]: { ...existing, observationCount: existing.observationCount + 1 },
    }
  }
  return {
    ...imprints,
    [characterId]: { characterId, observationCount: 1, writingCount: 0 },
  }
}

export function applyExposure(currentExposure: number, invasionLevel: number): number {
  return Math.min(currentExposure + invasionLevel, 100)
}

export function applyImpression(
  impressions: Record<string, number>,
  characterId: string,
): Record<string, number> {
  return {
    ...impressions,
    [characterId]: (impressions[characterId] || 0) + 1,
  }
}

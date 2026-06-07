import type { FocusType } from '../types/game'
import { FOCUSABLE_CHARACTERS } from './characters'
import { characters } from './characters'

export interface FocusConfigItem {
  type: FocusType
  labelKey: string
  subKey: string
  hintKey: string
  color: string
}

function buildFocusConfig(): FocusConfigItem[] {
  const items: FocusConfigItem[] = FOCUSABLE_CHARACTERS.map(charId => ({
    type: charId as FocusType,
    labelKey: `focus.${charId}`,
    subKey: `focus.${charId}Sub`,
    hintKey: `focus.${charId}Hint`,
    color: characters[charId]?.color || '#a8a29e',
  }))
  items.push({
    type: 'environment' as FocusType,
    labelKey: 'focus.env',
    subKey: 'focus.envSub',
    hintKey: 'focus.envHint',
    color: '#a8a29e',
  })
  return items
}

export const FOCUS_CONFIG = buildFocusConfig()

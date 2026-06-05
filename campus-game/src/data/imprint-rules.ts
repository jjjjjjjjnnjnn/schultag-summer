import type { StoryLine } from '../types/game'

export interface ImprintTrigger {
  characterId: string
  type: 'observation' | 'writing'
  threshold: number
  line: StoryLine
}

/** 印记触发规则：当角色印记达到阈值时，在指定场景插入额外叙事 */
export const IMPRINT_RULES: ImprintTrigger[] = [
  // ── 第一章 · 白天 ──
  {
    characterId: 'maya',
    type: 'writing',
    threshold: 1,
    line: {
      type: 'thought',
      text: '今天走进教室的时候，我不自觉地往她的座位看了一眼。',
    },
  },
  {
    characterId: 'maya',
    type: 'writing',
    threshold: 2,
    line: {
      type: 'narration',
      text: '她今天扎了不同的发型。我为什么会注意到这种事。',
    },
  },
  {
    characterId: 'ludwig',
    type: 'writing',
    threshold: 1,
    line: {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '嘿，你今天看起来心不在焉的，在想什么？',
    },
  },
  // ── 第三章 · 白天（打乒乓后的反噬）──
  {
    characterId: 'maya',
    type: 'writing',
    threshold: 3,
    line: {
      type: 'dialogue',
      speaker: 'maya',
      text: '你总是在看什么呢？',
    },
  },
]

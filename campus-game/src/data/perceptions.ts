import type { Perception, PerceptionTag } from '../types/game'

/** 初始认知矩阵：游戏开始时的认知状态 */
export const INITIAL_PERCEPTIONS: Perception[] = [
  // Robert 对其他人
  { from: 'robert', to: 'ludwig', tags: ['indifferent'], source: 'dialogue', intensity: 0.3 },
  { from: 'robert', to: 'maya', tags: ['curious'], source: 'dialogue', intensity: 0.2 },

  // Ludwig 对其他人
  { from: 'ludwig', to: 'robert', tags: ['admiring'], source: 'dialogue', intensity: 0.4 },
  { from: 'ludwig', to: 'maya', tags: ['curious'], source: 'dialogue', intensity: 0.3 },

  // Maya 对其他人
  { from: 'maya', to: 'robert', tags: ['confused'], source: 'dialogue', intensity: 0.2 },
  { from: 'maya', to: 'ludwig', tags: ['distant'], source: 'dialogue', intensity: 0.3 },
]

/** 认知变化触发器：定义事件如何改变认知 */
export interface PerceptionTrigger {
  /** 触发条件 */
  condition: {
    type: 'writingTag' | 'consequence' | 'imprintThreshold'
    value: string | number
  }
  /** 产生的认知变化 */
  change: {
    from: string
    to: string
    addTags: PerceptionTag[]
    removeTags: PerceptionTag[]
    intensityDelta: number
  }
}

export const PERCEPTION_TRIGGERS: PerceptionTrigger[] = [
  // Robert 写了关于 Ludwig 的内容
  {
    condition: { type: 'writingTag', value: 'wrote-ludwig' },
    change: { from: 'ludwig', to: 'robert', addTags: ['trusting'], removeTags: ['admiring'], intensityDelta: 0.2 },
  },
  // Robert 写了关于 Maya 的内容
  {
    condition: { type: 'writingTag', value: 'wrote-maya-class' },
    change: { from: 'maya', to: 'robert', addTags: ['curious'], removeTags: ['confused'], intensityDelta: 0.3 },
  },
  // 暴露度升高
  {
    condition: { type: 'imprintThreshold', value: 20 },
    change: { from: 'ludwig', to: 'robert', addTags: ['wary'], removeTags: [], intensityDelta: 0.1 },
  },
  // Ludwig 行为改变后
  {
    condition: { type: 'consequence', value: 'ludwig-more-open' },
    change: { from: 'maya', to: 'ludwig', addTags: ['admiring'], removeTags: ['distant'], intensityDelta: 0.2 },
  },
  {
    condition: { type: 'writingTag', value: 'wrote-maya-pingpong' },
    change: { from: 'maya', to: 'robert', addTags: ['trusting'], removeTags: ['curious'], intensityDelta: 0.2 },
  },
  {
    condition: { type: 'writingTag', value: 'deep-talk-ludwig' },
    change: { from: 'ludwig', to: 'robert', addTags: ['trusting'], removeTags: ['admiring'], intensityDelta: 0.3 },
  },
]

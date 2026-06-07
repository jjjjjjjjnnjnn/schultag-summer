import type { Evidence } from '../types/game'

export const ALL_EVIDENCE: Evidence[] = [
  {
    id: 'ev-wrong-date',
    title: '错误的创建日期',
    description: '文档属性的创建日期是2025-08-01。但Robert是2025-08-08才开始写这本小说的。文档在他开始写作之前，就已经存在。',
    cid: 'evidence.ev-wrong-date',
    type: 'anomaly',
    chapterId: 'ch01',
    isKeyEvidence: true,
  },
  {
    id: 'ev-maya-name',
    title: 'Maya的名字',
    description: 'Robert第一次听到"Maya"这个名字，是Maya自我介绍的时候。但文档里提前出现了"Maya"的缩写。像是有人已经知道她会来。',
    cid: 'evidence.ev-maya-name',
    type: 'contradiction',
    chapterId: 'ch01',
    isKeyEvidence: false,
  },
  {
    id: 'ev-light-twice',
    title: '重复的光',
    description: '走廊的光出现了两次。一次是第一天。一次是现在。但这两次不可能来自同一个记忆——因为第一次观察时，Robert还没有开始写作。',
    cid: 'evidence.ev-light-twice',
    type: 'anomaly',
    chapterId: 'ch02',
    isKeyEvidence: true,
  },
  {
    id: 'ev-first-line',
    title: '陌生的第一行',
    description: '文档开头出现了一行Robert不记得写过的文字："她来的那天雨很大。" 但Maya来的那天是晴天。',
    cid: 'evidence.ev-first-line',
    type: 'anomaly',
    chapterId: 'ch03',
    isKeyEvidence: true,
  },
  {
    id: 'ev-ludwig-line',
    title: 'Ludwig的台词',
    description: 'Ludwig说了一句话，Robert确定自己没有写过这段对话。但Ludwig说的时候，语气和文档里的一模一样。像是文档在写他，不是他在写文档。',
    cid: 'evidence.ev-ludwig-line',
    type: 'contradiction',
    chapterId: 'ch03',
    isKeyEvidence: false,
  },
  {
    id: 'ev-maya-motion',
    title: 'Maya的动作',
    description: 'Maya做了一个动作——和Robert前一章写过的完全一样。不是巧合的那种像。是精确到角度的像。她不可能读过Robert的文档。',
    cid: 'evidence.ev-maya-motion',
    type: 'prediction',
    chapterId: 'ch04',
    isKeyEvidence: true,
  },
  {
    id: 'ev-future-date',
    title: '未来的日期',
    description: '文档里出现了明天的日期。有一段文字的时间戳显示为未来。Robert还没写的东西，文档已经记下了。',
    cid: 'evidence.ev-future-date',
    type: 'prediction',
    chapterId: 'ch04',
    isKeyEvidence: true,
  },
  {
    id: 'ev-ludwig-knows',
    title: 'Ludwig的直觉',
    description: 'Ludwig问："你有没有觉得——她好像知道什么？" 他不知道自己在说什么。但Robert知道。',
    cid: 'evidence.ev-ludwig-knows',
    type: 'anomaly',
    chapterId: 'ch04',
    isKeyEvidence: false,
  },
  {
    id: 'ev-you-wrote-wrong',
    title: '你写错了',
    description: '文档最下面多了一行字。不是Robert写的。"你写错了。""我那天没有抿嘴。""但是你写完以后，我开始这样做了。"',
    cid: 'evidence.ev-you-wrote-wrong',
    type: 'anomaly',
    chapterId: 'ch05',
    isKeyEvidence: true,
  },
  {
    id: 'ev-deviation',
    title: '偏差累积',
    description: '文档和现实之间的偏差越来越多。Robert开始分不清哪些是他写的、哪些是文档自己写的。或者——哪些是他自己的记忆、哪些是文档写进去的记忆。',
    cid: 'evidence.ev-deviation',
    type: 'contradiction',
    chapterId: 'ch05',
    isKeyEvidence: false,
  },
  {
    id: 'ev-mirror',
    title: '角色互换',
    description: 'Maya的反应越来越不像被写的人。她开始提前知道Robert的行为。像一个角色在反抗自己的作者。或者——也许作者不是Robert。',
    cid: 'evidence.ev-mirror',
    type: 'origin',
    chapterId: 'ch05',
    isKeyEvidence: true,
  },
  {
    id: 'ev-dual-writers',
    title: '双人写作',
    description: '结论：这篇文档从一开始就有两个作者。Robert在写Maya。Maya在写Robert。他们同时在这份文档里写作。每一行都是对方的续写。他们都不知道。',
    cid: 'evidence.ev-dual-writers',
    type: 'origin',
    chapterId: 'ch05',
    isKeyEvidence: true,
  },
]

/** 证据发现的触发条件映射 */
export interface EvidenceTrigger {
  evidenceId: string
  condition: {
    type: 'milestone' | 'tag' | 'observation' | 'exposure' | 'scene' | 'keyCount'
    value: string | number
  }
}

export const EVIDENCE_TRIGGERS: EvidenceTrigger[] = [
  { evidenceId: 'ev-wrong-date', condition: { type: 'milestone', value: 'first-writing' } },
  { evidenceId: 'ev-maya-name', condition: { type: 'scene', value: 'ch01-day' } },
  { evidenceId: 'ev-light-twice', condition: { type: 'observation', value: 'note-light-01' } },
  { evidenceId: 'ev-first-line', condition: { type: 'milestone', value: 'meet-maya' } },
  { evidenceId: 'ev-ludwig-line', condition: { type: 'scene', value: 'ch03-night' } },
  { evidenceId: 'ev-maya-motion', condition: { type: 'tag', value: 'wrote-maya-pingpong' } },
  { evidenceId: 'ev-future-date', condition: { type: 'milestone', value: 'understand-dynamics' } },
  { evidenceId: 'ev-ludwig-knows', condition: { type: 'tag', value: 'wrote-maya-pingpong' } },
  { evidenceId: 'ev-you-wrote-wrong', condition: { type: 'scene', value: 'ch05-epilogue' } },
  { evidenceId: 'ev-deviation', condition: { type: 'exposure', value: 16 } },
  { evidenceId: 'ev-mirror', condition: { type: 'exposure', value: 32 } },
  { evidenceId: 'ev-dual-writers', condition: { type: 'keyCount', value: 6 } },
]

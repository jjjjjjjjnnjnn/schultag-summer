import type { DayScene, NightScene } from '../../types/game'
import { prologueDay, prologueNight } from './prologue'
import { ch01Day, ch01Night } from './ch01'
import { ch02Day, ch02Night } from './ch02'
import { ch03Day, ch03Night } from './ch03'
import { ch04Day, ch04Night } from './ch04'
import { ch05Epilogue } from './epilogue'

export const scenes: Record<string, DayScene | NightScene> = {
  'prologue-day': prologueDay,
  'prologue-night': prologueNight,
  'ch01-day': ch01Day,
  'ch01-night': ch01Night,
  'ch02-day': ch02Day,
  'ch02-night': ch02Night,
  'ch03-day': ch03Day,
  'ch03-night': ch03Night,
  'ch04-day': ch04Day,
  'ch04-night': ch04Night,
  'ch05-epilogue': ch05Epilogue,
}

export interface ChapterMeta {
  id: string
  title: string
  subtitle: string
  startSceneId: string
  time: string
  observationCount: number
  /** 内容翻译 key（用于多语言查找 .title / .subtitle / .time） */
  cid?: string
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'prologue', title: '序章', subtitle: '走廊 → 食堂', startSceneId: 'prologue-day', time: '周五 16:20',
    cid: 'prologue.ch', observationCount: 5 },
  { id: 'ch01', title: '第一章', subtitle: '英语课', startSceneId: 'ch01-day', time: '周三 10:23',
    cid: 'ch01.ch', observationCount: 6 },
  { id: 'ch02', title: '第二章', subtitle: '乒乓球', startSceneId: 'ch02-day', time: '暑假傍晚',
    cid: 'ch02.ch', observationCount: 6 },
  { id: 'ch03', title: '第三章', subtitle: '食堂', startSceneId: 'ch03-day', time: '中午',
    cid: 'ch03.ch', observationCount: 4 },
  { id: 'ch04', title: '第四章', subtitle: '纪录片', startSceneId: 'ch04-day', time: '周六下午',
    cid: 'ch04.ch', observationCount: 4 },
  { id: 'ch05', title: '终章', subtitle: '书桌前', startSceneId: 'ch05-epilogue', time: '深夜',
    cid: 'ch05.ch', observationCount: 0 },
]

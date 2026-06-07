import type { Character } from '../types/game'

export const characters: Record<string, Character> = {
  robert: {
    id: 'robert',
    name: '荣加俊',
    nameEn: 'Robert',
    age: 15,
    role: 'protagonist',
    color: '#d97706',
    traits: ['沉默寡言', '观察者', '中二病', '隐藏作家'],
    impressionLevels: [],
    cid: 'char.robert',
  },
  ludwig: {
    id: 'ludwig',
    name: '王嘉亿',
    nameEn: 'Ludwig',
    age: 15,
    role: 'main',
    color: '#3b82f6',
    traits: ['外向', '爱聊天', '语言天赋', '烘焙爱好者'],
    impressionLevels: ['陌生', '初识', '开始注意到他', '似乎理解他'],
    cid: 'char.ludwig',
  },
  maya: {
    id: 'maya',
    name: '兰若瑶',
    nameEn: 'Maya',
    age: 18,
    role: 'main',
    color: '#8b5cf6',
    traits: ['安静', '观察力强', '生态学爱好者', '动作清晰'],
    impressionLevels: ['陌生', '初识', '开始注意她', '似乎理解她'],
    cid: 'char.maya',
  },
  teacher: {
    id: 'teacher',
    name: '小飞飞',
    nameEn: 'Ms. Fly',
    role: 'teacher',
    color: '#6b7280',
    traits: ['英语老师', '幽默'],
    impressionLevels: [],
    cid: 'char.teacher',
  },
}

export const FOCUSABLE_CHARACTERS = ['maya', 'ludwig'] as const

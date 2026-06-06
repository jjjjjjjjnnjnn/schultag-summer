import type { ConsequenceRule } from '../types/game'

export const CONSEQUENCE_RULES: ConsequenceRule[] = [
  {
    trigger: { type: 'writingTag', value: 'wrote-ludwig' },
    effect: {
      id: 'ludwig-more-open',
      source: 'writing',
      triggerTag: 'wrote-ludwig',
      behaviorDescription: '他开始主动和你聊天，不再只是损你',
      affectedObservations: ['prologue-ludwig-tease', 'prologue-ludwig-phone'],
      duration: 'permanent',
    },
    delayChapters: 1,
  },
  {
    trigger: { type: 'writingTag', value: 'wrote-maya-class' },
    effect: {
      id: 'maya-approaches',
      source: 'writing',
      triggerTag: 'wrote-maya-class',
      behaviorDescription: '她开始主动问你问题，眼神里有好奇',
      affectedObservations: ['ch01-maya-notebook'],
      duration: 'permanent',
    },
    delayChapters: 1,
  },
  {
    trigger: { type: 'writingTag', value: 'wrote-novel' },
    effect: {
      id: 'exposure-increase',
      source: 'writing',
      triggerTag: 'wrote-novel',
      behaviorDescription: '你写的东西开始影响你看待他们的方式',
      affectedObservations: [],
      duration: 'chapter',
    },
    delayChapters: 0,
  },
  {
    trigger: { type: 'writingTag', value: 'wrote-phone' },
    effect: {
      id: 'ludwig-phone-aware',
      source: 'writing',
      triggerTag: 'wrote-phone',
      behaviorDescription: '他注意到你在看他，收起了手机',
      affectedObservations: ['prologue-ludwig-phone'],
      duration: 'chapter',
    },
    delayChapters: 1,
  },
  {
    trigger: { type: 'writingTag', value: 'wrote-maya-pingpong' },
    effect: {
      id: 'maya-opens-up',
      source: 'writing',
      triggerTag: 'wrote-maya-pingpong',
      behaviorDescription: '她开始和你分享更多关于自己的事',
      affectedObservations: ['ch03-maya-phone', 'ch04-maya-watch'],
      duration: 'permanent',
    },
    delayChapters: 1,
  },
  {
    trigger: { type: 'writingTag', value: 'deep-maya-pingpong' },
    effect: {
      id: 'maya-trusts-deep',
      source: 'writing',
      triggerTag: 'deep-maya-pingpong',
      behaviorDescription: '她看你的眼神变了，像是在确认什么',
      affectedObservations: ['ch04-maya-watch'],
      duration: 'permanent',
    },
    delayChapters: 1,
  },
  {
    trigger: { type: 'writingTag', value: 'observed-maya-inner' },
    effect: {
      id: 'maya-aware',
      source: 'writing',
      triggerTag: 'observed-maya-inner',
      behaviorDescription: '她似乎感觉到了你在注视她的内心',
      affectedObservations: [],
      duration: 'permanent',
    },
    delayChapters: 0,
  },
  {
    trigger: { type: 'writingTag', value: 'deep-talk-ludwig' },
    effect: {
      id: 'ludwig-vulnerable',
      source: 'writing',
      triggerTag: 'deep-talk-ludwig',
      behaviorDescription: '他不再只是开玩笑，开始说真心话',
      affectedObservations: ['ch04-ludwig-bored'],
      duration: 'permanent',
    },
    delayChapters: 1,
  },
]

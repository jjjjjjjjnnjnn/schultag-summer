import type { DayScene, NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 第三章 · 闲聊 / 夜聊
// ═══════════════════════════════════════════════

export const ch03Day: DayScene = {
  id: 'ch03-day',
  mode: 'day',
  location: '食堂',
  timeOfDay: '中午',
  titleCard: { day: '周四', time: '12:15' },
  intro: [
    { type: 'narration', text: '中午，食堂。我们坐在靠窗的位置。',
        cid: 'ch03.day.intro.0' },
    { type: 'narration', text: '兰若瑶坐在对面，低头吃饭。',
        cid: 'ch03.day.intro.1' },
    // 反噬爆点：如果玩家写过 Maya（三层递进）
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '我真的老抿嘴吗？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 1,
        cid: 'ch03.day.intro.2' },
    },
    {
      type: 'thought',
      text: '我愣了一下。\n\n她怎么知道这个？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 1,
        cid: 'ch03.day.intro.3' },
    },
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '王嘉亿昨天也这么说。',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 2,
        cid: 'ch03.day.intro.4' },
    },
    {
      type: 'thought',
      text: '王嘉亿？他怎么知道？\n\n是我写的那篇东西被他看到了？\n\n还是他也注意到了？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 2,
        cid: 'ch03.day.intro.5' },
    },
    // 焦点叠加反噬：连续 2 章 Maya 焦点
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你今天怎么一直看着我？',
      requiresFocusHistory: { characterId: 'maya', count: 2,
        cid: 'ch03.day.intro.6' },
    },
    {
      type: 'thought',
      text: '我……有吗？',
      requiresFocusHistory: { characterId: 'maya', count: 2,
        cid: 'ch03.day.intro.7' },
    },
    // Observation Echo: 观察过"兰若瑶的笔记"
    {
      type: 'narration',
      text: '她吃饭的时候，手指在桌面上轻轻敲了两下。像在写什么。',
      requiresObservation: 'note-maya-note-01',
        cid: 'ch03.day.intro.8'
    },
    // Writing Echo: 暴露度 >= 32
    {
      type: 'thought',
      text: '我犹豫了一下。\n\n这次，我不想写她了。\n\n但我的眼睛还是会自动找到她。',
      requiresExposure: 32,
        cid: 'ch03.day.intro.9'
    },
  ],
  observations: [
    {
      id: 'ch03-ludwig-ask',
      name: 'Ludwig 问你怎么看待新同学',
      description: '他在试探你的态度',
      observationText: '王嘉亿把椅子往前拖了拖，压低声音："话说，你打算怎么对待她啊。"他的语气不像在问一件小事，像在确认什么。',
      notebookEntry: {
        id: 'note-ch03-ludwig-ask-01',
        label: 'Ludwig 的试探',
        text: '"你打算怎么对待她啊。"他的语气不像在问一件小事，像在确认什么。',
        category: 'dialogue',
        cid: 'ch03.day.obs.0.nb',
      },
      cid: 'ch03.day.obs.0',
      relationshipEffect: { characterId: 'ludwig', delta: 1 },
      position: { x: 30, y: 45 },
      focusGroup: 'ludwig',

    },
    {
      id: 'ch03-maya-phone',
      name: '兰若瑶的手机壳',
      description: '她手机壳上的图案',
      observationText: '她的手机壳上印着一只北极熊。说是大卫·爱登堡的粉丝。她翻手机的时候，那只北极熊在光线下一亮一亮的。',
      notebookEntry: {
        id: 'note-ch03-maya-phone-01',
        label: '北极熊手机壳',
        text: '她的手机壳上印着一只北极熊。说是大卫·爱登堡的粉丝。',
        category: 'visual',
        cid: 'ch03.day.obs.1.nb',
      },
      cid: 'ch03.day.obs.1',
      relationshipEffect: { characterId: 'maya', delta: 1 },
      invasionLevel: 2,
      position: { x: 65, y: 45 },
      focusGroup: 'maya',
      focusAddendumDeep: '她的手机壳上印着一只北极熊。我发现自己已经记住了那只北极熊的每一个细节——耳朵的弧度、鼻子上的高光。',

    },
    {
      id: 'ch03-food',
      name: '食堂午餐的细节',
      description: '今天的午餐',
      observationText: '今天的意大利面配西红柿肉燥酱。旁边有一小碟沙拉。窗外的光透过窗户照到桌上，餐盘上也有一点。',
      notebookEntry: {
        id: 'note-ch03-food-01',
        label: '午餐',
        text: '意大利面配西红柿肉燥酱。窗外的光透过窗户照到桌上。',
        category: 'smell',
        cid: 'ch03.day.obs.2.nb',
      },
      cid: 'ch03.day.obs.2',
      position: { x: 48, y: 60 },
      focusGroup: 'environment',

    },
    {
      id: 'ch03-maya-voice',
      name: '兰若瑶说话的方式',
      description: '她聊天时的语气',
      observationText: '她说话的时候会用手比划。不是那种夸张的手势，而是很轻的、跟着语调走的动作。说到"海洋危机"的时候，她的手往下压了一下，像在模仿海水下沉。',
      notebookEntry: {
        id: 'note-ch03-maya-voice-01',
        label: '手势',
        text: '她说话的时候会用手比划。说到"海洋危机"的时候，她的手往下压了一下。',
        category: 'action',
        cid: 'ch03.day.obs.3.nb',
      },
      cid: 'ch03.day.obs.3',
      invasionLevel: 1,
      position: { x: 72, y: 55 },
      focusGroup: 'maya',

    },
  ],
  outro: [
    { type: 'narration', text: '食堂的光慢慢移了位置。午餐时间快结束了。',
        cid: 'ch03.day.outro.0' },
    { type: 'narration', text: '王嘉亿把最后一块面包塞进嘴里，含糊地说了句什么。',
        cid: 'ch03.day.outro.1' },
    { type: 'narration', text: '我看着窗外。今天什么也没发生。但好像又发生了很多。',
        cid: 'ch03.day.outro.2' },
  ],
  nextSceneId: 'ch03-night',
  attentionBudget: 3,
  focusCosts: { maya: 2, ludwig: 1, environment: 1 },
  sceneLayout: {
    elements: [
      // 餐桌
      { style: { position: 'absolute', left: '15%', top: '40%', width: '70%', height: '25%', border: '1px solid rgba(168,162,158,0.08)', borderRadius: 2 } },
      // 窗户
      { style: { position: 'absolute', right: 2, top: '10%', width: 2, height: '25%', background: 'rgba(200,150,50,0.1)' }, label: '窗户' },
      // 窗户光照区
      { style: { position: 'absolute', right: '18%', top: '40%', width: '20%', height: '25%', background: 'rgba(200,150,50,0.03)' } },
      // 餐盘
      { style: { position: 'absolute', left: '42%', top: '48%', width: '16%', height: '8%', border: '1px solid rgba(168,162,158,0.06)', borderRadius: 1 } },
    ],
  },
  cid: 'ch03.day',
}

export const ch03Night: NightScene = {
  id: 'ch03-night',
  mode: 'night',
  location: '宿舍 · 深夜',
  lines: [
    { type: 'narration', text: '深夜。走廊的灯已经灭了一半。',
        cid: 'ch03.night.lines.0' },
    { type: 'narration', text: '王嘉亿翻了个身。我以为他睡了。',
        cid: 'ch03.night.lines.1' },
    { type: 'dialogue', speaker: 'ludwig', text: '你睡了吗。',
        cid: 'ch03.night.lines.2' },
    { type: 'dialogue', speaker: 'robert', text: '没有。',
        cid: 'ch03.night.lines.3' },
    { type: 'dialogue', speaker: 'ludwig', text: '你有没有觉得……就是，和女生打交道这件事，特别难。',
        cid: 'ch03.night.lines.4' },
    { type: 'thought', text: '他在黑暗里说这话的时候，声音听起来比平时轻很多。',
        cid: 'ch03.night.lines.5' },
    { type: 'dialogue', speaker: 'robert', text: '为什么突然问这个。',
        cid: 'ch03.night.lines.6' },
    { type: 'dialogue', speaker: 'ludwig', text: '就是觉得……你好像也不知道怎么和她说话。',
        cid: 'ch03.night.lines.7' },
    {
      type: 'narration',
      text: '我翻到文档的开头。\n\n第一行不是我写的。\n\n但那是Maya来的第一天。',
      requiresMilestone: 'meet-maya',
      cid: 'ch03.night.lines.milestone.0',
    },
  ],
  writingPhase: {
    prompt: '深夜的对话。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-ch03-ludwig-ask-01', 'note-ch03-maya-phone-01'],
        composedText: '他在试探我怎么看待她。\n\n她的手机壳上有一只北极熊。\n\n我不知道该怎么回答他。因为我自己也不知道。\n\n——\n\n有些问题，不是用来回答的。是用来让两个人在黑暗里，各自想一想的。',
        influenceTag: 'deep-talk-ludwig',

        cid: 'ch03.night.wp.recipe.0',
      },
      {
        requiredEntries: ['note-ch03-maya-voice-01', 'note-ch03-food-01'],
        composedText: '她说话的时候会用手比划。\n\n今天的意大利面配西红柿肉燥酱。\n\n这些细节好像没什么用。但我就是记住了。',
        influenceTag: 'wrote-maya-voice',

        cid: 'ch03.night.wp.recipe.1',
      },
      {
        requiredEntries: ['note-ch03-maya-phone-01', 'note-ch03-maya-voice-01'],
        composedText: '北极熊手机壳。说话时的手势。\n\n我发现自己开始注意她的一些……不是所有人都会注意到的东西。\n\n这让我有点不安。',
        influenceTag: 'wrote-maya-detail',

        cid: 'ch03.night.wp.recipe.2',
      },
    ],
    defaultText: '深夜的对话。王嘉亿问了一个问题。我没有回答。雨还在下。',
    cid: 'ch03.night.wp',
  },
  nextSceneId: 'ch04-day',
  cid: 'ch03.night',
}

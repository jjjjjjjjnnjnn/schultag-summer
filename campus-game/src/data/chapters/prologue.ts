import type { DayScene, NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 序章 · 食堂
// ═══════════════════════════════════════════════

export const prologueDay: DayScene = {
  id: 'prologue-day',
  mode: 'day',
  location: '学校走廊 → 食堂',
  timeOfDay: '放学后',
  titleCard: { day: '周五', time: '16:20' },
  intro: [
    { type: 'narration', text: '走廊尽头的窗户透进光来。又是这个时间。',
        cid: 'prologue.day.intro.tutorial.0' },
    { type: 'narration', text: '你可以选择今天更留意谁。',
        cid: 'prologue.day.intro.tutorial.1' },
    { type: 'narration', text: '我叫荣加俊。今年十五岁。写了九十万字。',
        cid: 'prologue.day.intro.0' },
    { type: 'narration', text: '没有人知道这件事。直到今天。',
        cid: 'prologue.day.intro.1' },
    { type: 'narration', text: '王嘉亿站起来的速度比平时快了半秒。两个人往食堂走。',
        cid: 'prologue.day.intro.2' },
  ],
  observations: [
    {
      id: 'prologue-light',
      name: '走廊的光',
      description: '窗外照进来的光带',
      observationText: '走过那道光的时候，有一瞬间整个人都是亮的，然后暗下去，继续走。像一道分界线——从教室走出来的一瞬间，什么都被照亮了，然后又回到日常的暗处。',
      notebookEntry: {
        id: 'note-light-01',
        label: '走廊的光',
        text: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。走过那道光的时候，有一瞬间整个人都是亮的，然后暗下去，继续走。',
        category: 'visual',
        cid: 'prologue.day.obs.0.nb',
      },
      cid: 'prologue.day.obs.0',
      position: { x: 12, y: 30 },
      focusGroup: 'environment',

    },
    {
      id: 'prologue-maya-hallway',
      name: '走廊尽头的人影',
      description: '走廊尽头站着一个不认识的人',
      observationText: '走廊尽头站着一个女生。背着一个很大的双肩包，拉链上挂着一个毛绒挂件。她站在那里，像是在等什么人，又像是刚到、还不知道往哪里走。她的眼神有点茫然，但嘴角带着一点很淡的笑——那种不确定自己在笑什么的笑。',
      notebookEntry: {
        id: 'note-maya-hallway-01',
        label: '走廊尽头的人',
        text: '走廊尽头站着一个女生。背着很大的双肩包，拉链上挂着毛绒挂件。她站在那里，像是在等什么人。',
        category: 'visual',
        cid: 'prologue.day.obs.1.nb',
      },
      cid: 'prologue.day.obs.1',
      relationshipEffect: { characterId: 'maya', delta: 1 },
      position: { x: 70, y: 35 },
      focusGroup: 'maya',

    },
    {
      id: 'prologue-ludwig-phone',
      name: '王嘉亿在看手机',
      description: '他看手机时的表情',
      observationText: '他走路的时候眼睛一直盯着手机屏幕，嘴角带着笑。不知道在看什么。我凑过去看了一眼——是群聊消息，有人发了个表情包。他抬头看了我一眼："看什么看，你又不是没见过手机。"',
      notebookEntry: {
        id: 'note-ludwig-phone-01',
        label: 'Ludwig 的群聊',
        text: '他走路的时候眼睛一直盯着手机屏幕，嘴角带着笑。"看什么看，你又不是没见过手机。"',
        category: 'action',
        cid: 'prologue.day.obs.2.nb',
      },
      cid: 'prologue.day.obs.2',
      relationshipEffect: { characterId: 'ludwig', delta: 1 },
      position: { x: 30, y: 45 },
      focusGroup: 'ludwig',

    },
    {
      id: 'prologue-ludwig-tease',
      name: '王嘉亿的玩笑',
      description: '他在介绍你的时候那种语气',
      observationText: '"我们荣哥，那可是大人物。现实里的reclusive，内心世界里的护国公。你以为他在发呆，其实他在脑子里——拯救世界。" 他的语气带一种不怀好意的笑，声音在走廊里飘着，轻轻松松的。',
      notebookEntry: {
        id: 'note-ludwig-tease-01',
        label: '王嘉亿的评价',
        text: '"中二病晚期。现实里的reclusive，内心世界里的护国公。"——王嘉亿的语气带一种不怀好意的笑，在走廊里飘着。',
        category: 'dialogue',
        cid: 'prologue.day.obs.3.nb',
      },
      cid: 'prologue.day.obs.3',
      relationshipEffect: { characterId: 'ludwig', delta: 1 },
      position: { x: 42, y: 50 },
      focusGroup: 'ludwig',

    },
    {
      id: 'prologue-ninety',
      name: '九十万字',
      description: '你对兰若瑶说的那个数字',
      observationText: '"几十万吧。"这句话出口的时候，我感到那些字像一小堆晒干的叶子，被一把从藏身处翻出来摊在了太阳底下。几十万字——我自己几乎从没对人说过这个数字。那是我自己的东西。放在电脑文件夹里，放在U盘里，放在深夜台灯底下的东西。被写出来、被说出来，是两回事。',
      notebookEntry: {
        id: 'note-ninety-01',
        label: '九十万字',
        text: '"几十万吧。"——那些字像一小堆晒干的叶子，被一把从藏身处翻出来摊在了太阳底下。被写出来、被说出来，是两回事。',
        category: 'thought',
        cid: 'prologue.day.obs.4.nb',
      },
      cid: 'prologue.day.obs.4',
      position: { x: 85, y: 65 },
      focusGroup: 'environment',

    },
  ],
  outro: [
    { type: 'narration', text: '食堂门口。意面的味道涌出来。',
        cid: 'prologue.day.outro.0' },
    { type: 'dialogue', speaker: 'ludwig', text: '话说，老师说我们下周三要来一个中国新同学。',
        cid: 'prologue.day.outro.1' },
    { type: 'dialogue', speaker: 'robert', text: '哦。',
        cid: 'prologue.day.outro.2' },
    { type: 'dialogue', speaker: 'ludwig', text: '好像还是女同学。',
        cid: 'prologue.day.outro.3' },
    { type: 'thought', text: '我没接话。但我在想——新同学。',
        cid: 'prologue.day.outro.4' },
    { type: 'thought', text: '我写了九十万字。没有人知道。因为里面写的，全都是身边的人。',
        cid: 'prologue.day.outro.5' },
  ],
  nextSceneId: 'prologue-night',
  attentionBudget: 3,
  focusCosts: { maya: 2, ludwig: 2, environment: 1 },
  sceneLayout: {
    elements: [
      // 左墙
      { style: { position: 'absolute', left: 0, top: '10%', width: 2, height: '70%', background: 'rgba(168,162,158,0.12)' } },
      // 走廊窗户
      { style: { position: 'absolute', left: '5%', top: '15%', width: '15%', height: 1, background: 'rgba(200,150,50,0.15)' } },
      { style: { position: 'absolute', left: '5%', top: '15%', width: 1, height: '20%', background: 'rgba(200,150,50,0.1)' }, label: '窗户' },
      // 走廊地面线
      { style: { position: 'absolute', left: 0, top: '75%', width: '55%', height: 1, background: 'rgba(168,162,158,0.08)' } },
      // 食堂入口
      { style: { position: 'absolute', left: '55%', top: '10%', width: 1, height: '65%', background: 'rgba(168,162,158,0.1)' } },
      { style: { position: 'absolute', left: '53%', top: '10%', width: '8%', height: 1, background: 'rgba(168,162,158,0.1)' } },
      // 食堂区域标签
      { style: { position: 'absolute', left: '65%', top: '80%', width: 'auto', height: 'auto' }, label: '食堂' },
    ],
  },
  cid: 'prologue.day',
}

export const prologueNight: NightScene = {
  id: 'prologue-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '回到宿舍。关上门。U盘从口袋里掏出来，搁在桌上。银色的，边角磨得发白。',
        cid: 'prologue.night.lines.0' },
    { type: 'narration', text: '我站在桌前。窗外有一点光，窗帘没拉全，缝里透进来一小条。',
        cid: 'prologue.night.lines.1' },
    { type: 'narration', text: '打开电脑。屏幕亮起来。文档还开着，光标在最后一行的末尾一闪一闪。',
        cid: 'prologue.night.lines.2' },
    { type: 'narration', text: '今天的事在脑子里重新排列。',
        cid: 'prologue.night.lines.3' },
  ],
  writingPhase: {
    prompt: '今天观察到了这些。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-light-01', 'note-ludwig-tease-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。走过那道光的时候，有一瞬间整个人都是亮的，然后暗下去，继续走。\n\n"中二病晚期。现实里的reclusive，内心世界里的护国公。"\n\n被照亮的那一瞬间，好像什么都暴露了。\n\n——\n\n我把它写下来了。关于光，关于王嘉亿怎么形容我。\n\n这些句子放进文档里的时候，好像变成了某种证据。证明今天真的发生了这些事。',
        influenceTag: 'wrote-ludwig',
        perspectiveModifiers: {
          objective: '我注意到这些，就这样写下来了。',
          literary: '像有人把藏了很久的东西掀开了一个角。',
          analytical: '暴露本身比内容更让我不安。',
          projection: '也许我不是怕被看见，是怕没人看见。',
        },
        cid: 'prologue.night.wp.recipe.0',
      },
      {
        requiredEntries: ['note-light-01', 'note-ninety-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。\n\n"几十万吧。"——那些字像一小堆晒干的叶子，被一把从藏身处翻出来摊在了太阳底下。\n\n光和文字，都在暴露我。',
        influenceTag: 'wrote-novel',
        perspectiveModifiers: {
          objective: '光和话，我都记下来了。',
          literary: '像一小堆晒干的叶子被翻了出来。',
          analytical: '说出口和写下来，分量不一样。',
          projection: '我有时候觉得，被看见也没那么糟。',
        },
        cid: 'prologue.night.wp.recipe.1',
      },
      {
        requiredEntries: ['note-ludwig-phone-01', 'note-ninety-01'],
        composedText: '他走路的时候眼睛一直盯着手机屏幕，嘴角带着笑。\n\n"几十万吧。"——我自己几乎从没对人说过这个数字。\n\n他活在他的群聊里，我活在我的九十万字里。我们走在一起，但不在同一个世界。',
        influenceTag: 'wrote-phone',
        perspectiveModifiers: {
          objective: '他活在他的群聊里，我活在我的文档里。',
          literary: '我们走在一起，但不在同一个世界。',
          analytical: '同样的时间，完全不同的存在方式。',
          projection: '也许他也在写什么。只是没告诉我。',
        },
        cid: 'prologue.night.wp.recipe.2',
      },
    ],
    defaultText: '今天发生了一些事。走廊里的光，食堂的味道，王嘉亿的笑话。等我慢慢写下来。',
    cid: 'prologue.night.wp',
  },
  nextSceneId: 'ch01-day',
  cid: 'prologue.night',
}

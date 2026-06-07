import type { DayScene, NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 第四章 · 看纪录片
// ═══════════════════════════════════════════════

export const ch04Day: DayScene = {
  id: 'ch04-day',
  mode: 'day',
  location: '食堂二楼',
  timeOfDay: '周六下午',
  titleCard: { day: '周六', time: '16:20' },
  intro: [
    { type: 'narration', text: '兰若瑶说想看纪录片。',
        cid: 'ch04.day.intro.0' },
    { type: 'narration', text: '约了周六下午四点。结果五点二十才出门。',
        cid: 'ch04.day.intro.1' },
    // 第四次异常：如果玩家第三章写了 Maya
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你有没有觉得……她好像知道什么？',
      requiresTag: 'wrote-maya-pingpong',
        cid: 'ch04.day.intro.2'
    },
    {
      type: 'dialogue',
      speaker: 'robert',
      text: '什么意思？',
      requiresTag: 'wrote-maya-pingpong',
        cid: 'ch04.day.intro.3'
    },
    // 焦点叠加反噬：连续 3 章 Maya 焦点
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你是不是在写我？',
      requiresFocusHistory: { characterId: 'maya', count: 3,
        cid: 'ch04.day.intro.4' },
    },
    {
      type: 'thought',
      text: '她怎么会这么问？\n\n我写的那些东西……她不可能看到。',
      requiresFocusHistory: { characterId: 'maya', count: 3,
        cid: 'ch04.day.intro.5' },
    },
    // Focus Echo 深度：Maya 焦点 3 章
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你写的那些东西……能给我看看吗？',
      requiresFocusHistory: { characterId: 'maya', count: 3,
        cid: 'ch04.day.intro.6' },
    },
    {
      type: 'thought',
      text: '我……写了什么？\n\n她怎么会知道我在写？',
      requiresFocusHistory: { characterId: 'maya', count: 3,
        cid: 'ch04.day.intro.7' },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '不知道。就是觉得。',
      requiresTag: 'wrote-maya-pingpong',
        cid: 'ch04.day.intro.8'
    },
    // Observation Echo: 观察过"兰若瑶的声音"
    {
      type: 'thought',
      text: '她说话的时候，我又在听那个节奏。\n像一把干净的尺子在纸上划出直线。',
      requiresObservation: 'note-maya-voice-01',
        cid: 'ch04.day.intro.9'
    },
    { type: 'narration', text: '食堂二楼的灯只开了一半。我们找了张靠墙的桌子，把笔记本搬出来。',
        cid: 'ch04.day.intro.10' },
    { type: 'dialogue', speaker: 'maya', text: '看《海洋》。',
        cid: 'ch04.day.intro.11' },
    { type: 'narration', text: '屏幕亮起来的时候，窗外的天还亮着。',
        cid: 'ch04.day.intro.12' },
  ],
  observations: [
    {
      id: 'ch04-ocean',
      name: '纪录片里的鱼群',
      description: '银色的鱼群在水里转',
      observationText: '鱼群被什么驱赶着，队形从球状拉成条状，又散开，又聚拢。解说词在讲洋流，讲磷虾，讲食物链。银色的，密密麻麻，在水里转，像一整片金属在呼吸。',
      notebookEntry: {
        id: 'note-ch04-ocean-01',
        label: '鱼群',
        text: '鱼群被什么驱赶着，队形从球状拉成条状。银色的，密密麻麻，像一整片金属在呼吸。',
        category: 'visual',
        cid: 'ch04.day.obs.0.nb',
      },
      cid: 'ch04.day.obs.0',
      position: { x: 45, y: 30 },
      focusGroup: 'environment',

    },
    {
      id: 'ch04-maya-watch',
      name: '兰若瑶看纪录片时的表情',
      description: '她专注的样子',
      observationText: '她看纪录片的时候很安静。眼睛一动不动地盯着屏幕，偶尔抿一下嘴。说到珊瑚白化的时候，她的眉头皱了一下。',
      notebookEntry: {
        id: 'note-ch04-maya-watch-01',
        label: '专注',
        text: '她看纪录片的时候很安静。说到珊瑚白化的时候，她的眉头皱了一下。很轻，但我看到了。',
        category: 'visual',
        cid: 'ch04.day.obs.1.nb',
      },
      cid: 'ch04.day.obs.1',
      relationshipEffect: { characterId: 'maya', delta: 1 },
      invasionLevel: 2,
      position: { x: 60, y: 50 },
      focusGroup: 'maya',
      focusAddendumDeep: '她看纪录片的时候很安静。我发现自己也在安静——不是因为纪录片，而是因为想和她保持同样的节奏。',

    },
    {
      id: 'ch04-ludwig-bored',
      name: 'Ludwig 看到一半开始玩手机',
      description: '他的注意力转移了',
      observationText: '王嘉亿看了大概二十分钟就开始玩手机了。屏幕的光映在他脸上，一亮一亮的。他偶尔抬头看一眼屏幕，然后又低下去。但当解说说到"柠檬鲨"的时候，他抬头了："这个好看。"',
      notebookEntry: {
        id: 'note-ch04-ludwig-bored-01',
        label: 'Ludwig 的注意力',
        text: '他看了二十分钟就开始玩手机。但说到"柠檬鲨"的时候，他抬头了："这个好看。"',
        category: 'action',
        cid: 'ch04.day.obs.2.nb',
      },
      cid: 'ch04.day.obs.2',
      position: { x: 25, y: 60 },
      focusGroup: 'ludwig',

    },
    {
      id: 'ch04-light',
      name: '食堂的光线变化',
      description: '从下午到傍晚',
      observationText: '窗外的天色在变。从亮蓝色变成橘黄色，再变成灰紫色。食堂的灯管在桌面上映出一道白杠，和窗外的光混在一起。屏幕的光越来越亮，因为外面越来越暗了。',
      notebookEntry: {
        id: 'note-ch04-light-01',
        label: '光线变化',
        text: '窗外的天色从亮蓝变成橘黄，再变成灰紫。屏幕的光越来越亮，因为外面越来越暗了。',
        category: 'visual',
        cid: 'ch04.day.obs.3.nb',
      },
      cid: 'ch04.day.obs.3',
      position: { x: 85, y: 20 },
      focusGroup: 'environment',

    },
  ],
  outro: [
    { type: 'narration', text: '纪录片看完了。屏幕暗下去。',
        cid: 'ch04.day.outro.0' },
    { type: 'dialogue', speaker: 'maya', text: '好看吗？',
        cid: 'ch04.day.outro.1' },
    { type: 'dialogue', speaker: 'ludwig', text: '柠檬鲨好看。',
        cid: 'ch04.day.outro.2' },
    { type: 'narration', text: '兰若瑶笑了一下。我也笑了一下。',
        cid: 'ch04.day.outro.3' },
    { type: 'narration', text: '我们收了笔记本，往宿舍走。走廊里已经没什么人了。',
        cid: 'ch04.day.outro.4' },
  ],
  nextSceneId: 'ch04-night',
  attentionBudget: 3,
  focusCosts: { maya: 1, ludwig: 2, environment: 1 },
  sceneLayout: {
    elements: [
      // 后墙
      { style: { position: 'absolute', left: 0, top: 0, width: '100%', height: 2, background: 'rgba(168,162,158,0.08)' } },
      // 屏幕
      { style: { position: 'absolute', left: '30%', top: '15%', width: '35%', height: '30%', border: '1px solid rgba(100,120,180,0.12)', background: 'rgba(100,120,180,0.03)' }, label: '屏幕' },
      // 桌子
      { style: { position: 'absolute', left: '20%', top: '55%', width: '60%', height: '20%', border: '1px solid rgba(168,162,158,0.06)', borderRadius: 2 } },
      // 窗户（渐变色表示天色变化）
      { style: { position: 'absolute', right: 2, top: '5%', width: 2, height: '35%', background: 'linear-gradient(180deg, rgba(100,80,120,0.15) 0%, rgba(200,150,50,0.1) 100%)' }, label: '窗' },
      // 半明半暗天花板
      { style: { position: 'absolute', left: 0, top: '5%', width: '40%', height: 1, background: 'rgba(168,162,158,0.05)' } },
      { style: { position: 'absolute', right: 0, top: '5%', width: '40%', height: 1, background: 'rgba(168,162,158,0.03)' } },
    ],
  },
  cid: 'ch04.day',
}

export const ch04Night: NightScene = {
  id: 'ch04-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '深夜。文档打开了。',
        cid: 'ch04.night.lines.0' },
    { type: 'narration', text: '今天看的纪录片，鱼群在屏幕上转。',
        cid: 'ch04.night.lines.1' },
    { type: 'narration', text: '但她看纪录片时皱眉的样子，比鱼群更清楚。',
        cid: 'ch04.night.lines.2' },
    {
      type: 'thought',
      text: '我开始翻前面的内容。\n\n不是所有的段落都是我写的。\n\n有些段落里的Maya，比我还了解她自己。',
      requiresMilestone: 'understand-dynamics',
      cid: 'ch04.night.lines.milestone.0',
    },
  ],
  writingPhase: {
    prompt: '今天看纪录片。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-ch04-maya-watch-01', 'note-ch04-ocean-01'],
        composedText: '鱼群在屏幕上转，银色的，密密麻麻。\n\n但她看纪录片时皱眉的样子，比鱼群更清楚。\n\n——\n\n我不知道从什么时候开始，我的观察对象从"世界"变成了"她"。',
        influenceTag: 'observed-maya-inner',

        cid: 'ch04.night.wp.recipe.0',
      },
      {
        requiredEntries: ['note-ch04-light-01', 'note-ch04-ocean-01'],
        composedText: '窗外的天色从亮蓝变成橘黄，再变成灰紫。\n\n鱼群在屏幕上转，像一整片金属在呼吸。\n\n有些东西在变。光线在变，季节在变。我好像也在变。',

        cid: 'ch04.night.wp.recipe.1',
      },
      {
        requiredEntries: ['note-ch04-ludwig-bored-01', 'note-ch04-maya-watch-01'],
        composedText: '他看了二十分钟就开始玩手机。但她看完了全程。\n\n有些人对世界好奇，有些人对某件事好奇。\n\n我不知道自己属于哪种。',

        cid: 'ch04.night.wp.recipe.2',
      },
    ],
    defaultText: '今天看了纪录片。海洋很大，鱼群很多。我记下了一些东西。',
    cid: 'ch04.night.wp',
  },
  nextSceneId: 'ch05-epilogue',
  cid: 'ch04.night',
}

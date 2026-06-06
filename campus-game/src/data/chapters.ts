import type { DayScene, NightScene } from '../types/game'

// ═══════════════════════════════════════════════
// 序章 · 食堂
// ═══════════════════════════════════════════════

const prologueDay: DayScene = {
  id: 'prologue-day',
  mode: 'day',
  location: '学校走廊 → 食堂',
  timeOfDay: '放学后',
  titleCard: { day: '周五', time: '16:20' },
  intro: [
    { type: 'narration', text: '我叫荣加俊。今年十五岁。写了九十万字。' },
    { type: 'narration', text: '没有人知道这件事。直到今天。' },
    { type: 'narration', text: '王嘉亿站起来的速度比平时快了半秒。两个人往食堂走。' },
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
      },
      position: { x: 12, y: 30 },
      focusGroup: 'environment',
    },
    {
      id: 'prologue-food-smell',
      name: '食堂的气味',
      description: '从食堂飘出来的味道',
      observationText: '今天大概是意面。还有那股说不清楚的、学校食堂独有的味道——消毒水、加热的金属餐盘、放了很久的烤面包混在一起。不是好的那种好吃，是那种你每天闻到就会条件反射的味道。',
      notebookEntry: {
        id: 'note-smell-01',
        label: '食堂意面味',
        text: '食堂的气味飘过来——意面、番茄酱和煮过头的肉味混在一起，学校食堂独有的味道。消毒水、加热的金属餐盘、放了很久的烤面包。',
        category: 'smell',
      },
      position: { x: 70, y: 35 },
      focusGroup: 'environment',
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
      },
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
      },
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
      },
      position: { x: 85, y: 65 },
      focusGroup: 'environment',
    },
  ],
  outro: [
    { type: 'narration', text: '食堂门口。意面的味道涌出来。' },
    { type: 'dialogue', speaker: 'ludwig', text: '话说，老师说我们下周三要来一个中国新同学。' },
    { type: 'dialogue', speaker: 'robert', text: '哦。' },
    { type: 'dialogue', speaker: 'ludwig', text: '好像还是女同学。' },
    { type: 'thought', text: '我没接话。但我在想——新同学。' },
    { type: 'thought', text: '我写了九十万字。没有人知道。因为里面写的，全都是身边的人。' },
  ],
  nextSceneId: 'prologue-night',
  attentionBudget: 3,
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
}

const prologueNight: NightScene = {
  id: 'prologue-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '回到宿舍。关上门。U盘从口袋里掏出来，搁在桌上。银色的，边角磨得发白。' },
    { type: 'narration', text: '我站在桌前。窗外有一点光，窗帘没拉全，缝里透进来一小条。' },
    { type: 'narration', text: '打开电脑。屏幕亮起来。文档还开着，光标在最后一行的末尾一闪一闪。' },
    { type: 'narration', text: '今天的事在脑子里重新排列。' },
  ],
  writingPhase: {
    prompt: '今天观察到了这些。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-light-01', 'note-ludwig-tease-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。走过那道光的时候，有一瞬间整个人都是亮的，然后暗下去，继续走。\n\n"中二病晚期。现实里的reclusive，内心世界里的护国公。"\n\n被照亮的那一瞬间，好像什么都暴露了。\n\n——\n\n我把它写下来了。关于光，关于他怎么形容我。\n\n这些句子放进文档里的时候，好像变成了某种证据。证明今天真的发生了这些事。',
        influenceTag: 'wrote-ludwig',
      },
      {
        requiredEntries: ['note-light-01', 'note-ninety-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。\n\n"几十万吧。"——那些字像一小堆晒干的叶子，被一把从藏身处翻出来摊在了太阳底下。\n\n光和文字，都在暴露我。',
        influenceTag: 'wrote-novel',
      },
      {
        requiredEntries: ['note-ludwig-phone-01', 'note-ninety-01'],
        composedText: '他走路的时候眼睛一直盯着手机屏幕，嘴角带着笑。\n\n"几十万吧。"——我自己几乎从没对人说过这个数字。\n\n他活在他的群聊里，我活在我的九十万字里。我们走在一起，但不在同一个世界。',
        influenceTag: 'wrote-phone',
      },
    ],
    defaultText: '今天发生了一些事。走廊里的光，食堂的味道，王嘉亿的笑话。等我慢慢写下来。',
  },
  nextSceneId: 'ch01-day',
}

// ═══════════════════════════════════════════════
// 第一章 · 周三的英语课
// ═══════════════════════════════════════════════

const ch01Day: DayScene = {
  id: 'ch01-day',
  mode: 'day',
  location: '英语教室',
  timeOfDay: '上午',
  titleCard: { day: '周三', time: '10:23' },
  intro: [
    { type: 'narration', text: '周三。英语课。教室里的光从窗户斜着照进来。' },
    { type: 'dialogue', speaker: 'ludwig', text: '哎呀，又是小飞飞的课。' },
    // 即时反噬：根据序章写作方向触发不同异常
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '话说，我昨天突然在想——我看手机的时候，是不是笑得特别明显？',
      requiresTag: 'wrote-ludwig',
    },
    {
      type: 'thought',
      text: '他怎么突然问这个？',
      requiresTag: 'wrote-ludwig',
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你到底写了多少字来着？我昨天突然好奇。',
      requiresTag: 'wrote-novel',
    },
    {
      type: 'thought',
      text: '他怎么突然想起来的？',
      requiresTag: 'wrote-novel',
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '我昨晚做了个怪梦。梦见你当皇帝。',
      requiresTag: 'wrote-phone',
    },
    {
      type: 'thought',
      text: '……',
      requiresTag: 'wrote-phone',
    },
    { type: 'dialogue', speaker: 'ludwig', text: '嘿，今天那个新同学是不是要来了。' },
    { type: 'narration', text: '过了几十分钟。窗外篱笆旁边出现了三个身影。' },
    { type: 'dialogue', speaker: 'ludwig', text: '诶诶诶，看窗外，有一个没见过的女生。' },
    { type: 'narration', text: '门被敲响了。国际部老师用德语和小飞飞说了几句话，就带着家长走了。' },
    { type: 'dialogue', speaker: 'teacher', text: '所以，我们班来了一个新同学。用英语介绍一下自己吧！' },
    { type: 'narration', text: '无人回应。小飞飞看向了我。' },
    { type: 'dialogue', speaker: 'teacher', text: '看样子Robert很期待啊，对吧。' },
    { type: 'narration', text: '我站起来。' },
    { type: 'dialogue', speaker: 'ludwig', text: '加油。', requiresImprint: { characterId: 'ludwig', type: 'writing', threshold: 1 } },
    { type: 'dialogue', speaker: 'robert', text: '我叫荣加俊，英文名Robert，今年15岁。兴趣爱好是学习生物，对创造性项目感兴趣。现在在写小说和散文，一共写了90万字以上。' },
    { type: 'dialogue', speaker: 'teacher', text: 'OK。那接下来Ludwig。' },
    { type: 'dialogue', speaker: 'ludwig', text: '我叫王嘉亿，15岁，喜欢语言学，烘焙，经常旅游。' },
    { type: 'dialogue', speaker: 'teacher', text: '那你呢。' },
    { type: 'narration', text: '新同学站起来。' },
    { type: 'dialogue', speaker: 'maya', text: '我叫兰若瑶，也可以叫我Maya。我18岁，喜欢烘焙，对生态学感兴趣，德语不是特别好。' },
    { type: 'dialogue', speaker: 'teacher', text: '挺好。Maya，你可以看Ludwig的题目。' },
    { type: 'narration', text: '王嘉亿把题目放到他们俩中间。' },
  ],
  observations: [
    {
      id: 'ch01-maya-notebook',
      name: '兰若瑶在记笔记',
      description: '她做笔记的方式',
      observationText: '她的笔在纸上划过的声音很轻，但节奏很稳。每记一行，停顿一下，确认格式，再继续。不像王嘉亿那样随手乱写。她用的是活页纸，字迹很小，排列得像表格一样整齐。问了一句"要不要写句式引用"——连文章分析都知道要做引用，真专业。',
      notebookEntry: {
        id: 'note-maya-note-01',
        label: '兰若瑶的笔记',
        text: '她问了一句"要不要写句式引用"。连文章分析都知道要做引用。字迹很小，排列得像表格一样整齐。',
        category: 'action',
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
      position: { x: 65, y: 35 },
      focusGroup: 'maya',
    },
    {
      id: 'ch01-ludwig-lambda',
      name: '王嘉亿替她看题',
      description: '他把题目分享给兰若瑶',
      observationText: '王嘉亿没有犹豫就把题目放到两人中间。不是那种刻意的殷勤，而是一种理所当然的自然——好像帮助新同学看题是世界上最不需要想的事情。他说话的速度没变，语调没变，只是把纸推过去了。',
      notebookEntry: {
        id: 'note-ludwig-kind-01',
        label: '王嘉亿的自然',
        text: '他没有犹豫就把题目放到两人中间。不是刻意的殷勤，而是一种理所当然的自然。',
        category: 'action',
      },
      relationshipEffect: { characterId: 'ludwig', delta: 1 },
      position: { x: 35, y: 40 },
      focusGroup: 'ludwig',
    },
    {
      id: 'ch01-maya-voice',
      name: '兰若瑶的声音',
      description: '她说话的方式',
      observationText: '她说话的声音不大，但每个字都很清晰。不像王嘉亿那样连珠炮，也不像我自己那样吞吞吐吐。像一把干净的尺子在纸上划出直线——不快不慢，没有弯。',
      notebookEntry: {
        id: 'note-maya-voice-01',
        label: '兰若瑶的声音',
        text: '她说话的声音不大，但每个字都很清晰。像一把干净的尺子在纸上划出直线。',
        category: 'sound',
      },
      position: { x: 70, y: 55 },
      focusGroup: 'maya',
    },
    {
      id: 'ch01-window-light',
      name: '教室窗户的光',
      description: '今天教室里的光线',
      observationText: '光从窗户斜着打进来，照在对面那排课桌上。灰尘在光柱里浮动——平时不会注意到的那种。光柱随着云层的移动，慢慢地、几乎看不见地偏移了一点。整间教室的光线像一个正在呼吸的东西。',
      notebookEntry: {
        id: 'note-ch01-light-01',
        label: '教室光柱',
        text: '光从窗户斜着打进来。灰尘在光柱里浮动，随着云层慢慢偏移。整间教室的光线像一个正在呼吸的东西。',
        category: 'visual',
      },
      position: { x: 85, y: 25 },
      focusGroup: 'environment',
    },
    {
      id: 'ch01-maya-appearance',
      name: '新同学的外表',
      description: '她的样子',
      observationText: '白色加淡蓝色的冲锋衣，看起来挺干净。头发不是很长，正好扎个马尾辫。目测1米5左右，看着完全不像18。自我介绍的时候表情很平，没有紧张也没有刻意的微笑。就像在陈述一个事实。',
      notebookEntry: {
        id: 'note-maya-look-02',
        label: '兰若瑶的样子',
        text: '白色冲锋衣，马尾辫。目测1米5，看着不像18。自我介绍时表情很平，像在陈述一个事实。',
        category: 'visual',
      },
      position: { x: 60, y: 60 },
      focusGroup: 'maya',
    },
    {
      id: 'ch01-silence',
      name: '自我介绍后的沉默',
      description: '你坐下后的那几秒',
      observationText: '我坐下之后，有两三秒的安静。不是那种尴尬的安静，而是教室里本来就有的安静——翻纸的声音，笔碰桌面的声音，窗外风吹过什么的声音。只是在那两三秒里，这些声音突然变清楚了。像有人把背景噪音的音量旋钮往回调了一格。',
      notebookEntry: {
        id: 'note-silence-01',
        label: '两三秒安静',
        text: '坐下后有两三秒的安静。翻纸声，笔碰桌面声，窗外风声。突然变清楚了，像把音量旋钮往回调了一格。',
        category: 'sound',
      },
      position: { x: 20, y: 65 },
      focusGroup: 'environment',
    },
  ],
  outro: [
    { type: 'narration', text: '我们继续写文章分析。教室里只有翻纸和笔在纸上的声音。' },
    { type: 'narration', text: '我低着头。脑子里已经在排列今天的素材了。' },
    { type: 'narration', text: '今天最重要的一件事——新同学来了。' },
  ],
  nextSceneId: 'ch01-night',
  attentionBudget: 3,
  sceneLayout: {
    elements: [
      // 上墙
      { style: { position: 'absolute', left: 0, top: 0, width: '100%', height: 2, background: 'rgba(168,162,158,0.1)' } },
      // 下墙（黑板）
      { style: { position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2, background: 'rgba(168,162,158,0.1)' } },
      { style: { position: 'absolute', left: '30%', bottom: 2, width: '40%', height: 3, background: 'rgba(168,162,158,0.08)' }, label: '黑板' },
      // 右墙（窗户）
      { style: { position: 'absolute', right: 0, top: 0, width: 2, height: '100%', background: 'rgba(168,162,158,0.08)' } },
      { style: { position: 'absolute', right: '5%', top: '10%', width: '12%', height: '60%', background: 'linear-gradient(180deg, rgba(200,150,50,0.06) 0%, transparent 100%)' } },
      { style: { position: 'absolute', right: 2, top: '20%', width: 2, height: '15%', background: 'rgba(200,150,50,0.12)' }, label: '窗户' },
      // 三排课桌
      { style: { position: 'absolute', left: '15%', top: '30%', width: '50%', height: 1, background: 'rgba(168,162,158,0.06)' } },
      { style: { position: 'absolute', left: '15%', top: '50%', width: '50%', height: 1, background: 'rgba(168,162,158,0.06)' } },
      { style: { position: 'absolute', left: '15%', top: '70%', width: '50%', height: 1, background: 'rgba(168,162,158,0.06)' } },
      // 门
      { style: { position: 'absolute', left: 2, bottom: '15%', width: 2, height: '12%', background: 'rgba(168,162,158,0.1)' }, label: '门' },
    ],
  },
}

const ch01Night: NightScene = {
  id: 'ch01-night',
  mode: 'night',
  location: '宿舍 · 深夜',
  lines: [
    { type: 'narration', text: '深夜。宿舍走廊的灯已经灭了一半。' },
    { type: 'narration', text: '我坐在桌前。电脑屏幕上，文档打开了。' },
    { type: 'narration', text: '今天最重要的事情：新同学来了。但我不确定要写她。' },
    { type: 'narration', text: '先看看今天收集到了什么。' },
  ],
  writingPhase: {
    prompt: '今天在英语课上观察到了这些。选几个素材，写一段今天的文字。',
    recipes: [
      {
        requiredEntries: ['note-maya-note-01', 'note-maya-voice-01'],
        composedText: '新同学叫兰若瑶。她问了一句"要不要写句式引用"——连文章分析都知道要做引用。\n\n她说话的声音不大，但每个字都很清晰。像一把干净的尺子在纸上划出直线。\n\n我不知道她为什么18岁才来德国。但她的笔记本比王嘉亿整齐一百倍。',
        influenceTag: 'wrote-maya-class',
      },
      {
        requiredEntries: ['note-ch01-light-01', 'note-silence-01'],
        composedText: '光从窗户斜着打进来，灰尘在光柱里浮动。\n\n我坐下之后有两三秒的安静。翻纸声，笔碰桌面声，窗外风声。突然变清楚了，像把音量旋钮往回调了一格。\n\n教室是一个每天都在变化但每天都一样的地方。光不同，人不同，安静的方式也不同。',
      },
      {
        requiredEntries: ['note-maya-look-02', 'note-ludwig-kind-01'],
        composedText: '白色冲锋衣，马尾辫。自我介绍时表情很平，像在陈述一个事实。\n\n王嘉亿没有犹豫就把题目放到两人中间。不是刻意的殷勤，是一种理所当然的自然。\n\n一个在陈述事实，一个在自然地分享。教室里最自然的两个人，都不是我。',
      },
    ],
    defaultText: '今天英语课来了新同学。教室里有一些光，一些声音。我观察了一些事情，但还没想好怎么写。',
  },
  nextSceneId: 'ch02-day',
}

// ═══════════════════════════════════════════════
// 第二章 · 打乒乓
// ═══════════════════════════════════════════════

const ch02Day: DayScene = {
  id: 'ch02-day',
  mode: 'day',
  location: '自习室 → 户外乒乓球台',
  timeOfDay: '暑假傍晚',
  intro: [
    { type: 'narration', text: '作业写了一下午，写不动了。' },
    { type: 'narration', text: '我把笔往桌上一搁，食指上那道被笔压出来的红印子还在。窗外远处操场边，几个绿色乒乓球台在太阳底下晒着。' },
    { type: 'dialogue', speaker: 'robert', text: '打乒乓球。' },
    { type: 'dialogue', speaker: 'ludwig', text: '行啊，叫上兰若瑶？' },
    { type: 'narration', text: '我们到走廊的时候，兰若瑶已经靠在墙边等着了。她看了我们一眼："你们拍子呢？"' },
    // 第二次异常：如果玩家第一章写了 Maya
    {
      type: 'narration',
      text: '她看到我走进来的时候，忽然低头，抿了一下嘴。然后假装什么都没发生。',
      requiresTag: 'wrote-maya-class',
    },
    {
      type: 'thought',
      text: '她刚才……抿嘴了？',
      requiresTag: 'wrote-maya-class',
    },
    // Observation Echo: 观察过"走廊的光"
    {
      type: 'thought',
      text: '走出宿舍的时候，我又看到了那道光。\n和上周五走廊里的光一样。斜斜地切在地上。',
      requiresObservation: 'note-light-01',
    },
    // Writing Echo: 暴露度 >= 16
    {
      type: 'thought',
      text: '我发现自己在注意观察的方式。\n不是因为看到了什么，而是因为被看到了。',
      requiresExposure: 16,
    },
    { type: 'narration', text: '找老师借了拍子。胶皮边上翘起来一点，手柄的木头磨得发亮。' },
  ],
  observations: [
    {
      id: 'ch02-table',
      name: '球台的质感',
      description: '水泥台面上的石子和落叶',
      observationText: '球台是水泥的，边缘有磕碰的缺口。台面上有灰、有小石子、有昨夜下雨留下的干涸水渍。球落在台上的声音不是清脆的"哒哒"，而是有点沙哑的、沉闷的。因为台面不平，球弹起来的角度有时候会突然改变。',
      notebookEntry: {
        id: 'note-ch02-table-01',
        label: '水泥球台',
        text: '球台是水泥的，边缘有缺口。台面上有灰、有小石子、有干涸水渍。球弹起来的角度有时候会突然改变。',
        category: 'visual',
      },
      position: { x: 50, y: 55 },
      focusGroup: 'environment',
    },
    {
      id: 'ch02-maya-bush',
      name: '她找球时钻进灌木',
      description: '兰若瑶不怕脏地伸手进灌木丛',
      observationText: '球飞进了灌木丛。兰若瑶没犹豫，把手伸进去够。树枝划过她的手背，她皱了下眉但没停。"在哪呢……摸到了。"她把球掏出来的时候，袖口沾了几片碎叶子。',
      notebookEntry: {
        id: 'note-ch02-maya-bush-01',
        label: 'Maya 不怕脏',
        text: '球飞进灌木丛。她没犹豫，把手伸进去够。袖口沾了几片碎叶子。',
        category: 'action',
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
      invasionLevel: 2,
      position: { x: 15, y: 35 },
      focusGroup: 'maya',
      focusAddendum: '我发现自己一直在看她的手。她伸手进灌木丛的时候，我注意到了指甲上的淡蓝色。',
    },
    {
      id: 'ch02-maya-lip',
      name: '她发球前抿嘴',
      description: '兰若瑶发球前的小动作',
      observationText: '她发球前会抿一下嘴。很轻。像在把什么话咽回去。然后手腕一抖，球旋转着过网。',
      notebookEntry: {
        id: 'note-ch02-maya-lip-01',
        label: '抿嘴',
        text: '她发球前会抿一下嘴。很轻。像在把什么话咽回去。',
        category: 'visual',
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
      invasionLevel: 3,
      position: { x: 55, y: 30 },
      focusGroup: 'maya',
      focusAddendum: '她抿嘴的时候，我发现自己也在抿嘴。一种不自觉的模仿。',
    },
    {
      id: 'ch02-maya-lose',
      name: '她输球后不服气',
      description: '兰若瑶输了球的反应',
      observationText: '"这桌子不平。"她输了球之后说了一句，把拍子在手里转了一圈。然后瞪了王嘉亿一眼："你刚才那球擦网了吧。""没有。""有。""算吧算吧。""什么叫算吧！"',
      notebookEntry: {
        id: 'note-ch02-maya-lose-01',
        label: '不服气',
        text: '"这桌子不平。"她输了球之后说了一句。"你刚才那球擦网了吧。""不算，打手上了。""算个屁，那叫有效部位。"',
        category: 'dialogue',
      },
      invasionLevel: 2,
      position: { x: 65, y: 35 },
      focusGroup: 'maya',
    },
    {
      id: 'ch02-ludwing-smash',
      name: 'Ludwig 扣杀后的得意',
      description: '王嘉亿扣杀成功后的表情',
      observationText: '王嘉亿来了一个扣杀。球拍从下往上抡了个大圈，啪的一声把球扇到了操场方向。他把两手一摊，往墙上靠，笑眯眯地看着兰若瑶。"你来捡。""你打飞的我捡？""你现在站在裁判位，闲着也是闲着。"',
      notebookEntry: {
        id: 'note-ch02-ludwing-smash-01',
        label: 'Ludwig 的得意',
        text: '他扣杀成功后把两手一摊，往墙上靠，笑眯眯地看着她。"你来捡。"',
        category: 'action',
      },
      relationshipEffect: { characterId: 'ludwig', delta: 1 },
      position: { x: 35, y: 30 },
      focusGroup: 'ludwig',
      focusAddendum: '他扣杀的时候，整个身体都在发力。我突然觉得他比平时高了一点。',
    },
    {
      id: 'ch02-thunder',
      name: '第一声雷',
      description: '远处传来的闷雷声',
      observationText: '天色变暗了。空气变黏了，皮肤上有层薄汗，球拍握在手里有点滑。远处传来一声闷雷。三个人停下来，抬头看了看天。然后继续打。好像在和雨赛跑。',
      notebookEntry: {
        id: 'note-ch02-thunder-01',
        label: '雷声',
        text: '天色变暗了。远处传来一声闷雷。三个人停下来，抬头看了看天。然后继续打。',
        category: 'sound',
      },
      position: { x: 80, y: 15 },
      focusGroup: 'environment',
    },
  ],
  outro: [
    { type: 'narration', text: '一滴雨落在球台上，砸出一个深色的圆点。然后是第二滴、第三滴。' },
    { type: 'dialogue', speaker: 'ludwig', text: '走吧。' },
    { type: 'narration', text: '没人反驳。我们收了拍子，往宿舍跑。' },
    { type: 'narration', text: '回到宿舍，走廊的灯是暖黄色的。我把借来的球拍擦干，搭在椅背上。窗外的雨已经大起来了。' },
    { type: 'narration', text: '手机亮了，群聊消息。王嘉亿发了一个字："爽。"' },
    { type: 'narration', text: '我回了个表情包。站在窗前看了一会儿雨。' },
  ],
  nextSceneId: 'ch02-night',
  attentionBudget: 3,
  sceneLayout: {
    elements: [
      // 球台
      { style: { position: 'absolute', left: '28%', top: '42%', width: '44%', height: '28%', border: '1px solid rgba(168,162,158,0.1)', borderRadius: 2 } },
      // 球网
      { style: { position: 'absolute', left: '50%', top: '42%', width: 1, height: '28%', background: 'rgba(168,162,158,0.12)' } },
      // 灌木
      { style: { position: 'absolute', left: '2%', top: '25%', width: '12%', height: '30%', border: '1px dashed rgba(74,122,60,0.12)', borderRadius: '50%' }, label: '灌木' },
      // 墙
      { style: { position: 'absolute', right: '5%', top: '15%', width: 2, height: '50%', background: 'rgba(168,162,158,0.08)' } },
      // 天空线
      { style: { position: 'absolute', left: 0, top: '12%', width: '100%', height: 1, background: 'rgba(168,162,158,0.05)' } },
      // 操场标签
      { style: { position: 'absolute', left: '5%', top: '85%', width: 'auto', height: 'auto' }, label: '操场' },
    ],
  },
}

const ch02Night: NightScene = {
  id: 'ch02-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '回到宿舍。窗外的雨打在树叶上，声音很大。' },
    { type: 'narration', text: '电脑屏幕上，文档还开着。光标在最后一行的末尾一闪一闪。' },
    { type: 'narration', text: '今天的事在脑子里重新排列。球台、石子、她的动作、他的扣杀、雷声。' },
    { type: 'narration', text: '我开始打字。' },
  ],
  writingPhase: {
    prompt: '今天打乒乓球。选几个素材，写一段文字。',
    recipes: [
      {
        requiredEntries: ['note-ch02-maya-bush-01', 'note-ch02-maya-lip-01'],
        composedText: '她找球的时候钻进灌木丛，袖口沾了几片碎叶子。\n\n她发球前会抿一下嘴。很轻，很快。\n\n我不知道自己为什么会记住这种细节。\n\n——\n\n我把它写下来了。关于她不怕脏，关于她抿嘴。\n\n这些句子放进文档里的时候，好像变成了某种证据。',
        influenceTag: 'wrote-maya-pingpong',
      },
      {
        requiredEntries: ['note-ch02-maya-bush-01', 'note-ch02-maya-lip-01'],
        composedText: '她找球的时候钻进灌木丛，袖口沾了几片碎叶子。\n\n她发球前会抿一下嘴。很轻，很快。\n\n我不知道自己为什么会记住这种细节。\n\n——\n\n但我知道，从今天开始，我的眼睛会自动找到她。\n\n这让我害怕。',
        influenceTag: 'deep-maya-pingpong',
        requiresFocus: 'maya',
      },
      {
        requiredEntries: ['note-ch02-table-01', 'note-ch02-thunder-01'],
        composedText: '球台是水泥的，边缘有缺口。台面上有灰、有小石子。\n\n天色变暗了。远处传来一声闷雷。\n\n我们好像在和雨赛跑。\n\n——\n\n暑假的黄昏，就这样被一场球赛和一场雨记住了。',
      },
      {
        requiredEntries: ['note-ch02-ludwing-smash-01', 'note-ch02-maya-lose-01'],
        composedText: '他扣杀成功后把两手一摊，往墙上靠，笑眯眯地看着她。\n\n"这桌子不平。"她输了球之后说了一句。\n\n在王嘉亿的得意和兰若瑶的不服气之间，我靠着树站着，什么都没说。',
      },
    ],
    defaultText: '今天打了一场乒乓球。球台很旧，球总是飞走，天差点下雨。我记下了一些东西。',
  },
  nextSceneId: 'ch03-day',
}

// ═══════════════════════════════════════════════
// 第三章 · 闲聊 / 夜聊
// ═══════════════════════════════════════════════

const ch03Day: DayScene = {
  id: 'ch03-day',
  mode: 'day',
  location: '食堂',
  timeOfDay: '中午',
  intro: [
    { type: 'narration', text: '中午，食堂。我们坐在靠窗的位置。' },
    { type: 'narration', text: '兰若瑶坐在对面，低头吃饭。' },
    // 反噬爆点：如果玩家写过 Maya（三层递进）
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '我真的老抿嘴吗？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 1 },
    },
    {
      type: 'thought',
      text: '我愣了一下。\n\n她怎么知道这个？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 1 },
    },
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '王嘉亿昨天也这么说。',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 2 },
    },
    {
      type: 'thought',
      text: '王嘉亿？他怎么知道？\n\n是我写的那篇东西被他看到了？\n\n还是他也注意到了？',
      requiresImprint: { characterId: 'maya', type: 'writing', threshold: 2 },
    },
    // 焦点叠加反噬：连续 2 章 Maya 焦点
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你今天怎么一直看着我？',
      requiresFocusHistory: { characterId: 'maya', count: 2 },
    },
    {
      type: 'thought',
      text: '我……有吗？',
      requiresFocusHistory: { characterId: 'maya', count: 2 },
    },
    // Observation Echo: 观察过"兰若瑶的笔记"
    {
      type: 'narration',
      text: '她吃饭的时候，手指在桌面上轻轻敲了两下。像在写什么。',
      requiresObservation: 'note-maya-note-01',
    },
    // Writing Echo: 暴露度 >= 32
    {
      type: 'thought',
      text: '我犹豫了一下。\n\n这次，我不想写她了。\n\n但我的眼睛还是会自动找到她。',
      requiresExposure: 32,
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
      },
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
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
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
      },
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
      },
      position: { x: 72, y: 55 },
      focusGroup: 'maya',
    },
  ],
  outro: [
    { type: 'narration', text: '食堂的光慢慢移了位置。午餐时间快结束了。' },
    { type: 'narration', text: '王嘉亿把最后一块面包塞进嘴里，含糊地说了句什么。' },
    { type: 'narration', text: '我看着窗外。今天什么也没发生。但好像又发生了很多。' },
  ],
  nextSceneId: 'ch03-night',
  attentionBudget: 3,
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
}

const ch03Night: NightScene = {
  id: 'ch03-night',
  mode: 'night',
  location: '宿舍 · 深夜',
  lines: [
    { type: 'narration', text: '深夜。走廊的灯已经灭了一半。' },
    { type: 'narration', text: '王嘉亿翻了个身。我以为他睡了。' },
    { type: 'dialogue', speaker: 'ludwig', text: '你睡了吗。' },
    { type: 'dialogue', speaker: 'robert', text: '没有。' },
    { type: 'dialogue', speaker: 'ludwig', text: '你有没有觉得……就是，和女生打交道这件事，特别难。' },
    { type: 'thought', text: '他在黑暗里说这话的时候，声音听起来比平时轻很多。' },
    { type: 'dialogue', speaker: 'robert', text: '为什么突然问这个。' },
    { type: 'dialogue', speaker: 'ludwig', text: '就是觉得……你好像也不知道怎么和她说话。' },
  ],
  writingPhase: {
    prompt: '深夜的对话。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-ch03-ludwig-ask-01', 'note-ch03-maya-phone-01'],
        composedText: '他在试探我怎么看待她。\n\n她的手机壳上有一只北极熊。\n\n我不知道该怎么回答他。因为我自己也不知道。\n\n——\n\n有些问题，不是用来回答的。是用来让两个人在黑暗里，各自想一想的。',
        influenceTag: 'deep-talk-ludwig',
      },
      {
        requiredEntries: ['note-ch03-maya-voice-01', 'note-ch03-food-01'],
        composedText: '她说话的时候会用手比划。\n\n今天的意大利面配西红柿肉燥酱。\n\n这些细节好像没什么用。但我就是记住了。',
      },
      {
        requiredEntries: ['note-ch03-maya-phone-01', 'note-ch03-maya-voice-01'],
        composedText: '北极熊手机壳。说话时的手势。\n\n我发现自己开始注意她的一些……不是所有人都会注意到的东西。\n\n这让我有点不安。',
      },
    ],
    defaultText: '深夜的对话。王嘉亿问了一个问题。我没有回答。雨还在下。',
  },
  nextSceneId: 'ch04-day',
}

// ═══════════════════════════════════════════════
// 第四章 · 看纪录片
// ═══════════════════════════════════════════════

const ch04Day: DayScene = {
  id: 'ch04-day',
  mode: 'day',
  location: '食堂二楼',
  timeOfDay: '周六下午',
  intro: [
    { type: 'narration', text: '兰若瑶说想看纪录片。' },
    { type: 'narration', text: '约了周六下午四点。结果五点二十才出门。' },
    // 第四次异常：如果玩家第三章写了 Maya
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你有没有觉得……她好像知道什么？',
      requiresTag: 'wrote-maya-pingpong',
    },
    {
      type: 'dialogue',
      speaker: 'robert',
      text: '什么意思？',
      requiresTag: 'wrote-maya-pingpong',
    },
    // 焦点叠加反噬：连续 3 章 Maya 焦点
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你是不是在写我？',
      requiresFocusHistory: { characterId: 'maya', count: 3 },
    },
    {
      type: 'thought',
      text: '她怎么会这么问？\n\n我写的那些东西……她不可能看到。',
      requiresFocusHistory: { characterId: 'maya', count: 3 },
    },
    // Focus Echo 深度：Maya 焦点 3 章
    {
      type: 'dialogue',
      speaker: 'maya',
      text: '你写的那些东西……能给我看看吗？',
      requiresFocusHistory: { characterId: 'maya', count: 3 },
    },
    {
      type: 'thought',
      text: '我……写了什么？\n\n她怎么会知道我在写？',
      requiresFocusHistory: { characterId: 'maya', count: 3 },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '不知道。就是觉得。',
      requiresTag: 'wrote-maya-pingpong',
    },
    // Observation Echo: 观察过"兰若瑶的声音"
    {
      type: 'thought',
      text: '她说话的时候，我又在听那个节奏。\n像一把干净的尺子在纸上划出直线。',
      requiresObservation: 'note-maya-voice-01',
    },
    { type: 'narration', text: '食堂二楼的灯只开了一半。我们找了张靠墙的桌子，把笔记本搬出来。' },
    { type: 'dialogue', speaker: 'maya', text: '看《海洋》。' },
    { type: 'narration', text: '屏幕亮起来的时候，窗外的天还亮着。' },
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
      },
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
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
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
      },
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
      },
      position: { x: 85, y: 20 },
      focusGroup: 'environment',
    },
  ],
  outro: [
    { type: 'narration', text: '纪录片看完了。屏幕暗下去。' },
    { type: 'dialogue', speaker: 'maya', text: '好看吗？' },
    { type: 'dialogue', speaker: 'ludwig', text: '柠檬鲨好看。' },
    { type: 'narration', text: '兰若瑶笑了一下。我也笑了一下。' },
    { type: 'narration', text: '我们收了笔记本，往宿舍走。走廊里已经没什么人了。' },
  ],
  nextSceneId: 'ch04-night',
  attentionBudget: 3,
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
}

const ch04Night: NightScene = {
  id: 'ch04-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '深夜。文档打开了。' },
    { type: 'narration', text: '今天看的纪录片，鱼群在屏幕上转。' },
    { type: 'narration', text: '但她看纪录片时皱眉的样子，比鱼群更清楚。' },
  ],
  writingPhase: {
    prompt: '今天看纪录片。你想写什么？',
    recipes: [
      {
        requiredEntries: ['note-ch04-maya-watch-01', 'note-ch04-ocean-01'],
        composedText: '鱼群在屏幕上转，银色的，密密麻麻。\n\n但她看纪录片时皱眉的样子，比鱼群更清楚。\n\n——\n\n我不知道从什么时候开始，我的观察对象从"世界"变成了"她"。',
        influenceTag: 'observed-maya-inner',
      },
      {
        requiredEntries: ['note-ch04-light-01', 'note-ch04-ocean-01'],
        composedText: '窗外的天色从亮蓝变成橘黄，再变成灰紫。\n\n鱼群在屏幕上转，像一整片金属在呼吸。\n\n有些东西在变。光线在变，季节在变。我好像也在变。',
      },
      {
        requiredEntries: ['note-ch04-ludwig-bored-01', 'note-ch04-maya-watch-01'],
        composedText: '他看了二十分钟就开始玩手机。但她看完了全程。\n\n有些人对世界好奇，有些人对某件事好奇。\n\n我不知道自己属于哪种。',
      },
    ],
    defaultText: '今天看了纪录片。海洋很大，鱼群很多。我记下了一些东西。',
  },
  nextSceneId: 'ch05-epilogue',
}

// ═══════════════════════════════════════════════
// 卷一结尾
// ═══════════════════════════════════════════════

const ch05Epilogue: NightScene = {
  id: 'ch05-epilogue',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '深夜。' },
    { type: 'narration', text: '我打开文档。' },
    { type: 'narration', text: '光标在最后一行的末尾一闪一闪。' },
    // 默认结尾
    { type: 'narration', text: '然后我看到了。' },
    { type: 'narration', text: '文档最下面，多了一行字。' },
    { type: 'narration', text: '不是我写的。' },
    { type: 'thought', text: '"你写错了。"' },
    { type: 'thought', text: '"我那天没有抿嘴。"' },
    { type: 'thought', text: '"但是你写完以后，我开始这样做了。"' },
    // Maya 焦点结尾
    {
      type: 'thought',
      text: '我盯着屏幕看了很久。\n\n她开始这样做了。\n\n因为我写了她。',
      requiresFocusHistory: { characterId: 'maya', count: 2 },
    },
    // Ludwig 焦点结尾
    {
      type: 'narration',
      text: '王嘉亿翻了个身。我以为他睡了。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2 },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你睡了吗。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2 },
    },
    {
      type: 'dialogue',
      speaker: 'robert',
      text: '没有。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2 },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你有没有觉得……有些东西，写着写着就变了。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2 },
    },
    // 环境焦点结尾
    {
      type: 'narration',
      text: '窗外的光变了。从蓝变紫，再变灰。\n像第一天走廊里的光。',
      requiresFocusHistory: { characterId: 'environment', count: 2 },
    },
    // 高暴露度结尾
    {
      type: 'thought',
      text: '我开始在意自己观察的方式。\n\n不是因为看到了什么，而是因为被看到了。',
      requiresExposure: 32,
    },
  ],
}

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
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'prologue', title: '序章', subtitle: '走廊 → 食堂', startSceneId: 'prologue-day', time: '周五 16:20', observationCount: 5 },
  { id: 'ch01', title: '第一章', subtitle: '英语课', startSceneId: 'ch01-day', time: '周三 10:23', observationCount: 6 },
  { id: 'ch02', title: '第二章', subtitle: '乒乓球', startSceneId: 'ch02-day', time: '暑假傍晚', observationCount: 6 },
  { id: 'ch03', title: '第三章', subtitle: '食堂', startSceneId: 'ch03-day', time: '中午', observationCount: 4 },
  { id: 'ch04', title: '第四章', subtitle: '纪录片', startSceneId: 'ch04-day', time: '周六下午', observationCount: 4 },
  { id: 'ch05', title: '终章', subtitle: '书桌前', startSceneId: 'ch05-epilogue', time: '深夜', observationCount: 0 },
]

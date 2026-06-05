import type { DayScene, NightScene } from '../types/game'

// ═══════════════════════════════════════════════
// 序章 · 食堂
// ═══════════════════════════════════════════════

const prologueDay: DayScene = {
  id: 'prologue-day',
  mode: 'day',
  location: '学校走廊 → 食堂',
  timeOfDay: '放学后',
  intro: [
    { type: 'narration', text: '下课铃响了以后，王嘉亿站起来的速度比平时快了半秒。' },
    { type: 'narration', text: '三个人往食堂的方向走。走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。' },
    { type: 'narration', text: '王嘉亿开口了。' },
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
    },
    {
      id: 'prologue-maya-walk',
      name: '兰若瑶走路的样子',
      description: '她在走廊里走路的方式',
      observationText: '她走路的声音不大，鞋底在走廊的石板地上带出很轻的摩擦声。帆布包斜挎在肩上，拉链拉好了。动作不快，但每一步都很清楚，没有多余的动作。',
      notebookEntry: {
        id: 'note-maya-walk-01',
        label: '兰若瑶的步伐',
        text: '她走路的声音不大，鞋底在石板地上带出很轻的摩擦声。帆布包斜挎，拉链拉好。每一步都很清楚，没有多余的动作。',
        category: 'action',
      },
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
    },
    {
      id: 'prologue-maya-look',
      name: '兰若瑶的那一眼',
      description: '她看你的方式',
      observationText: '兰若瑶偏过头看了我一眼。很快，然后又转回去了。我不知道她原本想说什么。她说了一个词——"损友"。然后在王嘉亿继续说的时候，她又看了我一眼。两次。她的眼睛里有什么，但我读不懂。',
      notebookEntry: {
        id: 'note-maya-look-01',
        label: '兰若瑶的目光',
        text: '她偏过头看了我一眼。很快，然后转回去了。不知道她原本想说什么。后来又看了我一眼。两次。她眼睛里有什么，但我读不懂。',
        category: 'visual',
      },
      relationshipEffect: { characterId: 'maya', delta: 1 },
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
    },
  ],
  outro: [
    { type: 'narration', text: '前面就是食堂门口了。门开着，意面的味道涌出来。' },
    { type: 'narration', text: '兰若瑶说了一句。' },
    { type: 'dialogue', speaker: 'maya', text: '那还挺厉害的。' },
    { type: 'narration', text: '这句话没什么特别的语气，像一句普通的评价。' },
    { type: 'narration', text: '我跟着他们走进食堂。脑子里有一句话在转——"走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。"' },
    { type: 'narration', text: '这是今天的光。刚刚走过的那一道。等坐到桌前，我要把它记下来。' },
  ],
  nextSceneId: 'prologue-night',
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
        requiredEntries: ['note-light-01', 'note-maya-look-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。走过那道光的时候，有一瞬间整个人都是亮的，然后暗下去，继续走。\n\n她偏过头看了我一眼。很快，然后转回去了。不知道她原本想说什么。\n\n被照亮的那一瞬间，好像什么都暴露了。',
      },
      {
        requiredEntries: ['note-light-01', 'note-ninety-01'],
        composedText: '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。\n\n"几十万吧。"——那些字像一小堆晒干的叶子，被一把从藏身处翻出来摊在了太阳底下。\n\n光和文字，都在暴露我。',
      },
      {
        requiredEntries: ['note-ludwig-tease-01', 'note-maya-look-01'],
        composedText: '"中二病晚期。现实里的reclusive，内心世界里的护国公。"\n\n她偏过头看了我一眼。两次。她眼睛里有什么，但我读不懂。\n\n在王嘉亿的声音和兰若瑶的目光之间，我低着头往前走。',
      },
    ],
    defaultText: '今天发生了一些事。走廊里的光，食堂的味道，有人在看我，有人说了一个数字。等我慢慢写下来。',
  },
  nextSceneId: undefined,
}

// ═══════════════════════════════════════════════
// 第一章 · 周三的英语课
// ═══════════════════════════════════════════════

const ch01Day: DayScene = {
  id: 'ch01-day',
  mode: 'day',
  location: '英语教室',
  timeOfDay: '上午',
  intro: [
    { type: 'narration', text: '周三。英语课。教室里的光从窗户斜着照进来。' },
    { type: 'dialogue', speaker: 'ludwig', text: '哎呀，又是小飞飞的课。' },
    { type: 'dialogue', speaker: 'ludwig', text: '嘿，今天那个新同学是不是要来了。' },
    { type: 'narration', text: '过了几十分钟。窗外篱笆旁边出现了三个身影。' },
    { type: 'dialogue', speaker: 'ludwig', text: '诶诶诶，看窗外，有一个没见过的女生。' },
    { type: 'narration', text: '门被敲响了。国际部老师用德语和小飞飞说了几句话，就带着家长走了。' },
    { type: 'dialogue', speaker: 'teacher', text: '所以，我们班来了一个新同学。用英语介绍一下自己吧！' },
    { type: 'narration', text: '无人回应。小飞飞看向了我。' },
    { type: 'dialogue', speaker: 'teacher', text: '看样子Robert很期待啊，对吧。' },
    { type: 'narration', text: '我站起来。' },
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
    },
  ],
  outro: [
    { type: 'narration', text: '我们继续写文章分析。教室里只有翻纸和笔在纸上的声音。' },
    { type: 'narration', text: '我低着头。脑子里已经在排列今天的素材了。' },
    { type: 'narration', text: '今天最重要的一件事——新同学来了。' },
  ],
  nextSceneId: 'ch01-night',
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
  nextSceneId: undefined,
}

export const scenes: Record<string, DayScene | NightScene> = {
  'prologue-day': prologueDay,
  'prologue-night': prologueNight,
  'ch01-day': ch01Day,
  'ch01-night': ch01Night,
}

import type { DayScene, NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 第二章 · 打乒乓
// ═══════════════════════════════════════════════

export const ch02Day: DayScene = {
  id: 'ch02-day',
  mode: 'day',
  location: '自习室 → 户外乒乓球台',
  timeOfDay: '暑假傍晚',
  titleCard: { day: '暑假', time: '傍晚' },
  intro: [
    { type: 'narration', text: '作业写了一下午，写不动了。',
        cid: 'ch02.day.intro.0' },
    { type: 'narration', text: '我把笔往桌上一搁，食指上那道被笔压出来的红印子还在。窗外远处操场边，几个绿色乒乓球台在太阳底下晒着。',
        cid: 'ch02.day.intro.1' },
    { type: 'dialogue', speaker: 'robert', text: '打乒乓球。',
        cid: 'ch02.day.intro.2' },
    { type: 'dialogue', speaker: 'ludwig', text: '行啊，叫上兰若瑶？',
        cid: 'ch02.day.intro.3' },
    { type: 'narration', text: '我们到走廊的时候，兰若瑶已经靠在墙边等着了。她看了我们一眼："你们拍子呢？"',
        cid: 'ch02.day.intro.4' },
    // 第二次异常：如果玩家第一章写了 Maya
    {
      type: 'narration',
      text: '她看到我走进来的时候，忽然低头，抿了一下嘴。然后假装什么都没发生。',
      requiresTag: 'wrote-maya-class',
        cid: 'ch02.day.intro.5'
    },
    {
      type: 'thought',
      text: '她刚才……抿嘴了？',
      requiresTag: 'wrote-maya-class',
        cid: 'ch02.day.intro.6'
    },
    // Observation Echo: 观察过"走廊的光"
    {
      type: 'thought',
      text: '走出宿舍的时候，我又看到了那道光。\n和上周五走廊里的光一样。斜斜地切在地上。',
      requiresObservation: 'note-light-01',
        cid: 'ch02.day.intro.7'
    },
    // Writing Echo: 暴露度 >= 16
    {
      type: 'thought',
      text: '我发现自己在注意观察的方式。\n不是因为看到了什么，而是因为被看到了。',
      requiresExposure: 16,
        cid: 'ch02.day.intro.8'
    },
    { type: 'narration', text: '找老师借了拍子。胶皮边上翘起来一点，手柄的木头磨得发亮。',
        cid: 'ch02.day.intro.9' },
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
        cid: 'ch02.day.obs.0.nb',
      },
      cid: 'ch02.day.obs.0',
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
        cid: 'ch02.day.obs.1.nb',
      },
      cid: 'ch02.day.obs.1',
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
        cid: 'ch02.day.obs.2.nb',
      },
      cid: 'ch02.day.obs.2',
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
        cid: 'ch02.day.obs.3.nb',
      },
      cid: 'ch02.day.obs.3',
      invasionLevel: 2,
      position: { x: 65, y: 35 },
      focusGroup: 'maya',

    },
    {
      id: 'ch02-ludwig-smash',
      name: 'Ludwig 扣杀后的得意',
      description: '王嘉亿扣杀成功后的表情',
      observationText: '王嘉亿来了一个扣杀。球拍从下往上抡了个大圈，啪的一声把球扇到了操场方向。他把两手一摊，往墙上靠，笑眯眯地看着兰若瑶。"你来捡。""你打飞的我捡？""你现在站在裁判位，闲着也是闲着。"',
      notebookEntry: {
        id: 'note-ch02-ludwig-smash-01',
        label: 'Ludwig 的得意',
        text: '他扣杀成功后把两手一摊，往墙上靠，笑眯眯地看着她。"你来捡。"',
        category: 'action',
        cid: 'ch02.day.obs.4.nb',
      },
      cid: 'ch02.day.obs.4',
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
        cid: 'ch02.day.obs.5.nb',
      },
      cid: 'ch02.day.obs.5',
      position: { x: 80, y: 15 },
      focusGroup: 'environment',

    },
  ],
  outro: [
    { type: 'narration', text: '一滴雨落在球台上，砸出一个深色的圆点。然后是第二滴、第三滴。',
        cid: 'ch02.day.outro.0' },
    { type: 'dialogue', speaker: 'ludwig', text: '走吧。',
        cid: 'ch02.day.outro.1' },
    { type: 'narration', text: '没人反驳。我们收了拍子，往宿舍跑。',
        cid: 'ch02.day.outro.2' },
    { type: 'narration', text: '回到宿舍，走廊的灯是暖黄色的。我把借来的球拍擦干，搭在椅背上。窗外的雨已经大起来了。',
        cid: 'ch02.day.outro.3' },
    { type: 'narration', text: '手机亮了，群聊消息。王嘉亿发了一个字："爽。"',
        cid: 'ch02.day.outro.4' },
    { type: 'narration', text: '我回了个表情包。站在窗前看了一会儿雨。',
        cid: 'ch02.day.outro.5' },
  ],
  nextSceneId: 'ch02-night',
  attentionBudget: 3,
  focusCosts: { maya: 2, ludwig: 1, environment: 1 },
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
  cid: 'ch02.day',
}

export const ch02Night: NightScene = {
  id: 'ch02-night',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '回到宿舍。窗外的雨打在树叶上，声音很大。',
        cid: 'ch02.night.lines.0' },
    { type: 'narration', text: '电脑屏幕上，文档还开着。光标在最后一行的末尾一闪一闪。',
        cid: 'ch02.night.lines.1' },
    { type: 'narration', text: '今天的事在脑子里重新排列。球台、石子、她的动作、他的扣杀、雷声。',
        cid: 'ch02.night.lines.2' },
    { type: 'narration', text: '我开始打字。',
        cid: 'ch02.night.lines.3' },
  ],
  writingPhase: {
    prompt: '今天打乒乓球。选几个素材，写一段文字。',
    recipes: [
      {
        requiredEntries: ['note-ch02-maya-bush-01', 'note-ch02-maya-lip-01'],
        composedText: '她找球的时候钻进灌木丛，袖口沾了几片碎叶子。\n\n她发球前会抿一下嘴。很轻，很快。\n\n我不知道自己为什么会记住这种细节。\n\n——\n\n我把它写下来了。关于兰若瑶不怕脏，关于她抿嘴。\n\n这些句子放进文档里的时候，好像变成了某种证据。',
        influenceTag: 'wrote-maya-pingpong',

        cid: 'ch02.night.wp.recipe.0',
      },
      {
        requiredEntries: ['note-ch02-maya-bush-01', 'note-ch02-maya-lip-01'],
        composedText: '她找球的时候钻进灌木丛，袖口沾了几片碎叶子。\n\n她发球前会抿一下嘴。很轻，很快。\n\n我不知道自己为什么会记住这种细节。\n\n——\n\n但我知道，从今天开始，我的眼睛会自动找到她。\n\n这让我害怕。',
        influenceTag: 'deep-maya-pingpong',
        requiresFocus: 'maya',

        cid: 'ch02.night.wp.recipe.1',
      },
      {
        requiredEntries: ['note-ch02-table-01', 'note-ch02-thunder-01'],
        composedText: '球台是水泥的，边缘有缺口。台面上有灰、有小石子。\n\n天色变暗了。远处传来一声闷雷。\n\n我们好像在和雨赛跑。\n\n——\n\n暑假的黄昏，就这样被一场球赛和一场雨记住了。',

        cid: 'ch02.night.wp.recipe.2',
      },
      {
        requiredEntries: ['note-ch02-ludwig-smash-01', 'note-ch02-maya-lose-01'],
        composedText: '他扣杀成功后把两手一摊，往墙上靠，笑眯眯地看着她。\n\n"这桌子不平。"她输了球之后说了一句。\n\n在王嘉亿的得意和兰若瑶的不服气之间，我靠着树站着，什么都没说。',

        cid: 'ch02.night.wp.recipe.3',
      },
    ],
    defaultText: '今天打了一场乒乓球。球台很旧，球总是飞走，天差点下雨。我记下了一些东西。',
    cid: 'ch02.night.wp',
  },
  nextSceneId: 'ch03-day',
  cid: 'ch02.night',
}

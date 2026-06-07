/**
 * 章节模板 —— 用于快速创建新的 DayScene + NightScene 成对场景
 *
 * 使用步骤：
 * 1. 复制此文件为 chXX.ts（如 ch05.ts）
 * 2. 替换所有占位符
 * 3. 在 chapters.ts 中 import 并注册到 scenes Record + CHAPTERS 数组
 *

 * ✅ 注册检查清单（chapter ID 以 ch05 为例）:
 * [ ] DayScene 和 NightScene 已定义
 * [ ] 上一章的 nextSceneId 已指向 'ch05-day'
 * [ ] NightScene 的 nextSceneId 已指向下一章（如 'ch06-day'，终章则为 undefined）
 * [ ] scenes Record 中已添加: 'ch05-day': ch05Day, 'ch05-night': ch05Night
 * [ ] CHAPTERS 数组中已添加 ChapterMeta（observationCount 已手动计算）
 * [ ] src/i18n/content/en.ts 和 de.ts 已添加该章全部 CID 的英文/德文翻译
 * [ ] src/i18n/locales/zh.ts / en.ts / de.ts 已添加章节标题等 UI 翻译
 */

import type { DayScene, NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 第 X 章 · <章节标题>
// ═══════════════════════════════════════════════

export const chXXDay: DayScene = {
  // ── 场景标识 ──
  id: 'chXX-day',                    // 必须是全局唯一，命名规则: ch{NN}-day
  mode: 'day',                       // 固定 'day'
  location: '<位置描述>',             // 显示在场景顶部的位置文本（英文/德文通过 cid 翻译）

  // ── 时间信息 ──
  timeOfDay: '<时间描述>',            // 如 '中午'、'下午'
  titleCard: {                       // 场景进入时先显示的标题卡
    day: '<星期/日期>',               // 如 '周三'、'暑假'
    time: '<具体时间>',               // 如 '10:23'、'傍晚'
  },

  // ── 开场叙事（不可跳过的固定文本） ──
  intro: [
    // type: 'narration' = 旁白, 'dialogue' = 对话, 'thought' = 内心独白
    // speaker: 角色 ID（仅 dialogue 类型需要）
    // cid: 必须唯一，每行一个，格式 {chapter}.day.intro.{n}
    { type: 'narration', text: '开场叙事文本。', cid: 'chXX.day.intro.0' },
    { type: 'dialogue', speaker: 'ludwig', text: '对话文本。', cid: 'chXX.day.intro.1' },
    { type: 'thought', text: '内心独白。', cid: 'chXX.day.intro.2' },

    // 条件叙事行（非必填）：
    // { type: 'dialogue', speaker: 'maya', text: '只有写了某个标签才出现的文本。',
    //   requiresTag: 'wrote-maya-class', cid: 'chXX.day.intro.3' },
    // { type: 'thought', text: '只有印记达到阈值时才出现。',
    //   requiresImprint: { characterId: 'maya', type: 'writing', threshold: 1, cid: 'chXX.day.intro.4' } },
    // { type: 'thought', text: '只有焦点历史连续 N 章才出现。',
    //   requiresFocusHistory: { characterId: 'maya', count: 2, cid: 'chXX.day.intro.5' } },
    // { type: 'thought', text: '只有观察过某笔记条目才出现。',
    //   requiresObservation: 'note-light-01', cid: 'chXX.day.intro.6' },
    // { type: 'thought', text: '只有暴露度达到阈值才出现。',
    //   requiresExposure: 16, cid: 'chXX.day.intro.7' },
    // { type: 'narration', text: '只有完成里程碑才出现。',
    //   requiresMilestone: 'first-writing', cid: 'chXX.day.intro.8' },
  ],

  // ── 观察点（玩家可自由点击的对象） ──
  observations: [
    {
      // notebookEntry.id 是跨章引用标识（写作配方中用）
      // observation.id 是场景内标识，不需要跨章引用
      id: 'chXX-obs-unique-id',      // 观察点 ID（全局唯一即可，建议含章节号）
      name: '热点显示名称',           // 在场景中红色标签显示的文字
      description: '描述',           // 鼠标悬浮时的简短说明
      observationText: '完整观察文本', // 点击后显示的完整叙事文本
      notebookEntry: {
        id: 'note-XX-unique-id',     // 笔记本条目 ID（写作配方中用此 ID 引用）
        label: '简短标签',            // 笔记本列表中显示的标签
        text: '笔记本中的完整文本',    // 笔记本中展示的文本
        category: 'visual',          // 素材类别: 'visual' | 'dialogue' | 'thought' | 'sound' | 'smell' | 'action'
        cid: 'chXX.day.obs.{n}.nb',  // 翻译 CID，{n} 从 0 开始
      },
      cid: 'chXX.day.obs.{n}',       // 观察点 CID
      position: { x: 50, y: 50 },    // 场景中百分比坐标（0-100），决定热点位置
      focusGroup: 'maya',            // 焦点分类: 'maya' | 'ludwig' | 'environment'

      // ── 可选字段 ──
      // relationshipEffect: { characterId: 'maya', delta: 1 },
      //   ↑ 观察此点影响与特定角色的关系值（delta 通常为 1）
      // invasionLevel: 1,
      //   ↑ 侵入度：0=环境 1=对话 2=行为 3=习惯 5=内心推测
      //   影响写作阶段的暴露度累积
      // focusAddendum: '如果玩家焦点匹配此 focusGroup，追加显示的文本',
      // focusAddendumDeep: '如果焦点叠加 2+ 章，追加显示的深度偏见文本',
    },
    // ... 更多观察点（至少 3-6 个）
  ],

  // ── 收束叙事（观察结束后的固定文本，自动播放） ──
  outro: [
    { type: 'narration', text: '收束叙事文本。', cid: 'chXX.day.outro.0' },
    { type: 'narration', text: '一天结束了。', cid: 'chXX.day.outro.1' },
  ],

  // ── 下一场景 ID（指向夜晚场景） ──
  nextSceneId: 'chXX-night',

  // ── 注意力预算 ──
  attentionBudget: 3,                // 默认 3，玩家一天最多观察这么多次
  focusCosts: {                      // 必须定义全部三个焦点
    maya: 2,                         // 观察 Maya 焦点消耗
    ludwig: 2,                       // 观察 Ludwig 焦点消耗
    environment: 1,                  // 观察环境焦点消耗
  },

  // ── 场景骨架（场景背景图的空间参考线和固定元素） ──
  sceneLayout: {
    elements: [
      // 每个元素是一个定位的装饰/参考线
      // style 使用 React.CSSProperties，position 必须 absolute
      // 示例：
      { style: { position: 'absolute', left: 0, top: 0, width: '100%', height: 2,
          background: 'rgba(168,162,158,0.08)' } },
      // label: 可选，显示在元素上的文本标签（翻译通过 cid 查找）
      { style: { position: 'absolute', left: '30%', top: 20, width: '40%', height: 3,
          background: 'rgba(168,162,158,0.06)' }, label: '桌子', cid: 'chXX.day.layout.table' },
    ],
  },

  // ── 场景 CID（用于翻译查找 .location / .time / .titleCard.day 等） ──
  cid: 'chXX.day',
}

// ═══════════════════════════════════════════════
// 第 X 章 · 夜晚
// ═══════════════════════════════════════════════

export const chXXNight: NightScene = {
  id: 'chXX-night',                  // 必须全局唯一，命名规则: ch{NN}-night
  mode: 'night',                     // 固定 'night'
  location: '<位置描述>',             // 如 '宿舍 · 书桌前'

  // ── 夜晚叙事（自动播放，不可跳过） ──
  lines: [
    // type 同 DayScene intro
    { type: 'narration', text: '夜晚叙事文本。', cid: 'chXX.night.lines.0' },
    { type: 'narration', text: '坐在桌前。打开电脑。', cid: 'chXX.night.lines.1' },

    // 条件叙事行：
    // { type: 'narration', text: '里程碑条件文本。',
    //   requiresMilestone: 'meet-maya', cid: 'chXX.night.lines.milestone.0' },
  ],

  // ── 写作阶段（可选：如果本章不需要写作，可以省略整个 writingPhase） ──
  writingPhase: {
    prompt: '今天观察到了什么？你想写什么？',   // 写作阶段的提示文本
    cid: 'chXX.night.wp',

    // 写作配方：不同的素材组合产生不同的文字
    recipes: [
      {
        // requiredEntries: 需要选中的笔记本条目 ID 列表
        // 所有条目都被选中时此配方匹配
        requiredEntries: ['note-XX-a', 'note-XX-b'],

        // composedText: 配方匹配后生成的完整文字
        composedText: '组合后的文字。\n\n这是两个素材组合的结果。',

        // influenceTag: 写入的标签，影响后续场景的叙事条件
        // 命名规则：wrote-{简短描述}
        influenceTag: 'wrote-something',

        cid: 'chXX.night.wp.recipe.0',

        // ── 可选字段 ──
        // requiresFocus: 'maya',
        //   ↑ 仅当玩家当天焦点匹配时此配方才可用
        // perspectiveModifiers: {
        //   objective: '客观视角追加文本',
        //   literary: '文学视角追加文本',
        //   analytical: '分析视角追加文本',
        //   projection: '换位视角追加文本',
        // },
        //   ↑ V1.5 视角修饰器：根据选择的写作视角追加不同结尾
      },
      // ... 更多配方
    ],

    // defaultText: 没有匹配任何配方时使用的默认文字
    defaultText: '今天发生了一些事。我记下了一些东西。但是还没有想好怎么组合。',
  },

  // ── 下一场景 ID（指向下一章的 DayScene，终章则为 undefined） ──
  nextSceneId: 'chXX-day',           // 如果是终章则删除此行

  cid: 'chXX.night',
}

// ═══════════════════════════════════════════════
// 导出（以下为 chapters.ts 中的操作，仅作参考）
//
// 在 chapters.ts 中：
//
// 1. import { chXXDay, chXXNight } from './chapters/template'
//
// 2. 注册到 scenes Record:
//    export const scenes: Record<string, DayScene | NightScene> = {
//      // ... 已有场景 ...
//      'chXX-day': chXXDay,
//      'chXX-night': chXXNight,
//    }
//
// 3. 更新 CHAPTERS 数组:
//    export const CHAPTERS: ChapterMeta[] = [
//      // ... 已有章节 ...
//      {
//        id: 'chXX',
//        title: '第 X 章',
//        subtitle: '章节副标题',
//        startSceneId: 'chXX-day',
//        time: '时间描述',
//        cid: 'chXX.ch',
//        observationCount: N,  // ← 手动填写，等于 chXXDay.observations.length
//      },
//    ]
// ═══════════════════════════════════════════════

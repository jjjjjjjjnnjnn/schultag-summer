# 异乡校园：内容创作指南

> 本文档说明如何为游戏添加新章节、新角色、新写作配方。

**最后更新：** 2026-06-07

---

## 目录结构

```
src/data/
├── chapters.ts       # 所有章节场景定义（DayScene + NightScene 成对出现）
├── characters.ts     # 角色定义
├── quests.ts         # 主线/章节/每日目标
├── evidence.ts       # 异常证据定义
├── consequences.ts   # 写作后果规则
├── perceptions.ts    # 认知矩阵变更
├── achievements.ts   # 成就定义
└── imprint-rules.ts  # 印记触发规则
```

资料片阶段只编辑 `chapters.ts`。如需添加新角色或新成就，才编辑其他文件。

---

## CID 命名规则

每个可翻译的文本段必须有一个全局唯一的 CID（Content ID）。CID 的格式根据使用场景不同：

### DayScene（白天场景）

| 用途 | CID 格式 | 示例 |
|------|---------|------|
| 场景本身 | `{chapter}.day` | `ch04.day` |
| 场景位置 | `{chapter}.day.location` | `ch04.day.location` |
| 场景时间 | `{chapter}.day.time` | `ch04.day.time` |
| 标题卡 | `{chapter}.day.titleCard.day` / `.time` | `ch04.day.titleCard.day` |
| Intro 叙事 | `{chapter}.day.intro.{n}` | `ch04.day.intro.0` |
| Outro 叙事 | `{chapter}.day.outro.{n}` | `ch04.day.outro.1` |
| 观察点名称 | `{chapter}.day.obs.{n}.name` | `ch04.day.obs.0.name` |
| 观察点描述 | `{chapter}.day.obs.{n}.desc` | `ch04.day.obs.0.desc` |
| 观察文本 | `{chapter}.day.obs.{n}.text` | `ch04.day.obs.0.text` |
| 笔记本条目标签 | `{chapter}.day.obs.{n}.nb.label` | `ch04.day.obs.0.nb.label` |
| 笔记本条目文本 | `{chapter}.day.obs.{n}.nb.text` | `ch04.day.obs.0.nb.text` |
| 场景布局标签 | `{chapter}.day.layout.{key}` | `ch04.day.layout.window` |

### NightScene（夜晚场景）

| 用途 | CID 格式 | 示例 |
|------|---------|------|
| 场景本身 | `{chapter}.night` | `ch04.night` |
| 场景位置 | `{chapter}.night.location` | `ch04.night.location` |
| 叙事行 | `{chapter}.night.lines.{n}` | `ch04.night.lines.0` |
| 写作提示 | `{chapter}.night.wp.prompt` | `ch04.night.wp.prompt` |
| 写作配方 | `{chapter}.night.wp.recipe.{n}` | `ch04.night.wp.recipe.0` |
| 默认文案 | `{chapter}.night.wp.default` | `ch04.night.wp.default` |

### Chapter 元数据

| 用途 | CID 格式 | 示例 |
|------|---------|------|
| 章节标题 | `{chapter}.ch.title` | `ch04.ch.title` |
| 章节副标题 | `{chapter}.ch.subtitle` | `ch04.ch.subtitle` |
| 章节时间 | `{chapter}.ch.time` | `ch04.ch.time` |

### 角色

| 用途 | CID 格式 | 示例 |
|------|---------|------|
| 角色 | `char.{id}` | `char.maya` |
| 特质 | `char.{id}.traits.{n}` | `char.maya.traits.0` |
| 印象等级 | `char.{id}.imp.{n}` | `char.maya.imp.1` |

### CID 命名要点

1. `{chapter}` 使用短 ID（如 `prologue`, `ch01`, `ch02`），不要用全称。
2. `{n}` 从 0 开始递增。
3. 多语言时，英文和德文翻译文件中的 key 与 CID 一一对应。
4. CID 一旦发布不应更改，否则已有翻译会失效。

---

## 注意力预算

每个 DayScene 有一个注意力预算，控制玩家一天能观察多少次。

```typescript
attentionBudget: 3,       // 默认值 3。玩家在一天中最多观察 3 次
focusCosts: {
  maya: 2,                // 观察 Maya 焦点消耗 2 点注意力
  ludwig: 2,              // 观察 Ludwig 焦点消耗 2 点注意力
  environment: 1,         // 观察环境焦点消耗 1 点注意力
}
```

**规则：**
- `attentionBudget` 默认值始终为 3。
- `focusCosts` 必须定义所有三个焦点（`maya`, `ludwig`, `environment`）。
- 同焦点观察消耗更低是通过系统机制实现（选择焦点后，匹配焦点的观察点享有折扣）。
- 折扣公式：如果观察点的 `focusGroup` 与玩家当天选择的焦点匹配，消耗减 1（最低为 0）。

---

## 添加新章节

### 步骤清单

1. 在 `src/data/chapters.ts` 中定义 DayScene 和 NightScene 对象。
2. 将上一章的 `nextSceneId` 指向新章节的 DayScene。
3. 将新 NightScene 的 `nextSceneId` 指向下一章的 DayScene（或空值作为结尾）。
4. 在 `scenes` Record 中注册新场景。
5. 在 `CHAPTERS` 数组中添加 `ChapterMeta`，并手动计算 `observationCount`。
6. 在 `src/i18n/content/en.ts` 和 `src/i18n/content/de.ts` 中添加翻译。
7. 在 `src/i18n/locales/zh.ts` / `en.ts` / `de.ts` 中添加 UI 标签翻译（如章节标题等）。
8. （可选）在 `src/data/evidence.ts` 中添加新的异常证据。
9. （可选）在 `src/data/consequences.ts` 中添加新的后果规则。

### CHAPTERS 元数据中的 observationCount

`observationCount` **必须手动更新**，与 DayScene 中 `observations` 数组的长度一致：

```typescript
export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'prologue',
    title: '序章',
    subtitle: '走廊 → 食堂',
    startSceneId: 'prologue-day',
    time: '周五 16:20',
    observationCount: 5,   // ← prologueDay.observations.length
    cid: 'prologue.ch',
  },
  // ...
]
```

---

## 添加新观察点

在 DayScene 的 `observations` 数组中添加新元素：

```typescript
observations: [
  {
    id: 'chXX-unique-id',           // 全局唯一。命名：{chapter}-{简短描述}
    name: '显示在热点上的名称',
    description: '描述性文字',
    observationText: '点击后显示的完整观察文本',
    notebookEntry: {
      id: 'note-XX-unique-id',      // 笔记本条目 ID（跨章引用用）
      label: '简短标签',
      text: '笔记本中显示的完整文本',
      category: 'visual',           // 'visual' | 'dialogue' | 'thought' | 'sound' | 'smell' | 'action'
      cid: 'chXX.day.obs.{n}.nb',
    },
    cid: 'chXX.day.obs.{n}',
    position: { x: 50, y: 50 },    // 场景中的百分比坐标
    focusGroup: 'maya',             // 'maya' | 'ludwig' | 'environment'
    // 可选字段：
    relationshipEffect: { characterId: 'maya', delta: 1 },  // 影响角色关系
    invasionLevel: 1,               // 侵入度：0=环境 1=对话 2=行为 3=习惯 5=内心推测
    focusAddendum: '焦点匹配时的追加文本',
    focusAddendumDeep: '焦点叠加 2+ 章时的深度偏见文本',
  },
]
```

### 观察点 IDs 规则

- `observation.id` 和 `notebookEntry.id` 是两个不同的 ID 体系。
- `observation.id` 用于场景内定位，不需要跨章引用。
- `notebookEntry.id` 用于写作配方中的 `requiredEntries`，可以跨章引用。
- 命名建议：`note-{chapter}-{关键词}-{序号}`。

---

## 添加新写作配方

在 NightScene 的 `writingPhase.recipes` 数组中添加新元素：

```typescript
recipes: [
  {
    requiredEntries: ['note-XX-a', 'note-XX-b'],  // 需要选中的笔记本素材 ID
    composedText: '组合后生成的完整文字',
    influenceTag: 'wrote-something',               // 写入的标签，影响后续叙事
    cid: 'chXX.night.wp.recipe.{n}',
    // 可选：
    requiresFocus: 'maya',                         // 仅当玩家焦点匹配时可用
    perspectiveModifiers: {                         // V1.5 视角修饰器
      objective: '客观视角追加文本',
      literary: '文学视角追加文本',
      analytical: '分析视角追加文本',
      projection: '换位视角追加文本',
    },
  },
]
```

### 配方匹配逻辑

1. 玩家的 `selectedEntryIds` 与每个配方的 `requiredEntries` 进行子集匹配。
2. 如果 `selectedEntryIds` 包含配方要求的所有 ID，则匹配成功。
3. 如果有 `requiresFocus`，还需要玩家当前焦点匹配。
4. 如果没有配方匹配，使用 `defaultText`。
5. 匹配优先级：更长的 `requiredEntries` 数组优先。

---

## 条件叙事

`StoryLine` 支持 6 种条件渲染方式：

| 字段 | 条件 | 用途示例 |
|------|------|---------|
| `requiresTag` | 玩家 writingTags 中包含此标签 | 玩家写了 Ludwig → 他问奇怪问题 |
| `requiresImprint` | 角色印记达到阈值 | Maya 被写过 → 她问抿嘴的事 |
| `requiresFocusHistory` | 焦点历史连续达标 | 连续 2 章 Maya → 她质问 |
| `requiresObservation` | 玩家观察过此笔记 | 看过走廊的光 → 光再次出现 |
| `requiresExposure` | 暴露度 >= 阈值 | 暴露度 32+ → 角色开始察觉 |
| `requiresMilestone` | 已完成里程碑 | 写完第一章 → 时间异常 |

**注意：** 同一行可以只使用一个条件字段。如果需要复合条件，需要先修改 `getVisibleLines()` 逻辑。

---

## 添加新角色

在 `src/data/characters.ts` 中添加：

```typescript
export const characters: Record<string, Character> = {
  // ... 现有角色
  newChar: {
    id: 'newChar',
    name: '中文名',
    nameEn: 'EnglishName',
    age: 16,
    role: 'main',                              // 'protagonist' | 'main' | 'supporting' | 'teacher'
    color: '#10b981',                          // Tailwind 色值
    traits: ['特质1', '特质2'],
    impressionLevels: ['陌生', '初识', '开始注意他', '似乎理解他'],
    cid: 'char.newChar',
  },
}
```

然后更新：
1. `FOCUSABLE_CHARACTERS`（如果新角色可被焦点关注）。
2. `src/types/game.ts` 的 `FocusType` 联合类型。
3. 翻译文件中的 `char.newChar.*` 条目。

---

## 章节 ID 与场景 ID 约定

```
章节 ID:          ch02
DayScene ID:      ch02-day
NightScene ID:    ch02-night
下一章 DayScene:  ch03-day (写在 NightScene.nextSceneId)
```

- 序章特殊：`prologue-day`、`prologue-night`。
- 终章特殊：`ch05-epilogue`（只有 NightScene，没有 DayScene）。
- 场景 ID 全局唯一，在 `scenes` Record 中作为 key 使用。

---

## 质量检查清单

添加新章节后：

- [ ] 所有 CID 唯一且符合命名规则
- [ ] `observationCount` 与 `observations.length` 一致
- [ ] `focusCosts` 定义了全部三个焦点
- [ ] `attentionBudget` 存在（默认 3）
- [ ] `nextSceneId` 链条完整，不指向不存在的场景
- [ ] 新场景已注册到 `scenes` Record
- [ ] 新章节已添加到 `CHAPTERS` 数组
- [ ] 英文和德文翻译已添加
- [ ] 观察点的 `position` 在场景布局的合理范围内
- [ ] 写作配方的 `requiredEntries` 引用了存在的笔记本条目 ID

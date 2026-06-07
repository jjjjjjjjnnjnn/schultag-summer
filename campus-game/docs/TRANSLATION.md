# 异乡校园：翻译系统

> 本文档说明游戏的多语言架构，以及如何添加或修改翻译。

**最后更新：** 2026-06-07

---

## 架构概览

游戏有两层独立的翻译系统：

| 层 | 目录 | 用途 | Hook |
|---|------|------|------|
| UI 标签 | `src/i18n/locales/` | 按钮文字、标题、设置项、静态 UI | `useTranslation().t()` |
| 叙事内容 | `src/i18n/content/` | 对话、观察文本、配方文字、场景标题 | `useContent().c()` / `co()` |

### 文件结构

```
src/i18n/
├── index.ts           # useTranslation + useContent hooks 定义
├── locales/           # UI 标签（所有语言都有完整翻译）
│   ├── zh.ts          # 简体中文 UI
│   ├── en.ts          # 英文 UI
│   └── de.ts          # 德文 UI
└── content/           # 叙事内容翻译（中文为 inline，不在此目录）
    ├── en.ts          # 英文叙事文本
    └── de.ts          # 德文叙事文本
```

### 数据流

```
玩家选择语言 (settings.language)
        │
        ├── UI 标签: locales[lang] Record → t(key) 查找
        │
        └── 叙事内容: content[lang] Record → c(cid, fallback) 查找
                                              co(cid, field, fallback) 查找
```

---

## UI 标签翻译（locales/）

### 使用方式

```typescript
import { useTranslation } from '../../i18n'

function MyComponent() {
  const t = useTranslation()
  return <button>{t('title.start')}</button>
}
```

### 参数插值

```typescript
// 翻译文件中的条目：
'focus.budget': '你有 {n} 点注意力。选择的焦点方向消耗更少。'

// 使用：
t('focus.budget', { n: 3 })
// 结果：'你有 3 点注意力。选择的焦点方向消耗更少。'
```

### 支持的语言

| 语言 | 文件 | 状态 |
|------|------|------|
| zh (简体中文) | `src/i18n/locales/zh.ts` | 完整（源语言） |
| en (英文) | `src/i18n/locales/en.ts` | 完整 |
| de (德文) | `src/i18n/locales/de.ts` | 完整 |

### 添加新 UI 标签

1. 在 `zh.ts` 中添加中文文本（作为源语言）。
2. 在 `en.ts` 和 `de.ts` 中添加对应的翻译。
3. key 使用点分隔命名空间，如 `settings.textSpeed`、`notebook.title`。
4. 在代码中用 `t('namespace.key')` 引用。

---

## 叙事内容翻译（content/）

### 核心概念：CID

每个叙事文本段有一个全局唯一的 **CID**（Content ID）。CID 是连接中文原文和翻译的桥梁。

- **中文**是源语言，直接在 `chapters.ts` 的 `text` 字段中 inline 书写。
- **英文和德文**通过 CID 在 `content/en.ts` 和 `content/de.ts` 中映射。

### 使用方式

```typescript
import { useContent } from '../../i18n'

function SceneRenderer() {
  const { c, co } = useContent()

  // c(cid, fallback) — 直接查找完整文本
  const text = c('prologue.day.intro.0', '我的名字是荣加俊。')

  // co(cid, field, fallback) — 查找多字段对象中的某个字段
  const obsName = co('prologue.day.obs.0', 'name', '走廊的光')
  const obsDesc = co('prologue.day.obs.0', 'desc', '光带的描写')
}
```

### CID 映射规则

```
chapters.ts (中文 inline)              content/en.ts (英文)
─────────────────────────              ─────────────────────
cid: 'prologue.day.intro.0'    ──→     'prologue.day.intro.0': 'My name is...'
text: '我叫荣加俊。今年十五岁。'           'prologue.day.obs.0.name': 'Light in the corridor'
                                        'prologue.day.obs.0.text': 'When I walked...'

                                       content/de.ts (德文)
                                       ─────────────────────
                                       'prologue.day.intro.0': 'Ich heiße Robert...'
                                       'prologue.day.obs.0.name': 'Das Licht im Flur'
```

### 翻译 key 格式

对于观察点（ObservationPoint），一个观察点的 CID 会派生出多个翻译 key：

```
原始 CID: prologue.day.obs.0

派生 key:
  prologue.day.obs.0.name      ← ObservationPoint.name
  prologue.day.obs.0.desc      ← ObservationPoint.description
  prologue.day.obs.0.text      ← ObservationPoint.observationText
  prologue.day.obs.0.nb.label  ← ObservationPoint.notebookEntry.label
  prologue.day.obs.0.nb.text   ← ObservationPoint.notebookEntry.text
```

对于场景（Scene），场景的 CID 也会派生出多个 key：

```
原始 CID: prologue.day

派生 key:
  prologue.day.location        ← DayScene.location
  prologue.day.time            ← DayScene.timeOfDay
  prologue.day.titleCard.day   ← DayScene.titleCard.day
  prologue.day.titleCard.time  ← DayScene.titleCard.time
```

### 添加新内容翻译

1. 在 `chapters.ts` 中为新文本段添加 `cid` 字段。
2. 在 `content/en.ts` 中以 CID 为 key 添加英文翻译。
3. 在 `content/de.ts` 中以 CID 为 key 添加德文翻译。
4. 如果某个翻译暂时缺失，`c()` 函数会返回 fallback 中文原文。

### 内容 vs UI 的边界

| 应该放在 locales/（UI 标签） | 应该放在 content/（叙事内容） |
|-----------------------------|---------------------------|
| 按钮文字（"开始游戏"） | 对话文本 |
| 标题（"设置"、"笔记本"） | 观察文本 |
| UI 提示（"点击继续"） | 写作配方文字 |
| 系统消息（"已存档"） | 叙事旁白 |
| 焦点选项名称 | 笔记本条目内容 |
| 设置项标签 | 场景标题卡文字 |
| 帮助文本 | 章节元数据（标题/副标题） |

---

## 添加新语言

目前支持 3 种语言。添加新语言的步骤：

### 1. 添加 UI 翻译文件

创建 `src/i18n/locales/fr.ts`，导出 Record<string, string>。

### 2. 添加内容翻译文件

创建 `src/i18n/content/fr.ts`，导出 Record<string, string>。

### 3. 注册翻译

在 `src/i18n/index.ts` 中：

```typescript
import fr from './locales/fr'
import frContent from './content/fr'

const locales: Record<string, Record<string, string>> = { zh, en, de, fr }
const contentLocales: Record<string, Record<string, string>> = { en: enContent, de: deContent, fr: frContent }
```

### 4. 添加语言选项

在 `src/types/game.ts` 的 `Settings.language` 类型中添加新语言：

```typescript
language: 'zh' | 'en' | 'de' | 'fr'
```

### 5. 更新设置界面

在设置面板中添加新的语言选项。

---

## 翻译完整性检查

添加内容后，确保：

- [ ] 所有章节的 CID 在 `content/en.ts` 和 `content/de.ts` 中都有对应条目
- [ ] 新 UI 标签在 `zh.ts`、`en.ts`、`de.ts` 中都存在
- [ ] 参数插值的 key 在三种语言中一致
- [ ] CID 一旦发布不变更（否则已有翻译会失效）
- [ ] 角色特质、印象等级的 CID 在所有翻译文件中对应

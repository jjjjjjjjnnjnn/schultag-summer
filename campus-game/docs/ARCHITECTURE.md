# 异乡校园：夏天 — 项目架构

## 目录结构

```
src/
├── data/                    # 游戏数据（纯数据，无逻辑）
│   ├── chapters.ts          # 所有章节场景定义
│   ├── quests.ts            # 主线/章节/每日目标定义
│   ├── evidence.ts          # 证据定义 + 触发条件
│   ├── consequences.ts      # 后果规则定义
│   ├── perceptions.ts       # 认知矩阵 + 变化触发器
│   ├── characters.ts        # 角色定义 + FOCUSABLE_CHARACTERS
│   ├── focusConfig.ts       # 焦点配置（数据驱动）
│   ├── imprint-rules.ts     # 印记触发规则
│   └── achievements.ts      # 成就定义 + 评估函数
│
├── lib/                     # 纯函数（无副作用）
│   ├── consequenceEngine.ts # 后果评估
│   ├── perceptionEngine.ts  # 认知评估
│   ├── evidenceEngine.ts    # 证据评估
│   ├── observationLogic.ts  # 观察逻辑（消耗/印记/暴露度）
│   ├── writingLogic.ts      # 写作逻辑（配方匹配/即兴文本）
│   ├── questLogic.ts        # 任务评估
│   └── audio.ts             # 音频引擎（Web Audio API）
│
├── store/                   # 状态管理
│   ├── gameStore.ts         # Zustand store（组合状态 + 调用 lib 纯函数）
│   └── selectors.ts         # 选择器纯函数（getVisibleLines 等）
│
├── components/              # UI 组件
│   ├── ui/                  # 游戏核心 UI
│   │   ├── SceneView.tsx    # 场景渲染（Day/Night/WritingPhase）
│   │   ├── DialogBox.tsx    # 叙事对话框
│   │   ├── ObservationModal.tsx  # 观察弹窗
│   │   ├── NotebookView.tsx # 笔记本面板
│   │   ├── QuestTracker.tsx # 任务追踪器
│   │   ├── EvidenceTab.tsx  # 证据标签页
│   │   └── FocusSelector.tsx # 焦点选择器
│   └── menu/                # 菜单组件
│       ├── MenuModal.tsx    # 游戏内菜单
│       ├── ChapterSelect.tsx # 章节选择
│       ├── SettingsPanel.tsx # 设置面板
│       └── AchievementView.tsx # 成就展示
│
├── scenes/                  # 页面级组件
│   ├── GameScreen.tsx       # 游戏主界面
│   └── TitleScreen.tsx      # 标题屏
│
├── i18n/                    # 国际化
│   ├── index.ts             # useTranslation + useContent hooks
│   ├── locales/             # UI 翻译（zh/en/de）
│   └── content/             # 叙事内容翻译（en/de）
│
├── hooks/                   # React hooks
│   └── useTypewriter.ts     # 打字机效果
│
└── types/                   # TypeScript 类型定义
    └── game.ts              # 全部游戏类型
```

## 核心数据流

```
data/ (纯数据定义)
    |
    ├── chapters.ts -> scenes: Record<string, Scene>
    |       |
    |       v
    |   store/gameStore.ts -> getCurrentScene() 读取当前场景
    |       |
    |       v
    |   components/ui/SceneView.tsx -> 渲染当前场景
    |
    └── data/*.ts -> lib/*Engine.ts (纯函数)
            |
            v
        store/gameStore.ts -> 调用纯函数计算结果 -> set() 更新状态
```

## 场景生命周期

```
DayScene（模式 'day'）:
  TitleCard → intro[] → FocusSelector → 探索状态
  → observationPhase（点击 ObservationPoint，消耗注意力）
  → outro[] → nextSceneId

NightScene（模式 'night'）:
  TitleCard → lines[] → writingPhase? → 即时反馈 → nextSceneId
```

## 核心原则

1. **data/ 目录只放纯数据**：无逻辑、无副作用、无 React 依赖。
2. **lib/ 目录只放纯函数**：输入状态，输出计算结果，不修改外部状态。
3. **store/ 是唯一状态管理**：Zustand 组合状态，调用 lib/ 计算结果，set() 更新。
4. **条件叙事渲染**：StoryLine 支持 6 种条件（requiresTag / requiresImprint / requiresFocusHistory / requiresObservation / requiresExposure / requiresMilestone），由 getVisibleLines() 统一过滤。
5. **场景 ID 约定**：`{chapterId}-day` 和 `{chapterId}-night` 成对出现。
6. **版本标记**：每个大版本在类型定义中有明确标记（V1.1 BehaviorEffect, V1.2 Perception, V1.3 Quest, V1.4 Evidence, V1.5 WritingPerspective/focusCosts）。

## 缓存规则

不要往架构文档中写入状态管理细节、类型定义或组件 Props 的具体内容。这些应该从代码本身读取。本文件只描述框架和原则。

# 异乡校园：夏天 — 项目发展历史

## 项目概述

- 核心循环：观察 → 记录 → 写作 → 现实改变
- 技术栈：React 19 + TypeScript 6 + Vite 8 + Tailwind CSS v4 + Zustand 5
- 当前版本：V1.5 Expression Update（功能冻结，待试玩验证）

## 版本时间线

### V0.1 ~ V0.9（原型验证）
- 核心循环搭建：观察 → 记录 → 写作 → Echo
- 焦点系统、Notebook 基础
- 5 章基本结构
- V0.8 Reality Echo（三种回响：观察/写作/焦点回响 + 暴露度反馈）
- V0.8.1 试玩修复（终章渲染、阈值调整、UX 改进）
- V0.8.2 国际化（zh/en/de 三语言 + 游戏介绍/帮助）
- V0.9.5 UI 打磨（5种合成音效 + 叙事内容翻译 + GitHub Actions 自动部署）

### V1.0 — 发布就绪
- 存档 v3（playTimeMs, chapterId, Partial<GameState>）
- 键盘支持（Space/Enter/Escape/1-2-3）
- 无障碍（reducedMotion）
- 代码审查修复

### V1.1 — 后果系统
- Consequence Engine：writingTag → 行为效果 → 替代观察文本
- 9 条后果规则（ludwig-more-open, maya-approaches 等）
- 延迟生效机制（delayChapters）
- 观察弹窗因果标注

### V1.2 — 认知网络
- Perception Engine：N×N 认知矩阵
- 8 种认知标签（curious/distant/trusting 等）
- CharactersTab 认知标签显示

### V1.2.1 — 打磨
- 新手引导（焦点/观察/写作/Echo 提示）
- Bug 修复（night scene 卡死、isEnding 永假、WritingPhase 条目过滤）
- 平衡性调整（暴露度分布、认知网络死区修复）
- 路线体验评估 + 修复

### V1.3 — 叙事任务系统
- 三层次目标：主线（5里程碑）/ 章节目标（5个）/ 每日目标（14个）
- QuestTracker UI
- 每日目标完成检查

### V1.3.1 — 修复 + 悬念
- requiresMilestone 条件渲染
- 奖励消费机制
- 3 行悬念叙事（创建日期异常 / 陌生第一行 / 未来段落）
- ch02-ch04 每日目标补全
- QuestTracker bug 修复

### V1.4 — 谜团层
- Evidence 系统：12 条证据
- Evidence Tab（Notebook 第5个Tab）
- 自动发现机制（milestone/tag/exposure/scene/keyCount 触发）
- 4 种证据类型：anomaly / contradiction / prediction / origin

### V1.5 — Expression Update
- WritingPerspective：4 种写作视角（objective/literary/analytical/projection）
- baseText + 修饰器模式（perspectiveModifiers）
- FocusCosts：按焦点方向差异化观察消耗
- Improvised Writing：无配方匹配时的即兴文本生成
- **功能冻结**，待试玩验证

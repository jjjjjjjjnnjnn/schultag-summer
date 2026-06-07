import type { NightScene } from '../../types/game'

// ═══════════════════════════════════════════════
// 卷一结尾
// ═══════════════════════════════════════════════

export const ch05Epilogue: NightScene = {
  id: 'ch05-epilogue',
  mode: 'night',
  location: '宿舍 · 书桌前',
  lines: [
    { type: 'narration', text: '深夜。',
      cid: 'epilogue.lines.0' },
    { type: 'narration', text: '我打开文档。',
      cid: 'epilogue.lines.1' },
    { type: 'narration', text: '光标在最后一行的末尾一闪一闪。',
      cid: 'epilogue.lines.2' },
    // 默认结尾
    { type: 'narration', text: '然后我看到了。',
      cid: 'epilogue.lines.3' },
    { type: 'narration', text: '文档最下面，多了一行字。',
      cid: 'epilogue.lines.4' },
    { type: 'narration', text: '不是我写的。',
      cid: 'epilogue.lines.5' },
    { type: 'thought', text: '"你写错了。"',
      cid: 'epilogue.lines.6' },
    { type: 'thought', text: '"我那天没有抿嘴。"',
      cid: 'epilogue.lines.7' },
    { type: 'thought', text: '"但是你写完以后，我开始这样做了。"',
      cid: 'epilogue.lines.8' },
    // Maya 焦点结尾
    {
      type: 'thought',
      text: '我盯着屏幕看了很久。\n\n她开始这样做了。\n\n因为我写了她。',
      requiresFocusHistory: { characterId: 'maya', count: 2,
      cid: 'epilogue.lines.9' },
    },
    // Ludwig 焦点结尾
    {
      type: 'narration',
      text: '王嘉亿翻了个身。我以为他睡了。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2,
      cid: 'epilogue.lines.10' },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你睡了吗。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2,
      cid: 'epilogue.lines.11' },
    },
    {
      type: 'dialogue',
      speaker: 'robert',
      text: '没有。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2,
      cid: 'epilogue.lines.12' },
    },
    {
      type: 'dialogue',
      speaker: 'ludwig',
      text: '你有没有觉得……有些东西，写着写着就变了。',
      requiresFocusHistory: { characterId: 'ludwig', count: 2,
      cid: 'epilogue.lines.13' },
    },
    // 环境焦点结尾
    {
      type: 'narration',
      text: '窗外的光变了。从蓝变紫，再变灰。\n像第一天走廊里的光。',
      requiresFocusHistory: { characterId: 'environment', count: 2,
      cid: 'epilogue.lines.14' },
    },
    // 高暴露度结尾
    {
      type: 'thought',
      text: '我开始在意自己观察的方式。\n\n不是因为看到了什么，而是因为被看到了。',
      requiresExposure: 32,
      cid: 'epilogue.lines.15'
    },
  ],
  cid: 'epilogue',
}

export interface HiddenMemory {
  id: string
  /** 解锁需要灵感值 */
  inspirationCost: number
  /** 记忆文本 */
  text: string
  /** 来源章节 */
  chapterId: string
}

export const HIDDEN_MEMORIES: HiddenMemory[] = [
  {
    id: 'mem-light',
    inspirationCost: 5,
    text: '他记得更早以前的光。\n\n不是走廊那道。是另一道。\n\n更暖，更旧，边缘泛黄。\n\n他想起来——那是家里厨房的灯。',
    chapterId: 'prologue',
  },
  {
    id: 'mem-write-start',
    inspirationCost: 10,
    text: '他记得自己是什么时候开始写的。\n\n不是一时兴起。\n\n是因为有一天发现：\n\n如果不写下来，这些东西就像没发生过。',
    chapterId: 'ch01',
  },
  {
    id: 'mem-alone',
    inspirationCost: 15,
    text: '十五岁那年。\n\n他第一次意识到自己和别人不一样。\n\n不是因为写小说。\n\n是因为他发现自己更喜欢观察别人，而不是和他们说话。',
    chapterId: 'ch02',
  },
  {
    id: 'mem-maya-first',
    inspirationCost: 20,
    text: '他其实在走廊里见过她一次。\n\n比她转学来的那周更早。\n\n在校长办公室门口。她站在那里，背着那个大包。\n\n他在心里写下了一行描述。\n\n那是关于Maya的第一句话。\n\n——他那时候还不知道她的名字。',
    chapterId: 'ch03',
  },
  {
    id: 'mem-fear',
    inspirationCost: 30,
    text: '有一件事他从来没写过。\n\n不是因为不重要。\n\n是因为他怕写出来以后，\n\n它就变成真的了。',
    chapterId: 'ch04',
  },
]

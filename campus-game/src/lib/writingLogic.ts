import type { WritingPerspective, NotebookEntry, WritingRecipe, CharacterImprint } from '../types/game'

export interface RecipeMatch {
  composedText: string
  matchedTag?: string
}

export function matchRecipe(
  recipes: WritingRecipe[],
  selectedEntryIds: string[],
  currentFocus: string | null,
  selectedPerspective: WritingPerspective,
  getC: (lang: string, cid: string, fallback: string) => string,
  lang: string,
): { result: RecipeMatch; matchedRecipeIndex: number } {
  // 先尝试焦点专属配方
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i]
    if (recipe.requiresFocus && recipe.requiresFocus !== currentFocus) continue
    const allMatch = recipe.requiredEntries.every(id => selectedEntryIds.includes(id))
    if (allMatch && recipe.requiredEntries.length <= selectedEntryIds.length) {
      let text = recipe.cid ? getC(lang, recipe.cid, recipe.composedText) : recipe.composedText
      if (recipe.perspectiveModifiers?.[selectedPerspective]) {
        // 尝试通过 cid 翻译修饰句
        const modifierKey = recipe.cid ? `${recipe.cid}.perspective.${selectedPerspective}` : ''
        const translatedModifier = modifierKey ? getC(lang, modifierKey, recipe.perspectiveModifiers[selectedPerspective]) : recipe.perspectiveModifiers[selectedPerspective]
        text += '\n\n' + translatedModifier
      }
      return { result: { composedText: text, matchedTag: recipe.influenceTag }, matchedRecipeIndex: i }
    }
  }
  // 再尝试通用配方
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i]
    if (recipe.requiresFocus) continue
    const allMatch = recipe.requiredEntries.every(id => selectedEntryIds.includes(id))
    if (allMatch && recipe.requiredEntries.length <= selectedEntryIds.length) {
      let text = recipe.cid ? getC(lang, recipe.cid, recipe.composedText) : recipe.composedText
      if (recipe.perspectiveModifiers?.[selectedPerspective]) {
        // 尝试通过 cid 翻译修饰句
        const modifierKey = recipe.cid ? `${recipe.cid}.perspective.${selectedPerspective}` : ''
        const translatedModifier = modifierKey ? getC(lang, modifierKey, recipe.perspectiveModifiers[selectedPerspective]) : recipe.perspectiveModifiers[selectedPerspective]
        text += '\n\n' + translatedModifier
      }
      return { result: { composedText: text, matchedTag: recipe.influenceTag }, matchedRecipeIndex: i }
    }
  }
  return { result: { composedText: '' }, matchedRecipeIndex: -1 }
}

export function generateImprovText(
  entries: NotebookEntry[],
  labels: string[],
  selectedEntryIds: string[],
  selectedPerspective: WritingPerspective = 'objective',
  getC?: (lang: string, cid: string, fallback: string) => string,
  lang?: string,
): string {
  const labelStr = labels.join(lang === 'de' ? ', ' : '、')

  if (selectedEntryIds.length <= 1 && labels.length > 0) {
    const fallback = `今天记下了：${labelStr}。`
    return getC ? getC(lang!, 'improv.single', fallback) : fallback
  }
  if (selectedEntryIds.length === 0) {
    const fallback = '今天什么也没写。有些日子就是这样。'
    return getC ? getC(lang!, 'improv.empty', fallback) : fallback
  }

  // 根据焦点组和视角选择模板
  const focusCounts: Record<string, number> = {}
  for (const e of entries) {
    const fg = e.focusGroup || 'environment'
    focusCounts[fg] = (focusCounts[fg] || 0) + 1
  }
  const dominantFocus = Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'environment'

  // 视角 × 焦点 = 12 种变体
  const perspectiveTemplates: Record<string, Record<WritingPerspective, string>> = {
    maya: {
      objective: '我记下了{labels}。\n\n今天对她多了一些了解。',
      literary: '{labels}——这些细节像一小片月光，落在纸上就化不开了。',
      analytical: '关于{labels}，我注意到了一些模式。\n\n她在刻意维持某种距离。',
      projection: '写下{labels}的时候，我想起自己刚来的时候。\n\n那种不确定该看哪里的感觉。',
    },
    ludwig: {
      objective: '记录：{labels}。\n\n今天和王嘉亿的互动如常。',
      literary: '{labels}——像一张没有对焦的照片，模糊但温暖。',
      analytical: '他的行为有规律可循。\n\n{labels}——这些细节指向同一个结论。',
      projection: '有时候我觉得他比我更懂得怎么活着。\n\n{labels}。',
    },
    environment: {
      objective: '今天观察到：{labels}。',
      literary: '{labels}——像一首没有歌词的曲子，在脑子里循环。',
      analytical: '这些环境细节不是随机的。\n\n{labels}——它们构成了某种节奏。',
      projection: '我开始注意到这些了。\n\n{labels}。\n\n也许我一直都忽略了。',
    },
  }

  const fallback = (perspectiveTemplates[dominantFocus]?.[selectedPerspective] || perspectiveTemplates.environment![selectedPerspective])
    .replace('{labels}', labelStr)

  const cid = `improv.${dominantFocus}.${selectedPerspective}`
  const translated = getC ? getC(lang!, cid, fallback) : fallback
  return translated.replace('{labels}', labelStr)
}

export function scanImprints(
  text: string,
  imprints: Record<string, CharacterImprint>,
  characters: Record<string, { name: string }>,
): { newImprints: Record<string, CharacterImprint>; mentionedChars: string[] } {
  const newImprints = { ...imprints }
  const mentionedChars: string[] = []
  for (const [charId, char] of Object.entries(characters)) {
    if (newImprints[charId] && text.includes(char.name)) {
      newImprints[charId] = {
        ...newImprints[charId],
        writingCount: newImprints[charId].writingCount + 1,
      }
      mentionedChars.push(char.name)
    }
  }
  return { newImprints, mentionedChars }
}

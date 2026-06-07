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
        text += '\n\n' + recipe.perspectiveModifiers[selectedPerspective]
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
        text += '\n\n' + recipe.perspectiveModifiers[selectedPerspective]
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
): string {
  if (selectedEntryIds.length <= 1 && labels.length > 0) {
    return `今天记下了：${labels.join('、')}。`
  }
  if (selectedEntryIds.length === 0) {
    return '今天什么也没写。有些日子就是这样。'
  }
  // 根据大多数素材的焦点组选择模板
  const focusCounts: Record<string, number> = {}
  for (const e of entries) {
    const fg = e.focusGroup || 'environment'
    focusCounts[fg] = (focusCounts[fg] || 0) + 1
  }
  const dominantFocus = Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'environment'
  const templates: Record<string, string> = {
    maya: '今晚我试着写下{labels}。\n\n这些细节在脑子里转了好几圈。',
    ludwig: '{labels}——这些画面像快照一样叠在眼前。',
    environment: '{labels}\n\n这些观察像空气一样——说不出形状，但确实存在。',
  }
  const template = templates[dominantFocus] || templates.environment!
  return template.replace('{labels}', labels.join('、'))
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

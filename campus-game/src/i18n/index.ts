import { useGameStore } from '../store/gameStore'
import zh from './locales/zh'
import en from './locales/en'
import de from './locales/de'
import enContent from './content/en'
import deContent from './content/de'

const locales: Record<string, Record<string, string>> = { zh, en, de }
const contentLocales: Record<string, Record<string, string>> = { en: enContent, de: deContent }

export function useTranslation() {
  const lang = useGameStore(s => s.settings.language)
  const t = locales[lang] || locales.zh

  return (key: string, params?: Record<string, string | number>): string => {
    let text = t[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }
}

/** 内容翻译：根据 cid 查找当前语言的翻译，fallback 到原始中文 */
export function useContent() {
  const lang = useGameStore(s => s.settings.language)
  const translations = contentLocales[lang] || {}

  /** 查找翻译文本 */
  const c = (cid: string, fallback: string): string => {
    return translations[cid] || fallback
  }

  /** 查找多字段内容（如 obs 的 name/text/desc/nb.label/nb.text） */
  const co = (cid: string, field: string, fallback: string): string => {
    return translations[`${cid}.${field}`] || fallback
  }

  return { c, co }
}

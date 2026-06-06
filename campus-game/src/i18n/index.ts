import { useGameStore } from '../store/gameStore'
import zh from './locales/zh'
import en from './locales/en'
import de from './locales/de'

const locales: Record<string, Record<string, string>> = { zh, en, de }

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

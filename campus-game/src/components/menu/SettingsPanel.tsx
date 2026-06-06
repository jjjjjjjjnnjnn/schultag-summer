import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTranslation, useContent } from '../../i18n'
import { audio } from '../../lib/audio'
import type { Settings } from '../../types/game'

const SPEED_OPTIONS: { value: Settings['textSpeed']; labelKey: string; ms: string }[] = [
  { value: 'slow', labelKey: 'settings.slow', ms: '55ms' },
  { value: 'normal', labelKey: 'settings.normal', ms: '35ms' },
  { value: 'fast', labelKey: 'settings.fast', ms: '20ms' },
]

const FONT_OPTIONS: { value: Settings['fontSize']; labelKey: string }[] = [
  { value: 'small', labelKey: 'settings.small' },
  { value: 'medium', labelKey: 'settings.medium' },
  { value: 'large', labelKey: 'settings.large' },
]

const LANG_OPTIONS: { value: Settings['language']; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

export function SettingsPanel() {
  const { settings, updateSettings } = useGameStore()
  const t = useTranslation()
  const { c } = useContent()

  // Sync soundEnabled with AudioEngine
  useEffect(() => {
    audio.setEnabled(settings.soundEnabled)
  }, [settings.soundEnabled])

  return (
    <div className="space-y-6">
      {/* 语言 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">{t('settings.language')}</h3>
        <div className="flex gap-2">
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ language: opt.value })}
              className={`
                flex-1 px-3 py-2 rounded border text-sm transition-all
                ${settings.language === opt.value
                  ? 'border-amber-700 bg-amber-900/20 text-amber-300'
                  : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 文字速度 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">{t('settings.textSpeed')}</h3>
        <div className="flex gap-2">
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ textSpeed: opt.value })}
              className={`
                flex-1 px-3 py-2 rounded border text-sm transition-all
                ${settings.textSpeed === opt.value
                  ? 'border-amber-700 bg-amber-900/20 text-amber-300'
                  : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                }
              `}
            >
              <span className="block">{t(opt.labelKey)}</span>
              <span className="text-[10px] text-stone-600">{opt.ms}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 字体大小 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">{t('settings.fontSize')}</h3>
        <div className="flex gap-2">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateSettings({ fontSize: opt.value })}
              className={`
                flex-1 px-3 py-2 rounded border text-sm transition-all
                ${settings.fontSize === opt.value
                  ? 'border-amber-700 bg-amber-900/20 text-amber-300'
                  : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
                }
              `}
            >
              <span style={{ fontSize: opt.value === 'small' ? '12px' : opt.value === 'large' ? '18px' : '14px' }}>
                {t(opt.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 音效 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">{t('settings.sound')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => updateSettings({ soundEnabled: true })}
            className={`flex-1 px-3 py-2 rounded border text-sm transition-all btn-press ${
              settings.soundEnabled
                ? 'border-amber-700 bg-amber-900/20 text-amber-300'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
            }`}
          >
            {t('settings.sfxOn')}
          </button>
          <button
            onClick={() => updateSettings({ soundEnabled: false })}
            className={`flex-1 px-3 py-2 rounded border text-sm transition-all btn-press ${
              !settings.soundEnabled
                ? 'border-amber-700 bg-amber-900/20 text-amber-300'
                : 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300'
            }`}
          >
            {t('settings.sfxOff')}
          </button>
        </div>
      </div>

      {/* 预览 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">{t('settings.preview')}</h3>
        <div
          className="bg-stone-800/30 rounded-lg px-4 py-3 border border-stone-700/30"
          style={{
            fontSize: settings.fontSize === 'small' ? '13px' : settings.fontSize === 'large' ? '17px' : '15px',
            fontFamily: 'var(--font-serif-cn)',
          }}
        >
          <p className="text-stone-300 leading-[1.9]">
            {c('settings.previewText', '走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。')}
          </p>
        </div>
      </div>
    </div>
  )
}

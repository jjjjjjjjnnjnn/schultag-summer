import { useGameStore } from '../../store/gameStore'
import type { Settings } from '../../types/game'

const SPEED_OPTIONS: { value: Settings['textSpeed']; label: string; ms: string }[] = [
  { value: 'slow', label: '慢', ms: '55ms' },
  { value: 'normal', label: '中', ms: '35ms' },
  { value: 'fast', label: '快', ms: '20ms' },
]

const FONT_OPTIONS: { value: Settings['fontSize']; label: string }[] = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
]

export function SettingsPanel() {
  const { settings, updateSettings } = useGameStore()

  return (
    <div className="space-y-6">
      {/* 文字速度 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">文字速度</h3>
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
              <span className="block">{opt.label}</span>
              <span className="text-[10px] text-stone-600">{opt.ms}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 字体大小 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">字体大小</h3>
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
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 预览 */}
      <div>
        <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">预览</h3>
        <div
          className="bg-stone-800/30 rounded-lg px-4 py-3 border border-stone-700/30"
          style={{
            fontSize: settings.fontSize === 'small' ? '13px' : settings.fontSize === 'large' ? '17px' : '15px',
            fontFamily: 'var(--font-serif-cn)',
          }}
        >
          <p className="text-stone-300 leading-[1.9]">
            走廊里的光从尽头的窗户照进来，在石板地上斜斜地切出一道明晃晃的光带。
          </p>
        </div>
      </div>
    </div>
  )
}

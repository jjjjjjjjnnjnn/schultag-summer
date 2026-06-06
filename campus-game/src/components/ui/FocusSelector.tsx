import type { FocusType } from '../../types/game'

const FOCUSES: { type: FocusType; label: string; sublabel: string; hint: string; color: string }[] = [
  { type: 'maya', label: '兰若瑶', sublabel: '新来的女生', hint: '你会更注意到她的细节', color: '#8b5cf6' },
  { type: 'ludwig', label: '王嘉亿', sublabel: '你的室友', hint: '你会更注意到他的行为', color: '#3b82f6' },
  { type: 'environment', label: '环境', sublabel: '光、声音、气味', hint: '你会更注意到周围的氛围', color: '#a8a29e' },
]

interface Props {
  onSelect: (f: FocusType) => void
  budget?: number
}

export function FocusSelector({ onSelect, budget = 3 }: Props) {
  return (
    <div className="max-w-2xl mx-auto mt-8 scene-fade-in">
      <div className="text-center mb-6">
        <p className="text-stone-300 text-sm mb-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          今天的观察，你会更留意谁？
        </p>
        <p className="text-stone-500 text-xs">
          你有 {budget} 点注意力。选择的焦点方向消耗更少。
        </p>
      </div>

      <div className="flex justify-center gap-4 sm:gap-6">
        {FOCUSES.map(f => (
          <button
            key={f.type}
            onClick={() => onSelect(f.type)}
            className="group flex flex-col items-center gap-2 px-5 py-4 rounded-lg border border-stone-700/50 hover:border-stone-500 transition-all duration-300 hover:bg-stone-800/30"
          >
            <div
              className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: f.color }}
            />
            <span
              className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors"
              style={{ fontFamily: 'var(--font-serif-cn)' }}
            >
              {f.label}
            </span>
            <span className="text-[10px] text-stone-500">{f.sublabel}</span>
            <span className="text-[10px] text-stone-600 group-hover:text-stone-500 transition-colors">{f.hint}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-[10px] text-stone-700 mt-4">
        这个选择会影响你今天的观察和写作
      </p>
    </div>
  )
}

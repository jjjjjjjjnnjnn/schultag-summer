import type { FocusType } from '../../types/game'

const FOCUSES: { type: FocusType; label: string; sublabel: string; color: string }[] = [
  { type: 'maya', label: '兰若瑶', sublabel: '新来的女生', color: '#8b5cf6' },
  { type: 'ludwig', label: '王嘉亿', sublabel: '你的室友', color: '#3b82f6' },
  { type: 'environment', label: '环境', sublabel: '光、声音、气味', color: '#a8a29e' },
]

export function FocusSelector({ onSelect }: { onSelect: (f: FocusType) => void }) {
  return (
    <div className="max-w-2xl mx-auto mt-12 scene-fade-in">
      <div className="text-center mb-8">
        <p className="text-stone-400 text-sm mb-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          今天你最在意什么？
        </p>
        <p className="text-stone-600 text-xs">
          选择一个焦点，同类观察消耗更少注意力
        </p>
      </div>

      <div className="flex justify-center gap-4 sm:gap-6">
        {FOCUSES.map(f => (
          <button
            key={f.type}
            onClick={() => onSelect(f.type)}
            className="group flex flex-col items-center gap-2 px-5 py-4 rounded-lg border border-stone-700/50 hover:border-stone-600 transition-all duration-300 hover:bg-stone-800/30"
          >
            <div
              className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              style={{ backgroundColor: f.color }}
            />
            <span
              className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors"
              style={{ fontFamily: 'var(--font-serif-cn)' }}
            >
              {f.label}
            </span>
            <span className="text-[10px] text-stone-600">{f.sublabel}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

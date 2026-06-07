import { useGameStore } from '../../store/gameStore'
import { useState } from 'react'

export function GameHUD() {
  const { attentionRemaining, exposure, inspiration, isExploring } = useGameStore()
  const [collapsed, setCollapsed] = useState(false)

  if (!isExploring && attentionRemaining === 3) return null // 非探索时隐藏

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-1.5">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-[10px] text-stone-600 hover:text-stone-400 transition-colors"
      >
        {collapsed ? '◀ 状态' : '▼'}
      </button>

      {!collapsed && (
        <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800/50 rounded-lg px-3 py-2 space-y-1.5 min-w-[120px]">
          {/* 注意力 */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-stone-500">{'注意力'}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i < attentionRemaining ? 'bg-amber-400' : 'bg-stone-700'}`} />
              ))}
            </div>
          </div>

          {/* 暴露度 */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-stone-500">{'暴露度'}</span>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-stone-500 rounded-full transition-all" style={{ width: `${(exposure / 32) * 100}%` }} />
              </div>
              <span className="text-[10px] text-stone-400">{exposure}</span>
            </div>
          </div>

          {/* 灵感 */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-stone-500">{'灵感'}</span>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600/60 rounded-full transition-all" style={{ width: `${inspiration}%` }} />
              </div>
              <span className="text-[10px] text-stone-400">{inspiration}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

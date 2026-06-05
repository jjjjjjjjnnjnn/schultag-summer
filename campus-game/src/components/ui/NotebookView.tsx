import { useGameStore } from '../../store/gameStore'

export function NotebookView() {
  const { notebook, writings } = useGameStore()

  return (
    <div className="flex-1 flex flex-col scene-fade-in">
      <div className="px-6 py-3 border-b border-stone-800/50 flex items-center gap-3">
        <span className="text-sm">✎</span>
        <span className="text-sm text-stone-400">笔记本</span>
        <span className="text-xs text-stone-600">· {notebook.length} 条素材</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 素材列表 */}
        <div className="px-6 py-4">
          <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">
            收集的素材
          </h3>
          {notebook.length === 0 ? (
            <p className="text-sm text-stone-600 italic">
              还没有素材。在白天模式下观察周围的事物。
            </p>
          ) : (
            <div className="space-y-2">
              {notebook.map(entry => (
                <div key={entry.id} className="bg-stone-800/30 rounded px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-500">
                      {entry.category === 'visual' ? '👁' :
                       entry.category === 'dialogue' ? '💬' :
                       entry.category === 'thought' ? '💭' :
                       entry.category === 'sound' ? '🔊' :
                       entry.category === 'smell' ? '🌸' :
                       entry.category === 'action' ? '✨' : '📝'}
                    </span>
                    <span className="text-sm text-stone-200 font-medium">{entry.label}</span>
                    <span className="text-xs text-stone-600">{entry.category}</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 ml-6 leading-relaxed">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 已写成的文字 */}
        {writings.length > 0 && (
          <div className="px-6 py-4 border-t border-stone-800/30">
            <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">
              已写成的文字
            </h3>
            <div className="space-y-3">
              {writings.map((w, i) => (
                <div
                  key={i}
                  className="notebook-paper rounded-lg px-5 py-3 text-sm"
                  style={{ fontFamily: 'var(--font-serif-cn)' }}
                >
                  {w}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

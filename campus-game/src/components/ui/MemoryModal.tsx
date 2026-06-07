import { useGameStore } from '../../store/gameStore'
import { useContent } from '../../i18n'
import { HIDDEN_MEMORIES } from '../../data/memories'

export function MemoryModal() {
  const { inspiration, unlockedMemories, unlockMemory } = useGameStore()
  const { c } = useContent()

  // 找到可以解锁但尚未解锁的记忆
  const available = HIDDEN_MEMORIES.find(
    m => inspiration >= m.inspirationCost && !unlockedMemories.includes(m.id)
  )

  if (!available) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => unlockMemory(available.id)}>
      <div className="max-w-md mx-4 bg-[#2a2520] border border-amber-800/40 rounded-lg p-6 scene-fade-in animate-modal-enter" onClick={e => e.stopPropagation()}>
        <p className="text-[10px] text-amber-600/60 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {c('memory.unlocked', '记忆解锁')}
        </p>
        <p className="text-sm text-stone-200 leading-[2] whitespace-pre-line" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {available.text}
        </p>
        <button
          onClick={() => unlockMemory(available.id)}
          className="mt-4 px-4 py-2 border border-amber-700/50 text-amber-400 hover:bg-amber-900/20 transition-all text-xs rounded"
        >
          {c('memory.confirm', '收到')}
        </button>
      </div>
    </div>
  )
}

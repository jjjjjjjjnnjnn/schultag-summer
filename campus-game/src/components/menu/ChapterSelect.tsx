import { useGameStore } from '../../store/gameStore'
import { CHAPTERS } from '../../data/chapters'

interface Props {
  onSelect?: () => void
}

export function ChapterSelect({ onSelect }: Props) {
  const { completedChapters, currentSceneId, jumpToChapter } = useGameStore()

  return (
    <div className="space-y-3">
      {CHAPTERS.map((chapter, i) => {
        const isCompleted = completedChapters.includes(chapter.id)
        const isCurrent = currentSceneId === chapter.startSceneId ||
          currentSceneId.replace(/-day|-night/, '') === chapter.id
        const isUnlocked = i === 0 || completedChapters.includes(CHAPTERS[i - 1]?.id) || isCompleted || isCurrent

        return (
          <button
            key={chapter.id}
            disabled={!isUnlocked}
            onClick={() => {
              jumpToChapter(chapter.id)
              onSelect?.()
            }}
            className={`
              w-full text-left px-4 py-3 rounded-lg border transition-all duration-300
              ${!isUnlocked
                ? 'border-stone-800 text-stone-700 cursor-not-allowed opacity-40'
                : isCurrent
                  ? 'border-amber-700 bg-amber-900/10 text-stone-200'
                  : 'border-stone-700 hover:border-stone-500 hover:bg-stone-800/30 text-stone-300 cursor-pointer'
              }
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {!isUnlocked ? '🔒' : isCompleted ? '✓' : isCurrent ? '▶' : '○'}
                </span>
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                  {chapter.title}
                </span>
                <span className="text-xs text-stone-500">{chapter.subtitle}</span>
              </div>
              <span className="text-xs text-stone-600">{chapter.time}</span>
            </div>
            {/* 进度条 */}
            {chapter.observationCount > 0 && (
              <div className="ml-6 mt-1">
                <div className="h-0.5 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-700/60 rounded-full transition-all duration-500"
                    style={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                  />
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

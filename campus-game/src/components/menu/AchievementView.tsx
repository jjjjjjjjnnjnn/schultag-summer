import { useGameStore } from '../../store/gameStore'
import { ACHIEVEMENTS } from '../../data/achievements'

export function AchievementView() {
  const unlockedAchievements = useGameStore(s => s.unlockedAchievements)

  return (
    <div className="grid grid-cols-3 gap-3">
      {ACHIEVEMENTS.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id)
        return (
          <div
            key={achievement.id}
            className={`
              flex flex-col items-center text-center p-3 rounded-lg border transition-all
              ${isUnlocked
                ? 'border-amber-700/50 bg-amber-900/10'
                : 'border-stone-800 opacity-40'
              }
            `}
          >
            <span className={`text-2xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
              {isUnlocked ? achievement.icon : '🔒'}
            </span>
            <span className="text-xs text-stone-300 font-medium">
              {isUnlocked ? achievement.name : '???'}
            </span>
            {isUnlocked && (
              <span className="text-[10px] text-stone-500 mt-1 leading-tight">
                {achievement.description}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

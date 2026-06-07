import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTranslation, useContent } from '../../i18n'
import { MAIN_QUESTS, CHAPTER_GOALS, DAILY_OBJECTIVES } from '../../data/quests'
import { CHAPTERS } from '../../data/chapters'

export function QuestTracker() {
  const {
    completedMilestones,
    completedDailyObjectives,
    currentSceneId,
    completedChapters,
  } = useGameStore()
  const t = useTranslation()
  const { c } = useContent()
  const [expanded, setExpanded] = useState(false)

  // 主线进度
  const totalChapters = CHAPTERS.length
  const novelProgress = Math.round((completedChapters.length / totalChapters) * 100)

  // 当前场景的每日目标
  const dailyObj = DAILY_OBJECTIVES.find(d => d.sceneId === currentSceneId)
  const totalToday = dailyObj?.objectives.length || 0

  // 计算已完成每日目标数（仅当前场景）
  const currentCompletedDaily = dailyObj
    ? dailyObj.objectives.filter(obj => completedDailyObjectives.includes(obj.id)).length
    : 0

  // 当前章节目标
  const currentChapterId = currentSceneId.replace(/-(day|night)$/, '')
  const currentGoal = CHAPTER_GOALS.find(g => g.chapterId === currentChapterId)

  const novelCompleted = completedChapters.includes(currentChapterId)

  // 主线完成
  const allMilestonesDone = MAIN_QUESTS.every(m => completedMilestones.includes(m.id))
  const displayProgress = allMilestonesDone ? 100 : novelProgress

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`text-xs px-2 py-1 rounded border transition-colors flex items-center gap-1.5 ${
          expanded
            ? 'border-amber-700 text-amber-400'
            : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500'
        }`}
      >
        <span className="text-[10px]">◎</span>
        <span className="text-xs tabular-nums">{displayProgress}%</span>
        {!novelCompleted && totalToday > 0 && (
          <span className="text-[10px] text-amber-500/80">{currentCompletedDaily}/{totalToday}</span>
        )}
      </button>

      {/* 下拉面板 */}
      {expanded && (
        <div
          className="absolute top-full right-0 mt-2 w-72 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-50 p-4 space-y-3 text-xs"
          onClick={e => e.stopPropagation()}
        >
          {/* 主线进度 */}
          <div>
            <h4 className="text-stone-500 uppercase tracking-wider mb-1.5 text-[10px]">
              {t('quest.mainQuest')}
            </h4>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-stone-300">{t('quest.novelProgress')}</span>
              <span className="text-amber-400">{displayProgress}%</span>
            </div>
            <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-700/60 rounded-full transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <p className="text-stone-500 mt-1">
              {completedChapters.length}/{totalChapters} {t('quest.chaptersCompleted')}
            </p>
          </div>

          {/* 章节目标 */}
          {currentGoal && !novelCompleted && (
            <div className="border-t border-stone-800 pt-2">
              <h4 className="text-stone-500 uppercase tracking-wider mb-1.5 text-[10px]">
                {t('quest.chapterGoal')}
              </h4>
              <p className="text-stone-300">{c(currentGoal.cid || '', currentGoal.description)}</p>
            </div>
          )}

          {/* 每日目标 */}
          {dailyObj && !novelCompleted && (
            <div className="border-t border-stone-800 pt-2">
              <h4 className="text-stone-500 uppercase tracking-wider mb-1.5 text-[10px]">
                {t('quest.dailyObjectives')}
              </h4>
              <div className="space-y-1">
                {dailyObj.objectives.map(obj => {
                  const done = completedDailyObjectives.includes(obj.id)
                  return (
                    <div
                      key={obj.id}
                      className={`flex items-center gap-2 ${
                        done ? 'text-stone-600' : 'text-stone-300'
                      }`}
                    >
                      <span className="text-xs w-3 text-center">
                        {done ? '✓' : '○'}
                      </span>
                      <span className={done ? 'line-through' : ''}>{c(obj.cid || '', obj.description)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 无目标提示 */}
          {!dailyObj && !currentGoal && (
            <div className="border-t border-stone-800 pt-2">
              <p className="text-stone-500 italic">{t('quest.noObjectives')}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

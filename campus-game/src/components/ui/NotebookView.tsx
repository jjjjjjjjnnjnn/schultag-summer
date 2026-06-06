import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTranslation } from '../../i18n'
import { characters } from '../../data/characters'
import { CHAPTERS } from '../../data/chapters'

type Tab = 'observations' | 'writings' | 'characters' | 'stats'

export function NotebookView() {
  const t = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('observations')

  const TABS: { id: Tab; label: string }[] = [
    { id: 'observations', label: t('notebook.observations') },
    { id: 'writings', label: t('notebook.writings') },
    { id: 'characters', label: t('notebook.characters') },
    { id: 'stats', label: t('notebook.stats') },
  ]

  return (
    <div className="flex-1 flex flex-col scene-fade-in">
      {/* Tab 栏 */}
      <div className="px-4 py-2 border-b border-stone-800/50 flex items-center gap-1">
        <span className="text-xs text-stone-500 mr-2" style={{ fontFamily: 'var(--font-serif-cn)' }}>{t('notebook.title')}</span>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3 py-1.5 rounded transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-900/20 text-amber-400 border border-amber-700/50'
                : 'text-stone-500 hover:text-stone-300 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {activeTab === 'observations' && <ObservationsTab />}
        {activeTab === 'writings' && <WritingsTab />}
        {activeTab === 'characters' && <CharactersTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
    </div>
  )
}

function ObservationsTab() {
  const allNotebookEntries = useGameStore(s => s.allNotebookEntries)
  const t = useTranslation()

  if (allNotebookEntries.length === 0) {
    return (
      <p className="text-sm text-stone-600 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
        {t('notebook.empty')}
      </p>
    )
  }

  const grouped: Record<string, typeof allNotebookEntries> = {}
  for (const entry of allNotebookEntries) {
    const key = entry.sceneId || 'unknown'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  }

  return (
    <div className="space-y-6">
      {CHAPTERS.map(chapter => {
        const entries = grouped[chapter.startSceneId]
        if (!entries || entries.length === 0) return null
        return (
          <div key={chapter.id}>
            <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>{chapter.title}</span>
              <span className="text-stone-700">·</span>
              <span className="text-stone-600">{chapter.time}</span>
            </h3>
            <div className="space-y-2">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="bg-stone-800/30 rounded px-3 py-2 border border-stone-700/20"
                  style={{ fontFamily: 'var(--font-serif-cn)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs">
                      {entry.category === 'visual' ? '👁' :
                       entry.category === 'dialogue' ? '💬' :
                       entry.category === 'thought' ? '💭' :
                       entry.category === 'sound' ? '🔊' :
                       entry.category === 'smell' ? '🌸' :
                       entry.category === 'action' ? '✨' : '📝'}
                    </span>
                    <span className="text-xs text-stone-200 font-medium">{entry.label}</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-[1.8]">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function WritingsTab() {
  const { writings } = useGameStore()
  const t = useTranslation()

  if (writings.length === 0) {
    return (
      <p className="text-sm text-stone-600 italic" style={{ fontFamily: 'var(--font-serif-cn)' }}>
        {t('notebook.emptyWriting')}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {writings.map((w, i) => (
        <div key={i} className="space-y-2">
          <h3 className="text-xs text-stone-500 uppercase tracking-wider">
            {t('notebook.writings')} {i + 1}
          </h3>
          <div className="notebook-paper rounded-lg px-4 py-3 text-sm leading-[1.8]">
            {w}
          </div>
        </div>
      ))}
    </div>
  )
}

function CharactersTab() {
  const imprints = useGameStore(s => s.imprints)
  const impressions = useGameStore(s => s.impressions)
  const allNotebookEntries = useGameStore(s => s.allNotebookEntries)
  const t = useTranslation()

  const mainChars = Object.values(characters).filter(
    c => c.role !== 'protagonist' && c.role !== 'teacher'
  )

  return (
    <div className="space-y-6">
      {mainChars.map(char => {
        const imprint = imprints[char.id]
        const obsCount = imprint ? imprint.observationCount : 0
        const writeCount = imprint ? imprint.writingCount : 0
        const level = impressions[char.id] || 0
        const impressionText = char.impressionLevels[level] || ''

        const recentObs = allNotebookEntries
          .filter(e => e.focusGroup === char.id)
          .slice(-3)

        return (
          <div key={char.id} className="bg-stone-800/30 rounded-lg px-4 py-3 border border-stone-700/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }} />
              <span className="text-sm text-stone-200 font-medium" style={{ fontFamily: 'var(--font-serif-cn)' }}>
                {char.name}
              </span>
              <span className="text-xs text-stone-500" style={{ fontFamily: 'var(--font-serif-en)' }}>
                {char.nameEn}
              </span>
              {impressionText && (
                <span className="text-xs ml-auto" style={{ color: char.color }}>{impressionText}</span>
              )}
            </div>

            <div className="flex gap-4 text-xs text-stone-500 mb-2">
              <span>{t('char.observations', { n: obsCount })}</span>
              <span>{t('char.writings', { n: writeCount })}</span>
            </div>

            {recentObs.length > 0 && (
              <div className="space-y-1 mt-2 pt-2 border-t border-stone-700/20">
                <p className="text-[10px] text-stone-600 uppercase tracking-wider">{t('char.recentObs')}</p>
                {recentObs.map(entry => (
                  <p key={entry.id} className="text-xs text-stone-400 leading-relaxed pl-2 border-l border-stone-700/30">
                    {entry.label}
                  </p>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StatsTab() {
  const { allNotebookEntries, writings, focusHistory, exposure, unlockedAchievements } = useGameStore()
  const t = useTranslation()

  const totalObservations = CHAPTERS.reduce((sum, ch) => sum + ch.observationCount, 0)
  const observedCount = allNotebookEntries.length
  const coverage = totalObservations > 0 ? Math.round((observedCount / totalObservations) * 100) : 0

  const focusCounts: Record<string, number> = {}
  for (const f of focusHistory) {
    focusCounts[f] = (focusCounts[f] || 0) + 1
  }
  const topFocus = Object.entries(focusCounts).sort((a, b) => b[1] - a[1])[0]
  const topFocusLabel = topFocus
    ? topFocus[0] === 'maya' ? t('focus.maya') : topFocus[0] === 'ludwig' ? t('focus.ludwig') : t('focus.env')
    : '—'

  return (
    <div className="space-y-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
      <StatRow label={t('stats.totalObs')} value={`${observedCount}`} />
      <StatRow label={t('stats.totalWrite')} value={`${writings.length}`} />
      <StatRow label={t('stats.topFocus')} value={topFocusLabel} />
      <StatRow label={t('stats.exposure')} value={`${exposure}`} />

      <div className="pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-stone-500">{t('stats.coverage')}</span>
          <span className="text-xs text-stone-400">{observedCount}/{totalObservations}</span>
        </div>
        <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-700/60 rounded-full transition-all duration-500"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      <StatRow label={t('stats.achievements')} value={`${unlockedAchievements.length}`} />
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-stone-500">{label}</span>
      <span className="text-sm text-stone-300">{value}</span>
    </div>
  )
}

import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTranslation, useContent } from '../../i18n'
import { characters } from '../../data/characters'
import { CHAPTERS } from '../../data/chapters'
import { audio } from '../../lib/audio'

type Tab = 'observations' | 'writings' | 'characters' | 'stats'

export function NotebookView() {
  const t = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('observations')

  const handleTabChange = (tab: Tab) => {
    audio.play('page')
    setActiveTab(tab)
  }

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
            onClick={() => handleTabChange(tab.id)}
            className={`text-xs px-3 py-1.5 transition-colors relative ${
              activeTab === tab.id
                ? 'text-amber-400'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-amber-500/60 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 tab-fade-in" key={activeTab}>
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
  const { co } = useContent()

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
        const chTitle = chapter.cid ? co(chapter.cid, 'title', chapter.title) : chapter.title
        const chTime = chapter.cid ? co(chapter.cid, 'time', chapter.time) : chapter.time
        return (
          <div key={chapter.id}>
            <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3 pb-2 border-b border-stone-800/30 flex items-center gap-2">
              <span>{chTitle}</span>
              <span className="text-stone-700">·</span>
              <span className="text-stone-600">{chTime}</span>
            </h3>
            <div className="space-y-2">
              {entries.map((entry, entryIdx) => {
                const entryLabel = entry.cid ? co(entry.cid, 'label', entry.label) : entry.label
                const entryText = entry.cid ? co(entry.cid, 'text', entry.text) : entry.text
                const categoryColor = entry.category === 'visual' ? '#d97706'
                  : entry.category === 'dialogue' ? '#3b82f6'
                  : entry.category === 'thought' ? '#8b5cf6'
                  : entry.category === 'sound' ? '#a8a29e'
                  : entry.category === 'smell' ? '#ec4899'
                  : entry.category === 'action' ? '#22c55e'
                  : '#a8a29e'
                return (
                  <div
                    key={entry.id}
                    className="bg-stone-800/20 rounded-r pl-4 pr-3 py-2 border border-stone-700/20 list-item-enter"
                    style={{ borderLeftWidth: '2px', borderLeftColor: categoryColor, animationDelay: `${entryIdx * 30}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-stone-200 font-medium">{entryLabel}</span>
                      <span className="text-[10px] text-stone-600 ml-auto">{entry.category}</span>
                    </div>
                    <p className="text-[13px] text-stone-400 leading-[1.8]" style={{ fontFamily: 'var(--font-serif-cn)' }}>{entryText}</p>
                  </div>
                )
              })}
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
        <div key={i} className="space-y-2 list-item-enter" style={{ animationDelay: `${i * 40}ms` }}>
          <h3 className="text-xs text-stone-500 uppercase tracking-wider">
            {t('notebook.writings')} {i + 1}
          </h3>
          <div className="notebook-paper rounded px-5 py-4 text-[15px] leading-[2] shadow-sm">
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
  const settings = useGameStore(s => s.settings)
  const t = useTranslation()
  const { co } = useContent()
  const isForeignLang = settings.language === 'en' || settings.language === 'de'

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
        const impressionText = char.cid
          ? co(char.cid, `imp.${level}`, char.impressionLevels[level] || '')
          : (char.impressionLevels[level] || '')

        const recentObs = allNotebookEntries
          .filter(e => e.focusGroup === char.id)
          .slice(-3)

        const primaryName = isForeignLang ? char.nameEn : char.name
        const secondaryName = isForeignLang ? char.name : char.nameEn

        return (
          <div key={char.id} className="rounded-lg overflow-hidden border border-stone-700/20">
            {/* Top color bar */}
            <div className="h-[2px]" style={{ backgroundColor: char.color }} />
            <div className="bg-stone-800/20 px-4 pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char.color }} />
                <span className="text-sm text-stone-200 font-medium" style={{ fontFamily: isForeignLang ? 'var(--font-serif-en)' : 'var(--font-serif-cn)' }}>
                  {primaryName}
                </span>
                <span className="text-xs text-stone-600" style={{ fontFamily: isForeignLang ? 'var(--font-serif-cn)' : 'var(--font-serif-en)' }}>
                  {secondaryName}
                </span>
                {impressionText && (
                  <span className="text-xs font-medium ml-auto" style={{ color: char.color }}>{impressionText}</span>
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

import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useTranslation, useContent } from '../i18n'
import { SceneView } from '../components/ui/SceneView'
import { NotebookView } from '../components/ui/NotebookView'
import { QuestTracker } from '../components/ui/QuestTracker'
import { MenuModal } from '../components/menu/MenuModal'
import { ChapterSelect } from '../components/menu/ChapterSelect'
import { AchievementView } from '../components/menu/AchievementView'
import { SettingsPanel } from '../components/menu/SettingsPanel'
import { characters } from '../data/characters'

type MenuOverlay = null | 'chapters' | 'achievements' | 'settings'

export function GameScreen() {
  const { saveGame, resetGame, observedIds, allNotebookEntries, getCurrentScene, writingTags, isPlaying, settings } = useGameStore()
  const scene = getCurrentScene()
  const mode = scene?.mode || 'day'
  const [showMenu, setShowMenu] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [menuOverlay, setMenuOverlay] = useState<MenuOverlay>(null)
  const t = useTranslation()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        // 如果观察弹窗打开，让 ObservationModal 处理
        if (useGameStore.getState().modalObservationId) return
        if (menuOverlay) {
          setMenuOverlay(null)
        } else if (showNotebook) {
          setShowNotebook(false)
        } else if (isPlaying) {
          setMenuOverlay('settings')
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [menuOverlay, showNotebook, isPlaying])

  useEffect(() => {
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }
  }, [settings.reducedMotion])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-stone-800/50 bg-stone-950/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="text-sm text-stone-400 tracking-wider cursor-pointer hover:text-stone-200 transition-colors"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
            onClick={() => setShowMenu(!showMenu)}
          >
            {t('title.name')}
          </span>
          <span className="text-xs text-stone-600 hidden sm:inline">·</span>
          <span className="text-xs text-stone-600 hidden sm:inline">
            {mode === 'night' ? '🌙' : '☀'} {mode === 'night' ? t('game.night') : t('game.day')}
          </span>
          {observedIds.length > 0 && (
            <span className="text-xs text-amber-600">
              👁 {observedIds.length}
            </span>
          )}
          {writingTags.length > 0 && (
            <span className="text-xs text-violet-600 hidden sm:inline">
              ✎ {writingTags.length} {t('game.imprints')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotebook(!showNotebook)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              showNotebook
                ? 'border-amber-700 text-amber-400'
                : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500'
            }`}
          >
            ✎ ({allNotebookEntries.length})
          </button>
          <div className="relative">
            <QuestTracker />
          </div>
          <button
            onClick={() => setMenuOverlay('settings')}
            className="text-xs px-2 py-1.5 rounded border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-colors"
            title={t('game.settings')}
          >
            ⚙
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden relative">
        {showNotebook ? <NotebookView /> : <CharacterSidebar />}

        {/* 右侧：场景 */}
        <div className="flex-1 border-l border-stone-800/30">
          {showNotebook ? (
            <div className="flex-1 h-full">
              <div className="h-full flex flex-col">
                <NotebookContent />
              </div>
            </div>
          ) : (
            <SceneView />
          )}
        </div>
      </div>

      {/* 移动端底部人物栏 */}
      <MobileCharacterBar />

      {/* 游戏菜单覆盖层 */}
      {showMenu && (
        <div
          className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-lg p-8 space-y-3 min-w-[200px]"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg text-stone-200 mb-4" style={{ fontFamily: 'var(--font-serif-cn)' }}>
              {t('game.menu')}
            </h2>
            <button
              onClick={() => { saveGame(); setShowMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              {t('game.save')}
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('chapters') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              {t('game.chapters')}
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('achievements') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              {t('game.achievements')}
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('settings') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              {t('game.settings')}
            </button>
            <div className="border-t border-stone-800 my-2" />
            <button
              onClick={() => { resetGame(); setShowMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-stone-800 rounded transition-colors"
            >
              {t('game.returnTitle')}
            </button>
          </div>
        </div>
      )}

      {/* 菜单子面板 */}
      {menuOverlay === 'chapters' && (
        <MenuModal title={t('game.chapters')} onClose={() => setMenuOverlay(null)}>
          <ChapterSelect onSelect={() => setMenuOverlay(null)} />
        </MenuModal>
      )}
      {menuOverlay === 'achievements' && (
        <MenuModal title={t('game.achievements')} onClose={() => setMenuOverlay(null)}>
          <AchievementView />
        </MenuModal>
      )}
      {menuOverlay === 'settings' && (
        <MenuModal title={t('settings.title')} onClose={() => setMenuOverlay(null)}>
          <SettingsPanel />
        </MenuModal>
      )}
    </div>
  )
}

// ── 笔记本详细内容 ──
function NotebookContent() {
  const { allNotebookEntries, writings } = useGameStore()
  const t = useTranslation()
  const { co } = useContent()

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3">
        {t('notebook.observations')}
      </h3>
      {allNotebookEntries.length === 0 ? (
        <p className="text-sm text-stone-600 italic">
          {t('notebook.empty')}
        </p>
      ) : (
        <div className="space-y-2">
          {allNotebookEntries.map(entry => {
            const entryLabel = entry.cid ? co(entry.cid, 'label', entry.label) : entry.label
            const entryText = entry.cid ? co(entry.cid, 'text', entry.text) : entry.text
            return (
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
                  <span className="text-sm text-stone-200 font-medium">{entryLabel}</span>
                  <span className="text-xs text-stone-600">{entry.category}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1 ml-6 leading-relaxed">{entryText}</p>
              </div>
            )
          })}
        </div>
      )}

      {writings.length > 0 && (
        <>
          <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3 mt-6">
            {t('notebook.writings')}
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
        </>
      )}
    </div>
  )
}

// ── 人物印象侧边栏（桌面端） ──
function CharacterSidebar() {
  const impressions = useGameStore(s => s.impressions)
  const imprints = useGameStore(s => s.imprints)
  const settings = useGameStore(s => s.settings)
  const t = useTranslation()
  const { co } = useContent()
  const isForeignLang = settings.language === 'en' || settings.language === 'de'

  const mainChars = Object.values(characters).filter(
    c => c.role !== 'protagonist' && c.role !== 'teacher' && c.impressionLevels.length > 0
  )

  return (
    <div className="w-48 border-r border-stone-800/30 bg-stone-950/50 p-4 hidden lg:flex flex-col">
      <h3 className="text-xs text-stone-600 uppercase tracking-wider mb-3">{t('char.impression')}</h3>
      <div className="space-y-4">
        {mainChars.map(c => {
          const level = impressions[c.id] || 0
          const impressionText = c.cid
            ? co(c.cid, 'imp.' + level, c.impressionLevels[level] || '')
            : (c.impressionLevels[level] || '陌生')
          const imprint = imprints[c.id]
          const totalImprint = imprint
            ? imprint.observationCount + imprint.writingCount
            : 0
          const awarenessText = totalImprint === 0
            ? ''
            : totalImprint <= 2
              ? t('char.awareness.1')
              : totalImprint <= 4
                ? t('char.awareness.2')
                : t('char.awareness.3')

          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-stone-400">{isForeignLang ? c.nameEn : c.name}</span>
              </div>
              <p
                className="text-xs ml-4 transition-all duration-500"
                style={{ color: c.color, opacity: level === 0 ? 0.4 : 1 }}
              >
                {impressionText}
              </p>
              {awarenessText && (
                <p className="text-xs ml-4 text-stone-600 italic"
                   style={{ fontFamily: isForeignLang ? 'var(--font-serif-en)' : 'var(--font-serif-cn)' }}>
                  {awarenessText}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 移动端底部人物栏 ──
function MobileCharacterBar() {
  const impressions = useGameStore(s => s.impressions)
  const { co } = useContent()

  const mainChars = Object.values(characters).filter(
    c => c.role !== 'protagonist' && c.role !== 'teacher' && c.impressionLevels.length > 0
  )

  const hasData = mainChars.some(c => {
    const level = impressions[c.id] || 0
    return level > 0
  })

  if (!hasData) return null

  return (
    <div className="lg:hidden border-t border-stone-800/50 bg-stone-950/80 px-4 py-2 flex gap-4 overflow-x-auto">
      {mainChars.map(c => {
        const level = impressions[c.id] || 0
        const impressionText = c.cid
          ? co(c.cid, 'imp.' + level, c.impressionLevels[level] || '')
          : (c.impressionLevels[level] || '陌生')
        if (level === 0) return null
        return (
          <div key={c.id} className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-xs" style={{ color: c.color }}>{impressionText}</span>
          </div>
        )
      })}
    </div>
  )
}

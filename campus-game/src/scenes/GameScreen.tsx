import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { SceneView } from '../components/ui/SceneView'
import { NotebookView } from '../components/ui/NotebookView'
import { MenuModal } from '../components/menu/MenuModal'
import { ChapterSelect } from '../components/menu/ChapterSelect'
import { AchievementView } from '../components/menu/AchievementView'
import { SettingsPanel } from '../components/menu/SettingsPanel'
import { characters } from '../data/characters'

type MenuOverlay = null | 'chapters' | 'achievements' | 'settings'

export function GameScreen() {
  const { saveGame, resetGame, observedIds, notebook, getCurrentScene, writingTags } = useGameStore()
  const scene = getCurrentScene()
  const mode = scene?.mode || 'day'
  const [showMenu, setShowMenu] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [menuOverlay, setMenuOverlay] = useState<MenuOverlay>(null)

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
            异乡校园
          </span>
          <span className="text-xs text-stone-600 hidden sm:inline">·</span>
          <span className="text-xs text-stone-600 hidden sm:inline">
            {mode === 'night' ? '🌙 夜晚' : '☀ 白天'}
          </span>
          {observedIds.length > 0 && (
            <span className="text-xs text-amber-600">
              👁 {observedIds.length}
            </span>
          )}
          {writingTags.length > 0 && (
            <span className="text-xs text-violet-600 hidden sm:inline">
              ✎ {writingTags.length} 个印记
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotebook(!showNotebook)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              showNotebook
                ? 'border-amber-700 text-amber-400'
                : 'border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500'
            }`}
          >
            ✎ ({notebook.length})
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
              菜单
            </h2>
            <button
              onClick={() => { saveGame(); setShowMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              存档
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('chapters') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              章节选择
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('achievements') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              成就
            </button>
            <button
              onClick={() => { setShowMenu(false); setMenuOverlay('settings') }}
              className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
            >
              设置
            </button>
            <div className="border-t border-stone-800 my-2" />
            <button
              onClick={() => { resetGame(); setShowMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-stone-800 rounded transition-colors"
            >
              返回标题
            </button>
          </div>
        </div>
      )}

      {/* 菜单子面板 */}
      {menuOverlay === 'chapters' && (
        <MenuModal title="章节选择" onClose={() => setMenuOverlay(null)}>
          <ChapterSelect onSelect={() => setMenuOverlay(null)} />
        </MenuModal>
      )}
      {menuOverlay === 'achievements' && (
        <MenuModal title="成就" onClose={() => setMenuOverlay(null)}>
          <AchievementView />
        </MenuModal>
      )}
      {menuOverlay === 'settings' && (
        <MenuModal title="设置" onClose={() => setMenuOverlay(null)}>
          <SettingsPanel />
        </MenuModal>
      )}
    </div>
  )
}

// ── 笔记本详细内容 ──
function NotebookContent() {
  const { notebook, writings } = useGameStore()

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
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

      {writings.length > 0 && (
        <>
          <h3 className="text-xs text-stone-500 uppercase tracking-wider mb-3 mt-6">
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
        </>
      )}
    </div>
  )
}

// ── 人物印象侧边栏（桌面端） ──
function CharacterSidebar() {
  const impressions = useGameStore(s => s.impressions)
  const imprints = useGameStore(s => s.imprints)

  const mainChars = Object.values(characters).filter(
    c => c.role !== 'protagonist' && c.role !== 'teacher' && c.impressionLevels.length > 0
  )

  return (
    <div className="w-48 border-r border-stone-800/30 bg-stone-950/50 p-4 hidden lg:flex flex-col">
      <h3 className="text-xs text-stone-600 uppercase tracking-wider mb-3">人物印象</h3>
      <div className="space-y-4">
        {mainChars.map(c => {
          const level = impressions[c.id] || 0
          const impressionText = c.impressionLevels[level] || '陌生'
          const imprint = imprints[c.id]
          const totalImprint = imprint
            ? imprint.observationCount + imprint.writingCount
            : 0
          const awarenessText = totalImprint === 0
            ? ''
            : totalImprint <= 2
              ? '你开始注意他了'
              : totalImprint <= 4
                ? '你总是不自觉地看向他'
                : '他似乎察觉到了什么'

          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-stone-400">{c.name}</span>
              </div>
              <p
                className="text-xs ml-4 transition-all duration-500"
                style={{ color: c.color, opacity: level === 0 ? 0.4 : 1 }}
              >
                {impressionText}
              </p>
              {awarenessText && (
                <p className="text-xs ml-4 text-stone-600 italic"
                   style={{ fontFamily: 'var(--font-serif-cn)' }}>
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
        const impressionText = c.impressionLevels[level] || '陌生'
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

import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useTranslation } from '../i18n'
import { MenuModal } from '../components/menu/MenuModal'
import { ChapterSelect } from '../components/menu/ChapterSelect'
import { AchievementView } from '../components/menu/AchievementView'
import { SettingsPanel } from '../components/menu/SettingsPanel'

type Overlay = null | 'chapters' | 'achievements' | 'settings' | 'about' | 'help'

export function TitleScreen() {
  const { startGame, loadGame } = useGameStore()
  const [overlay, setOverlay] = useState<Overlay>(null)
  const t = useTranslation()

  const hasSave = localStorage.getItem('schultag-save-v2') !== null

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景氛围 */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-black" />

      {/* 装饰性光线 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-900/10 blur-3xl rounded-full" />

      <div className="relative z-10 text-center space-y-12 scene-fade-in">
        {/* 标题 */}
        <div className="space-y-4">
          <h1
            className="text-5xl font-light tracking-wider text-stone-100"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
          >
            {t('title.name')}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-stone-700" />
            <span className="text-sm text-stone-500 tracking-widest" style={{ fontFamily: 'var(--font-serif-en)' }}>SCHULTAG</span>
            <div className="h-px w-12 bg-stone-700" />
          </div>
          <p className="text-lg text-amber-500/80" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            {t('title.subtitle')}
          </p>
        </div>

        {/* 副标题 */}
        <p className="text-sm text-stone-400 max-w-md leading-[2] whitespace-pre-line" style={{ fontFamily: 'var(--font-serif-cn)' }}>
          {t('title.description')}
        </p>

        {/* 按钮 */}
        <div className="space-y-3">
          <button
            onClick={startGame}
            className="block w-48 mx-auto px-6 py-3 border border-amber-700 bg-amber-900/20 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200 transition-all duration-300 text-sm tracking-wider rounded"
          >
            {t('title.start')}
          </button>

          {hasSave && (
            <button
              onClick={() => loadGame()}
              className="block w-48 mx-auto px-6 py-3 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-all text-sm rounded"
            >
              {t('title.continue')}
            </button>
          )}
        </div>

        {/* 菜单链接 */}
        <div className="flex items-center justify-center gap-4 text-xs text-stone-600">
          <button onClick={() => setOverlay('chapters')} className="hover:text-stone-400 transition-colors">
            {t('title.chapters')}
          </button>
          <span>·</span>
          <button onClick={() => setOverlay('achievements')} className="hover:text-stone-400 transition-colors">
            {t('title.achievements')}
          </button>
          <span>·</span>
          <button onClick={() => setOverlay('settings')} className="hover:text-stone-400 transition-colors">
            {t('title.settings')}
          </button>
          <span>·</span>
          <button onClick={() => setOverlay('about')} className="hover:text-stone-400 transition-colors">
            {t('title.about')}
          </button>
          <span>·</span>
          <button onClick={() => setOverlay('help')} className="hover:text-stone-400 transition-colors">
            {t('title.help')}
          </button>
        </div>

        {/* 版本号 */}
        <p className="text-xs text-stone-700 mt-8">
          v0.8 — {t('title.version')}
        </p>
      </div>

      {/* 覆盖层 */}
      {overlay === 'chapters' && (
        <MenuModal title={t('title.chapters')} onClose={() => setOverlay(null)}>
          <ChapterSelect onSelect={() => setOverlay(null)} />
        </MenuModal>
      )}
      {overlay === 'achievements' && (
        <MenuModal title={t('title.achievements')} onClose={() => setOverlay(null)}>
          <AchievementView />
        </MenuModal>
      )}
      {overlay === 'settings' && (
        <MenuModal title={t('settings.title')} onClose={() => setOverlay(null)}>
          <SettingsPanel />
        </MenuModal>
      )}
      {overlay === 'about' && (
        <MenuModal title={t('intro.title')} onClose={() => setOverlay(null)}>
          <IntroContent />
        </MenuModal>
      )}
      {overlay === 'help' && (
        <MenuModal title={t('help.title')} onClose={() => setOverlay(null)}>
          <HelpContent />
        </MenuModal>
      )}
    </div>
  )
}

function IntroContent() {
  return (
    <div className="space-y-4 text-sm text-stone-300 leading-[1.9]" style={{ fontFamily: 'var(--font-serif-cn)' }}>
      <p>
        《异乡校园：夏天》是一个关于观察、记忆与书写的叙事游戏。
      </p>
      <p>
        你是荣加俊，15岁，在德国寄宿学校写下90万字的秘密小说。
        每天你选择观察什么，晚上把观察写成文字。
        但你写下的东西，开始改变你看到的现实。
      </p>
      <p className="text-stone-500">
        这不是恋爱模拟。
        这是一个关于"写作者如何被自己塑造"的故事。
      </p>
      <p className="text-xs text-stone-600 pt-2 border-t border-stone-800">
        预计游玩时间：20-30分钟
      </p>
    </div>
  )
}

function HelpContent() {
  return (
    <div className="space-y-6 text-sm text-stone-300 leading-[1.9]" style={{ fontFamily: 'var(--font-serif-cn)' }}>
      <div>
        <h3 className="text-amber-500/80 text-xs uppercase tracking-wider mb-2">☀ 白天</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>选择焦点（今天更留意谁）</li>
          <li>观察场景中的热点</li>
          <li>收集素材到笔记本</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/80 text-xs uppercase tracking-wider mb-2">🌙 夜晚</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>选择素材写成文字</li>
          <li>不同的素材组合产生不同的文字</li>
          <li>你写的内容会影响后续的故事</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/80 text-xs uppercase tracking-wider mb-2">关于注意力</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>同类观察消耗1点，异类消耗2点</li>
          <li>每天只有3点注意力，所以你需要选择</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/80 text-xs uppercase tracking-wider mb-2">关于 Echo</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>你之前观察过的东西，可能在后续章节中被引用</li>
          <li>你写过的内容，会改变世界对你的回应</li>
        </ul>
      </div>
    </div>
  )
}

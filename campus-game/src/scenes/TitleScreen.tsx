import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useTranslation, useContent } from '../i18n'
import { audio } from '../lib/audio'
import { MenuModal } from '../components/menu/MenuModal'
import { ChapterSelect } from '../components/menu/ChapterSelect'
import { AchievementView } from '../components/menu/AchievementView'
import { SettingsPanel } from '../components/menu/SettingsPanel'

type Overlay = null | 'chapters' | 'achievements' | 'settings' | 'about' | 'help'

export function TitleScreen() {
  const { startGame, loadGame, settings } = useGameStore()
  const [overlay, setOverlay] = useState<Overlay>(null)
  const t = useTranslation()

  useEffect(() => {
    if (settings.reducedMotion) {
      document.body.classList.add('reduce-motion')
    } else {
      document.body.classList.remove('reduce-motion')
    }
  }, [settings.reducedMotion])

  const handleStart = () => {
    audio.init()
    audio.setEnabled(settings.soundEnabled)
    startGame()
  }

  const handleLoad = () => {
    audio.init()
    audio.setEnabled(settings.soundEnabled)
    loadGame()
  }

  const hasSave = localStorage.getItem('schultag-save-v2') !== null

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden grain-overlay">
      {/* 背景层次 */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-[#0f0d0b] to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-72 bg-amber-900/8 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-amber-950/10 blur-3xl rounded-full" />

      <div className="relative z-10 text-center space-y-10 scene-fade-in px-6">
        {/* 标题 */}
        <div className="space-y-5">
          <h1
            className="text-5xl sm:text-6xl font-light tracking-[0.12em] text-stone-100"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
          >
            {t('title.name')}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-stone-600" />
            <span
              className="text-[11px] text-stone-500 tracking-[0.25em] uppercase"
              style={{ fontFamily: 'var(--font-serif-en)' }}
            >
              Schultag
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-stone-600" />
          </div>
          <p
            className="text-base sm:text-lg text-amber-500/70 tracking-wide"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
          >
            {t('title.subtitle')}
          </p>
        </div>

        {/* 描述 */}
        <p
          className="text-sm text-stone-500 max-w-md mx-auto leading-[2] whitespace-pre-line"
          style={{ fontFamily: 'var(--font-serif-cn)' }}
        >
          {t('title.description')}
        </p>

        {/* 按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="block w-48 mx-auto px-6 py-3 border border-stone-600 bg-stone-900/40 text-stone-200 hover:border-amber-700/60 hover:bg-amber-900/15 hover:text-amber-100 transition-all duration-300 text-sm tracking-wider rounded-sm"
          >
            {t('title.start')}
          </button>

          {hasSave && (
            <button
              onClick={handleLoad}
              className="block w-48 mx-auto px-6 py-3 border border-stone-700/60 text-stone-500 hover:text-stone-300 hover:border-stone-500 transition-all duration-300 text-sm rounded-sm"
            >
              {t('title.continue')}
            </button>
          )}
        </div>

        {/* 菜单链接 */}
        <div className="flex items-center justify-center gap-5 text-xs text-stone-600">
          {([
            ['chapters', 'title.chapters'],
            ['achievements', 'title.achievements'],
            ['settings', 'title.settings'],
            ['about', 'title.about'],
            ['help', 'title.help'],
          ] as const).map(([key, labelKey], i) => (
            <span key={key} className="flex items-center gap-5">
              {i > 0 && <span className="text-stone-800">·</span>}
              <button
                onClick={() => setOverlay(key)}
                className="hover:text-stone-400 transition-colors pb-0.5 border-b border-transparent hover:border-stone-700"
              >
                {t(labelKey)}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 版本号 — 右下角 */}
      <p className="absolute bottom-4 right-5 text-[10px] text-stone-800">
        v0.9.5
      </p>

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
  const { c } = useContent()
  return (
    <div className="space-y-4 text-sm text-stone-300 leading-[1.9]" style={{ fontFamily: 'var(--font-serif-cn)' }}>
      <p>
        {c('intro.p1', '《异乡校园：夏天》是一个关于观察、记忆与书写的叙事游戏。')}
      </p>
      <p>
        {c('intro.p2', '你是荣加俊，15岁，在德国寄宿学校写下90万字的秘密小说。每天你选择观察什么，晚上把观察写成文字。但你写下的东西，开始改变你看到的现实。')}
      </p>
      <p className="text-stone-500">
        {c('intro.p3', '这不是恋爱模拟。这是一个关于"写作者如何被自己塑造"的故事。')}
      </p>
      <p className="text-xs text-stone-600 pt-2 border-t border-stone-800/60">
        {c('intro.p4', '预计游玩时间：20-30分钟')}
      </p>
    </div>
  )
}

function HelpContent() {
  const { c } = useContent()
  return (
    <div className="space-y-6 text-sm text-stone-300 leading-[1.9]" style={{ fontFamily: 'var(--font-serif-cn)' }}>
      <div>
        <h3 className="text-amber-500/70 text-xs uppercase tracking-wider mb-2">{c('help.dayTitle', '☀ 白天')}</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>{c('help.day1', '选择焦点（今天更留意谁）')}</li>
          <li>{c('help.day2', '观察场景中的热点')}</li>
          <li>{c('help.day3', '收集素材到笔记本')}</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/70 text-xs uppercase tracking-wider mb-2">{c('help.nightTitle', '🌙 夜晚')}</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>{c('help.night1', '选择素材写成文字')}</li>
          <li>{c('help.night2', '不同的素材组合产生不同的文字')}</li>
          <li>{c('help.night3', '你写的内容会影响后续的故事')}</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/70 text-xs uppercase tracking-wider mb-2">{c('help.attnTitle', '关于注意力')}</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>{c('help.attn1', '同类观察消耗1点，异类消耗2点')}</li>
          <li>{c('help.attn2', '每天只有3点注意力，所以你需要选择')}</li>
        </ul>
      </div>
      <div>
        <h3 className="text-amber-500/70 text-xs uppercase tracking-wider mb-2">{c('help.echoTitle', '关于 Echo')}</h3>
        <ul className="space-y-1 text-xs text-stone-400">
          <li>{c('help.echo1', '你之前观察过的东西，可能在后续章节中被引用')}</li>
          <li>{c('help.echo2', '你写过的内容，会改变世界对你的回应')}</li>
        </ul>
      </div>
    </div>
  )
}

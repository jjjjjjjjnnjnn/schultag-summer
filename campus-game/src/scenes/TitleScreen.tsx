import { useGameStore } from '../store/gameStore'

export function TitleScreen() {
  const { startGame, loadGame } = useGameStore()

  const hasSave = localStorage.getItem('schultag-save') !== null

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
            异乡校园
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-stone-700" />
            <span className="text-sm text-stone-500 tracking-widest">SCHULTAG</span>
            <div className="h-px w-12 bg-stone-700" />
          </div>
          <p className="text-lg text-amber-500/80" style={{ fontFamily: 'var(--font-serif-cn)' }}>
            夏天
          </p>
        </div>

        {/* 副标题 */}
        <p className="text-sm text-stone-500 max-w-md leading-relaxed">
          在德国的寄宿学校里，荣加俊把每一天的观察写进一本秘密的小说。
          <br />
          走廊里的光，食堂的味道，朋友说的话。
          <br />
          那些被写下来的，不再只是日常生活。
        </p>

        {/* 按钮 */}
        <div className="space-y-3">
          <button
            onClick={startGame}
            className="block w-48 mx-auto px-6 py-3 border border-stone-700 hover:border-amber-700 hover:text-amber-400 transition-all duration-300 text-sm tracking-wider"
          >
            开始游戏
          </button>

          {hasSave && (
            <button
              onClick={() => loadGame()}
              className="block w-48 mx-auto px-6 py-3 text-stone-500 hover:text-stone-300 transition-colors text-sm"
            >
              继续上次
            </button>
          )}
        </div>

        {/* 版本号 */}
        <p className="text-xs text-stone-700 mt-12">
          v0.1 — Demo · 观察 · 记录 · 写作
        </p>
      </div>
    </div>
  )
}

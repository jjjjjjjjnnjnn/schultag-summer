import { useEffect } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function MenuModal({ title, onClose, children }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center scene-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1c1917] border border-stone-700/40 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col shadow-2xl animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between">
          <h2
            className="text-stone-200 text-[15px] tracking-wide"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-400 transition-colors text-sm w-6 h-6 flex items-center justify-center rounded-sm hover:bg-stone-800/50"
          >
            ×
          </button>
        </div>

        {/* 装饰线 */}
        <div className="px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-700/50 to-transparent" />
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  )
}

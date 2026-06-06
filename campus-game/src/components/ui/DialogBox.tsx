import { useEffect } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import { characters } from '../../data/characters'
import { useContent } from '../../i18n'
import { useGameStore } from '../../store/gameStore'

interface Props {
  line: { type: string; text: string; speaker?: string; speed?: 'slow' | 'normal' | 'fast' | number; cid?: string }
  onAdvance: () => void
}

const SPEED_MAP = { slow: 55, normal: 35, fast: 25 }

export function DialogBox({ line, onAdvance }: Props) {
  const speed = typeof line.speed === 'number' ? line.speed : SPEED_MAP[line.speed || 'normal'] || 35
  const { c } = useContent()
  const lang = useGameStore(s => s.settings.language)
  const displayText = line.cid ? c(line.cid, line.text) : line.text
  const { displayed, isComplete, skip } = useTypewriter(displayText, speed)
  const character = line.speaker ? characters[line.speaker] : null
  const isForeignLang = lang === 'en' || lang === 'de'

  const handleClick = () => {
    if (!isComplete) {
      skip()
    } else {
      onAdvance()
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 如果有 overlay 打开，不处理 Space/Enter
      if (useGameStore.getState().modalObservationId) return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        if (!isComplete) {
          skip()
        } else {
          onAdvance()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isComplete, skip, onAdvance])

  const isThought = line.type === 'thought'
  const isDialogue = line.type === 'dialogue' && character

  const getLineColor = () => {
    switch (line.type) {
      case 'dialogue': return 'text-stone-100'
      case 'thought': return 'text-stone-400 italic'
      case 'observe': return 'text-amber-400/90'
      case 'notebook': return 'text-amber-300/90'
      default: return 'text-stone-300'
    }
  }

  const typeIcon = () => {
    switch (line.type) {
      case 'observe': return '○'
      case 'notebook': return '○'
      default: return null
    }
  }

  // Border color: thought=dashed stone, dialogue=character color, else transparent
  const borderStyle = isThought
    ? 'border-l border-dashed border-stone-600/30'
    : isDialogue
      ? ''
      : 'border-l border-transparent'

  const inlineBorderStyle = isDialogue && character
    ? { borderLeftColor: `${character.color}33` }
    : undefined

  return (
    <button
      onClick={handleClick}
      className="w-full text-left cursor-pointer focus:outline-none group btn-press"
    >
      <div
        className={`pl-5 py-5 min-h-[3.5rem] transition-colors duration-300 rounded-sm -ml-5 pr-4 group-hover:bg-stone-900/30 max-w-[65ch] ${borderStyle}`}
        style={inlineBorderStyle}
      >
        {isDialogue && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: character!.color }}
            />
            <span
              className="text-[13px] font-medium"
              style={{ color: character!.color }}
            >
              {isForeignLang ? character!.nameEn : character!.name}
            </span>
            <span
              className="text-[11px] text-stone-600"
              style={{ fontFamily: isForeignLang ? 'var(--font-serif-cn)' : 'var(--font-serif-en)' }}
            >
              {isForeignLang ? character!.name : character!.nameEn}
            </span>
          </div>
        )}

        {typeIcon() && (
          <span className="text-[10px] mr-2 opacity-40 align-middle">{typeIcon()}</span>
        )}

        <span
          className={`text-base leading-[2] tracking-[0.01em] ${getLineColor()} ${!isComplete ? 'cursor-blink' : ''}`}
          style={{ fontFamily: 'var(--font-serif-cn)' }}
        >
          {isThought && !displayed.startsWith('（') ? '（' : ''}
          {displayed}
          {isThought && isComplete && !displayed.endsWith('）') ? '）' : ''}
        </span>

        {isComplete && (
          <span
            className="text-xs text-stone-600/70 block mt-4 tracking-wider animate-[fadeIn_0.4s_ease-out]"
            style={{ fontFamily: 'var(--font-serif-cn)' }}
          >
            {c('ui.clickContinue', '点击继续 →')}
          </span>
        )}
      </div>
    </button>
  )
}

import { useTypewriter } from '../../hooks/useTypewriter'
import { characters } from '../../data/characters'

interface Props {
  line: { type: string; text: string; speaker?: string; speed?: 'slow' | 'normal' | 'fast' | number }
  onAdvance: () => void
}

const SPEED_MAP = { slow: 55, normal: 35, fast: 25 }

export function DialogBox({ line, onAdvance }: Props) {
  const speed = typeof line.speed === 'number' ? line.speed : SPEED_MAP[line.speed || 'normal'] || 35
  const { displayed, isComplete, skip } = useTypewriter(line.text, speed)
  const character = line.speaker ? characters[line.speaker] : null

  const handleClick = () => {
    if (!isComplete) {
      skip()
    } else {
      onAdvance()
    }
  }

  const getLineColor = () => {
    switch (line.type) {
      case 'dialogue': return 'text-stone-100'
      case 'thought': return 'text-stone-400 italic'
      case 'observe': return 'text-amber-400'
      case 'notebook': return 'text-amber-300'
      default: return 'text-stone-300'
    }
  }

  const typeIcon = () => {
    switch (line.type) {
      case 'observe': return '👁'
      case 'notebook': return '✎'
      default: return null
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left cursor-pointer focus:outline-none"
    >
      <div className="pl-4 py-3 min-h-[3rem]"
        style={character ? { borderLeft: `2px solid ${character.color}` } : { borderLeft: '2px solid transparent' }}
      >
        {character && line.type === 'dialogue' && (
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: character.color }}>
              {character.name}
            </span>
            <span className="text-xs text-stone-500" style={{ fontFamily: 'var(--font-serif-en)' }}>{character.nameEn}</span>
          </div>
        )}

        {typeIcon() && (
          <span className="text-xs mr-2 opacity-60">{typeIcon()}</span>
        )}

        <span
          className={`text-base leading-[1.9] ${getLineColor()} ${!isComplete ? 'cursor-blink' : ''}`}
          style={{ fontFamily: 'var(--font-serif-cn)' }}
        >
          {line.type === 'thought' && !displayed.startsWith('（') ? '（' : ''}
          {displayed}
          {line.type === 'thought' && isComplete && !displayed.endsWith('）') ? '）' : ''}
        </span>

        {isComplete && (
          <span className="text-xs text-stone-600 block mt-3" style={{ fontFamily: 'var(--font-serif-cn)' }}>点击继续 →</span>
        )}
      </div>
    </button>
  )
}

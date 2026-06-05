import { useState, useEffect, useCallback, useRef } from 'react'

export function useTypewriter(text: string, speed: number = 40) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDisplayed('')
    setIsComplete(false)
    indexRef.current = 0

    if (!text) {
      setIsComplete(true)
      return
    }

    const tick = () => {
      indexRef.current++
      setDisplayed(text.slice(0, indexRef.current))

      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(tick, speed)
      } else {
        setIsComplete(true)
      }
    }

    timerRef.current = setTimeout(tick, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, speed])

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDisplayed(text)
    setIsComplete(true)
  }, [text])

  return { displayed, isComplete, skip }
}

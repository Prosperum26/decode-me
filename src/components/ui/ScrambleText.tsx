import { useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_/[]{}=+*^?#'
const FINAL_TEXT = 'DECODE ME'

export function ScrambleText() {
  const [display, setDisplay] = useState(FINAL_TEXT)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const play = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    let frame = 0
    const total = 24

    intervalRef.current = setInterval(() => {
      frame += 1
      setDisplay(
        FINAL_TEXT.split('')
          .map((character, index) => {
            if (character === ' ') return ' '

            const progress = frame - index * 1.2
            return progress > total * 0.6
              ? character
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (frame > total + FINAL_TEXT.length && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setDisplay(FINAL_TEXT)
      }
    }, 35)
  }

  useEffect(() => {
    play()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <span className="scramble" onMouseEnter={play} aria-label={FINAL_TEXT}>
      {display}
    </span>
  )
}
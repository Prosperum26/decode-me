import { useCallback, useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_/[]{}=+*^?#'

type ScrambleTextProps = {
  text?: string
}

export function ScrambleText({ text = 'DECODE ME' }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const play = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    let frame = 0
    const total = 24

    intervalRef.current = setInterval(() => {
      frame += 1
      setDisplay(
        text.split('')
          .map((character, index) => {
            if (character === ' ') return ' '

            const progress = frame - index * 1.2
            return progress > total * 0.6
              ? character
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (frame > total + text.length && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setDisplay(text)
      }
    }, 35)
  }, [text])

  useEffect(() => {
    play()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [play])

  return (
    <span className="scramble" onMouseEnter={play} aria-label={text}>
      {display}
    </span>
  )
}
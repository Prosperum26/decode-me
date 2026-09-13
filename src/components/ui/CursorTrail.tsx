import { useEffect, useRef } from 'react'

type Point = { x: number; y: number }

const DOT_COUNT = 12
const LERP_FACTOR = 0.35

export function CursorTrail() {
  const trailRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([])
  const targetRef = useRef<Point>({ x: 0, y: 0 })
  const pointsRef = useRef<Point[]>([])
  const visibleRef = useRef(false)

  useEffect(() => {
    const trail = trailRef.current
    if (!trail) return

    const points = Array.from({ length: DOT_COUNT }, () => ({ x: 0, y: 0 }))
    pointsRef.current = points

    const setVisible = (visible: boolean) => {
      visibleRef.current = visible
      trail.classList.toggle('is-visible', visible)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = trail.getBoundingClientRect()
      const isInside = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom

      if (!isInside) {
        setVisible(false)
        return
      }

      targetRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }
      setVisible(true)
    }

    const handlePointerLeave = () => setVisible(false)

    let frameId = 0
    const animate = () => {
      const target = targetRef.current
      const currentPoints = pointsRef.current

      currentPoints.forEach((point, index) => {
        const destination = index === 0 ? target : currentPoints[index - 1]
        point.x += (destination.x - point.x) * LERP_FACTOR
        point.y += (destination.y - point.y) * LERP_FACTOR

        const dot = dotRefs.current[index]
        dot?.style.setProperty('transform', `translate3d(${point.x}px, ${point.y}px, 0)`)
      })

      frameId = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    frameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="cursor-trail" ref={trailRef} aria-hidden="true">
      {Array.from({ length: DOT_COUNT }, (_, index) => (
        <span
          className="cursor-trail-dot"
          key={index}
          ref={(dot) => { dotRefs.current[index] = dot }}
        />
      ))}
    </div>
  )
}

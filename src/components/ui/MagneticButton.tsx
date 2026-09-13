import { useRef } from 'react'

type MagneticButtonProps = {
  href: string
  onNavigate: (href: string) => void
}

export function MagneticButton({ href, onNavigate }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const button = buttonRef.current
    if (!button) return

    const bounds = button.getBoundingClientRect()
    const x = event.clientX - bounds.left - bounds.width / 2
    const y = event.clientY - bounds.top - bounds.height / 2
    button.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`
  }

  const handleLeave = () => {
    if (buttonRef.current) buttonRef.current.style.transform = 'translate(0, 0)'
  }

  return (
    <div className="magnetic-zone" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <button
        className="play-button"
        ref={buttonRef}
        type="button"
        onClick={() => onNavigate(href)}
      >
        Play
      </button>
    </div>
  )
}
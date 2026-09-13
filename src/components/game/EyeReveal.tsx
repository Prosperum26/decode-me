type EyeRevealProps = {
  disabled: boolean
  pressed: boolean
  onPressChange: (pressed: boolean) => void
}

export function EyeReveal({ disabled, pressed, onPressChange }: EyeRevealProps) {
  return (
    <button
      className={pressed ? 'eye-button pressed' : 'eye-button'}
      type="button"
      disabled={disabled}
      aria-label="Reveal discovered clue"
      aria-pressed={pressed}
      onPointerDown={() => onPressChange(true)}
      onPointerUp={() => onPressChange(false)}
      onPointerLeave={() => onPressChange(false)}
      onPointerCancel={() => onPressChange(false)}
      onKeyDown={(event) => {
        if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
          event.preventDefault()
          onPressChange(true)
        }
      }}
      onKeyUp={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          onPressChange(false)
        }
      }}
      onBlur={() => onPressChange(false)}
    >
      <span aria-hidden="true">◉</span>
      <span>Hold to inspect</span>
    </button>
  )
}
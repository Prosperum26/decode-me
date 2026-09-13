const orbs = [
  { className: 'orb orb-one', color: 'var(--deep-red)' },
  { className: 'orb orb-two', color: 'var(--coral-red)' },
  { className: 'orb orb-three', color: 'var(--burnt-orange)' },
  { className: 'orb orb-four', color: 'var(--golden-orange)' },
]

export function FloatingBackground() {
  return (
    <div className="floating-background" aria-hidden="true">
      {orbs.map((orb) => (
        <span className={orb.className} key={orb.className} style={{ backgroundColor: orb.color }} />
      ))}
    </div>
  )
}
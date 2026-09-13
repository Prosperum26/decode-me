import { FloatingBackground } from '../components/layout/FloatingBackground'
import { MagneticButton } from '../components/ui/MagneticButton'
import { ScrambleText } from '../components/ui/ScrambleText'

export function HomePage() {
  const navigateToPlay = (href: string) => {
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <section className="page-section home-page">
      <FloatingBackground />
      <div className="home-content">
        <div className="home-copy">
          <h1><ScrambleText /></h1>
        </div>
        <MagneticButton href="/play" onNavigate={navigateToPlay} />
      </div>
    </section>
  )
}
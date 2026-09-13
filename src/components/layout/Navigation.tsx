import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/play', label: 'Play' },
  { href: '/archive', label: 'Archive' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigation = (href: string) => {
    window.history.pushState({}, '', href)
    setCurrentPath(href)
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); handleNavigation('/') }}>
        <span className="brand-symbol" aria-hidden="true">◆</span>
        <span>Decode Me</span>
      </a>
      <nav aria-label="Main navigation">
        {links.map((link) => (
          <a
            className={currentPath === link.href ? 'nav-link active' : 'nav-link'}
            href={link.href}
            key={link.href}
            onClick={(event) => { event.preventDefault(); handleNavigation(link.href) }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
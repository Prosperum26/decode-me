import type { ReactNode } from 'react'

import { Navigation } from '../components/layout/Navigation'

type LayoutProps = { children: ReactNode }

export function Layout({ children }: LayoutProps) {
  const isHome = window.location.pathname === '/'

  return (
    <div className={`site-shell${isHome ? ' home-shell' : ''}`}>
      {!isHome && <Navigation />}
      <main className="main-content">{children}</main>
      {!isHome && <footer className="site-footer">Decode Me // Field archive 01</footer>}
    </div>
  )
}
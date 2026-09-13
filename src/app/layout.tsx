import type { ReactNode } from 'react'

import { Navigation } from '../components/layout/Navigation'

type LayoutProps = { children: ReactNode }

export function Layout({ children }: LayoutProps) {
  return (
    <div className="site-shell">
      <Navigation />
      <main className="main-content">{children}</main>
      <footer className="site-footer">Decode Me // Field archive 01</footer>
    </div>
  )
}
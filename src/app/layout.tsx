import type { ReactNode } from 'react'

type LayoutProps = { children: ReactNode }

export function Layout({ children }: LayoutProps) {
  return (
    <div className="site-shell home-shell">
      <main className="main-content">{children}</main>
    </div>
  )
}
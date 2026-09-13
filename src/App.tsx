import { useEffect, useState } from 'react'

import { AboutPage } from './app/about/page'
import { ArchivePage } from './app/archive/page'
import { Layout } from './app/layout'
import { HomePage } from './app/page'
import { PlayPage } from './app/play/page'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const page = {
    '/': <HomePage />,
    '/play': <PlayPage />,
    '/archive': <ArchivePage />,
    '/about': <AboutPage />,
  }[currentPath] ?? <HomePage />

  return (
    <Layout>{page}</Layout>
  )
}

export default App

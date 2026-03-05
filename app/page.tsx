'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from '@/components/Nav'
import Cursor from '@/components/ui/Cursor'
import Cart from '@/components/ui/Cart'
import HeroSection from '@/components/sections/HeroSection'
import MenuSection from '@/components/sections/MenuSection'
import GallerySection from '@/components/sections/GallerySection'
import AboutSection from '@/components/sections/AboutSection'
import LocationSection from '@/components/sections/LocationSection'
import ContactSection from '@/components/sections/ContactSection'

export type SectionId = 'hero' | 'menu' | 'gallery' | 'about' | 'location' | 'contact'

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'about', label: 'Our Story' },
  { id: 'location', label: 'Find Us' },
  { id: 'contact', label: 'Connect' },
]

const sectionComponents: Record<SectionId, React.ComponentType<{ onNavigate: (id: SectionId) => void }>> = {
  hero: HeroSection,
  menu: MenuSection,
  gallery: GallerySection,
  about: AboutSection,
  location: LocationSection,
  contact: ContactSection,
}

// Cinematic black fade transition
const variants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Home() {
  const [current, setCurrent] = useState<SectionId>('hero')
  const [transitioning, setTransitioning] = useState(false)

  const navigate = (id: SectionId) => {
    if (id === current || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(id)
      setTransitioning(false)
    }, 50)
  }

  // Keyboard navigation
  useEffect(() => {
    const idx = SECTIONS.findIndex((s) => s.id === current)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = SECTIONS[idx + 1]
        if (next) navigate(next.id)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = SECTIONS[idx - 1]
        if (prev) navigate(prev.id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, transitioning])

  const ActiveSection = sectionComponents[current]

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', overflow: 'hidden' }}>
      <Cursor />
      <Nav current={current} onNavigate={navigate} />
      <Cart />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="page-container"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <ActiveSection onNavigate={navigate} />
        </motion.div>
      </AnimatePresence>

      {/* Side dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3 items-center">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(s.id)}
            title={s.label}
            className={`dot ${current === s.id ? 'active' : ''}`}
            style={{ cursor: 'none' }}
          />
        ))}
      </div>
    </div>
  )
}

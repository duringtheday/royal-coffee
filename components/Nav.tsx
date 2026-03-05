'use client'
import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/store'
import { type SectionId, SECTIONS } from '@/lib/sections'
import Image from 'next/image'

interface NavProps {
  current: SectionId
  onNavigate: (id: SectionId) => void
}

export default function Nav({ current, onNavigate }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalItems = useCart((s) => s.totalItems())
  const toggleCart = useCart((s) => s.toggleCart)

  useEffect(() => {
    const el = document.querySelector('.page-container')
    if (!el) return
    const handler = () => setScrolled(el.scrollTop > 40)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  const go = (id: SectionId) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  return (
    <>
      {/* ── Desktop Nav ── */}
      <nav className={`fixed top-5 left-1/2 -translate-x-1/2 z-[200] hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-500 ${
        scrolled || current !== 'hero'
          ? 'bg-[rgba(10,10,10,0.9)] backdrop-blur-xl border border-[rgba(201,146,42,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}>

        {/* Logo pill */}
        <button onClick={() => go('hero')} className="mr-1 w-8 h-8 flex items-center justify-center" style={{ cursor: 'none' }}>
          <Image src="/logo.png" alt="Royal Coffee" width={28} height={28} className="object-contain" />
        </button>

        {SECTIONS.filter(s => s.id !== 'hero').map((s) => (
          <button
            key={s.id}
            onClick={() => go(s.id)}
            className={`relative px-4 py-1.5 rounded-full text-[11px] font-medium tracking-widest uppercase transition-all duration-300 ${
              current === s.id
                ? 'bg-gradient-to-r from-[#a87020] to-[#e4af2e] text-[#0a0a0a]'
                : 'text-[rgba(245,240,232,0.5)] hover:text-[#c9922a]'
            }`}
            style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}
          >
            {s.label}
          </button>
        ))}

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="relative ml-1 w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(201,146,42,0.25)] text-[#c9922a] hover:bg-[rgba(201,146,42,0.1)] transition-all"
          style={{ cursor: 'none' }}
        >
          <ShoppingBag size={14} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#a87020] to-[#e4af2e] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* ── Mobile Nav — vertical side strip ── */}
      <div className="md:hidden fixed left-0 top-0 h-full z-[200] flex flex-col items-center justify-between py-8 px-3"
        style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.95), transparent)' }}>

        {/* Logo */}
        <button onClick={() => go('hero')} style={{ cursor: 'none' }}>
          <Image src="/logo.png" alt="Royal Coffee" width={36} height={36} className="object-contain" />
        </button>

        {/* Section labels rotated */}
        <div className="flex flex-col gap-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`text-[10px] tracking-widest uppercase transition-all duration-300 ${
                current === s.id ? 'text-[#c9922a]' : 'text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.7)]'
              }`}
              style={{ writingMode: 'vertical-rl', fontFamily: 'Outfit, sans-serif', cursor: 'none' }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[rgba(201,146,42,0.25)] text-[#c9922a]"
          style={{ cursor: 'none' }}
        >
          <ShoppingBag size={14} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#a87020] to-[#e4af2e] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </>
  )
}

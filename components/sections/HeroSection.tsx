'use client'
import Image from 'next/image'
import type { SectionId } from '@/app/page'

interface Props { onNavigate: (id: SectionId) => void }

export default function HeroSection({ onNavigate }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,146,42,0.07) 0%, transparent 70%)' }} />

      {/* Rotating rings */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-[rgba(201,146,42,0.05)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ animation: 'spin 30s linear infinite' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-[rgba(201,146,42,0.04)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ animation: 'spin 20s linear infinite reverse' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Logo */}
        <div className="float mb-10" style={{ filter: 'drop-shadow(0 0 50px rgba(201,146,42,0.3))' }}>
          <Image src="/logo.png" alt="Royal Coffee & Tea" width={180} height={180} className="w-36 h-36 md:w-44 md:h-44 object-contain" priority />
        </div>

        <p className="fade-up-1 text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Siem Reap, Cambodia
        </p>

        <h1 className="fade-up-2 leading-none mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 400 }}>
          <span className="gold-shimmer" style={{ fontWeight: 600 }}>Royal</span>
        </h1>
        <h2 className="fade-up-3 tracking-[0.25em] uppercase text-[rgba(245,240,232,0.65)]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 200, fontSize: 'clamp(1rem, 3vw, 1.75rem)' }}>
          Coffee & Tea
        </h2>

        <div className="gold-line w-28 my-8 fade-up-3" />

        <p className="fade-up-4 text-[rgba(245,240,232,0.45)] leading-relaxed mb-12 max-w-md" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem' }}>
          Where every cup tells a story of craftsmanship, flavour, and quiet luxury.
        </p>

        <div className="fade-up-5 flex flex-col sm:flex-row items-center gap-4">
          <button onClick={() => onNavigate('menu')} className="btn-gold px-10 py-3.5 rounded-full text-[11px] tracking-widest" style={{ cursor: 'none' }}>
            Explore Menu
          </button>
          <button onClick={() => onNavigate('contact')} className="btn-outline px-10 py-3.5 rounded-full text-[11px] tracking-widest" style={{ cursor: 'none' }}>
            Find Us
          </button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.3)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.7)' }} />
          Open Today · 7:00 AM – 10:00 PM
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[rgba(201,146,42,0.3)]">
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>Navigate</span>
        <div className="w-px h-10 bg-gradient-to-b from-[rgba(201,146,42,0.4)] to-transparent" />
      </div>
    </div>
  )
}

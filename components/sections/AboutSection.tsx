'use client'
import Image from 'next/image'
import type { SectionId } from '@/lib/sections'

const stats = [
  { value: '2019', label: 'Est.' },
  { value: '40+', label: 'Menu Items' },
  { value: '100%', label: 'Arabica' },
  { value: '5★', label: 'Rating' },
]

interface Props { onNavigate: (id: SectionId) => void }

export default function AboutSection({ onNavigate }: Props) {
  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Who We Are</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 400 }}>
            Our <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>Story</span>
          </h2>
          <div className="gold-line w-20 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative fade-up-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <Image src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&q=80" alt="Royal Coffee Interior" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(201,146,42,0.08) 0%,transparent 60%)' }} />
            </div>
            <div className="absolute -bottom-6 -right-2 md:right-0 bg-[#141414] border border-[rgba(201,146,42,0.25)] rounded-2xl p-5 max-w-[210px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.2rem' }} className="text-[#c9922a] mb-2">"Every cup,<br />a crown."</p>
              <span className="text-[10px] tracking-widest text-[rgba(245,240,232,0.3)] uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>— The Royal Team</span>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:pl-6 fade-up-2">
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 400 }} className="text-[rgba(245,240,232,0.95)] leading-snug mb-6">
                Born in the heart of <span className="gold-shimmer">Siem Reap</span>,<br />brewed with intention.
              </h3>
              <p className="text-sm text-[rgba(245,240,232,0.45)] leading-relaxed mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Royal Coffee & Tea was founded in 2019 with a single belief — that a great cup of coffee is not just a drink, it is an experience. Nestled in the cultural heart of Siem Reap, our doors opened to travellers, locals, and dreamers alike.
              </p>
              <p className="text-sm text-[rgba(245,240,232,0.45)] leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                We source our beans directly from Cambodian highlands and neighbouring origins, roasted in-house to bring out each origin's unique character. Our tea selection spans rare single-estate leaves to hand-blended house creations.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t border-[rgba(255,255,255,0.06)] pt-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="gold-shimmer text-2xl md:text-3xl" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>{s.value}</p>
                  <p className="text-[9px] tracking-widest uppercase text-[rgba(245,240,232,0.3)] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {['☕ Single-origin Arabica & Robusta blends', '🌱 Locally sourced, sustainably grown', '👑 House-roasted weekly for peak freshness'].map((v) => (
                <div key={v} className="flex items-center gap-3">
                  <span className="text-sm">{v.slice(0, 2)}</span>
                  <span className="text-xs text-[rgba(245,240,232,0.45)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{v.slice(3)}</span>
                </div>
              ))}
            </div>

            <button onClick={() => onNavigate('menu')} className="btn-gold self-start px-8 py-3 rounded-full text-[11px] tracking-widest" style={{ cursor: 'none' }}>
              See Our Menu →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

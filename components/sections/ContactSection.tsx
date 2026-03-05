'use client'
import { useEffect, useState } from 'react'
import { client, SETTINGS_QUERY } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/types'
import type { SectionId } from '@/app/page'

interface Props { onNavigate: (id: SectionId) => void }

export default function ContactSection({ onNavigate }: Props) {
  const [s, setS] = useState<Partial<SiteSettings>>({
    whatsapp: '85596907731',
    telegram: 'royalcoffeekh',
    instagram: 'https://instagram.com/royalcoffee.kh',
    facebook: 'https://facebook.com/royalcoffeekh',
    tiktok: 'https://tiktok.com/@royalcoffee.kh',
    phone1: '0969 077 311',
    phone2: '017 824 500',
    payments: [
      { name: 'ABA Pay', abbreviation: 'ABA', active: true },
      { name: 'Wing Money', abbreviation: 'WING', active: true },
      { name: 'Cash (USD / KHR)', abbreviation: 'CASH', active: true },
    ],
  })

  useEffect(() => {
    client.fetch(SETTINGS_QUERY).then((data) => {
      if (data) {
        setS(data)
        ;(window as any).__ROYAL_SETTINGS__ = data
      }
    }).catch(() => {})
  }, [])

  const socials = [
    s.whatsapp && {
      name: 'WhatsApp',
      handle: `+${s.whatsapp}`,
      href: `https://wa.me/${s.whatsapp}`,
      color: '#25D366',
      icon: '💬',
    },
    s.telegram && {
      name: 'Telegram',
      handle: `@${s.telegram}`,
      href: `https://t.me/${s.telegram}`,
      color: '#229ED9',
      icon: '✈️',
    },
    s.instagram && {
      name: 'Instagram',
      handle: '@royalcoffee.kh',
      href: s.instagram,
      color: '#E1306C',
      icon: '📷',
    },
    s.facebook && {
      name: 'Facebook',
      handle: 'Royal Coffee & Tea',
      href: s.facebook,
      color: '#1877F2',
      icon: '👥',
    },
    s.tiktok && {
      name: 'TikTok',
      handle: '@royalcoffee.kh',
      href: s.tiktok,
      color: '#EE1D52',
      icon: '🎵',
    },
  ].filter(Boolean) as { name: string; handle: string; href: string; color: string; icon: string }[]

  const payments = (s.payments || []).filter((p) => p.active)

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Stay Connected</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 400 }}>
            Connect <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>With Us</span>
          </h2>
          <div className="gold-line w-20 mx-auto mt-5" />
          <p className="text-sm text-[rgba(245,240,232,0.4)] mt-5 max-w-sm mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Order ahead, ask a question, or just say hello — we're always here.
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 fade-up-1">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card flex items-center gap-4 p-5 rounded-2xl"
              style={{ cursor: 'none' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: `${social.color}18` }}>
                {social.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[rgba(245,240,232,0.9)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{social.name}</p>
                <p className="text-xs text-[rgba(245,240,232,0.35)] mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{social.handle}</p>
              </div>
              <span className="ml-auto text-[rgba(201,146,42,0.4)] text-sm">↗</span>
            </a>
          ))}
        </div>

        {/* Quick order buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 fade-up-2">
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white text-[11px] font-semibold tracking-widest uppercase hover:bg-[#1da851] transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}>
              💬 Order via WhatsApp
            </a>
          )}
          {s.telegram && (
            <a href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#229ED9] text-white text-[11px] font-semibold tracking-widest uppercase hover:bg-[#1b8abf] transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif', cursor: 'none' }}>
              ✈️ Order via Telegram
            </a>
          )}
        </div>

        {/* Payments */}
        {payments.length > 0 && (
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-10 fade-up-3">
            <p className="text-center text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.25)] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>We Accept</p>
            <div className="flex flex-wrap justify-center gap-3">
              {payments.map((p) => (
                <div key={p.name} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(201,146,42,0.2)] bg-[rgba(201,146,42,0.04)]">
                  <span className="text-xs font-bold tracking-wider text-[#c9922a]" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.abbreviation}</span>
                  <span className="text-xs text-[rgba(245,240,232,0.45)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="gold-line w-32 mx-auto mb-6" />
          <p className="text-[10px] text-[rgba(245,240,232,0.2)] tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
            © {new Date().getFullYear()} Royal Coffee & Tea · Siem Reap, Cambodia
          </p>
        </div>
      </div>
    </div>
  )
}

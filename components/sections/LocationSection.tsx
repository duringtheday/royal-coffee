'use client'
import { useEffect, useState } from 'react'
import { client, SETTINGS_QUERY } from '@/lib/sanity'
import type { SiteSettings } from '@/lib/types'
import type { SectionId } from '@/app/page'

const DEFAULTS = {
  address: 'Street 9, Pub Street Area, Siem Reap, Cambodia',
  phone1: '0969 077 311',
  phone2: '017 824 500',
  hoursWeekday: '7:00 AM – 10:00 PM',
  hoursWeekend: '7:00 AM – 11:00 PM',
  googleMapsLink: 'https://maps.google.com/?q=Pub+Street+Siem+Reap+Cambodia',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15505.837020461!2d103.84344!3d13.36221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3110168ffffffff%3A0xd1bfd75a40a0c!2sSiem+Reap!5e0!3m2!1sen!2skh!4v1700000000000!5m2!1sen!2skh',
}

interface Props { onNavigate: (id: SectionId) => void }

export default function LocationSection({ onNavigate }: Props) {
  const [s, setS] = useState<Partial<SiteSettings>>(DEFAULTS)

  useEffect(() => {
    client.fetch(SETTINGS_QUERY).then((data) => { if (data) setS(data) }).catch(() => {})
  }, [])

  const info = [
    { icon: '📍', title: 'Address', lines: [s.address || DEFAULTS.address] },
    { icon: '🕐', title: 'Hours', lines: [`Mon – Fri: ${s.hoursWeekday || DEFAULTS.hoursWeekday}`, `Sat – Sun: ${s.hoursWeekend || DEFAULTS.hoursWeekend}`] },
    { icon: '📞', title: 'Phone', lines: [s.phone1 || DEFAULTS.phone1, s.phone2 || DEFAULTS.phone2] },
    { icon: '🅿️', title: 'Parking', lines: ['Free parking available', 'Tuk-tuk friendly drop-off'] },
  ]

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Come Visit</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 400 }}>
            Find <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>Us</span>
          </h2>
          <div className="gold-line w-20 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4 fade-up-1">
            {info.map((card) => (
              <div key={card.title} className="card rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-lg">{card.icon}</span>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-[rgba(201,146,42,0.65)] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{card.title}</p>
                    {card.lines.map((l) => (
                      <p key={l} className="text-sm text-[rgba(245,240,232,0.65)] leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>{l}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <a href={s.googleMapsLink || DEFAULTS.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn-gold px-6 py-3.5 rounded-xl text-[11px] tracking-widest text-center block" style={{ cursor: 'none' }}>
              Get Directions ↗
            </a>
          </div>

          <div className="lg:col-span-3 fade-up-2">
            <div className="rounded-2xl overflow-hidden border border-[rgba(201,146,42,0.15)]" style={{ height: '480px', filter: 'grayscale(0.2) contrast(1.05)' }}>
              <iframe
                src={s.mapEmbedUrl || DEFAULTS.mapEmbedUrl}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Royal Coffee Location"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

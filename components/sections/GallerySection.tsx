'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { client, GALLERY_QUERY } from '@/lib/sanity'
import type { GalleryItem } from '@/lib/types'
import type { SectionId } from '@/app/page'

const DEMO: GalleryItem[] = [
  { _id: 'g1', title: 'The Craft', mediaType: 'photo', photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80' },
  { _id: 'g2', title: 'Our Space', mediaType: 'photo', photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80' },
  { _id: 'g3', title: 'Behind the Bar', mediaType: 'video', photo: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80' },
  { _id: 'g4', title: 'Mornings', mediaType: 'photo', photo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80' },
  { _id: 'g5', title: 'Ambiance', mediaType: 'photo', photo: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80' },
  { _id: 'g6', title: 'Poured with Care', mediaType: 'photo', photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
]

const spans = ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-2 row-span-1']

interface Props { onNavigate: (id: SectionId) => void }

export default function GallerySection({ onNavigate }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(DEMO)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useEffect(() => {
    client.fetch(GALLERY_QUERY).then((data) => { if (data?.length) setItems(data) }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Moments & Atmosphere</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 400 }}>
            Our <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>Gallery</span>
          </h2>
          <div className="gold-line w-20 mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoRows: '180px' }}>
          {items.map((item, i) => (
            <div key={item._id} className={`${spans[i % spans.length]} relative overflow-hidden rounded-2xl cursor-none group card`} onClick={() => setSelected(item)}>
              <Image src={item.photo || ''} alt={item.title} fill className="card-img object-cover" sizes="(max-width:768px) 50vw,25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {item.mediaType === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[rgba(201,146,42,0.85)] flex items-center justify-center">
                    <Play size={17} fill="#0a0a0a" className="ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] tracking-widest uppercase text-[rgba(245,240,232,0.8)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-[10px] text-[rgba(245,240,232,0.2)] tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>
          ✦ Managed via Owner Dashboard · /studio
        </p>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/92 backdrop-blur-xl z-[500] flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[rgba(201,146,42,0.3)] flex items-center justify-center text-[rgba(245,240,232,0.5)] hover:text-[#c9922a] transition-colors" style={{ cursor: 'none' }}><X size={16} /></button>
          <div className="relative max-w-4xl w-full max-h-[80vh] rounded-2xl overflow-hidden">
            <Image src={selected.photo || ''} alt={selected.title} width={1200} height={800} className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}

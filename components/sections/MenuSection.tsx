'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Minus, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { client, PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/lib/sanity'
import { useCart } from '@/lib/store'
import type { Product, Category } from '@/lib/types'
import type { SectionId } from '@/app/page'

// Fallback demo data when Sanity is not yet connected
const DEMO_PRODUCTS: Product[] = [
  { _id: 'p1', name: 'Royal Espresso', description: 'Double shot Arabica, rich crema, velvety finish.', price: 2.50, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80', category: { _id: 'c1', name: 'Espresso', emoji: '☕' } },
  { _id: 'p2', name: 'Crown Blend', description: 'Our exclusive house blend — dark chocolate, orange zest & spice over gold-dusted ice.', price: 5.50, badge: 'House Special', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', category: { _id: 'c2', name: 'Signature', emoji: '👑' } },
  { _id: 'p3', name: 'Caramel Macchiato', description: 'Vanilla steamed milk, espresso, golden caramel drizzle.', price: 4.00, image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9a4?w=600&q=80', category: { _id: 'c1', name: 'Espresso', emoji: '☕' } },
  { _id: 'p4', name: 'Royal Milk Tea', description: 'Premium Ceylon black tea, brown sugar syrup, fresh whole milk.', price: 4.25, badge: 'Fan Favourite', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80', category: { _id: 'c2', name: 'Signature', emoji: '👑' } },
  { _id: 'p5', name: 'Cold Brew Original', description: '24-hour cold-steeped single origin. Smooth, low-acid, naturally sweet.', price: 4.00, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80', category: { _id: 'c3', name: 'Cold Brew', emoji: '❄️' } },
  { _id: 'p6', name: 'Coconut Cold Brew', description: 'Cold brew topped with coconut cream and Cambodian sea salt.', price: 4.75, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', category: { _id: 'c3', name: 'Cold Brew', emoji: '❄️' } },
  { _id: 'p7', name: 'Saffron Latte', description: 'Steamed oat milk infused with saffron & cardamom, espresso foam.', price: 5.00, badge: 'New', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', category: { _id: 'c2', name: 'Signature', emoji: '👑' } },
  { _id: 'p8', name: 'Jasmine Dragon Pearl', description: 'Hand-rolled green tea pearls, delicate jasmine aroma. Pot served.', price: 3.75, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80', category: { _id: 'c4', name: 'Tea', emoji: '🍃' } },
  { _id: 'p9', name: 'Iced Matcha Latte', description: 'Ceremonial grade matcha whisked with cold almond milk over ice.', price: 4.50, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80', category: { _id: 'c3', name: 'Cold Brew', emoji: '❄️' } },
  { _id: 'p10', name: 'Butter Croissant', description: 'Laminated French-style, 72-hour ferment. Impossibly flaky. Served warm.', price: 2.75, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80', category: { _id: 'c5', name: 'Bites', emoji: '🥐' } },
  { _id: 'p11', name: 'Avocado Toast', description: 'Sourdough, smashed avo, chilli flakes, poached egg, microgreens.', price: 5.50, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', category: { _id: 'c5', name: 'Bites', emoji: '🥐' } },
  { _id: 'p12', name: 'Black Gold Mocha', description: 'Activated charcoal espresso, dark Belgian chocolate, oat cream.', price: 5.25, badge: 'Limited', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category: { _id: 'c2', name: 'Signature', emoji: '👑' } },
]

const DEMO_CATEGORIES: Category[] = [
  { _id: 'all', name: 'All', emoji: '✦', order: 0 },
  { _id: 'c1', name: 'Espresso', emoji: '☕', order: 1 },
  { _id: 'c2', name: 'Signature', emoji: '👑', order: 2 },
  { _id: 'c3', name: 'Cold Brew', emoji: '❄️', order: 3 },
  { _id: 'c4', name: 'Tea', emoji: '🍃', order: 4 },
  { _id: 'c5', name: 'Bites', emoji: '🥐', order: 5 },
]

interface Props { onNavigate: (id: SectionId) => void }

export default function MenuSection({ onNavigate }: Props) {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('all')
  const { addItem, items, updateQty } = useCart()

  useEffect(() => {
    const load = async () => {
      try {
        const [prods, cats] = await Promise.all([
          client.fetch(PRODUCTS_QUERY),
          client.fetch(CATEGORIES_QUERY),
        ])
        if (prods?.length) setProducts(prods)
        if (cats?.length) setCategories([{ _id: 'all', name: 'All', emoji: '✦', order: 0 }, ...cats])
      } catch {
        // Sanity not connected yet — demo data shows
      }
    }
    load()
  }, [])

  const filtered = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category._id === activeCategory)

  const getQty = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0

  const handleAdd = (p: Product) => {
    addItem({ id: p._id, name: p.name, price: p.price, image: p.image })
    toast.success(`${p.name} added`, { icon: '✦' })
  }

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 fade-up">
          <p className="text-[11px] tracking-[0.45em] uppercase text-[rgba(201,146,42,0.65)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Curated Selection</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', fontWeight: 400 }}>
            Our <span className="gold-shimmer" style={{ fontStyle: 'italic' }}>Menu</span>
          </h2>
          <div className="gold-line w-20 mx-auto mt-5" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`pill px-5 py-2 rounded-full text-[11px] tracking-widest uppercase flex items-center gap-1.5 ${activeCategory === cat._id ? 'active' : ''}`}
              style={{ cursor: 'none' }}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, i) => {
            const qty = getQty(p._id)
            return (
              <div key={p._id} className="card rounded-2xl overflow-hidden fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                {p.badge && (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#a87020] to-[#e4af2e] text-[#0a0a0a] text-[9px] font-bold tracking-wider uppercase" style={{ position: 'absolute' }}>
                    {p.badge}
                  </div>
                )}
                <div className="relative h-48 overflow-hidden bg-[#1a1a1a]" style={{ position: 'relative' }}>
                  {p.badge && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#a87020] to-[#e4af2e] text-[#0a0a0a] text-[9px] font-bold tracking-wider uppercase">
                      {p.badge}
                    </div>
                  )}
                  <Image src={p.image} alt={p.name} fill className="card-img object-cover" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5 gap-2">
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }} className="text-[rgba(245,240,232,0.95)] leading-snug">{p.name}</h3>
                    <span className="text-sm font-semibold text-[#c9922a] whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>${p.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-[rgba(245,240,232,0.4)] leading-relaxed mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.description}</p>
                  {qty === 0 ? (
                    <button onClick={() => handleAdd(p)} className="w-full btn-gold py-2.5 rounded-xl text-[10px] tracking-widest flex items-center justify-center gap-1.5" style={{ cursor: 'none' }}>
                      <Plus size={12} /> Add to Order
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[rgba(201,146,42,0.07)] border border-[rgba(201,146,42,0.2)] rounded-xl px-3 py-1.5">
                      <button onClick={() => updateQty(p._id, qty - 1)} className="w-7 h-7 rounded-lg text-[#c9922a] flex items-center justify-center hover:bg-[rgba(201,146,42,0.15)] transition-colors" style={{ cursor: 'none' }}><Minus size={12} /></button>
                      <span className="text-sm font-semibold text-[rgba(245,240,232,0.9)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{qty}</span>
                      <button onClick={() => handleAdd(p)} className="w-7 h-7 rounded-lg text-[#c9922a] flex items-center justify-center hover:bg-[rgba(201,146,42,0.15)] transition-colors" style={{ cursor: 'none' }}><Plus size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

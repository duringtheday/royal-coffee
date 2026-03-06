'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
})

type Tab = 'products' | 'settings' | 'gallery'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'products', label: 'Products', icon: '☕' },
  { id: 'settings', label: 'Site Settings', icon: '⚙️' },
  { id: 'gallery', label: 'Gallery', icon: '📸' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [gallery, setGallery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [editProduct, setEditProduct] = useState<any>(null)
  const router = useRouter()

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [prods, cats, sett, gall] = await Promise.all([
        client.fetch(`*[_type == "product"] | order(order asc){ _id, name, description, price, badge, available, order, "image": image.asset->url, "categoryId": category._ref }`),
        client.fetch(`*[_type == "category"] | order(order asc){ _id, name, emoji }`),
        client.fetch(`*[_type == "siteSettings"][0]`),
        client.fetch(`*[_type == "gallery"] | order(order asc){ _id, title, mediaType, "photo": photo.asset->url }`),
      ])
      setProducts(prods || [])
      setCategories(cats || [])
      setSettings(sett || {})
      setGallery(gall || [])
    } catch (e) {
      setMsg('⚠️ Could not load data. Check Sanity token.')
    }
    setLoading(false)
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const existing = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)
      if (existing?._id) {
        await client.patch(existing._id).set(settings).commit()
      } else {
        await client.create({ _type: 'siteSettings', ...settings })
      }
      showMsg('✅ Settings saved successfully!')
    } catch { showMsg('❌ Error saving settings.') }
    setSaving(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await client.delete(id)
    setProducts(p => p.filter(x => x._id !== id))
    showMsg('✅ Product deleted.')
  }

  const toggleAvailable = async (id: string, current: boolean) => {
    await client.patch(id).set({ available: !current }).commit()
    setProducts(p => p.map(x => x._id === id ? { ...x, available: !current } : x))
  }

  const s = (k: string, v: any) => setSettings((prev: any) => ({ ...prev, [k]: v }))

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Outfit, sans-serif', color: '#f5f0e8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div style={{ background: '#141414', borderBottom: '1px solid rgba(201,146,42,0.15)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image src="/logo.png" alt="Royal Coffee" width={36} height={36} style={{ objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 600, background: 'linear-gradient(90deg,#a87020,#e4af2e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Royal Coffee & Tea</div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase' }}>Owner Dashboard</div>
          </div>
        </div>
        <button onClick={logout} style={{ padding: '0.5rem 1.2rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', background: 'transparent', color: 'rgba(245,240,232,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>Log Out</button>
      </div>

      {msg && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#141414', border: '1px solid rgba(201,146,42,0.3)', borderRadius: '2rem', padding: '0.75rem 2rem', fontSize: '0.85rem', zIndex: 9999 }}>{msg}</div>
      )}

      <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <div style={{ width: '220px', background: '#0f0f0f', borderRight: '1px solid rgba(201,146,42,0.1)', padding: '1.5rem 1rem', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', marginBottom: '0.25rem', textAlign: 'left', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', background: tab === t.id ? 'rgba(201,146,42,0.12)' : 'transparent', color: tab === t.id ? '#c9922a' : 'rgba(245,240,232,0.45)', borderLeft: tab === t.id ? '2px solid #c9922a' : '2px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(245,240,232,0.3)' }}>Loading...</div>
          ) : (
            <>
              {tab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>Products & Services</h2>
                    <button onClick={() => setEditProduct({ _id: 'new', name: '', description: '', price: '', badge: '', available: true, categoryId: categories[0]?._id || '' })}
                      style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '2rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em' }}>
                      + Add Product
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
                    {products.map(p => (
                      <div key={p._id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', overflow: 'hidden' }}>
                        {p.image && (
                          <div style={{ position: 'relative', height: '140px', background: '#1a1a1a' }}>
                            <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="280px" />
                            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                              <button onClick={() => toggleAvailable(p._id, p.available)} style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, background: p.available ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', color: p.available ? '#34d399' : '#f87171' }}>
                                {p.available ? 'VISIBLE' : 'HIDDEN'}
                              </button>
                            </div>
                          </div>
                        )}
                        <div style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}>{p.name}</span>
                            <span style={{ color: '#c9922a', fontWeight: 600, fontSize: '0.9rem' }}>${Number(p.price).toFixed(2)}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', margin: '0 0 1rem', lineHeight: 1.5 }}>{p.description}</p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setEditProduct(p)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(201,146,42,0.1)', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '0.5rem', color: '#c9922a', fontSize: '0.75rem', cursor: 'pointer' }}>✏️ Edit</button>
                            <button onClick={() => deleteProduct(p._id)} style={{ padding: '0.5rem 0.75rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div style={{ maxWidth: '700px' }}>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem' }}>Site Settings</h2>
                  {[
                    { section: '🏪 Business', fields: [{ key: 'businessName', label: 'Business Name' }, { key: 'tagline', label: 'Tagline' }, { key: 'about', label: 'About / Story', multiline: true }] },
                    { section: '📞 Contact', fields: [{ key: 'phone1', label: 'Phone Number 1' }, { key: 'phone2', label: 'Phone Number 2' }, { key: 'email', label: 'Email Address' }, { key: 'address', label: 'Address' }] },
                    { section: '🕐 Hours', fields: [{ key: 'hoursWeekday', label: 'Mon – Fri Hours' }, { key: 'hoursWeekend', label: 'Sat – Sun Hours' }] },
                    { section: '💬 Social & Messaging', fields: [{ key: 'whatsapp', label: 'WhatsApp Number (with country code, no spaces)' }, { key: 'telegram', label: 'Telegram Username (without @)' }, { key: 'instagram', label: 'Instagram URL' }, { key: 'facebook', label: 'Facebook URL' }, { key: 'tiktok', label: 'TikTok URL' }] },
                    { section: '🗺️ Location', fields: [{ key: 'googleMapsLink', label: 'Google Maps Direct Link' }, { key: 'mapEmbedUrl', label: 'Google Maps Embed URL' }] },
                  ].map(group => (
                    <div key={group.section} style={{ marginBottom: '2rem', background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.7)', marginBottom: '1rem', marginTop: 0 }}>{group.section}</h3>
                      {group.fields.map((f: any) => (
                        <div key={f.key} style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>{f.label}</label>
                          {f.multiline ? (
                            <textarea value={settings[f.key] || ''} onChange={e => s(f.key, e.target.value)} rows={4}
                              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
                          ) : (
                            <input type="text" value={settings[f.key] || ''} onChange={e => s(f.key, e.target.value)}
                              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button onClick={saveSettings} disabled={saving} style={{ padding: '0.9rem 3rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '2rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving...' : 'Save All Settings'}
                  </button>
                </div>
              )}

              {tab === 'gallery' && (
                <div>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem' }}>Gallery</h2>
                  <div style={{ background: '#141414', border: '1px dashed rgba(201,146,42,0.2)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ color: 'rgba(245,240,232,0.4)', fontSize: '0.85rem', marginBottom: '1rem' }}>Upload photos and videos via Sanity Studio</p>
                    <a href="https://royalcoffee.sanity.studio" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', borderRadius: '2rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
                      Open Gallery Manager ↗
                    </a>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
                    {gallery.map(g => (
                      <div key={g._id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', background: '#1a1a1a' }}>
                        {g.photo && <Image src={g.photo} alt={g.title || ''} fill style={{ objectFit: 'cover' }} sizes="200px" />}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.75rem', background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent)' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(245,240,232,0.8)' }}>{g.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {editProduct && (
        <ProductModal product={editProduct} categories={categories} onClose={() => setEditProduct(null)}
          onSave={async (data: any) => {
            setSaving(true)
            try {
              if (data._id === 'new') {
                const created = await client.create({ _type: 'product', name: data.name, description: data.description, price: Number(data.price), badge: data.badge || undefined, available: data.available, order: products.length, category: { _type: 'reference', _ref: data.categoryId } })
                setProducts(p => [...p, { ...data, _id: created._id }])
              } else {
                await client.patch(data._id).set({ name: data.name, description: data.description, price: Number(data.price), badge: data.badge || undefined, available: data.available, category: { _type: 'reference', _ref: data.categoryId } }).commit()
                setProducts(p => p.map(x => x._id === data._id ? { ...x, ...data } : x))
              }
              showMsg('✅ Product saved!')
              setEditProduct(null)
            } catch { showMsg('❌ Error saving product.') }
            setSaving(false)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, categories, onClose, onSave }: any) {
  const [form, setForm] = useState({ ...product })
  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#141414', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '1.5rem', padding: '2rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400, margin: 0 }}>{form._id === 'new' ? 'Add Product' : 'Edit Product'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        {[
          { key: 'name', label: 'Product Name *' },
          { key: 'description', label: 'Description *', multiline: true },
          { key: 'price', label: 'Price (USD) *', type: 'number' },
          { key: 'badge', label: 'Badge (optional — e.g. New, Popular)' },
        ].map((field: any) => (
          <div key={field.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>{field.label}</label>
            {field.multiline ? (
              <textarea value={form[field.key] || ''} onChange={e => f(field.key, e.target.value)} rows={3}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
            ) : (
              <input type={field.type || 'text'} value={form[field.key] || ''} onChange={e => f(field.key, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
            )}
          </div>
        ))}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Category *</label>
          <select value={form.categoryId || ''} onChange={e => f('categoryId', e.target.value)}
            style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
            {categories.map((c: any) => <option key={c._id} value={c._id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input type="checkbox" id="available" checked={form.available} onChange={e => f('available', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#c9922a' }} />
          <label htmlFor="available" style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.6)', cursor: 'pointer' }}>Visible on website</label>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'rgba(245,240,232,0.5)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '0.75rem', color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Product</button>
        </div>
      </div>
    </div>
  )
}
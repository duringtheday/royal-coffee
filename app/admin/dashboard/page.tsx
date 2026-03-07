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

type Tab = 'products' | 'orders' | 'accounting' | 'metrics' | 'notes' | 'settings' | 'gallery'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'products', label: 'Products', icon: '☕' },
  { id: 'orders', label: 'Orders', icon: '🧾' },
  { id: 'accounting', label: 'Accounting', icon: '💰' },
  { id: 'metrics', label: 'Metrics', icon: '📊' },
  { id: 'notes', label: 'Owner Log', icon: '📝' },
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
  const [orders, setOrders] = useState<any[]>([])
  const [editOrder, setEditOrder] = useState<any>(null)
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [prods, cats, sett, gall, ords, nts] = await Promise.all([
        client.fetch(`*[_type == "product"] | order(order asc){ _id, name, description, price, badge, available, order, "image": image.asset->url, "categoryId": category._ref }`),
        client.fetch(`*[_type == "category"] | order(order asc){ _id, name, emoji }`),
        client.fetch(`*[_type == "siteSettings"][0]`),
        client.fetch(`*[_type == "gallery"] | order(order asc){ _id, title, mediaType, "photo": photo.asset->url }`),
        client.fetch(`*[_type == "order"] | order(createdAt desc){ _id, orderNumber, customerName, customerContact, source, orderType, location, items, total, status, notes, createdAt }`),
        client.fetch(`*[_type == "note"] | order(createdAt desc){ _id, content, type, amount, sector, createdAt }`),
      ])
      setProducts(prods || [])
      setCategories(cats || [])
      setSettings(sett || {})
      setGallery(gall || [])
      setOrders(ords || [])
      setNotes(nts || [])
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Outfit, sans-serif', color: '#f5f0e8', cursor: 'default' }}>
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

      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', cursor: 'default' }}>
        <div style={{ width: '220px', background: '#0f0f0f', borderRight: '1px solid rgba(201,146,42,0.1)', padding: '1.5rem 1rem', flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', marginBottom: '0.25rem', textAlign: 'left', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', background: tab === t.id ? 'rgba(201,146,42,0.12)' : 'transparent', color: tab === t.id ? '#c9922a' : 'rgba(245,240,232,0.45)', borderLeft: tab === t.id ? '2px solid #c9922a' : '2px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', cursor: 'default' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(245,240,232,0.3)' }}>Loading...</div>
          ) : (
            <>
            {tab === 'orders' && (
                <OrdersTab
                  orders={orders}
                  categories={categories}
                  products={products}
                  onNewOrder={() => setShowNewOrder(true)}
                  onEditOrder={(o: any) => setEditOrder(o)}
                  onStatusChange={async (id: string, status: string) => {
                    await client.patch(id).set({ status }).commit()
                    setOrders(o => o.map(x => x._id === id ? { ...x, status } : x))
                    showMsg(status === 'confirmed' ? '✅ Order confirmed!' : status === 'cancelled' ? '❌ Order cancelled.' : '✅ Status updated.')
                  }}
                  onClearArchived={async () => {
                    if (!confirm('Delete all cancelled orders permanently? This cannot be undone.')) return
                    const cancelled = orders.filter((o: any) => o.status === 'cancelled')
                    await Promise.all(cancelled.map((o: any) => client.delete(o._id)))
                    setOrders(o => o.filter((x: any) => x.status !== 'cancelled'))
                    showMsg('🗑️ Cancelled orders cleared.')
                  }}
                />
              )}

              {tab === 'accounting' && (
                <AccountingTab orders={orders} />
              )}

              {tab === 'metrics' && (
                <MetricsTab orders={orders} />
              )}

              {tab === 'notes' && (
                <NotesTab
                  notes={notes}
                  orders={orders}
                  onSaveNote={async (data: any) => {
                    try {
                      const created = await client.create({ _type: 'note', ...data })
                      setNotes(n => [{ ...data, _id: created._id }, ...n])
                      showMsg('✅ Note saved!')
                    } catch { showMsg('❌ Error saving note.') }
                  }}
                  onDeleteNote={async (id: string) => {
                    if (!confirm('Delete this note?')) return
                    await client.delete(id)
                    setNotes(n => n.filter(x => x._id !== id))
                    showMsg('🗑️ Note deleted.')
                  }}
                  onClearNotes={async () => {
                    if (!confirm('Delete ALL notes permanently? This cannot be undone.')) return
                    await Promise.all(notes.map((n: any) => client.delete(n._id)))
                    setNotes([])
                    showMsg('🗑️ All notes cleared.')
                  }}
                />
              )}
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

      {(showNewOrder || editOrder) && (
        <OrderModal
          order={editOrder}
          products={products}
          onClose={() => { setShowNewOrder(false); setEditOrder(null) }}
          onSave={async (data: any) => {
            setSaving(true)
            try {
              const orderNumber = `ORD-${Date.now()}`
              if (editOrder?._id) {
                await client.patch(editOrder._id).set({ ...data, items: data.items }).commit()
                setOrders(o => o.map(x => x._id === editOrder._id ? { ...x, ...data } : x))
              } else {
                const created = await client.create({ _type: 'order', orderNumber, createdAt: new Date().toISOString(), ...data })
                setOrders(o => [{ ...data, _id: created._id, orderNumber, createdAt: new Date().toISOString() }, ...o])
              }
              showMsg('✅ Order saved!')
              setShowNewOrder(false)
              setEditOrder(null)
            } catch { showMsg('❌ Error saving order.') }
            setSaving(false)
          }}
        />
      )}

      {editProduct && (
        <ProductModal product={editProduct} categories={categories} onClose={() => setEditProduct(null)}
          onSave={async (data: any) => {
            setSaving(true)
            try {
              if (data._id === 'new') {
                const created = await client.create({ _type: 'product', name: data.name, description: data.description, price: Number(data.price), badge: data.badge || undefined, available: data.available, order: products.length, category: { _type: 'reference', _ref: data.categoryId }, ...(data.imageAssetId ? { image: { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: data.imageAssetId } } } : { image: { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: '' } } }) })
                setProducts(p => [...p, { ...data, _id: created._id }])
              } else {
                const imageField = data.imageAssetId ? { image: { _type: 'image', asset: { _type: 'reference', _ref: data.imageAssetId } } } : {}
                await client.patch(data._id).set({ name: data.name, description: data.description, price: Number(data.price), badge: data.badge || undefined, available: data.available, category: { _type: 'reference', _ref: data.categoryId }, ...imageField }).commit()
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

function OrderModal({ order, products, onClose, onSave }: any) {
  const isNew = !order?._id
  const [form, setForm] = useState(order || {
    customerName: '', customerContact: '', source: 'whatsapp', status: 'pending', notes: '', total: 0, items: []
  })
  const [items, setItems] = useState<any[]>(order?.items || [])
  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const addItem = () => setItems(i => [...i, { productName: '', quantity: 1, unitPrice: 0, subtotal: 0 }])
  const removeItem = (idx: number) => setItems(i => i.filter((_: any, j: number) => j !== idx))
  const updateItem = (idx: number, key: string, val: any) => {
    setItems(prev => prev.map((item: any, j: number) => {
      if (j !== idx) return item
      const updated = { ...item, [key]: val }
      if (key === 'quantity' || key === 'unitPrice') {
        updated.subtotal = Number(updated.quantity) * Number(updated.unitPrice)
      }
      if (key === 'productName') {
        const product = products.find((p: any) => p.name === val)
        if (product) { updated.unitPrice = product.price; updated.subtotal = Number(updated.quantity) * product.price }
      }
      return updated
    }))
  }

  const total = items.reduce((sum: number, i: any) => sum + (i.subtotal || 0), 0)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#141414', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '1.5rem', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400, margin: 0 }}>{isNew ? 'New Order' : 'Edit Order'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {[{ key: 'customerName', label: 'Customer Name' }, { key: 'customerContact', label: 'Contact (WhatsApp/Phone)' }].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>{field.label}</label>
              <input value={form[field.key] || ''} onChange={e => f(field.key, e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Source</label>
            <select value={form.source || 'whatsapp'} onChange={e => f('source', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
              {[['whatsapp','WhatsApp'],['telegram','Telegram'],['inperson','In Person'],['online','Online'],['phone','Phone']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Status</label>
            <select value={form.status || 'pending'} onChange={e => f('status', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
              {[['pending','🟡 Pending'],['confirmed','✅ Confirmed'],['modified','🔄 Modified'],['cancelled','❌ Cancelled'],['refunded','💰 Refunded']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order Items</label>
            <button onClick={addItem} style={{ padding: '0.3rem 0.75rem', background: 'rgba(201,146,42,0.1)', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '0.5rem', color: '#c9922a', fontSize: '0.7rem', cursor: 'pointer' }}>+ Add Item</button>
          </div>
          {items.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <select value={item.productName || ''} onChange={e => updateItem(idx, 'productName', e.target.value)}
                style={{ padding: '0.6rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>
                <option value=''>Select product</option>
                {products.map((p: any) => <option key={p._id} value={p.name}>{p.name}</option>)}
              </select>
              <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} min={1}
                style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }} />
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem', color: '#c9922a', fontSize: '0.8rem', textAlign: 'center' }}>
                ${Number(item.subtotal || 0).toFixed(2)}
              </div>
              <button onClick={() => removeItem(idx)} style={{ padding: '0.6rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'rgba(245,240,232,0.2)', fontSize: '0.8rem', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '0.75rem' }}>No items yet. Click + Add Item</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Order Type</label>
            <select value={form.orderType || ''} onChange={e => f('orderType', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
              <option value=''>Select type</option>
              <option value='dinein'>🪑 Dine-in</option>
              <option value='takeaway'>🥡 Takeaway</option>
              <option value='delivery'>🛵 Delivery</option>
              <option value='online'>💻 Online</option>
              <option value='phone'>📞 Phone</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Location</label>
            <input type="text" value={form.location || ''} onChange={e => f('location', e.target.value)} placeholder="e.g. Pub Street, Siem Reap"
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', marginBottom: '0.4rem' }}>Notes</label>
          <textarea value={form.notes || ''} onChange={e => f('notes', e.target.value)} rows={2}
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(201,146,42,0.05)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.5)' }}>Order Total</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#c9922a', fontWeight: 600 }}>${total.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'rgba(245,240,232,0.5)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          <button onClick={() => onSave({ ...form, items, total })} style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '0.75rem', color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Save Order</button>
        </div>
      </div>
    </div>
  )
}

function OrdersTab({ orders, products, onNewOrder, onEditOrder, onStatusChange, onClearArchived }: any) {
  const [page, setPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [search, setSearch] = useState('')
  const PER_PAGE = 50

  const statusColor: any = {
    pending: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: '🟡 Pending' },
    confirmed: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: '✅ Confirmed' },
    modified: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: '🔄 Modified' },
    cancelled: { bg: 'rgba(248,113,113,0.15)', color: '#f87171', label: '❌ Cancelled' },
    refunded: { bg: 'rgba(201,146,42,0.15)', color: '#c9922a', label: '💰 Refunded' },
  }

  const now = new Date()
  const filtered = orders.filter((o: any) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false
    if (filterSource !== 'all' && o.source !== filterSource) return false
    if (search && !o.customerName?.toLowerCase().includes(search.toLowerCase()) && !o.customerContact?.includes(search)) return false
    if (filterDate === 'today' && new Date(o.createdAt).toDateString() !== now.toDateString()) return false
    if (filterDate === 'week' && new Date(o.createdAt) < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) return false
    if (filterDate === 'month' && new Date(o.createdAt) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Royal Coffee & Tea — Orders Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()} · Total: ${filtered.length} orders`, 14, 28)
    autoTable(doc, {
      startY: 35,
      head: [['#', 'Customer', 'Source', 'Items', 'Total', 'Status', 'Date']],
      body: filtered.map((o: any) => [
        o.orderNumber || '-',
        o.customerName || '-',
        o.source || '-',
        o.items?.map((i: any) => `${i.quantity}x ${i.productName}`).join(', ') || '-',
        `$${Number(o.total || 0).toFixed(2)}`,
        o.status,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 26, 26] },
    })
    const confirmed = filtered.filter((o: any) => o.status === 'confirmed')
    const revenue = confirmed.reduce((s: number, o: any) => s + (o.total || 0), 0)
    doc.text(`Total Revenue (confirmed): $${revenue.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10)
    doc.save(`royal-coffee-orders-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>Orders</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={exportPDF} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>📄 Export PDF</button>
          <button onClick={onNewOrder} style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '2rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ New Order</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input placeholder="Search customer..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ flex: 1, minWidth: '150px', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }} />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
          style={{ padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>
          <option value="all">All Statuses</option>
          <option value="pending">🟡 Pending</option>
          <option value="confirmed">✅ Confirmed</option>
          <option value="modified">🔄 Modified</option>
          <option value="cancelled">❌ Cancelled</option>
          <option value="refunded">💰 Refunded</option>
        </select>
        <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1) }}
          style={{ padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>
          <option value="all">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telegram">Telegram</option>
          <option value="inperson">In Person</option>
          <option value="online">Online</option>
          <option value="phone">Phone</option>
        </select>
        <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1) }}
          style={{ padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button onClick={onClearArchived} style={{ padding: '0.6rem 1rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️ Clear Cancelled</button>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', marginBottom: '1rem' }}>
        Showing {paginated.length} of {filtered.length} orders
      </div>

      {paginated.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(245,240,232,0.3)' }}>No orders found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {paginated.map((o: any) => (
            <div key={o._id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{o.customerName || 'Unknown Customer'}</span>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: 700, background: statusColor[o.status]?.bg, color: statusColor[o.status]?.color }}>
                      {statusColor[o.status]?.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.35)', marginBottom: '0.5rem' }}>
                    {o.orderNumber && <span style={{ marginRight: '1rem', color: 'rgba(201,146,42,0.5)' }}>{o.orderNumber}</span>}
                    {o.source && <span style={{ marginRight: '1rem' }}>📱 {o.source}</span>}
                    {o.customerContact && <span style={{ marginRight: '1rem' }}>📞 {o.customerContact}</span>}
                    <span>🕐 {new Date(o.createdAt).toLocaleString()}</span>
                  </div>
                  {o.items?.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)' }}>
                      {o.items.map((item: any, i: number) => (
                        <span key={i}>{item.quantity}x {item.productName}{i < o.items.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>
                  )}
                  {o.notes && <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', marginTop: '0.3rem', fontStyle: 'italic' }}>📝 {o.notes}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#c9922a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>${Number(o.total || 0).toFixed(2)}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {o.status !== 'confirmed' && o.status !== 'refunded' && (
                      <button onClick={() => onStatusChange(o._id, 'confirmed')} style={{ padding: '0.4rem 0.9rem', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '0.5rem', color: '#34d399', fontSize: '0.7rem', cursor: 'pointer' }}>✅ Confirm</button>
                    )}
                    {o.status === 'confirmed' && (
                      <button onClick={() => onStatusChange(o._id, 'pending')} style={{ padding: '0.4rem 0.9rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '0.5rem', color: '#fbbf24', fontSize: '0.7rem', cursor: 'pointer' }}>↩ Undo</button>
                    )}
                    {o.status !== 'cancelled' && o.status !== 'refunded' && (
                      <button onClick={() => onStatusChange(o._id, 'cancelled')} style={{ padding: '0.4rem 0.9rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.7rem', cursor: 'pointer' }}>❌ Cancel</button>
                    )}
                    {o.status === 'cancelled' && (
                      <button onClick={() => onStatusChange(o._id, 'pending')} style={{ padding: '0.4rem 0.9rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '0.5rem', color: '#fbbf24', fontSize: '0.7rem', cursor: 'pointer' }}>↩ Restore</button>
                    )}
                    {o.status === 'confirmed' && (
                      <button onClick={() => onStatusChange(o._id, 'refunded')} style={{ padding: '0.4rem 0.9rem', background: 'rgba(201,146,42,0.08)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#c9922a', fontSize: '0.7rem', cursor: 'pointer' }}>💰 Refund</button>
                    )}
                    <button onClick={() => onEditOrder(o)} style={{ padding: '0.4rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(245,240,232,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}>✏️ Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(245,240,232,0.5)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>← Prev</button>
          <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(245,240,232,0.5)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>Next →</button>
        </div>
      )}
    </div>
  )
}

function AccountingTab({ orders }: any) {
  const [filterDate, setFilterDate] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [cleanLimit, setCleanLimit] = useState(50)
  const [page, setPage] = useState(1)
  const PER_PAGE = 50

  const now = new Date()
  const todayStr = now.toDateString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const filteredOrders = orders.filter((o: any) => {
    const d = new Date(o.createdAt)
    if (filterDate === 'today') return d.toDateString() === todayStr
    if (filterDate === 'week') return d >= weekAgo
    if (filterDate === 'month') return d >= monthAgo
    if (filterDate === 'custom' && customFrom) return d >= new Date(customFrom) && (!customTo || d <= new Date(customTo + 'T23:59:59'))
    return true
  })

  const confirmed = filteredOrders.filter((o: any) => o.status === 'confirmed')
  const cancelled = filteredOrders.filter((o: any) => o.status === 'cancelled')
  const refunded = filteredOrders.filter((o: any) => o.status === 'refunded')
  const pending = filteredOrders.filter((o: any) => o.status === 'pending')

  const totalRevenue = confirmed.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const totalRefunded = refunded.reduce((s: number, o: any) => s + (o.total || 0), 0)
  const netRevenue = totalRevenue - totalRefunded

  const orderTypeLabels: any = { dinein: '🪑 Dine-in', takeaway: '🥡 Takeaway', delivery: '🛵 Delivery', online: '💻 Online', phone: '📞 Phone' }

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Royal Coffee & Tea — Financial Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()} · Period: ${filterDate === 'all' ? 'All Time' : filterDate}`, 14, 28)
    doc.text(`Revenue: $${totalRevenue.toFixed(2)} | Refunded: $${totalRefunded.toFixed(2)} | Net: $${netRevenue.toFixed(2)}`, 14, 35)
    autoTable(doc, {
      startY: 42,
      head: [['Order #', 'Customer', 'Location', 'Type', 'Total', 'Status', 'Date']],
      body: filteredOrders.map((o: any) => [
        o.orderNumber || '-',
        o.customerName || '-',
        o.location || '-',
        orderTypeLabels[o.orderType] || '-',
        `$${Number(o.total || 0).toFixed(2)}`,
        o.status,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [26, 26, 26] },
    })
    doc.save(`royal-coffee-accounting-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const stat = (label: string, value: string, sub?: string, color?: string) => (
    <div style={{ background: '#141414', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: color || '#c9922a', fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  )

  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE)
  const paginatedHistory = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, margin: 0 }}>Accounting</h2>
        <button onClick={exportPDF} style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', color: 'rgba(245,240,232,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>📄 Export PDF</button>
      </div>

      {orders.length >= cleanLimit && (
        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#fbbf24' }}>⚠️ You have {orders.length} orders. Consider exporting a backup and cleaning your history.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>Alert at:</span>
            <input type="number" value={cleanLimit} onChange={e => setCleanLimit(Number(e.target.value))} min={10}
              style={{ width: '65px', padding: '0.35rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', textAlign: 'center' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>orders</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'today', 'week', 'month', 'custom'].map(d => (
          <button key={d} onClick={() => { setFilterDate(d); setPage(1) }} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif', background: filterDate === d ? 'linear-gradient(135deg,#a87020,#e4af2e)' : 'rgba(255,255,255,0.05)', color: filterDate === d ? '#0a0a0a' : 'rgba(245,240,232,0.5)', fontWeight: filterDate === d ? 700 : 400 }}>
            {d === 'all' ? 'All Time' : d === 'today' ? 'Today' : d === 'week' ? 'This Week' : d === 'month' ? 'This Month' : '📅 Custom'}
          </button>
        ))}
      </div>

      {filterDate === 'custom' && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
          <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.8rem' }}>to</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stat('Revenue', `$${totalRevenue.toFixed(2)}`, `${confirmed.length} confirmed`, '#34d399')}
        {stat('Refunded', `-$${totalRefunded.toFixed(2)}`, `${refunded.length} orders`, '#f87171')}
        {stat('Net Revenue', `$${netRevenue.toFixed(2)}`, 'after refunds', '#c9922a')}
        {stat('Pending', `${pending.length}`, 'awaiting confirmation')}
        {stat('Cancelled', `${cancelled.length}`, 'not counted')}
        {stat('Total Orders', `${filteredOrders.length}`, 'all statuses')}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 400, margin: 0 }}>Financial History</h3>
        <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)' }}>{filteredOrders.length} records</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {paginatedHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,240,232,0.2)' }}>No records in this period.</div>
        ) : paginatedHistory.map((o: any) => (
          <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#f5f0e8' }}>{o.customerName || 'Customer'}</span>
              {o.orderNumber && <span style={{ fontSize: '0.7rem', color: 'rgba(201,146,42,0.4)', marginLeft: '0.75rem' }}>{o.orderNumber}</span>}
              {o.location && <span style={{ fontSize: '0.7rem', color: 'rgba(201,146,42,0.5)', marginLeft: '0.75rem' }}>📍 {o.location}</span>}
              {o.orderType && <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', marginLeft: '0.75rem' }}>{orderTypeLabels[o.orderType]}</span>}
              <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', marginLeft: '0.75rem' }}>{new Date(o.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '2rem', background: o.status === 'confirmed' ? 'rgba(52,211,153,0.15)' : o.status === 'cancelled' ? 'rgba(248,113,113,0.15)' : o.status === 'refunded' ? 'rgba(201,146,42,0.15)' : 'rgba(251,191,36,0.15)', color: o.status === 'confirmed' ? '#34d399' : o.status === 'cancelled' ? '#f87171' : o.status === 'refunded' ? '#c9922a' : '#fbbf24' }}>
                {o.status}
              </span>
              <span style={{ color: o.status === 'confirmed' ? '#34d399' : o.status === 'refunded' ? '#f87171' : 'rgba(245,240,232,0.4)', fontWeight: 600 }}>${Number(o.total || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(245,240,232,0.5)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>← Prev</button>
          <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.4)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(245,240,232,0.5)', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>Next →</button>
        </div>
      )}
    </div>
  )
}

function NotesTab({ notes, orders, onSaveNote, onDeleteNote, onClearNotes }: any) {
  const [content, setContent] = useState('')
  const [filterDate, setFilterDate] = useState('all')
  const [activeSection, setActiveSection] = useState<'activity' | 'notes'>('activity')

  const now = new Date()

  const activityFeed = orders
    .filter((o: any) => {
      if (filterDate === 'today' && new Date(o.createdAt).toDateString() !== now.toDateString()) return false
      if (filterDate === 'week' && new Date(o.createdAt) < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) return false
      if (filterDate === 'month' && new Date(o.createdAt) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return false
      return true
    })
    .flatMap((o: any) => {
      const events = []
      events.push({ id: o._id + '-created', time: o.createdAt, type: 'created', label: `New order from ${o.customerName || 'Unknown'}`, amount: o.total, sector: o.sector, status: o.status, orderNumber: o.orderNumber })
      if (o.status === 'confirmed') events.push({ id: o._id + '-confirmed', time: o.createdAt, type: 'confirmed', label: `Order confirmed — ${o.customerName || 'Unknown'}`, amount: o.total, sector: o.sector, orderNumber: o.orderNumber })
      if (o.status === 'cancelled') events.push({ id: o._id + '-cancelled', time: o.createdAt, type: 'cancelled', label: `Order cancelled — ${o.customerName || 'Unknown'}`, amount: o.total, sector: o.sector, orderNumber: o.orderNumber })
      if (o.status === 'refunded') events.push({ id: o._id + '-refunded', time: o.createdAt, type: 'refunded', label: `Order refunded — ${o.customerName || 'Unknown'}`, amount: o.total, sector: o.sector, orderNumber: o.orderNumber })
      return events
    })
    .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime())

  const eventColor: any = {
    created: { color: 'rgba(245,240,232,0.4)', icon: '🆕' },
    confirmed: { color: '#34d399', icon: '✅' },
    cancelled: { color: '#f87171', icon: '❌' },
    refunded: { color: '#c9922a', icon: '💰' },
    modified: { color: '#818cf8', icon: '🔄' },
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem' }}>Log & Notes</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveSection('activity')} style={{ padding: '0.6rem 1.5rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: activeSection === 'activity' ? 700 : 400, background: activeSection === 'activity' ? 'linear-gradient(135deg,#a87020,#e4af2e)' : 'rgba(255,255,255,0.05)', color: activeSection === 'activity' ? '#0a0a0a' : 'rgba(245,240,232,0.5)' }}>
          📊 Activity Feed
        </button>
        <button onClick={() => setActiveSection('notes')} style={{ padding: '0.6rem 1.5rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: activeSection === 'notes' ? 700 : 400, background: activeSection === 'notes' ? 'linear-gradient(135deg,#a87020,#e4af2e)' : 'rgba(255,255,255,0.05)', color: activeSection === 'notes' ? '#0a0a0a' : 'rgba(245,240,232,0.5)' }}>
          📝 Private Notes
        </button>
      </div>

      {activeSection === 'activity' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <select value={filterDate} onChange={e => setFilterDate(e.target.value)}
              style={{ padding: '0.6rem 1rem', background: '#1a1a1a', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif' }}>
              <option value='all'>All Time</option>
              <option value='today'>Today</option>
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
            </select>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.3)', marginBottom: '1rem' }}>{activityFeed.length} events</div>

          {activityFeed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,240,232,0.2)' }}>No activity yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activityFeed.map((event: any) => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#141414', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{eventColor[event.type]?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: eventColor[event.type]?.color }}>{event.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.25)', marginTop: '0.2rem' }}>
                      {event.orderNumber && <span style={{ marginRight: '0.75rem' }}>{event.orderNumber}</span>}
                      {event.sector && <span style={{ marginRight: '0.75rem' }}>📍 {event.sector}</span>}
                      🕐 {new Date(event.time).toLocaleString()}
                    </div>
                  </div>
                  {event.amount && <span style={{ color: event.type === 'confirmed' ? '#34d399' : event.type === 'refunded' ? '#f87171' : 'rgba(245,240,232,0.4)', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>${Number(event.amount).toFixed(2)}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'notes' && (
        <div>
          <div style={{ background: '#141414', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Write a private note..."
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.75rem' }} />
            <button onClick={() => { if (!content.trim()) return; onSaveNote({ content, createdAt: new Date().toISOString() }); setContent('') }}
              style={{ padding: '0.75rem 2rem', background: 'linear-gradient(135deg,#a87020,#e4af2e)', border: 'none', borderRadius: '2rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              Save Note
            </button>
          </div>

          {notes.length > 50 && (
            <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#f87171' }}>⚠️ You have {notes.length} notes. Consider cleaning up old entries.</span>
              <button onClick={onClearNotes} style={{ padding: '0.4rem 1rem', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.7rem', cursor: 'pointer' }}>Clear All</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notes.map((n: any) => (
              <div key={n._id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#f5f0e8', lineHeight: 1.6 }}>{n.content}</p>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)' }}>🕐 {new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <button onClick={() => onDeleteNote(n._id)} style={{ padding: '0.4rem 0.6rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.7rem', cursor: 'pointer', flexShrink: 0 }}>🗑️</button>
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(245,240,232,0.2)' }}>No notes yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  function MetricsTab({ orders }: any) {
  const [filterDate, setFilterDate] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const now = new Date()
  const todayStr = now.toDateString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const confirmed = orders.filter((o: any) => {
    if (o.status !== 'confirmed') return false
    const d = new Date(o.createdAt)
    if (filterDate === 'today') return d.toDateString() === todayStr
    if (filterDate === 'week') return d >= weekAgo
    if (filterDate === 'month') return d >= monthAgo
    if (filterDate === 'custom' && customFrom) return d >= new Date(customFrom) && (!customTo || d <= new Date(customTo + 'T23:59:59'))
    return true
  })

  const orderTypeLabels: any = { dinein: '🪑 Dine-in', takeaway: '🥡 Takeaway', delivery: '🛵 Delivery', online: '💻 Online', phone: '📞 Phone' }

  const topProducts = Object.entries(confirmed.reduce((acc: any, o: any) => {
    o.items?.forEach((item: any) => {
      if (!item.productName) return
      if (!acc[item.productName]) acc[item.productName] = { count: 0, total: 0 }
      acc[item.productName].count += item.quantity || 1
      acc[item.productName].total += item.subtotal || 0
    })
    return acc
  }, {})).sort((a: any, b: any) => b[1].count - a[1].count).slice(0, 10) as any[]

  const topLocations = Object.entries(confirmed.reduce((acc: any, o: any) => {
    const l = o.location?.trim()
    if (!l) return acc
    if (!acc[l]) acc[l] = { count: 0, total: 0 }
    acc[l].count++
    acc[l].total += o.total || 0
    return acc
  }, {})).sort((a: any, b: any) => b[1].total - a[1].total).slice(0, 10) as any[]

  const topOrderTypes = Object.entries(confirmed.reduce((acc: any, o: any) => {
    const t = o.orderType || 'unknown'
    if (!acc[t]) acc[t] = { count: 0, total: 0 }
    acc[t].count++
    acc[t].total += o.total || 0
    return acc
  }, {})).sort((a: any, b: any) => b[1].total - a[1].total) as any[]

  const maxProduct = topProducts[0]?.[1]?.count || 1
  const maxLocation = topLocations[0]?.[1]?.total || 1
  const maxOrderType = topOrderTypes[0]?.[1]?.total || 1

  const Bar = ({ value, max, color }: any) => (
    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color || '#c9922a', borderRadius: '3px', transition: 'width 0.4s ease' }} />
    </div>
  )

  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem' }}>Metrics</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'today', 'week', 'month', 'custom'].map(d => (
          <button key={d} onClick={() => setFilterDate(d)} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif', background: filterDate === d ? 'linear-gradient(135deg,#a87020,#e4af2e)' : 'rgba(255,255,255,0.05)', color: filterDate === d ? '#0a0a0a' : 'rgba(245,240,232,0.5)', fontWeight: filterDate === d ? 700 : 400 }}>
            {d === 'all' ? 'All Time' : d === 'today' ? 'Today' : d === 'week' ? 'This Week' : d === 'month' ? 'This Month' : '📅 Custom'}
          </button>
        ))}
      </div>

      {filterDate === 'custom' && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
          <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.8rem' }}>to</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
        </div>
      )}

      {confirmed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(245,240,232,0.2)' }}>No confirmed orders in this period.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '1.5rem' }}>

          {topProducts.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>☕ Best Selling Products</div>
              {topProducts.map(([name, data]: any, i: number) => (
                <div key={name} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>{data.count} sold</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>${data.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Bar value={data.count} max={maxProduct} color='#c9922a' />
                </div>
              ))}
            </div>
          )}

          {topLocations.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>📍 Top Locations</div>
              {topLocations.map(([location, data]: any, i: number) => (
                <div key={location} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{location}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>${data.total.toFixed(2)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>{data.count} orders</span>
                    </div>
                  </div>
                  <Bar value={data.total} max={maxLocation} color='#34d399' />
                </div>
              ))}
            </div>
          )}

          {topOrderTypes.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>🧾 By Order Type</div>
              {topOrderTypes.map(([type, data]: any, i: number) => (
                <div key={type} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{orderTypeLabels[type] || type}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>${data.total.toFixed(2)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>{data.count} orders</span>
                    </div>
                  </div>
                  <Bar value={data.total} max={maxOrderType} color='#818cf8' />
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

function MetricsTab({ orders }: any) {
  const [filterDate, setFilterDate] = useState('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const now = new Date()
  const todayStr = now.toDateString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const confirmed = orders.filter((o: any) => {
    if (o.status !== 'confirmed') return false
    const d = new Date(o.createdAt)
    if (filterDate === 'today') return d.toDateString() === todayStr
    if (filterDate === 'week') return d >= weekAgo
    if (filterDate === 'month') return d >= monthAgo
    if (filterDate === 'custom' && customFrom) return d >= new Date(customFrom) && (!customTo || d <= new Date(customTo + 'T23:59:59'))
    return true
  })

  const orderTypeLabels: any = { dinein: '🪑 Dine-in', takeaway: '🥡 Takeaway', delivery: '🛵 Delivery', online: '💻 Online', phone: '📞 Phone' }

  const topProducts = Object.entries(confirmed.reduce((acc: any, o: any) => {
    o.items?.forEach((item: any) => {
      if (!item.productName) return
      if (!acc[item.productName]) acc[item.productName] = { count: 0, total: 0 }
      acc[item.productName].count += item.quantity || 1
      acc[item.productName].total += item.subtotal || 0
    })
    return acc
  }, {})).sort((a: any, b: any) => b[1].count - a[1].count).slice(0, 10) as any[]

  const topLocations = Object.entries(confirmed.reduce((acc: any, o: any) => {
    const l = o.location?.trim()
    if (!l) return acc
    if (!acc[l]) acc[l] = { count: 0, total: 0 }
    acc[l].count++
    acc[l].total += o.total || 0
    return acc
  }, {})).sort((a: any, b: any) => b[1].total - a[1].total).slice(0, 10) as any[]

  const topOrderTypes = Object.entries(confirmed.reduce((acc: any, o: any) => {
    const t = o.orderType || 'unknown'
    if (!acc[t]) acc[t] = { count: 0, total: 0 }
    acc[t].count++
    acc[t].total += o.total || 0
    return acc
  }, {})).sort((a: any, b: any) => b[1].total - a[1].total) as any[]

  const maxProduct = topProducts[0]?.[1]?.count || 1
  const maxLocation = topLocations[0]?.[1]?.total || 1
  const maxOrderType = topOrderTypes[0]?.[1]?.total || 1

  const Bar = ({ value, max, color }: any) => (
    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${(value / max) * 100}%`, background: color || '#c9922a', borderRadius: '3px', transition: 'width 0.4s ease' }} />
    </div>
  )

  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '1.5rem' }}>Metrics</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'today', 'week', 'month', 'custom'].map(d => (
          <button key={d} onClick={() => setFilterDate(d)} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif', background: filterDate === d ? 'linear-gradient(135deg,#a87020,#e4af2e)' : 'rgba(255,255,255,0.05)', color: filterDate === d ? '#0a0a0a' : 'rgba(245,240,232,0.5)', fontWeight: filterDate === d ? 700 : 400 }}>
            {d === 'all' ? 'All Time' : d === 'today' ? 'Today' : d === 'week' ? 'This Week' : d === 'month' ? 'This Month' : '📅 Custom'}
          </button>
        ))}
      </div>

      {filterDate === 'custom' && (
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
          <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.8rem' }}>to</span>
          <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
            style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.15)', borderRadius: '0.5rem', color: '#f5f0e8', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', colorScheme: 'dark' }} />
        </div>
      )}

      {confirmed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(245,240,232,0.2)' }}>No confirmed orders in this period.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '1.5rem' }}>

          {topProducts.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>☕ Best Selling Products</div>
              {topProducts.map(([name, data]: any, i: number) => (
                <div key={name} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>{data.count} sold</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>${data.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Bar value={data.count} max={maxProduct} color='#c9922a' />
                </div>
              ))}
            </div>
          )}

          {topLocations.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>📍 Top Locations</div>
              {topLocations.map(([location, data]: any, i: number) => (
                <div key={location} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{location}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>${data.total.toFixed(2)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>{data.count} orders</span>
                    </div>
                  </div>
                  <Bar value={data.total} max={maxLocation} color='#34d399' />
                </div>
              ))}
            </div>
          )}

          {topOrderTypes.length > 0 && (
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.6)', marginBottom: '1.25rem' }}>🧾 By Order Type</div>
              {topOrderTypes.map(([type, data]: any, i: number) => (
                <div key={type} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: i === 0 ? '#e4af2e' : 'rgba(245,240,232,0.25)', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: '#f5f0e8' }}>{orderTypeLabels[type] || type}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#c9922a', fontWeight: 600 }}>${data.total.toFixed(2)}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', marginLeft: '0.5rem' }}>{data.count} orders</span>
                    </div>
                  </div>
                  <Bar value={data.total} max={maxOrderType} color='#818cf8' />
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

}
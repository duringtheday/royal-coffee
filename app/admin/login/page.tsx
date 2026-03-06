'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Incorrect password. Try again.')
      }
    } catch {
      setError('Connection error. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <div style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', background: '#141414', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '1.5rem', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', margin: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Image src="/logo.png" alt="Royal Coffee" width={80} height={80} style={{ objectFit: 'contain', marginBottom: '1rem' }} />
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 400, color: '#f5f0e8', margin: 0 }}>Owner Dashboard</h1>
          <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: '0.75rem', letterSpacing: '0.2em', marginTop: '0.4rem' }}>ROYAL COFFEE & TEA</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,146,42,0.7)', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" required
              style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,146,42,0.2)', borderRadius: '0.75rem', color: '#f5f0e8', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #a87020, #e4af2e, #a87020)', border: 'none', borderRadius: '0.75rem', color: '#0a0a0a', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: '0.5rem' }}>
            {loading ? 'Verifying...' : 'Enter Dashboard →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.68rem', color: 'rgba(245,240,232,0.2)' }}>Forgot password? Contact your developer.</p>
      </div>
    </div>
  )
}
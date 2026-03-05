export default function StudioPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: '#c9922a',
      fontFamily: 'Outfit, sans-serif',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>👑 Owner Dashboard</h1>
        <p style={{ opacity: 0.6 }}>Run locally with <code>npm run dev</code> to access the dashboard.</p>
      </div>
    </div>
  )
}
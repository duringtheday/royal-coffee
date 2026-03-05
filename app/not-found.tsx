export default function NotFound() {
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
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <p style={{ opacity: 0.6 }}>Page not found</p>
      </div>
    </div>
  )
}
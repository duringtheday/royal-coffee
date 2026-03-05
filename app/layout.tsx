import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Royal Coffee & Tea — Siem Reap',
  description: 'Premium coffee & tea in the heart of Siem Reap, Cambodia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#f5f0e8',
              border: '1px solid rgba(201,146,42,0.3)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.85rem',
              letterSpacing: '0.03em',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}

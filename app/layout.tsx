import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Adso',
  description:
    'Note-taking app for exploring your deepest thoughts and articulating your brightest ideas.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon.png',
        href: '/favicon.png'
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark.png',
        href: '/favicon-dark.png'
      }
    ]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

import './global.css'
import { config } from '@/config'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import TopLoader from 'nextjs-toploader'

import Navbar from '@/components/Navbar'
import { ModalContainer } from '@/hooks/useModal'
import CartContainer from '@/components/CartContainer'
import ToastContainer from '@/hooks/useToast/ToastContainer'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})


const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

// next.js metadata is just for SEO stuff or can be
export const metadata: Metadata = {
  title: 'MASA Telecomunications',
  description: 'Placeholder'
}

// root layout handles the layout of the pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TopLoader
          color={config.theme}
          showSpinner={false}
        />
        <ModalContainer />
        <ToastContainer />
        <CartContainer />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
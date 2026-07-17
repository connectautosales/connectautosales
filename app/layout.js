import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Outfit } from 'next/font/google'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import SessionWrapper from '@/components/SessionWrapper'
import { SettingsProvider } from '@/context/SettingsContext'
import VisitorTracker from '@/app/components/VisitorTracker'
import { headers } from 'next/headers'

const outfit = Outfit({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Connect Auto Sales - Quality Used Cars in Dearborn Heights, MI',
  description: 'Find your dream car at Connect Auto Sales. Quality used vehicles, easy financing, and warranty options in Dearborn Heights, Michigan.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body className={outfit.className} suppressHydrationWarning>
        <SessionWrapper>
          <SettingsProvider>
            <VisitorTracker />
            {!isAdmin && <Header />}
            <main>{children}</main>
            {!isAdmin && <Footer />}
          </SettingsProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}

import './globals.css'
import { Outfit } from 'next/font/google'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

const outfit = Outfit({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Connect Auto Sales - Quality Used Cars in Dearborn Heights, MI',
  description: 'Find your dream car at Connect Auto Sales. Quality used vehicles, easy financing, and warranty options in Dearborn Heights, Michigan.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

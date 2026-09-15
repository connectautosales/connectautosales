import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import SessionWrapper from '@/components/SessionWrapper'
import { SettingsProvider } from '@/context/SettingsContext'
import VisitorTracker from '@/app/components/VisitorTracker'
import PageTransition from '@/app/components/PageTransition'
import { headers } from 'next/headers'

const outfit = Outfit({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  metadataBase: new URL('https://www.connectautosales.com'),
  title: {
    default: 'Used Cars for Sale in Dearborn Heights, MI | Connect Auto Sales',
    template: '%s | Connect Auto Sales',
  },
  description: 'Quality used cars, trucks and SUVs for sale in Dearborn Heights, Michigan. Financing available for all credit types, extended warranty options, clean and rebuilt titles.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Connect Auto Sales',
    locale: 'en_US',
    url: '/',
    title: 'Used Cars for Sale in Dearborn Heights, MI | Connect Auto Sales',
    description: 'Quality used cars, trucks and SUVs for sale in Dearborn Heights, Michigan. Financing available for all credit types, extended warranty options.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': 'https://www.connectautosales.com/#dealer',
  name: 'Connect Auto Sales',
  url: 'https://www.connectautosales.com',
  logo: 'https://www.connectautosales.com/images/logo.png',
  image: 'https://www.connectautosales.com/images/logo.png',
  telephone: '+1-313-413-3400',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4413 S Beech Daly St',
    addressLocality: 'Dearborn Heights',
    addressRegion: 'MI',
    postalCode: '48125',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 42.2917, longitude: -83.2663 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
  sameAs: [
    'https://facebook.com/connectautosales',
    'https://instagram.com/connectautosales',
  ],
  areaServed: [
    { '@type': 'City', name: 'Dearborn Heights' },
    { '@type': 'City', name: 'Dearborn' },
    { '@type': 'City', name: 'Detroit' },
    { '@type': 'State', name: 'Michigan' },
  ],
}

export default async function RootLayout({ children }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body className={outfit.className} suppressHydrationWarning>
        {!isAdmin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
          />
        )}
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4BGMGDC39K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4BGMGDC39K');
        `}</Script>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=6LdhzWYtAAAAAOSA8uZed4Bxb2aFKTm75YA1L2UY`}
          strategy="afterInteractive"
        />
        {/* Meta Pixel — business page + personal marketplace */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '145080567456088');
          fbq('init', '622117261774143');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=145080567456088&ev=PageView&noscript=1"
            alt=""
          />
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=622117261774143&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <SessionWrapper>
          <SettingsProvider>
            <VisitorTracker />
            {!isAdmin && <Header />}
            <main><PageTransition>{children}</PageTransition></main>
            {!isAdmin && <Footer />}
          </SettingsProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}

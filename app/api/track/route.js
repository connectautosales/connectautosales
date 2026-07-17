import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function parseDevice(ua) {
  if (!ua) return 'Unknown'
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) return 'Mobile'
  if (/Tablet/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

function parseBrowser(ua) {
  if (!ua) return 'Unknown'
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\//i.test(ua)) return 'Opera'
  if (/Chrome\//i.test(ua)) return 'Chrome'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Safari\//i.test(ua)) return 'Safari'
  return 'Other'
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { page, referrer } = body

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || '127.0.0.1')
    const ua = request.headers.get('user-agent') || ''

    const device = parseDevice(ua)
    const browser = parseBrowser(ua)

    // Skip bots
    if (/bot|crawl|spider|slurp|mediapartners/i.test(ua)) {
      return NextResponse.json({ ok: true })
    }

    let country = 'Unknown'
    let city = 'Unknown'

    // Only do geo lookup for non-local IPs
    if (ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const geo = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 3600 } })
        if (geo.ok) {
          const geoData = await geo.json()
          country = geoData.country_name || 'Unknown'
          city = geoData.city || 'Unknown'
        }
      } catch {}
    }

    await prisma.$executeRaw`
      INSERT INTO visitorlog (ip, country, city, page, device, browser, referrer, createdAt)
      VALUES (${ip}, ${country}, ${city}, ${page || '/'}, ${device}, ${browser}, ${referrer || ''}, NOW())
    `

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Track error:', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

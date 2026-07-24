export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const PHONE = '313-413-3400'
const SIZE = 1080

function modelFontSize(model) {
  const len = (model || '').length
  if (len <= 3) return 230
  if (len <= 4) return 200
  if (len <= 5) return 170
  if (len <= 6) return 145
  if (len <= 8) return 120
  return 95
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function buildSvg(logoB64, year, make, model, trim, cashPrice, financePrice) {
  const modelSize = modelFontSize(model)
  // model baseline: logo ends ~115px, year/make ~165px, model text starts below
  const modelY = 165 + modelSize

  const showTrim = trim && trim.trim()
  const trimY = modelY + 30
  const trimW = Math.max(80, (trim || '').length * 22 + 30)

  const hasFinance = financePrice && financePrice > cashPrice
  const displayFinance = hasFinance ? financePrice : cashPrice + 1000
  const displayCash = cashPrice

  // Bottom boxes — left box finance price, right box cash price
  const boxTop = 870
  const boxH = 180

  const cashStr = fmt(displayCash)
  const finStr = fmt(displayFinance)

  // Cash price font size based on length
  const cashFontSize = cashStr.length <= 7 ? 80 : cashStr.length <= 8 ? 68 : 56

  return `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="leftGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000" stop-opacity="0.65"/>
      <stop offset="60%" stop-color="#000" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.72"/>
    </linearGradient>
  </defs>

  <!-- Top gradient for logo/phone readability -->
  <rect x="0" y="0" width="${SIZE}" height="140" fill="url(#topGrad)"/>

  <!-- Left gradient for text readability -->
  <rect x="0" y="0" width="560" height="${SIZE}" fill="url(#leftGrad)"/>

  <!-- Bottom gradient for price section -->
  <rect x="0" y="720" width="${SIZE}" height="360" fill="url(#bottomGrad)"/>

  <!-- Logo (top-left) -->
  <image href="data:image/png;base64,${logoB64}" x="18" y="12" width="300" height="100"/>

  <!-- Phone badge (top-right): black rounded rect, red border -->
  <rect x="680" y="16" width="384" height="82" rx="14" fill="#000" stroke="#e50202" stroke-width="3.5"/>
  <!-- Phone icon: red circle -->
  <circle cx="717" cy="57" r="22" fill="#e50202"/>
  <!-- Phone handset icon (SVG path) -->
  <path d="M709 49 C709 49 712 46 714 48 L717 51 C718 52 718 54 717 55 L715 57 C715 57 717 62 722 65 C727 68 729 67 729 67 L731 65 C732 64 734 64 735 65 L738 68 C740 70 737 73 737 73 C737 73 733 76 728 73 C723 70 714 61 711 56 C708 51 709 49 709 49 Z" fill="#fff"/>
  <!-- Phone number text -->
  <text x="858" y="68" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="34" fill="#fff" letter-spacing="1">${PHONE}</text>

  <!-- Year + Make text -->
  <text x="26" y="162" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="46" fill="#fff" letter-spacing="2">${year} ${(make || '').toUpperCase()}</text>

  <!-- Model name (BIG RED) -->
  <text x="18" y="${modelY}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${modelSize}" fill="#e50202" letter-spacing="-3">${(model || '').toUpperCase()}</text>

  ${showTrim ? `
  <!-- Trim badge -->
  <rect x="22" y="${trimY}" width="${trimW}" height="52" rx="9" fill="#e50202"/>
  <text x="${22 + trimW / 2}" y="${trimY + 36}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="28" fill="#fff">${trim.toUpperCase()}</text>
  ` : ''}

  <!-- Finance price box (bottom-left) -->
  <rect x="18" y="${boxTop}" width="318" height="${boxH}" rx="13" fill="rgba(0,0,0,0.88)"/>
  <text x="36" y="${boxTop + 42}" font-family="Arial, sans-serif" font-weight="700" font-size="18" fill="#ccc" letter-spacing="2">FINANCE PRICE</text>
  <text x="36" y="${boxTop + 118}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="58" fill="#fff">${finStr}</text>
  <!-- Red strikethrough -->
  <line x1="32" y1="${boxTop + 100}" x2="326" y2="${boxTop + 100}" stroke="#e50202" stroke-width="5"/>

  <!-- Arrow -->
  <text x="360" y="${boxTop + 118}" font-family="Arial, sans-serif" font-size="62" fill="#e50202" font-weight="900">&#8594;</text>

  <!-- Cash price section (bottom-right) -->
  <!-- Yellow discount banner -->
  <rect x="430" y="${boxTop}" width="632" height="52" rx="9" fill="#fde92b"/>
  <text x="746" y="${boxTop + 37}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="26" fill="#000" letter-spacing="0.5">-$1,000 DISCOUNT!</text>

  <!-- Red box: when pay in full + price -->
  <rect x="430" y="${boxTop + 56}" width="632" height="${boxH - 56}" rx="9" fill="#b91c1c"/>
  <text x="746" y="${boxTop + 86}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="20" fill="#fff" letter-spacing="3">WHEN PAY IN FULL</text>
  <text x="746" y="${boxTop + 56 + (boxH - 56) - 12}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${cashFontSize}" fill="#fde92b" letter-spacing="-2">${cashStr}</text>
</svg>`
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const photo = formData.get('photo')
    const year = formData.get('year') || ''
    const make = formData.get('make') || ''
    const model = formData.get('model') || ''
    const trim = formData.get('trim') || ''
    const price = parseFloat(formData.get('price') || 0)
    const financePrice = parseFloat(formData.get('financePrice') || 0)
    const carId = formData.get('carId') || 'gen'

    if (!photo) return NextResponse.json({ error: 'No photo provided' }, { status: 400 })

    // Read logo as base64
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png')
    const logoB64 = fs.readFileSync(logoPath).toString('base64')

    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const svg = buildSvg(logoB64, year, make, model, trim, price, financePrice)

    const result = await sharp(buffer)
      .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 93 })
      .toBuffer()

    const filename = `watermark/${carId}-${Date.now()}.jpg`

    let url
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, result, { access: 'public' })
      url = blob.url
    } else {
      // Local dev fallback: save to public/uploads
      const outDir = path.join(process.cwd(), 'public', 'uploads', 'watermark')
      fs.mkdirSync(outDir, { recursive: true })
      const fname = `${carId}-${Date.now()}.jpg`
      fs.writeFileSync(path.join(outDir, fname), result)
      url = `/uploads/watermark/${fname}`
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Watermark error:', err)
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}

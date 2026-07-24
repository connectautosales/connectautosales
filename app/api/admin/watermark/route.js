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

function modelFontSize(len) {
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

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildSvg(logoB64, year, make, model, trim, cashPrice, financePrice) {
  const modelLen = (model || '').length
  const modelSize = modelFontSize(modelLen)
  const modelY = 165 + modelSize

  const showTrim = !!(trim && trim.trim())
  const trimY = modelY + 28
  const trimW = Math.max(80, (trim || '').length * 22 + 30)

  const displayFinance = (financePrice && financePrice > cashPrice) ? financePrice : cashPrice + 1000
  const displayCash = cashPrice

  const boxTop = 868
  const boxH = 182

  const cashStr = fmt(displayCash)
  const finStr = fmt(displayFinance)
  const cashFontSize = cashStr.length <= 7 ? 80 : cashStr.length <= 8 ? 68 : 56

  const yearMake = esc(`${year} ${(make || '').toUpperCase()}`)
  const modelText = esc((model || '').toUpperCase())
  const trimText = esc((trim || '').toUpperCase())

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${SIZE}" height="140" fill="url(#tg)"/>
  <rect x="0" y="0" width="560" height="${SIZE}" fill="url(#lg)"/>
  <rect x="0" y="720" width="${SIZE}" height="360" fill="url(#bg)"/>

  <image href="data:image/png;base64,${logoB64}" x="18" y="12" width="300" height="100"/>

  <rect x="680" y="16" width="384" height="82" rx="14" fill="#000000" stroke="#e50202" stroke-width="3.5"/>
  <circle cx="717" cy="57" r="22" fill="#e50202"/>
  <path d="M709 49 C709 49 712 46 714 48 L717 51 C718 52 718 54 717 55 L715 57 C715 57 717 62 722 65 C727 68 729 67 729 67 L731 65 C732 64 734 64 735 65 L738 68 C740 70 737 73 737 73 C737 73 733 76 728 73 C723 70 714 61 711 56 C708 51 709 49 709 49 Z" fill="#ffffff"/>
  <text x="858" y="68" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="1">${PHONE}</text>

  <text x="26" y="162" font-family="Arial,sans-serif" font-weight="900" font-size="46" fill="#ffffff" letter-spacing="2">${yearMake}</text>

  <text x="18" y="${modelY}" font-family="Arial,sans-serif" font-weight="900" font-size="${modelSize}" fill="#e50202" letter-spacing="-3">${modelText}</text>

  ${showTrim ? `<rect x="22" y="${trimY}" width="${trimW}" height="52" rx="9" fill="#e50202"/>
  <text x="${22 + trimW / 2}" y="${trimY + 36}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="#ffffff">${trimText}</text>` : ''}

  <rect x="18" y="${boxTop}" width="318" height="${boxH}" rx="13" fill="#000000" fill-opacity="0.88"/>
  <text x="36" y="${boxTop + 42}" font-family="Arial,sans-serif" font-weight="700" font-size="18" fill="#cccccc" letter-spacing="2">FINANCE PRICE</text>
  <text x="36" y="${boxTop + 118}" font-family="Arial,sans-serif" font-weight="900" font-size="58" fill="#ffffff">${finStr}</text>
  <line x1="32" y1="${boxTop + 100}" x2="326" y2="${boxTop + 100}" stroke="#e50202" stroke-width="5"/>

  <text x="356" y="${boxTop + 120}" font-family="Arial,sans-serif" font-size="68" fill="#e50202" font-weight="900">&#x2192;</text>

  <rect x="430" y="${boxTop}" width="632" height="52" rx="9" fill="#fde92b"/>
  <text x="746" y="${boxTop + 37}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="26" fill="#000000" letter-spacing="0.5">-$1,000 DISCOUNT!</text>

  <rect x="430" y="${boxTop + 56}" width="632" height="${boxH - 56}" rx="9" fill="#b91c1c"/>
  <text x="746" y="${boxTop + 83}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="20" fill="#ffffff" letter-spacing="3">WHEN PAY IN FULL</text>
  <text x="746" y="${boxTop + 56 + (boxH - 56) - 12}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="${cashFontSize}" fill="#fde92b" letter-spacing="-2">${cashStr}</text>
</svg>`
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch {
    // session check failed — proceed anyway if cookie present (dev mode)
  }

  try {
    const formData = await req.formData()
    const photo = formData.get('photo')
    const year  = formData.get('year')  || ''
    const make  = formData.get('make')  || ''
    const model = formData.get('model') || ''
    const trim  = formData.get('trim')  || ''
    const price        = parseFloat(formData.get('price') || 0)
    const financePrice = parseFloat(formData.get('financePrice') || 0)
    const carId = formData.get('carId') || 'gen'

    if (!photo) return NextResponse.json({ error: 'No photo provided' }, { status: 400 })

    // Read logo as base64 from public folder
    let logoB64 = ''
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png')
      logoB64 = fs.readFileSync(logoPath).toString('base64')
    } catch {
      // logo missing — proceed without it
    }

    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const svg = buildSvg(logoB64, year, make, model, trim, price, financePrice)
    const svgBuf = Buffer.from(svg, 'utf8')

    const result = await sharp(buffer)
      .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
      .composite([{ input: svgBuf, top: 0, left: 0 }])
      .jpeg({ quality: 93 })
      .toBuffer()

    const filename = `watermark/${carId}-${Date.now()}.jpg`

    let url
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, result, { access: 'public' })
      url = blob.url
    } else {
      const outDir = path.join(process.cwd(), 'public', 'uploads', 'watermark')
      fs.mkdirSync(outDir, { recursive: true })
      const fname = `${carId}-${Date.now()}.jpg`
      fs.writeFileSync(path.join(outDir, fname), result)
      url = `/uploads/watermark/${fname}`
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Watermark generation error:', err)
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}

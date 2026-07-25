export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

// Load Anton font as base64 once (server-side)
let ANTON_B64 = null
function getAntonB64() {
  if (ANTON_B64) return ANTON_B64
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Anton-Regular.ttf')
    ANTON_B64 = fs.readFileSync(fontPath).toString('base64')
  } catch { ANTON_B64 = '' }
  return ANTON_B64
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function getLogoBase64() {
  try {
    const rows = await prisma.$queryRawUnsafe(`SELECT logo_url FROM sitesettings LIMIT 1`)
    const url = rows[0]?.logo_url
    if (!url) return null
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const mime = res.headers.get('content-type') || 'image/png'
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch { return null }
}

function buildSvg({ W, H, HEADER, PRICING, DISCOUNT, year, make, model, trim, cashStr, finStr, logoB64, antonB64 }) {
  const fontFace = antonB64
    ? `@font-face { font-family: 'Anton'; src: url('data:font/truetype;base64,${antonB64}') format('truetype'); }`
    : ''

  // Trim badge
  const trimBadge = trim ? `
    <rect x="48" y="${HEADER + 490}" width="${Math.max(80, trim.length * 22 + 32)}" height="52" rx="8" fill="#cc0000"/>
    <text x="${Math.max(80, trim.length * 22 + 32) / 2 + 48}" y="${HEADER + 524}" font-family="Anton" font-size="30" fill="white" text-anchor="middle">${escXml(trim.toUpperCase())}</text>
  ` : ''

  // Phone pill badge
  const pillW = 360, pillH = 78, pillX = W - pillW - 32, pillY = (HEADER - pillH) / 2
  const phoneIcon = `<text x="${pillX + 30}" y="${pillY + pillH / 2 + 13}" font-family="Anton" font-size="34" fill="white">&#9742;</text>`

  // Logo or text
  const logoEl = logoB64
    ? `<image href="${logoB64}" x="28" y="${(HEADER - 74) / 2}" width="220" height="74" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="40" y="${HEADER / 2 - 8}" font-family="Anton" font-size="30" fill="white">CONNECT AUTO</text>
       <text x="40" y="${HEADER / 2 + 26}" font-family="Anton" font-size="26" fill="#cc0000">SALES</text>`

  // Pricing layout
  const pricingY = H - PRICING - DISCOUNT
  const halfW = W / 2
  // Arrow triangle pointing right
  const arrowCx = halfW, arrowCy = pricingY + PRICING / 2
  const arrowH = 90, arrowW = 60
  const arrowPts = `${arrowCx - arrowW / 2},${arrowCy - arrowH / 2} ${arrowCx + arrowW / 2},${arrowCy} ${arrowCx - arrowW / 2},${arrowCy + arrowH / 2}`

  // Strikethrough line y-position
  const strikePriceY = pricingY + 118
  const strikeLineY = strikePriceY - 14

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}">
  <defs>
    <style>${fontFace}</style>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.72"/>
      <stop offset="52%" stop-color="#000000" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="headerFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>

  <!-- Header bar -->
  <rect x="0" y="0" width="${W}" height="${HEADER}" fill="url(#headerFade)"/>

  <!-- Red accent line under header -->
  <rect x="0" y="${HEADER - 4}" width="${W}" height="4" fill="#cc0000"/>

  <!-- Logo -->
  ${logoEl}

  <!-- Phone pill -->
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="#111111" stroke="#cc0000" stroke-width="3"/>
  ${phoneIcon}
  <text x="${pillX + 66}" y="${pillY + pillH / 2 + 14}" font-family="Anton" font-size="34" fill="white">313-413-3400</text>

  <!-- Left gradient overlay (photo area only) -->
  <rect x="0" y="${HEADER}" width="${W * 0.62}" height="${pricingY - HEADER}" fill="url(#leftFade)"/>

  <!-- Vehicle title text -->
  <text x="48" y="${HEADER + 180}" font-family="Anton" font-size="56" fill="white" letter-spacing="2">${escXml(year)} ${escXml(make.toUpperCase())}</text>
  <text x="44" y="${HEADER + 420}" font-family="Anton" font-size="230" fill="white" letter-spacing="-4" opacity="1">${escXml(model.toUpperCase())}</text>

  ${trimBadge}

  <!-- Pricing section background -->
  <rect x="0" y="${pricingY}" width="${halfW - 30}" height="${PRICING}" fill="#111111"/>
  <polygon points="${halfW - 30},${pricingY} ${halfW + 30},${pricingY} ${halfW + 30},${pricingY + PRICING} ${halfW - 30},${pricingY + PRICING}" fill="#cc0000"/>
  <rect x="${halfW + 30}" y="${pricingY}" width="${halfW - 30}" height="${PRICING}" fill="#cc0000"/>

  <!-- Finance price label -->
  <text x="44" y="${pricingY + 46}" font-family="Anton" font-size="26" fill="#aaaaaa" letter-spacing="2">FINANCE PRICE</text>
  <text x="44" y="${strikePriceY}" font-family="Anton" font-size="78" fill="white">${escXml(finStr)}</text>
  <!-- Strikethrough -->
  <line x1="40" y1="${strikeLineY}" x2="${Math.min(halfW - 50, 44 + finStr.length * 42)}" y2="${strikeLineY}" stroke="#cc0000" stroke-width="5"/>

  <!-- Arrow -->
  <polygon points="${arrowPts}" fill="#cc0000"/>

  <!-- Cash price label -->
  <text x="${halfW + 50}" y="${pricingY + 46}" font-family="Anton" font-size="24" fill="white" letter-spacing="2">WHEN PAY IN FULL</text>
  <text x="${halfW + 50}" y="${strikePriceY}" font-family="Anton" font-size="78" fill="#FFD700">${escXml(cashStr)}</text>

  <!-- Discount banner -->
  <rect x="0" y="${H - DISCOUNT}" width="${W}" height="${DISCOUNT}" fill="#FFD700"/>
  <text x="${W / 2}" y="${H - DISCOUNT + DISCOUNT * 0.68}" font-family="Anton" font-size="52" fill="#111111" text-anchor="middle" letter-spacing="3">-$1,000 DISCOUNT!</text>
</svg>`
}

export async function POST(req) {
  let step = 'init'
  try {
    step = 'parse_form'
    const formData    = await req.formData()
    const photo       = formData.get('photo')
    const year        = formData.get('year')        || ''
    const make        = formData.get('make')        || ''
    const model       = formData.get('model')       || ''
    const trim        = formData.get('trim')        || ''
    const price       = parseFloat(formData.get('price') || 0)
    const financePrice = parseFloat(formData.get('financePrice') || 0)

    if (!photo) return NextResponse.json({ error: 'No photo provided' }, { status: 400 })

    const cashStr = fmt(price)
    const finStr  = fmt(financePrice && financePrice > price ? financePrice : price + 1000)

    step = 'prepare_image'
    const bytes  = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const sharp = (await import('sharp')).default

    // Resize to 1080x1080 cover
    const W = 1080, H = 1080
    const HEADER   = 130
    const PRICING  = 155
    const DISCOUNT = 80

    const bgBuf = await sharp(buffer)
      .resize(W, H, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer()

    step = 'load_assets'
    const [logoB64, antonB64] = await Promise.all([
      getLogoBase64(),
      Promise.resolve(getAntonB64()),
    ])

    step = 'build_svg'
    const svg = buildSvg({ W, H, HEADER, PRICING, DISCOUNT, year, make, model, trim, cashStr, finStr, logoB64, antonB64 })
    const svgBuf = Buffer.from(svg, 'utf8')

    step = 'composite'
    const outBuf = await sharp(bgBuf)
      .composite([{ input: svgBuf, top: 0, left: 0 }])
      .png({ compressionLevel: 7 })
      .toBuffer()

    const base64 = `data:image/png;base64,${outBuf.toString('base64')}`
    return NextResponse.json({ base64 })

  } catch (err) {
    console.error(`Watermark failed at [${step}]:`, err)
    return NextResponse.json(
      { error: `Failed at "${step}": ${err.message || String(err)}` },
      { status: 500 }
    )
  }
}

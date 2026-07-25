export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

let _antonB64 = null
function getAntonB64() {
  if (_antonB64) return _antonB64
  try {
    const p = path.join(process.cwd(), 'public', 'fonts', 'Anton-Regular.ttf')
    _antonB64 = fs.readFileSync(p).toString('base64')
  } catch { _antonB64 = '' }
  return _antonB64
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Dynamic font size for model name based on length
function modelFontSize(model) {
  const len = model.length
  return Math.min(240, Math.max(80, Math.floor(920 / (len * 0.62))))
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
    const sharp  = (await import('sharp')).default

    const SIZE = 1080
    const bg = await sharp(buffer)
      .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer()

    step = 'build_overlay'
    const antonB64 = getAntonB64()
    const fontFace = antonB64
      ? `@font-face { font-family: 'Anton'; src: url('data:font/truetype;base64,${antonB64}') format('truetype'); }`
      : ''

    const mSize   = modelFontSize(model)
    // vertical positions
    const checkH  = 18   // checkered strip height
    const urlY    = checkH + 44
    const yearY   = urlY + 46
    const modelY  = yearY + mSize + 8
    const trimY   = modelY + 16

    // Trim badge
    const trimEl = trim ? (() => {
      const tw = Math.max(80, trim.length * 22 + 40)
      return `<rect x="36" y="${trimY}" width="${tw}" height="54" rx="10" fill="#cc0000"/>
      <text x="${36 + tw / 2}" y="${trimY + 37}" font-family="Anton" font-size="30" fill="white" text-anchor="middle" dominant-baseline="auto">${esc(trim.toUpperCase())}</text>`
    })() : ''

    // Phone badge dimensions
    const phoneText  = '313-413-3400'
    const phoneBadgeW = 370
    const phoneBadgeH = 76
    const phoneBadgeX = SIZE - phoneBadgeW - 28
    const phoneBadgeY = checkH + 20

    // Bottom pricing layout
    const bottomY   = SIZE - 240   // start of pricing area
    const boxH      = 200
    const leftBoxW  = 380
    const rightBoxX = SIZE / 2 + 20
    const rightBoxW = SIZE - rightBoxX - 28

    // Strikethrough Y
    const finLabelY = bottomY + 44
    const finPriceY = bottomY + 120
    const strikeY   = finPriceY - 16

    const cashLabelY    = bottomY + 36
    const discountBadgeY = bottomY + 8
    const cashPriceY    = bottomY + 148

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs>
    <style>${fontFace}</style>
  </defs>

  <!-- Checkered flag strip top -->
  ${Array.from({ length: Math.ceil(SIZE / 18) }, (_, i) =>
    `<rect x="${i * 18}" y="0" width="18" height="${checkH}" fill="${i % 2 === 0 ? '#000' : '#fff'}"/>`
  ).join('')}

  <!-- Website URL -->
  <text x="32" y="${urlY}" font-family="Anton" font-size="28" fill="#111111">www.Connect</text>
  <text x="${32 + 10 * 16.5}" y="${urlY}" font-family="Anton" font-size="28" fill="#cc0000">Auto-Sales</text>
  <text x="${32 + 10 * 16.5 + 10 * 16.5}" y="${urlY}" font-family="Anton" font-size="28" fill="#111111">.com</text>

  <!-- Year Make -->
  <text x="32" y="${yearY}" font-family="Anton" font-size="46" fill="#111111">${esc(year)} </text>
  <text x="${32 + String(year).length * 28 + 10}" y="${yearY}" font-family="Anton" font-size="46" fill="#cc0000">${esc(make.toUpperCase())}</text>

  <!-- Model name — huge red with black stroke -->
  <text x="30" y="${modelY}" font-family="Anton" font-size="${mSize}" fill="#cc0000"
    paint-order="stroke" stroke="#111111" stroke-width="${Math.round(mSize * 0.065)}" stroke-linejoin="round"
    letter-spacing="-2">${esc(model.toUpperCase())}</text>

  <!-- Trim badge -->
  ${trimEl}

  <!-- Phone badge -->
  <rect x="${phoneBadgeX}" y="${phoneBadgeY}" width="${phoneBadgeW}" height="${phoneBadgeH}" rx="${phoneBadgeH / 2}" fill="#111111" stroke="#cc0000" stroke-width="3"/>
  <text x="${phoneBadgeX + 22}" y="${phoneBadgeY + phoneBadgeH / 2 + 4}" font-family="Anton" font-size="30" fill="#cc0000">&#9742;</text>
  <text x="${phoneBadgeX + 62}" y="${phoneBadgeY + phoneBadgeH / 2 + 13}" font-family="Anton" font-size="36" fill="white">${phoneText}</text>

  <!-- Bottom-left black pricing box -->
  <rect x="28" y="${bottomY}" width="${leftBoxW}" height="${boxH}" rx="16" fill="#111111" fill-opacity="0.92"/>
  <text x="${28 + leftBoxW / 2}" y="${finLabelY}" font-family="Anton" font-size="24" fill="#aaaaaa" text-anchor="middle" letter-spacing="2">FINANCE PRICE</text>
  <text x="${28 + leftBoxW / 2}" y="${finPriceY}" font-family="Anton" font-size="72" fill="white" text-anchor="middle">${esc(finStr)}</text>
  <line x1="${28 + 30}" y1="${strikeY}" x2="${28 + leftBoxW - 30}" y2="${strikeY}" stroke="#cc0000" stroke-width="5"/>

  <!-- Arrow -->
  <text x="${leftBoxW + 40}" y="${bottomY + boxH / 2 + 24}" font-family="Anton" font-size="72" fill="#cc0000" text-anchor="middle">&#x27A4;</text>

  <!-- Bottom-right red pricing box -->
  <rect x="${rightBoxX}" y="${bottomY}" width="${rightBoxW}" height="${boxH}" rx="16" fill="#cc0000"/>

  <!-- Discount badge inside right box -->
  <rect x="${rightBoxX + 16}" y="${discountBadgeY}" width="${rightBoxW - 32}" height="46" rx="8" fill="#FFD700"/>
  <text x="${rightBoxX + rightBoxW / 2}" y="${discountBadgeY + 32}" font-family="Anton" font-size="26" fill="#111111" text-anchor="middle" letter-spacing="1">-$1,000 DISCOUNT!</text>

  <text x="${rightBoxX + rightBoxW / 2}" y="${cashLabelY + 50}" font-family="Anton" font-size="22" fill="white" text-anchor="middle" letter-spacing="2">WHEN PAY IN FULL</text>
  <text x="${rightBoxX + rightBoxW / 2}" y="${cashPriceY}" font-family="Anton" font-size="78" fill="#FFD700" text-anchor="middle">${esc(cashStr)}</text>

  <!-- Checkered flag strip bottom -->
  ${Array.from({ length: Math.ceil(SIZE / 18) }, (_, i) =>
    `<rect x="${i * 18}" y="${SIZE - checkH}" width="18" height="${checkH}" fill="${i % 2 === 0 ? '#000' : '#fff'}"/>`
  ).join('')}
</svg>`

    step = 'composite'
    const svgBuf = Buffer.from(svg, 'utf8')
    const outBuf = await sharp(bg)
      .composite([{ input: svgBuf, top: 0, left: 0 }])
      .jpeg({ quality: 92 })
      .toBuffer()

    const base64 = `data:image/jpeg;base64,${outBuf.toString('base64')}`
    return NextResponse.json({ base64 })

  } catch (err) {
    console.error(`Watermark failed at [${step}]:`, err)
    return NextResponse.json(
      { error: `Failed at "${step}": ${err.message || String(err)}` },
      { status: 500 }
    )
  }
}

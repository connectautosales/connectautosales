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

function modelFontSize(model) {
  const len = model.replace(/\s/g, '').length
  return Math.min(220, Math.max(72, Math.floor(880 / (len * 0.60))))
}

export async function POST(req) {
  let step = 'init'
  try {
    step = 'parse_form'
    const formData     = await req.formData()
    const photo        = formData.get('photo')
    const year         = formData.get('year')         || ''
    const make         = formData.get('make')         || ''
    const model        = formData.get('model')        || ''
    const trim         = formData.get('trim')         || ''
    const price        = parseFloat(formData.get('price') || 0)
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

    const STRIPE = 20

    // Top text positions
    const urlY    = STRIPE + 48
    const yearY   = urlY + 52
    const mSize   = modelFontSize(model)
    const modelY  = yearY + mSize + 4
    const trimY   = modelY + 10

    // Trim badge
    const trimEl = trim ? (() => {
      const tw = Math.max(90, trim.length * 24 + 44)
      return `
      <rect x="32" y="${trimY}" width="${tw}" height="56" rx="10" fill="#cc0000"/>
      <text x="${32 + tw / 2}" y="${trimY + 39}" font-family="Anton" font-size="32"
        fill="white" text-anchor="middle">${esc(trim.toUpperCase())}</text>`
    })() : ''

    // Phone badge
    const PBW = 380, PBH = 80
    const PBX = SIZE - PBW - 24, PBY = STRIPE + 18

    // Bottom pricing
    const BOTTOM_H  = 220
    const BOTTOM_Y  = SIZE - BOTTOM_H - STRIPE
    const L_BOX_W   = 390
    const R_BOX_X   = SIZE / 2 + 28
    const R_BOX_W   = SIZE - R_BOX_X - 24
    const ARROW_X   = L_BOX_W + 32 + (SIZE / 2 - L_BOX_W - 32) / 2 + 24

    const finLabelY  = BOTTOM_Y + 46
    const finPriceY  = BOTTOM_Y + 128
    const strikeY    = finPriceY - 18

    const discBadgeY = BOTTOM_Y + 10
    const discBadgeH = 46
    const wpifY      = discBadgeY + discBadgeH + 38
    const cashPriceY = BOTTOM_Y + BOTTOM_H - 18

    // Build checkered stripe rows
    const stripeCount = Math.ceil(SIZE / STRIPE)
    const topStripe   = Array.from({ length: stripeCount }, (_, i) =>
      `<rect x="${i * STRIPE}" y="0" width="${STRIPE}" height="${STRIPE}" fill="${i % 2 === 0 ? '#111' : '#fff'}"/>`
    ).join('')
    const botStripe   = Array.from({ length: stripeCount }, (_, i) =>
      `<rect x="${i * STRIPE}" y="${SIZE - STRIPE}" width="${STRIPE}" height="${STRIPE}" fill="${i % 2 === 0 ? '#111' : '#fff'}"/>`
    ).join('')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
<defs><style>${fontFace}</style></defs>

<!-- Top checkered strip -->
${topStripe}

<!-- Website URL -->
<text x="32" y="${urlY}" font-family="Anton" font-size="30" fill="#111111">www.Connect</text>
<text x="${32 + 170}" y="${urlY}" font-family="Anton" font-size="30" fill="#cc0000">Auto-Sales</text>
<text x="${32 + 340}" y="${urlY}" font-family="Anton" font-size="30" fill="#111111">.com</text>

<!-- Year + Make -->
<text x="32" y="${yearY}" font-family="Anton" font-size="50" fill="#111111">${esc(year)}&nbsp;</text>
<text x="${32 + String(year).length * 30 + 12}" y="${yearY}" font-family="Anton" font-size="50" fill="#cc0000">${esc(make.toUpperCase())}</text>

<!-- Model name -->
<text x="28" y="${modelY}"
  font-family="Anton" font-size="${mSize}" fill="#cc0000"
  paint-order="stroke" stroke="#111111" stroke-width="${Math.round(mSize * 0.07)}" stroke-linejoin="round"
  letter-spacing="-1">${esc(model.toUpperCase())}</text>

<!-- Trim badge -->
${trimEl}

<!-- Phone badge -->
<rect x="${PBX}" y="${PBY}" width="${PBW}" height="${PBH}" rx="${PBH / 2}" fill="#111111" stroke="#cc0000" stroke-width="3"/>
<text x="${PBX + 24}" y="${PBY + PBH / 2 + 5}" font-family="Anton" font-size="32" fill="#cc0000">&#9742;</text>
<text x="${PBX + 68}" y="${PBY + PBH / 2 + 14}" font-family="Anton" font-size="38" fill="white">313-413-3400</text>

<!-- Finance box (bottom-left) -->
<rect x="24" y="${BOTTOM_Y}" width="${L_BOX_W}" height="${BOTTOM_H}" rx="16" fill="#111111" fill-opacity="0.88"/>
<text x="${24 + L_BOX_W / 2}" y="${finLabelY}" font-family="Anton" font-size="26"
  fill="#aaaaaa" text-anchor="middle" letter-spacing="2">FINANCE PRICE</text>
<text x="${24 + L_BOX_W / 2}" y="${finPriceY}" font-family="Anton" font-size="76"
  fill="white" text-anchor="middle">${esc(finStr)}</text>
<line x1="${24 + 28}" y1="${strikeY}" x2="${24 + L_BOX_W - 28}" y2="${strikeY}"
  stroke="#cc0000" stroke-width="5"/>

<!-- Arrow -->
<text x="${ARROW_X}" y="${BOTTOM_Y + BOTTOM_H / 2 + 28}"
  font-family="Anton" font-size="80" fill="#cc0000" text-anchor="middle">&#x27A4;</text>

<!-- Cash box (bottom-right) -->
<rect x="${R_BOX_X}" y="${BOTTOM_Y}" width="${R_BOX_W}" height="${BOTTOM_H}" rx="16" fill="#cc0000"/>
<rect x="${R_BOX_X + 14}" y="${discBadgeY}" width="${R_BOX_W - 28}" height="${discBadgeH}" rx="8" fill="#FFD700"/>
<text x="${R_BOX_X + R_BOX_W / 2}" y="${discBadgeY + 33}"
  font-family="Anton" font-size="26" fill="#111111" text-anchor="middle">-$1,000 DISCOUNT!</text>
<text x="${R_BOX_X + R_BOX_W / 2}" y="${wpifY}"
  font-family="Anton" font-size="24" fill="white" text-anchor="middle" letter-spacing="1">WHEN PAY IN FULL</text>
<text x="${R_BOX_X + R_BOX_W / 2}" y="${cashPriceY}"
  font-family="Anton" font-size="80" fill="#FFD700" text-anchor="middle">${esc(cashStr)}</text>

<!-- Bottom checkered strip -->
${botStripe}
</svg>`

    step = 'composite'
    const outBuf = await sharp(bg)
      .composite([{ input: Buffer.from(svg, 'utf8'), top: 0, left: 0 }])
      .jpeg({ quality: 93 })
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

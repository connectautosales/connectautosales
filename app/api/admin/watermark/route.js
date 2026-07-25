export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

const MAKE_WEBHOOK = 'https://hook.eu1.make.com/9q6s7rugszzcmom1grtyov5chk9rjlf7'
// Webhook module in Make.com scenario: 15

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS watermark_jobs (
      id VARCHAR(36) PRIMARY KEY,
      base64 LONGTEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
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

    const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')
    const cashStr       = fmt(price)
    const finStr        = fmt(financePrice && financePrice > price ? financePrice : price + 1000)
    const trimBadgeLine = trim ? `- A small red rounded rectangle badge below the model name with white bold text "${trim.toUpperCase()}"` : ''

    step = 'load_prompt'
    let savedPrompt = ''
    let templateUrl = ''
    try {
      const rows = await prisma.$queryRawUnsafe(`SELECT watermark_prompt, watermark_template_url FROM sitesettings LIMIT 1`)
      savedPrompt = rows[0]?.watermark_prompt || ''
      templateUrl = rows[0]?.watermark_template_url || ''
    } catch { /* use default */ }

    const defaultPrompt = `You are a graphic designer adding text and shape overlays onto a real car dealership photo. DO NOT alter, repaint, redraw, or modify the car or background in any way. The photo is the background — keep it 100% untouched.

Output: 1080x1080 square image.

OVERLAY ELEMENTS (add exactly these, nothing else):

1. TOP EDGE — Checkered strip:
A crisp black-and-white only checkered flag strip (NO yellow, NO color, ONLY pure black #000000 and pure white #ffffff squares) spanning the full width at the very top edge. Each square ~18px. This is a classic racing flag pattern.

2. TOP-LEFT — Website URL:
"www.Connect" in black bold sans-serif, "Auto-Sales" in bright red bold, ".com" in black bold. Font size ~28px. Positioned just below the checkered strip on the left side.

3. TOP-LEFT — Year and Make:
"{{year}} {{make}}" in large black bold italic text, font size ~48px, below the URL line.

4. TOP-LEFT — Model name (LARGEST element):
"{{model}}" in an enormous bold italic font — this must be the biggest text on the image, spanning nearly the full width. Use a red-to-dark-red gradient fill with a thick solid black outline/stroke (at least 4px). Font size approximately 120-150px.

5. TOP-LEFT — Trim badge (only if trim provided):
A small red rounded rectangle badge with white bold text "{{trim}}" inside. Positioned to the right of or below the model name.

6. TOP-RIGHT — Phone number badge:
A large black rounded rectangle with a 3px red border. Inside: a red telephone/phone icon on the left side, then "313-413-3400" in large white bold text. This badge is prominent and takes up the full top-right corner area.

7. BOTTOM-LEFT — Finance price box:
A solid black rounded rectangle box (not transparent). Inside: "FINANCE PRICE" in small white bold uppercase text on top line, then "{{finance_price}}" in large white bold text below it, with a red diagonal strikethrough line crossing out the price.

8. BOTTOM-CENTER — Arrow:
A large solid red arrow (→) pointing right, centered between the two price boxes.

9. BOTTOM-RIGHT — Cash price box:
A solid red rounded rectangle box (larger than the finance box). At the top: a yellow pill/badge with black bold text "-$1,000 DISCOUNT!". Below: "WHEN PAY IN FULL" in small white text. Below that: "{{cash_price}}" in very large bold yellow/gold text — this is the most prominent price.

STRICT RULES:
- Do NOT modify the car, background, sky, lot, or any part of the photo
- Do NOT add any extra badges, watermarks, or text not listed above (no "Clean Title", "Great Value", "Certified", "Luxury", etc.)
- Do NOT cover the car with overlays — overlays go in corners/edges only
- Maintain high contrast — all text must be clearly readable
- Style: professional automotive advertisement, bold and high-impact`

    const rawPrompt = savedPrompt || defaultPrompt
    const prompt = rawPrompt
      .replace(/\{\{year\}\}/g, year)
      .replace(/\{\{make\}\}/g, make.toUpperCase())
      .replace(/\{\{model\}\}/g, model.toUpperCase())
      .replace(/\{\{trim\}\}/g, trim.toUpperCase())
      .replace(/\{\{cash_price\}\}/g, cashStr)
      .replace(/\{\{finance_price\}\}/g, finStr)
      .replace(/\{\{trim_line\}\}/g, trimBadgeLine)

    step = 'upload_photo'
    const bytes  = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const sharp  = (await import('sharp')).default
    // Convert to PNG (gpt-image-2 requires PNG)
    const pngBuf = await sharp(buffer).png().toBuffer()

    // Upload to Vercel Blob to get a public URL
    const { put } = await import('@vercel/blob')
    const token = process.env.STORAGE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
    const blobResult = await put(`watermark-input/${Date.now()}.png`, pngBuf, {
      access: 'public',
      token,
    })
    const photoUrl = blobResult.url

    step = 'create_job'
    await ensureTable()
    const requestId = randomUUID()
    await prisma.$executeRawUnsafe(
      `INSERT INTO watermark_jobs (id) VALUES (?)`, requestId
    )

    step = 'call_make'
    // Fire webhook — Make.com will call our callback when done
    const makeRes = await fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoUrl, templateUrl, prompt, requestId }),
    })
    if (!makeRes.ok) {
      throw new Error(`Make.com webhook failed: ${makeRes.status}`)
    }

    // Return requestId immediately — frontend will poll /api/admin/watermark-status
    return NextResponse.json({ requestId })

  } catch (err) {
    console.error(`Watermark failed at [${step}]:`, err)
    return NextResponse.json(
      { error: `Failed at "${step}": ${err.message || String(err)}` },
      { status: 500 }
    )
  }
}

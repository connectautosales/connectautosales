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
    try {
      const rows = await prisma.$queryRawUnsafe(`SELECT watermark_prompt FROM sitesettings LIMIT 1`)
      savedPrompt = rows[0]?.watermark_prompt || ''
    } catch { /* use default */ }

    const defaultPrompt = `This is a PHOTO EDITING task. You are given a real dealership car photo. Add graphic text overlays on top of it exactly like a professional designer would in Photoshop. The photo must remain a real photograph — do NOT illustrate, paint, or cartoon-ify anything.

KEEP THE CAR PHOTO 100% REALISTIC AND UNCHANGED.

ADD THESE OVERLAYS:

TOP-LEFT:
- Thin checkered flag border strip at the very top edge
- "www.ConnectAuto-Sales.com" — bold black text, "Auto-Sales" in red
- "{{year}} {{make}}" — large black bold text
- "{{model}}" — HUGE red bold text with black stroke, nearly full width
- Red rounded badge: white bold "{{trim}}"

TOP-RIGHT:
- Black rounded pill, red border, phone icon, white bold "313-413-3400"

BOTTOM-LEFT black box:
- "FINANCE PRICE" small white label
- "{{finance_price}}" large white text, red strikethrough ONCE only

BOTTOM-CENTER: Red arrow →

BOTTOM-RIGHT red box:
- Yellow badge: "-$1,000 DISCOUNT!"
- "WHEN PAY IN FULL" white small text
- "{{cash_price}}" very large yellow bold text

The background car photo must remain a real photograph. No cartoon, no illustration, no painting effect.`

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
    // Fire and forget — Make.com will call our callback when done
    fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoUrl, prompt, requestId }),
    }).catch(e => console.error('Make.com webhook error:', e))

    step = 'poll_result'
    const deadline = Date.now() + 52000
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 2500))
      const rows = await prisma.$queryRawUnsafe(
        `SELECT base64 FROM watermark_jobs WHERE id = ? AND base64 IS NOT NULL`, requestId
      )
      if (rows[0]?.base64) {
        await prisma.$executeRawUnsafe(`DELETE FROM watermark_jobs WHERE id = ?`, requestId)
        return NextResponse.json({ base64: rows[0].base64 })
      }
    }

    // Cleanup timed-out job
    await prisma.$executeRawUnsafe(`DELETE FROM watermark_jobs WHERE id = ?`, requestId)
    throw new Error('Image generation timed out. Please try again.')

  } catch (err) {
    console.error(`Watermark failed at [${step}]:`, err)
    return NextResponse.json(
      { error: `Failed at "${step}": ${err.message || String(err)}` },
      { status: 500 }
    )
  }
}

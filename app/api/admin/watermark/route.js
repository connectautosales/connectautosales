export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { toFile } from 'openai'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'

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

    const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')
    const cashStr    = fmt(price)
    const finStr     = fmt(financePrice && financePrice > price ? financePrice : price + 1000)
    const trimBadgeLine = trim ? `- A small red rounded rectangle badge below the model name with white bold text "${trim.toUpperCase()}"` : ''

    step = 'load_prompt'
    let savedPrompt = ''
    try {
      const rows = await prisma.$queryRawUnsafe(`SELECT watermark_prompt FROM sitesettings LIMIT 1`)
      savedPrompt = rows[0]?.watermark_prompt || ''
    } catch { /* use default */ }

    step = 'init_openai'
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    step = 'prepare_image'
    const bytes  = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const sharp  = (await import('sharp')).default
    const resized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 6 })
      .toBuffer()
    const imageFile = await toFile(resized, 'car.png', { type: 'image/png' })

    const defaultPrompt = `This is a PHOTO EDITING task, not image generation. You are given a real dealership car photo. Your job is to add graphic text overlays on top of it — like a designer would in Photoshop. The photo must look like a real photograph throughout.

CRITICAL: The car and its surroundings must look like a REAL PHOTOGRAPH — not illustrated, not painted, not cartoon. Preserve the original photographic realism of the vehicle and background completely.

Use the layout and style from the reference image provided.

ADD THESE OVERLAYS ON TOP OF THE REAL PHOTO:

TOP-LEFT:
- Thin checkered flag border strip at the very top edge
- "www.ConnectAuto-Sales.com" — bold black text, "Auto-Sales" in red
- "{{year}} {{make}}" — large black bold text
- "{{model}}" — HUGE red bold text with black stroke, nearly full width, largest element
- Red rounded badge: white bold "{{trim}}"

TOP-RIGHT:
- Black rounded pill, red border, phone icon, white bold "313-413-3400"

BOTTOM-LEFT black box:
- "FINANCE PRICE" small white label
- "{{finance_price}}" large white text, red strikethrough line through it ONLY ONCE

BOTTOM-CENTER:
- Red arrow →

BOTTOM-RIGHT red box:
- Yellow badge top: "-$1,000 DISCOUNT!"
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

    step = 'load_reference'
    let refFile = null
    try {
      const refPath = path.join(process.cwd(), 'public', 'images', 'ad-template-reference.png')
      const refBuf  = fs.readFileSync(refPath)
      const refResized = await sharp(refBuf)
        .resize(1024, 1024, { fit: 'cover' })
        .png()
        .toBuffer()
      refFile = await toFile(refResized, 'reference.png', { type: 'image/png' })
    } catch { /* no reference image */ }

    step = 'generate_image'
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: refFile ? [refFile, imageFile] : imageFile,
      prompt,
      n: 1,
      size: '1024x1024',
    })

    step = 'encode_result'
    let base64
    if (response.data[0].b64_json) {
      base64 = `data:image/png;base64,${response.data[0].b64_json}`
    } else if (response.data[0].url) {
      const imgRes = await fetch(response.data[0].url)
      const imgBuf = await imgRes.arrayBuffer()
      base64 = `data:image/png;base64,${Buffer.from(imgBuf).toString('base64')}`
    } else {
      throw new Error('No image data in response')
    }

    return NextResponse.json({ base64 })

  } catch (err) {
    console.error(`Watermark failed at [${step}]:`, err)
    return NextResponse.json(
      { error: `Failed at "${step}": ${err.message || String(err)}` },
      { status: 500 }
    )
  }
}

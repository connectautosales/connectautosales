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
    const formData = await req.formData()
    const photo        = formData.get('photo')
    const year         = formData.get('year')         || ''
    const make         = formData.get('make')         || ''
    const model        = formData.get('model')        || ''
    const trim         = formData.get('trim')         || ''
    const price        = parseFloat(formData.get('price') || 0)
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
    const sharp = (await import('sharp')).default

    // Resize photo to 1024x1024
    const resized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'cover', position: 'centre' })
      .png({ compressionLevel: 6 })
      .toBuffer()
    const imageFile = await toFile(resized, 'car.png', { type: 'image/png' })

    // Build mask: transparent = AI can edit, opaque black = preserve original
    // Top 22% = transparent (header area)
    // Middle 53% = black/opaque (vehicle — must NOT be altered)
    // Bottom 25% = transparent (pricing area)
    const SIZE = 1024
    const headerH  = Math.round(SIZE * 0.22)  // 225px
    const pricingH = Math.round(SIZE * 0.25)  // 256px
    const vehicleH = SIZE - headerH - pricingH // 543px

    // RGBA mask: alpha=0 means editable, alpha=255 means locked
    const maskData = Buffer.alloc(SIZE * SIZE * 4)
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const i = (y * SIZE + x) * 4
        if (y < headerH || y >= headerH + vehicleH) {
          // editable zone — fully transparent
          maskData[i] = 0; maskData[i+1] = 0; maskData[i+2] = 0; maskData[i+3] = 0
        } else {
          // vehicle zone — fully opaque (preserve)
          maskData[i] = 0; maskData[i+1] = 0; maskData[i+2] = 0; maskData[i+3] = 255
        }
      }
    }
    const maskBuf = await sharp(maskData, { raw: { width: SIZE, height: SIZE, channels: 4 } })
      .png()
      .toBuffer()
    const maskFile = await toFile(maskBuf, 'mask.png', { type: 'image/png' })

    const defaultPrompt = `Replicate the exact graphic style of the FIRST reference image, but use the car from the SECOND photo as the vehicle. The car photo background must remain completely unaltered — do NOT repaint, recolor, or alter the vehicle or its background in any way.

Output: 1080x1080 square advertisement image.

OVERLAY ELEMENTS TO ADD (matching reference style exactly):

TOP-LEFT:
- Thin checkered flag strip across the very top
- "www.ConnectAuto-Sales.com" bold text, "Auto-Sales" in red
- "{{year}} {{make}}" in large black bold text on next line
- "{{model}}" in MASSIVE ultra-bold red text with black outline — largest text element, nearly full width
- Red rounded badge below model name: white bold text "{{trim}}"

TOP-RIGHT:
- Black rounded rectangle, red border, red phone icon + bold white "313-413-3400"

BOTTOM-LEFT floating black box:
- Label: "FINANCE PRICE" in small white bold
- Price: "{{finance_price}}" in large white bold — show this price ONCE with a red strikethrough line across it. DO NOT show this price a second time without strikethrough.

BOTTOM-CENTER:
- Bold red arrow → pointing right

BOTTOM-RIGHT floating red box:
- Yellow pill badge at top: "-$1,000 DISCOUNT!" in black bold
- "WHEN PAY IN FULL" in small white text
- "{{cash_price}}" in very large yellow/gold bold text

RULES:
- Vehicle and background photo must be 100% preserved — no alterations whatsoever
- Finance price appears ONLY ONCE in the bottom-left box, with strikethrough
- Cash price appears ONLY ONCE in the bottom-right box, no strikethrough
- No extra badges, descriptions, or text beyond what is listed above`

    const rawPrompt = savedPrompt || defaultPrompt
    const prompt = rawPrompt
      .replace(/\{\{year\}\}/g, year)
      .replace(/\{\{make\}\}/g, make.toUpperCase())
      .replace(/\{\{model\}\}/g, model.toUpperCase())
      .replace(/\{\{trim\}\}/g, trim.toUpperCase())
      .replace(/\{\{cash_price\}\}/g, cashStr)
      .replace(/\{\{finance_price\}\}/g, finStr)
      .replace(/\{\{trim_line\}\}/g, trimBadgeLine)

    step = 'generate_image'
    // Try to load reference template image to guide AI style
    let refFile = null
    try {
      const refPath = path.join(process.cwd(), 'public', 'images', 'ad-template-reference.png')
      const refBuf  = fs.readFileSync(refPath)
      const refResized = await sharp(refBuf)
        .resize(1024, 1024, { fit: 'cover' })
        .png()
        .toBuffer()
      refFile = await toFile(refResized, 'reference.png', { type: 'image/png' })
    } catch { /* no reference image, proceed without */ }

    const editParams = {
      model: 'gpt-image-1',
      image: refFile ? [refFile, imageFile] : imageFile,
      mask: maskFile,
      prompt,
      n: 1,
      size: '1024x1024',
    }
    const response = await openai.images.edit(editParams)

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

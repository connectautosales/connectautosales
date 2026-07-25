export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { toFile } from 'openai'
import { prisma } from '@/lib/prisma'

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
    const resized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 6 })
      .toBuffer()
    const imageFile = await toFile(resized, 'car.png', { type: 'image/png' })

    const defaultPrompt = `You are overlaying graphic text elements onto the uploaded car photo. DO NOT repaint, redraw, or alter the vehicle or background in any way. The uploaded photo is the complete background — keep it 100% intact.

Output: 1080x1080 square image. The uploaded photo fills the entire canvas exactly as-is.

Add these graphic overlays on top of the photo:

TOP-LEFT AREA:
- A thin horizontal checkered flag strip (black and white squares) running across the very top edge
- Below it: website text "www.ConnectAuto-Sales.com" — black bold text, "Auto-Sales" portion in red
- Below that on next line: "{{year}} {{make}}" in large black bold text
- Below that: "{{model}}" in a MASSIVE font — ultra-bold, red gradient color (bright red to dark red), with a thick black outline/stroke. This should be the largest text on the entire image, spanning almost the full width
- Below the model name: a red rounded rectangle badge with white bold text "{{trim}}" (only if trim is provided)

TOP-RIGHT AREA:
- A black rounded rectangle with a red border outline, containing: a red phone icon on the left, then bold white text "313-413-3400" — large and prominent

BOTTOM-LEFT (floating box, does not span full width):
- A small black rounded rectangle box, semi-transparent black background
- Inside: "FINANCE PRICE" in small bold white text on top
- Below: "{{finance_price}}" in large bold white text with a red diagonal strikethrough line across the price number

BOTTOM-CENTER:
- A bold solid red arrow pointing right → between the two pricing boxes

BOTTOM-RIGHT (floating box, larger than left box):
- A large red rounded rectangle box
- At the top of this box: a small yellow badge/pill with black bold text "-$1,000 DISCOUNT!"
- Below: "WHEN PAY IN FULL" in small white text
- Below: "{{cash_price}}" in very large bold yellow/gold text

STRICT RULES:
- The vehicle photo background must remain completely unaltered — same colors, same lighting, same background
- Do NOT add any banners, strips, or overlays that cover the vehicle itself
- Do NOT add: Clean Title Guaranteed, Great Value, Buy With Confidence, Luxury & Performance, Reliable & Efficient, or any other badges not listed above
- All text elements float on top of the photo naturally
- Overall style: bold, high-contrast automotive advertisement`

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
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
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

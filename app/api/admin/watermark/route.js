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

    const defaultPrompt = `Create a professional automotive dealership advertisement. Output size: 640x640 square. Premium red, black and white color theme.

MASTER TEMPLATE RULES — DO NOT DEVIATE:

HEADER:
- Top left: Connect Auto Sales logo (checkered flag + bold text)
- Top right: Black pill badge with red border, phone icon, bold white text "313-413-3400"

VEHICLE TITLE (left side):
- Line 1: "{{year}} {{make}}" — bold white text, medium size
- Line 2: "{{model}}" — very large bold white text
- Line 3: {{trim_line}}

VEHICLE IMAGE:
- Largest element on the page, placed on the right side
- Use uploaded photo exactly — do NOT repaint, recolor, or alter the vehicle
- Preserve original color, reflections, wheels, and lighting
- Background: blend the original photo with a mild semi-realistic dealership lot enhancement. The vehicle must stand out significantly more than the background. Not fully AI, not fully original.

BOTTOM PRICING LAYOUT:
- Bottom left black box: label "FINANCE PRICE" (small grey text), then "{{finance_price}}" in large white bold with a red horizontal strike-through line across it
- Bottom center: large bold red arrow →
- Bottom right red box: label "WHEN PAY IN FULL" (small white text), then "{{cash_price}}" in large bold yellow text
- Yellow banner across bottom: "-$1,000 DISCOUNT!"

REMOVE PERMANENTLY — never include any of these:
- Clean Title Guaranteed
- Great Value
- Buy With Confidence
- Luxury & Performance
- Reliable & Efficient
- Great Price Great Value
- Any extra descriptions, badges, or text not listed above

Same font hierarchy, trim badge style, pricing box style, and overall composition as the master Connect Auto Sales template.`

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

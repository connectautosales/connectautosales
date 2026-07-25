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
    // Resize to max 1024px and convert to PNG for OpenAI
    const sharp = (await import('sharp')).default
    const resized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 6 })
      .toBuffer()
    const imageFile = await toFile(resized, 'car.png', { type: 'image/png' })

    const defaultPrompt = `Create a professional automotive dealership advertisement using the uploaded vehicle photo. Style: Modern luxury dealership advertising. Canvas: Square (1080x1080). Use the uploaded vehicle photo exactly as provided. Do not change the vehicle. Place the vehicle large on the right side. On the left side display: {{year}} {{make}} {{model}} — large bold white text. {{trim_line}} Top right: Connect Auto Sales logo. Below logo: 313-413-3400. Bottom pricing box: LEFT: Finance Price {{finance_price}} — use a red strike-through line across the finance price. Center: Large red arrow →. RIGHT: When Pay In Full {{cash_price}}. Bottom: Yellow banner -$1,000 DISCOUNT! Use a premium red, black and white color theme. Professional dealership marketing. No additional feature list. No descriptions. No extra badges. No unnecessary decorations. High-end commercial automotive advertising quality.`

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

export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { toFile } from 'openai'

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
    const trimLine   = trim ? ` ${trim.toUpperCase()}` : ''

    step = 'init_openai'
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    step = 'prepare_image'
    const bytes  = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const imageFile = await toFile(buffer, 'car.png', { type: 'image/png' })

    const prompt = `You are adding a professional car dealership advertisement overlay on top of this car photo. Keep the car photo fully visible as the background. Add these exact overlay elements:

TOP LEFT: ConnectAuto-Sales.com logo text with checkered flag racing design in black and white, website URL "www.ConnectAuto-Sales.com" in stylized text

TOP RIGHT: A black rounded rectangle badge with a thick red border. Inside: a red circle with a white phone handset icon on the left, then bold white text "313-413-3400" in large font

LEFT SIDE (middle area):
- Line 1: "${year} ${make.toUpperCase()}" in bold white text, medium size
- Line 2: "${model.toUpperCase()}${trimLine}" in VERY LARGE bold red text, taking up significant space
${trim ? `- Below model name: a small red rounded badge with white text "${trim.toUpperCase()}"` : ''}

BOTTOM LEFT: A black semi-transparent rounded box containing:
- Small grey text "FINANCE PRICE" at top
- Large white bold text "${finStr}" with a red diagonal strikethrough line across it

CENTER BOTTOM: A large red arrow pointing right (→)

BOTTOM RIGHT: Two stacked sections:
- Top section: bright yellow rounded rectangle with bold black text "-$1,000 DISCOUNT!"
- Bottom section: dark red rounded rectangle with:
  - White text "WHEN PAY IN FULL"
  - Very large bold yellow text "${cashStr}"

Style: Professional car dealership advertisement, high contrast, bold graphics. The overlay elements should be clearly visible but the car should remain the main focus.`

    step = 'generate_image'
    const response = await openai.images.edit({
      model: 'gpt-image-2',
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

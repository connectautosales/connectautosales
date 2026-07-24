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
    // Resize to max 1024px and convert to PNG for OpenAI
    const sharp = (await import('sharp')).default
    const resized = await sharp(buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 6 })
      .toBuffer()
    const imageFile = await toFile(resized, 'car.png', { type: 'image/png' })

    const prompt = `Add a professional car dealership advertisement overlay to this car photo. The car must stay fully visible as the background. Replicate this EXACT layout:

TOP-LEFT CORNER: A logo area showing a small racing checkered flag icon followed by "ConnectAuto-Sales.com" in bold stylized text, with "www.ConnectAuto-Sales.com" in smaller text below it. Black/white colors.

TOP-RIGHT CORNER: A wide black pill/badge with a thick red border. Left side has a red filled circle with a white phone handset icon. Right side has bold white text "313-413-3400" in very large font (about 36px).

LEFT SIDE TEXT BLOCK (upper-middle area):
- "${year} ${make.toUpperCase()}" in bold white text, medium size (~46px)
- "${model.toUpperCase()}" in MASSIVE bold italic red text with a strong black drop shadow/outline, taking up most of the left side height. Font size very large (~180-220px). The text should look 3D and dramatic like a sports advertisement.
${trim ? `- A small red rounded rectangle badge below the model name with white bold text "${trim.toUpperCase()}"` : ''}

BOTTOM-LEFT: A dark black semi-transparent rounded rectangle box containing:
- Top: small grey uppercase text "FINANCE PRICE"
- Bottom: large bold white text "${finStr}" with a red horizontal strikethrough line drawn across it

BOTTOM-CENTER: A large bold red arrow (→) pointing right

BOTTOM-RIGHT: Two stacked boxes:
- Top box: bright yellow rounded rectangle with bold black text "-$1,000 DISCOUNT!"
- Bottom box: dark crimson/red rounded rectangle with white uppercase text "WHEN PAY IN FULL" on top and very large bold yellow text "${cashStr}" below it

IMPORTANT: Keep exact proportions. The model name must be the dominant visual element on the left. All text must be crisp and legible. Professional car dealership ad style.`

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

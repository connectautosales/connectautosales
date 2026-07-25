import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({ ok: true, route: 'watermark-callback' })
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || ''

    let requestId, imageBase64

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      requestId = form.get('requestId')
      const imageFile = form.get('image')
      if (imageFile && typeof imageFile !== 'string') {
        const bytes = await imageFile.arrayBuffer()
        imageBase64 = `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`
      } else {
        imageBase64 = imageFile
      }
    } else {
      const body = await req.json()
      requestId = body.requestId
      const image = body.image
      if (image) {
        imageBase64 = image.startsWith('data:') ? image : `data:image/png;base64,${image}`
      }
    }

    if (!requestId || !imageBase64) {
      return NextResponse.json({ error: 'Missing requestId or image' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE watermark_jobs SET base64 = ? WHERE id = ?`,
      imageBase64, requestId
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

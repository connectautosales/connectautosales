import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { put } = await import('@vercel/blob')
    const token = process.env.STORAGE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
    const ext = file.name.split('.').pop() || 'png'
    const result = await put(`watermark-template/template-${Date.now()}.${ext}`, buffer, {
      access: 'public',
      token,
    })

    return NextResponse.json({ url: result.url })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

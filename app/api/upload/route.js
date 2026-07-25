import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    const ext = file.name.split('.').pop() || 'bin'
    const filename = `inspections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const token = process.env.STORAGE_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN
    const blob = await put(filename, buffer, {
      access: 'public',
      token,
      contentType: file.type || 'application/octet-stream',
    })
    return NextResponse.json({ url: blob.url })
  } catch (e) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 })
  }
}

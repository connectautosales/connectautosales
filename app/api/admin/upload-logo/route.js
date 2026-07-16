import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('logo')
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext     = file.name.split('.').pop().toLowerCase()
    const allowed = ['png', 'jpg', 'jpeg', 'webp', 'svg']
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })

    const fileName = `logo.${ext}`
    const dir      = path.join(process.cwd(), 'public', 'images')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, fileName), buffer)

    return NextResponse.json({ logoUrl: `/images/${fileName}` })
  } catch (e) {
    console.error('Logo upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let formData
  try {
    formData = await req.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const carId = formData.get('carId')
  const folder = formData.get('folder')

  if (!file || typeof file === 'string') return Response.json({ error: 'No file provided' }, { status: 400 })
  if (!carId) return Response.json({ error: 'No carId provided' }, { status: 400 })
  if (!folder || !['main-photos', 'damage-history'].includes(folder)) {
    return Response.json({ error: 'Invalid folder: ' + folder }, { status: 400 })
  }

  const nameParts = (file.name || '').split('.')
  const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : ''
  if (!['jpg', 'jpeg', 'jfif', 'png', 'webp', 'avif', 'gif'].includes(ext)) {
    return Response.json({ error: `File type ".${ext}" not allowed. Use jpg, png, or webp.` }, { status: 400 })
  }

  const filename = `vehicles/${carId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, { access: 'public' })
    return Response.json({ url: blob.url })
  }

  // Local dev fallback
  const { writeFile, mkdir } = await import('fs/promises')
  const { join } = await import('path')
  const dir = join(process.cwd(), 'public', 'uploads', String(carId), folder)
  await mkdir(dir, { recursive: true })
  const localName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  await writeFile(join(dir, localName), Buffer.from(await file.arrayBuffer()))
  return Response.json({ url: `/uploads/${carId}/${folder}/${localName}` })
}

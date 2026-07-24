import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { sendMail } from '@/lib/mailer'
import { inspectionCustomer, inspectionAdmin } from '@/lib/emailTemplates'

const uploadOneFile = async (file, field, index) => {
  try {
    if (!file || typeof file === 'string' || file.size === 0) return null
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = file.name.split('.').pop() || 'pdf'
      const filename = `inspections/${field}-${Date.now()}-${index}.${ext}`
      const blob = await put(filename, file, { access: 'public' })
      return blob.url
    }
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'inspections')
    await mkdir(uploadDir, { recursive: true })
    const ext = file.name.split('.').pop() || 'pdf'
    const filename = `${field}-${Date.now()}-${index}.${ext}`
    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
    return `/uploads/inspections/${filename}`
  } catch (e) {
    console.error(`File upload failed for ${field}[${index}]:`, e.message)
    return null
  }
}

const uploadFiles = async (field, formData) => {
  const files = formData.getAll(field).filter(f => f && typeof f !== 'string' && f.size > 0)
  if (!files.length) return null
  const urls = await Promise.all(files.map((f, i) => uploadOneFile(f, field, i)))
  const valid = urls.filter(Boolean)
  if (!valid.length) return null
  return valid.length === 1 ? valid[0] : JSON.stringify(valid)
}

export async function POST(req) {
  try {
    const formData = await req.formData()

    const firstName    = formData.get('firstName') || ''
    const lastName     = formData.get('lastName') || ''
    const phone        = formData.get('phone') || ''
    const email        = formData.get('email') || ''
    const partsChanged = formData.get('partsChanged') || ''

    const [salvageTitle, validId, receipts] = await Promise.all([
      uploadFiles('salvageTitle', formData),
      uploadFiles('validId', formData),
      uploadFiles('receipts', formData),
    ])

    await prisma.$executeRaw`
      INSERT INTO salvageinspection (firstName, lastName, phone, email, partsChanged, salvageTitle, validId, receipts, status, createdAt)
      VALUES (${firstName}, ${lastName}, ${phone}, ${email}, ${partsChanged}, ${salvageTitle}, ${validId}, ${receipts}, 'new', NOW())
    `
    const rows = await prisma.$queryRaw`SELECT * FROM salvageinspection ORDER BY id DESC LIMIT 1`
    const inspection = rows[0]

    await Promise.allSettled([
      email && sendMail({
        to: email,
        subject: 'Documents Received — Connect Auto Sales',
        html: inspectionCustomer({ firstName }),
      }),
      sendMail({
        to: process.env.NOTIFY_EMAIL,
        subject: `New Inspection Request — ${firstName} ${lastName}`,
        html: inspectionAdmin({ firstName, lastName, phone, email }),
      }),
    ])

    return NextResponse.json({ ok: true, id: inspection?.id })
  } catch (e) {
    console.error('Inspection submit error:', e)
    return NextResponse.json({ error: 'Failed to submit documents.' }, { status: 500 })
  }
}

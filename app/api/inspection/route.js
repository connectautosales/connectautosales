import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { sendMail } from '@/lib/mailer'
import { inspectionCustomer, inspectionAdmin } from '@/lib/emailTemplates'

const uploadFile = async (field, formData) => {
  try {
    const file = formData.get(field)
    if (!file || typeof file === 'string') return null

    // Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const nameParts = file.name.split('.')
      const ext = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'pdf'
      const filename = `inspections/${field}-${Date.now()}.${ext}`
      const blob = await put(filename, file, { access: 'public' })
      return blob.url
    }

    // Fallback: local filesystem (dev only)
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'inspections')
    await mkdir(uploadDir, { recursive: true })
    const nameParts = file.name.split('.')
    const ext = nameParts.length > 1 ? nameParts.pop() : 'pdf'
    const filename = `${field}-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
    return `/uploads/inspections/${filename}`
  } catch (e) {
    console.error(`File upload failed for ${field}:`, e.message)
    return null
  }
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
      uploadFile('salvageTitle', formData),
      uploadFile('validId', formData),
      uploadFile('receipts', formData),
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

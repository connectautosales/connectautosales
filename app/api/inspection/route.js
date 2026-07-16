import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req) {
  try {
    const formData = await req.formData()

    const firstName  = formData.get('firstName') || ''
    const lastName   = formData.get('lastName') || ''
    const phone      = formData.get('phone') || ''
    const email      = formData.get('email') || ''
    const partsChanged = formData.get('partsChanged') || ''

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'inspections')
    await mkdir(uploadDir, { recursive: true })

    const saveFile = async (field) => {
      const file = formData.get(field)
      if (!file || typeof file === 'string') return null
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const nameParts = file.name.split('.')
      const ext = nameParts.length > 1 ? nameParts.pop() : (file.type.split('/')[1] || 'pdf')
      const filename = `${field}-${Date.now()}.${ext}`
      await writeFile(path.join(uploadDir, filename), buffer)
      return `/uploads/inspections/${filename}`
    }

    const [salvageTitle, validId, receipts] = await Promise.all([
      saveFile('salvageTitle'),
      saveFile('validId'),
      saveFile('receipts'),
    ])

    const inspection = await prisma.salvageInspection.create({
      data: { firstName, lastName, phone, email, partsChanged, salvageTitle, validId, receipts },
    })

    return NextResponse.json({ ok: true, id: inspection.id })
  } catch (e) {
    console.error('Inspection submit error:', e)
    return NextResponse.json({ error: 'Failed to submit documents.' }, { status: 500 })
  }
}

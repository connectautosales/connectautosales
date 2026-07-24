import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function makeSlug(year, make, model, trim, id) {
  const base = `${year} ${make} ${model} ${trim || ''}`.trim()
  const slug = base.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return `${slug}-${id}`
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const numId = parseInt(id)
    const data = await req.json()

    delete data.id
    if (data.vin === '' || data.vin === undefined) data.vin = null

    // Always regenerate slug from year/make/model/trim
    data.slug = makeSlug(data.year, data.make, data.model, data.trim, numId)

    const sets = Object.keys(data).map(k => `\`${k}\` = ?`).join(', ')
    const vals = [...Object.values(data), numId]
    await prisma.$executeRawUnsafe(`UPDATE car SET ${sets} WHERE id = ?`, ...vals)
    const rows = await prisma.$queryRaw`SELECT * FROM car WHERE id = ${numId} LIMIT 1`
    return NextResponse.json(rows[0])
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.$executeRaw`DELETE FROM car WHERE id = ${parseInt(id)}`
  return NextResponse.json({ ok: true })
}

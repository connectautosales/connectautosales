import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await req.json()

    // Remove id from data to avoid conflicts, normalize unique nullable fields
    delete data.id
    if (data.vin === '' || data.vin === undefined) data.vin = null
    if (data.slug === '' || data.slug === undefined) data.slug = null

    const car = await prisma.car.update({ where: { id: parseInt(id) }, data })
    return NextResponse.json(car)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.car.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ ok: true })
}

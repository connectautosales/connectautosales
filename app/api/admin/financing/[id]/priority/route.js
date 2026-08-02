import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { priority } = await req.json()

  const allowed = ['high', 'medium', 'low', null]
  if (!allowed.includes(priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
  }

  await prisma.$executeRawUnsafe(
    `UPDATE financingapplication SET priority = ? WHERE id = ?`,
    priority, parseInt(id)
  )

  return NextResponse.json({ ok: true })
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { featured } = await req.json()

  await prisma.$executeRawUnsafe(`UPDATE car SET featured = ? WHERE id = ?`, featured ? 1 : 0, parseInt(id))
  return NextResponse.json({ ok: true, featured })
}

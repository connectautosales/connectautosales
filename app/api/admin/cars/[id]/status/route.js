import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  const allowed = ['available', 'sold', 'hidden']
  if (!allowed.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  await prisma.$executeRawUnsafe(`UPDATE car SET status = ? WHERE id = ?`, status, parseInt(id))
  return NextResponse.json({ ok: true, status })
}

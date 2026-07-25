import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// One-time endpoint to create super-admin account
// Requires any logged-in admin, and no super-admin must already exist
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, password, name } = await req.json()
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password, and name required' }, { status: 400 })
  }

  // Check if super-admin already exists
  try {
    const existing = await prisma.$queryRaw`SELECT id FROM admin WHERE role = 'super-admin' LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Super-admin already exists' }, { status: 409 })
    }
  } catch {
    return NextResponse.json({ error: 'Migration not run yet — call /api/admin/migrate first' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 10)

  // Check if email already exists (update role) or create new
  const existingEmail = await prisma.$queryRaw`SELECT id FROM admin WHERE email = ${email} LIMIT 1`
  if (existingEmail.length > 0) {
    await prisma.$executeRaw`UPDATE admin SET role = 'super-admin', name = ${name}, password = ${hash} WHERE email = ${email}`
    return NextResponse.json({ ok: true, action: 'updated existing account to super-admin' })
  }

  await prisma.$executeRaw`
    INSERT INTO admin (email, password, name, role) VALUES (${email}, ${hash}, ${name}, 'super-admin')
  `
  return NextResponse.json({ ok: true, action: 'created new super-admin account' })
}

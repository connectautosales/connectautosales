import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await sendMail({
      to: session.user.email,
      subject: 'Test Email — Connect Auto Sales',
      html: '<p>Email is working correctly.</p>',
    })
    return NextResponse.json({ ok: true, message: 'Email sent to ' + session.user.email })
  } catch (err) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: 500 })
  }
}

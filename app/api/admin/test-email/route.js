import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notifyEmail = process.env.NOTIFY_EMAIL
  const smtpUser = process.env.SMTP_USER

  try {
    await sendMail({
      to: notifyEmail,
      subject: 'Test Email — Connect Auto Sales',
      html: '<p>Email is working correctly. NOTIFY_EMAIL is set and receiving.</p>',
    })
    return NextResponse.json({
      ok: true,
      sentTo: notifyEmail,
      from: smtpUser,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message, code: err.code, notifyEmail, smtpUser }, { status: 500 })
  }
}

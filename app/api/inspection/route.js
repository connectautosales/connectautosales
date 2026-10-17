import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { inspectionCustomer, inspectionAdmin } from '@/lib/emailTemplates'
import { verifyRecaptcha } from '@/lib/recaptcha'

export async function POST(req) {
  try {
    const data = await req.json()

    const captcha = await verifyRecaptcha(data.recaptchaToken)
    if (!captcha.success || captcha.score < 0.5) {
      return NextResponse.json({ error: 'Bot detected. Please try again.' }, { status: 403 })
    }
    const { firstName = '', lastName = '', phone = '', email = '', partsChanged = '', salvageTitle = null, validId = null, receipts = null } = data
    const vehicleColor = String(data.vehicleColor || '').trim().slice(0, 50)
    if (!vehicleColor) {
      return NextResponse.json({ error: 'Vehicle color is required.' }, { status: 400 })
    }

    const insert = () => prisma.$executeRaw`
      INSERT INTO salvageinspection (firstName, lastName, phone, email, vehicleColor, partsChanged, salvageTitle, validId, receipts, status, createdAt)
      VALUES (${firstName}, ${lastName}, ${phone}, ${email}, ${vehicleColor}, ${partsChanged}, ${salvageTitle}, ${validId}, ${receipts}, 'new', NOW())
    `
    try {
      await insert()
    } catch (e) {
      // The vehicleColor column was added after launch. If this database
      // doesn't have it yet, add it once and retry instead of losing the lead.
      if (!/Unknown column/i.test(e.message || '')) throw e
      try {
        await prisma.$executeRaw`ALTER TABLE salvageinspection ADD COLUMN vehicleColor VARCHAR(50) NULL`
        await insert()
      } catch (alterErr) {
        // Last resort: keep the request and carry the color in the notes.
        console.error('vehicleColor column unavailable:', alterErr.message)
        const notes = `Vehicle color: ${vehicleColor}${partsChanged ? `\n\n${partsChanged}` : ''}`
        await prisma.$executeRaw`
          INSERT INTO salvageinspection (firstName, lastName, phone, email, partsChanged, salvageTitle, validId, receipts, status, createdAt)
          VALUES (${firstName}, ${lastName}, ${phone}, ${email}, ${notes}, ${salvageTitle}, ${validId}, ${receipts}, 'new', NOW())
        `
      }
    }
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
        html: inspectionAdmin({ firstName, lastName, phone, email, vehicleColor }),
      }),
    ])

    return NextResponse.json({ ok: true, id: inspection?.id })
  } catch (e) {
    console.error('Inspection submit error:', e)
    return NextResponse.json({ error: 'Failed to submit documents.' }, { status: 500 })
  }
}

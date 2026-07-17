import nodemailer from 'nodemailer'
import { readFileSync } from 'fs'

// Load .env manually
const env = readFileSync('.env', 'utf8')
env.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/)
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '')
})

console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_FROM:', process.env.SMTP_FROM)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

try {
  await transporter.verify()
  console.log('SMTP connection OK')

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER,
    subject: 'Status Update Test — Connect Auto Sales',
    html: '<p>This is a test email for status update feature.</p>',
  })
  console.log('Test email sent!')
} catch (e) {
  console.error('SMTP error:', e.message)
}

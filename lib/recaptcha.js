export async function verifyRecaptcha(token) {
  if (!token) return { success: false, score: 0 }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
  })

  const data = await res.json()
  return data
}

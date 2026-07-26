import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGO = 'aes-256-gcm'

function getKey() {
  const key = process.env.SSN_ENCRYPTION_KEY
  if (!key || key.length < 32) throw new Error('SSN_ENCRYPTION_KEY missing or too short')
  return Buffer.from(key.slice(0, 32))
}

export function encryptSSN(plaintext) {
  if (!plaintext) return null
  const key = getKey()
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGO, key, iv)
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decryptSSN(ciphertext) {
  if (!ciphertext) return null
  try {
    const key = getKey()
    const [ivHex, authTagHex, encHex] = ciphertext.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encrypted = Buffer.from(encHex, 'hex')
    const decipher = createDecipheriv(ALGO, key, iv)
    decipher.setAuthTag(authTag)
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  } catch {
    return '[encrypted]'
  }
}

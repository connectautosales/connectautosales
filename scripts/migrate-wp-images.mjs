import { put } from '@vercel/blob'
import mysql from 'mysql2/promise'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const BLOB_TOKEN   = 'vercel_blob_rw_JqSxTcUDH1YT2Y2i_rtkfMrJgBAdnHvwfQyQLu0yK3BGLEr'
const DATABASE_URL = 'mysql://root:aGylJCercUsRDaCcKGCEPqAcFFZcFAGC@sakura.proxy.rlwy.net:59290/railway'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_FILE  = path.join(__dirname, 'migrate-wp-images.log')
const MAP_FILE  = path.join(__dirname, 'wp-to-blob-map.json')

// ── helpers ──────────────────────────────────────────────────────────────
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`
  console.log(line)
  fs.appendFileSync(LOG_FILE, line + '\n')
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const get = (u, redirects = 0) => {
      protocol.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
          return get(res.headers.location, redirects + 1)
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`))
        }
        const chunks = []
        res.on('data', c => chunks.push(c))
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || 'image/jpeg' }))
        res.on('error', reject)
      }).on('error', reject)
    }
    get(url)
  })
}

function extFromUrl(url) {
  const clean = url.split('?')[0]
  const ext = clean.split('.').pop().toLowerCase()
  return ['jpg','jpeg','png','webp','gif','avif','jfif'].includes(ext) ? ext : 'jpg'
}

function parseDatabaseUrl(url) {
  const u = new URL(url)
  return {
    host:     u.hostname,
    port:     parseInt(u.port || '3306'),
    user:     u.username,
    password: u.password,
    database: u.pathname.slice(1),
    ssl:      { rejectUnauthorized: false },
  }
}

// ── main ─────────────────────────────────────────────────────────────────
async function main() {
  log('=== WP → Vercel Blob migration started ===')

  // Load existing map (resume support)
  const urlMap = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {}
  const alreadyDone = Object.keys(urlMap).length
  if (alreadyDone) log(`Resuming — ${alreadyDone} URLs already migrated`)

  // Connect to DB
  const db = await mysql.createConnection(parseDatabaseUrl(DATABASE_URL))
  log('Connected to production DB')

  // Fetch all cars with images
  const [cars] = await db.execute('SELECT id, stock, images, damageImages FROM car')
  log(`Found ${cars.length} cars in DB`)

  // Collect all unique WP URLs
  const allWpUrls = new Set()
  for (const car of cars) {
    const imgs   = car.images      ? JSON.parse(car.images)      : []
    const damage = car.damageImages ? JSON.parse(car.damageImages) : []
    ;[...imgs, ...damage].forEach(u => { if (u && u.includes('wp-content')) allWpUrls.add(u) })
  }
  log(`Total unique WP URLs to migrate: ${allWpUrls.size}`)

  // Download & upload each unique URL
  let done = 0, failed = 0
  for (const wpUrl of allWpUrls) {
    if (urlMap[wpUrl]) { done++; continue } // already done

    try {
      const { buffer, contentType } = await downloadBuffer(wpUrl)
      const ext = extFromUrl(wpUrl)
      const filename = `vehicles/migrated/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const blob = await put(filename, buffer, {
        access:      'public',
        token:       BLOB_TOKEN,
        contentType: contentType.split(';')[0].trim(),
      })
      urlMap[wpUrl] = blob.url
      fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2))
      done++
      log(`[${done}/${allWpUrls.size}] OK  ${wpUrl.split('/').pop()} → ${blob.url}`)
    } catch (err) {
      failed++
      log(`[FAIL] ${wpUrl} — ${err.message}`)
    }

    // Small delay to avoid hammering the WP server
    await new Promise(r => setTimeout(r, 80))
  }

  log(`Upload phase done — ${done} succeeded, ${failed} failed`)

  // Update DB: replace old URLs in images & damageImages JSON arrays
  let updatedCars = 0
  for (const car of cars) {
    let imgs   = car.images       ? JSON.parse(car.images)       : []
    let damage = car.damageImages ? JSON.parse(car.damageImages)  : []

    const newImgs   = imgs.map(u   => urlMap[u]   || u)
    const newDamage = damage.map(u => urlMap[u]   || u)

    const changed =
      JSON.stringify(newImgs)   !== JSON.stringify(imgs) ||
      JSON.stringify(newDamage) !== JSON.stringify(damage)

    if (changed) {
      await db.execute(
        'UPDATE car SET images = ?, damageImages = ?, updatedAt = NOW() WHERE id = ?',
        [JSON.stringify(newImgs), JSON.stringify(newDamage), car.id]
      )
      updatedCars++
      log(`Updated car id=${car.id} stock=${car.stock}`)
    }
  }

  log(`DB update done — ${updatedCars} cars updated`)
  log('=== Migration complete ===')
  await db.end()
}

main().catch(err => { console.error('FATAL:', err); process.exit(1) })

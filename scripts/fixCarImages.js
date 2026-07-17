const mysql = require('mysql2/promise');
const https = require('https');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../public/uploads/cars');
const WP_BASE = 'https://connectautosales.com';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(dest); return; }
    const file = fs.createWriteStream(dest);
    const doGet = (u) => {
      https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          downloadFile(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      }).on('error', err => { file.close(); try { fs.unlinkSync(dest); } catch {}; reject(err); });
    };
    doGet(url);
  });
}

async function fetchPageImages(stockNum) {
  const url = `${WP_BASE}/vehicle/${stockNum}/`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let html = '';
      res.on('data', d => html += d);
      res.on('end', () => {
        // All data-src URLs from wp-content/uploads
        const allDataSrc = [];
        const dRx = /data-src="(https:\/\/connectautosales\.com\/wp-content\/uploads\/[^"]+)"/g;
        let m;
        while ((m = dRx.exec(html)) !== null) allDataSrc.push(m[1]);

        // Car gallery photos: case-insensitive {stock}_CAR{n}.jpg
        const carPattern = new RegExp(`${stockNum}_car\\d+\\.(?:jpg|jpeg|png)`, 'i');
        const carImgs = allDataSrc.filter(u => carPattern.test(u));

        // Damage photos: pattern like {digits}_{n}_I.jpeg (NOT matching stock_car pattern)
        const damagePattern = /\/\d{6,}_\d+_I\.jpeg$/i;
        const dmgImgs = allDataSrc.filter(u => damagePattern.test(u));

        resolve({ carImgs, dmgImgs });
      });
    }).on('error', () => resolve({ carImgs: [], dmgImgs: [] }));
  });
}

function ext(url) {
  const clean = url.replace(/\?.*$/, '');
  return path.extname(clean) || '.jpg';
}

function sortNumerically(arr) {
  return arr.slice().sort((a, b) => {
    const na = parseInt(a.match(/CAR(\d+)/i)?.[1] || 0);
    const nb = parseInt(b.match(/CAR(\d+)/i)?.[1] || 0);
    return na - nb;
  });
}

async function main() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'connectautosales' });
  const [cars] = await conn.execute("SELECT id, stock, year, make, model FROM car WHERE stock LIKE 'WP-%'");

  for (const car of cars) {
    const stockNum = car.stock.replace('WP-', '');
    console.log(`\n[${car.id}] ${car.year} ${car.make} ${car.model} (stock ${stockNum})`);

    const { carImgs, dmgImgs } = await fetchPageImages(stockNum);
    const sortedCarImgs = sortNumerically(carImgs);
    console.log(`  Found: ${sortedCarImgs.length} car photos, ${dmgImgs.length} damage photos`);

    const localCarImgs = [];
    for (let i = 0; i < sortedCarImgs.length; i++) {
      const wpUrl = sortedCarImgs[i];
      const e = ext(wpUrl);
      const dest = path.join(UPLOAD_DIR, `stock-${stockNum}-${i + 1}${e}`);
      try {
        await downloadFile(wpUrl, dest);
        localCarImgs.push(`/uploads/cars/stock-${stockNum}-${i + 1}${e}`);
      } catch (err) {
        console.log(`  skip car ${i+1}: ${err.message}`);
      }
    }

    const localDmgImgs = [];
    for (let i = 0; i < dmgImgs.length; i++) {
      const wpUrl = dmgImgs[i];
      const e = ext(wpUrl);
      const dest = path.join(UPLOAD_DIR, `damage-${stockNum}-${i + 1}${e}`);
      try {
        await downloadFile(wpUrl, dest);
        localDmgImgs.push(`/uploads/cars/damage-${stockNum}-${i + 1}${e}`);
      } catch (err) {
        console.log(`  skip dmg ${i+1}: ${err.message}`);
      }
    }

    console.log(`  Saved: ${localCarImgs.length} car, ${localDmgImgs.length} damage`);

    if (localCarImgs.length > 0) {
      await conn.execute(
        'UPDATE car SET images = ?, damageImages = ? WHERE id = ?',
        [JSON.stringify(localCarImgs), JSON.stringify(localDmgImgs), car.id]
      );
      console.log(`  DB updated.`);
    }
  }

  await conn.end();
  console.log('\nAll done!');
}

main().catch(e => { console.error(e.message); process.exit(1); });

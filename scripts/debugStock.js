const https = require('https');

const stock = process.argv[2] || '1989';
https.get(`https://connectautosales.com/vehicle/${stock}/`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    // All data-src URLs
    const dataSrcRx = /data-src="(https:\/\/connectautosales\.com\/wp-content\/uploads\/[^"]+)"/g;
    let m;
    const found = [];
    while ((m = dataSrcRx.exec(html)) !== null) found.push(m[1]);
    console.log(`Stock ${stock} - data-src images (${found.length}):`);
    found.slice(0, 30).forEach(u => console.log(' ', u));

    // Damage images
    const dmgRx = /class="vt-damage-img[^"]*"[^>]*(?:src|data-src)="([^"]+)"|(?:src|data-src)="([^"]+)"[^>]*class="[^"]*vt-damage-img/g;
    console.log('\nDamage imgs:');
    while ((m = dmgRx.exec(html)) !== null) console.log(' ', m[1] || m[2]);
  });
});

const https = require('https');

https.get('https://connectautosales.com/vehicle/1786/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    // Find all img tags
    const imgRx = /<img([^>]+)>/g;
    let m;
    let count = 0;
    while ((m = imgRx.exec(html)) !== null && count < 40) {
      const tag = m[1];
      const srcM = /src="([^"]+)"/.exec(tag) || /data-src="([^"]+)"/.exec(tag);
      if (!srcM) continue;
      const src = srcM[1];
      if (src.includes('connectautosales.com/wp-content/uploads') || src.includes('/uploads/')) {
        const isVt = tag.includes('vt-damage');
        const isDefer = tag.includes('defer-img');
        console.log(`[${isVt?'DMG':isDefer?'CAR':'?  '}] ${src.substring(0,100)}`);
        count++;
      }
    }
    // Also look for data-src (lazy load)
    const dataSrcRx = /data-src="([^"]+1786_car[^"]+)"/g;
    let m2;
    console.log('\n-- data-src car photos:');
    while ((m2 = dataSrcRx.exec(html)) !== null) {
      console.log(m2[1]);
    }
  });
}).on('error', e => console.error(e.message));

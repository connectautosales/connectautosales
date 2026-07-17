const mysql = require('mysql2/promise');
async function go() {
  const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'', database:'connectautosales' });
  const [rows] = await conn.execute('SELECT id, stock, make, model, year, slug, images, damageImages FROM car ORDER BY id');
  rows.forEach(r => {
    let imgs = [];
    try { imgs = JSON.parse(r.images || '[]'); } catch {}
    let dmg = [];
    try { dmg = JSON.parse(r.damageImages || '[]'); } catch {}
    console.log(`ID ${r.id} | ${r.year} ${r.make} ${r.model} | stock:${r.stock} | slug:${r.slug} | images:${imgs.length} | damage:${dmg.length}`);
    if (imgs.length) console.log('  first img:', imgs[0]);
    if (dmg.length) console.log('  first dmg:', dmg[0]);
  });
  await conn.end();
}
go().catch(e => console.error(e.message));

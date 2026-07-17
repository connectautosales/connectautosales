const mysql = require('mysql2/promise');
async function go() {
  const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'', database:'connectautosales' });
  const [rows] = await conn.execute('SELECT id, stock, make, model, year, images FROM car WHERE id IN (12, 17, 18) ORDER BY id');
  rows.forEach(r => {
    let imgs = [];
    try { imgs = JSON.parse(r.images || '[]'); } catch {}
    console.log(`\n--- ID ${r.id} | ${r.year} ${r.make} ${r.model} | stock:${r.stock} ---`);
    imgs.forEach((img, i) => console.log(`  [${i}] ${img}`));
  });
  await conn.end();
}
go().catch(e => console.error(e.message));

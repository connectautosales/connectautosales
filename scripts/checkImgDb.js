const mysql = require('mysql2/promise');
mysql.createConnection({host:'localhost',user:'root',password:'',database:'connectautosales'}).then(async conn => {
  const [rows] = await conn.execute("SELECT id, stock, year, make, model, images FROM car ORDER BY id");
  rows.forEach(r => {
    let imgs = [];
    try { imgs = JSON.parse(r.images || '[]'); } catch {}
    console.log(r.id, r.stock, r.year, r.make, r.model, '| imgs:', imgs.length, imgs[0] || 'NONE');
  });
  conn.end();
});

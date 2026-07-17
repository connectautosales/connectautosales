const mysql = require('mysql2/promise');
async function go() {
  const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'', database:'connectautosales' });
  const [rows] = await conn.execute('SELECT * FROM visitorlog ORDER BY createdAt DESC LIMIT 10');
  console.log(JSON.stringify(rows, null, 2));
  await conn.end();
}
go().catch(e => console.error(e.message));

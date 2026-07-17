const mysql = require('mysql2/promise');

async function go() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'connectautosales'
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS visitorlog (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip VARCHAR(64),
      country VARCHAR(64),
      city VARCHAR(64),
      page VARCHAR(512),
      device VARCHAR(32),
      browser VARCHAR(128),
      referrer VARCHAR(512),
      createdAt DATETIME DEFAULT NOW(),
      INDEX idx_created (createdAt),
      INDEX idx_ip (ip)
    )
  `);
  console.log('visitorlog table created');
  await conn.end();
}

go().catch(e => { console.error(e.message); process.exit(1); });

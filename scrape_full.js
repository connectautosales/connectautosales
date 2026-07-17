const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) return fetchUrl(res.headers.location).then(resolve).catch(reject);
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 20000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) { file.close(); try{fs.unlinkSync(dest);}catch{} return downloadFile(res.headers.location, dest).then(resolve).catch(reject); }
      if (res.statusCode !== 200) { file.close(); try{fs.unlinkSync(dest);}catch{} return reject(new Error("HTTP " + res.statusCode)); }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    });
    req.on("error", e => { try{fs.unlinkSync(dest);}catch{} reject(e); });
    req.on("timeout", () => { req.destroy(); try{fs.unlinkSync(dest);}catch{} reject(new Error("timeout")); });
  });
}

async function decodeVin(vin) {
  try {
    const json = await fetchUrl(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const data = JSON.parse(json);
    const get = (var_) => data.Results.find(r => r.Variable === var_)?.Value || null;
    return {
      year: get("Model Year"),
      make: get("Make"),
      model: get("Model"),
      trim: get("Trim") || get("Series") || null,
      bodyType: get("Body Class"),
      drivetrain: get("Drive Type"),
      transmission: get("Transmission Style"),
      fuelType: get("Fuel Type - Primary"),
    };
  } catch(e) { return {}; }
}

async function scrapePage(url) {
  const html = await fetchUrl(url);
  // Extract VIN
  const vin = (html.match(/VIN[:\s#]*([A-HJ-NPR-Z0-9]{17})/i) || [])[1] || null;
  // Extract stock number from URL
  const stock = (url.match(/\/vehicle\/(\d+)\//i) || [])[1] || null;
  // Extract price - look for price patterns
  const priceMatch = html.match(/\$\s*([\d,]+)(?:\s*<|\s*USD|\s*\.00)/i);
  const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g,"")) : null;
  // Extract mileage
  const milesMatch = html.match(/([\d,]+)\s*(?:mi|miles)(?:\s*<|[^l])/i);
  const mileage = milesMatch ? parseInt(milesMatch[1].replace(/,/g,"")) : null;
  // Extract title type
  const titleType = html.match(/salvage/i) ? "salvage" : html.match(/rebuilt/i) ? "rebuilt" : "clean";
  // Car images - filter out logos/banners
  const seen = new Set();
  const imgs = [];
  const allImgs = [...html.matchAll(/(?:src|href)="(https:\/\/connectautosales\.com\/wp-content\/uploads\/202[56]\/\d+\/\d+[^"]*\.(?:jpg|jpeg|png|webp))"/gi)].map(m => m[1].split("?")[0]);
  for (const img of allImgs) {
    if (seen.has(img)) continue;
    // Skip logos, banners, icons
    if (/Group-|logo|icon|banner|Group/i.test(img)) continue;
    seen.add(img);
    imgs.push(img);
  }
  return { vin, stock, price, mileage, titleType, images: imgs };
}

const uploadDir = "D:/Projects/connectautosales-github/public/uploads/cars";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Stock -> DB car id mapping (from our DB)
// 1786=12(Honda Pilot already done), rest need update
const stockToData = {
  "1786": { dbId: 12 },
  "1989": { dbId: 13 },
  "1990": { dbId: 14 },
  "1967": { dbId: 15 },
  "1943": { dbId: 16 },
  "1958": { dbId: 17 },
  "1947": { dbId: null }, // new car, need to insert
  "1913": { dbId: 19 },
  "1974": { dbId: 20 },
};

const vehicleUrls = [
  "https://connectautosales.com/vehicle/1786/",
  "https://connectautosales.com/vehicle/1989/",
  "https://connectautosales.com/vehicle/1990/",
  "https://connectautosales.com/vehicle/1967/",
  "https://connectautosales.com/vehicle/1943/",
  "https://connectautosales.com/vehicle/1958/",
  "https://connectautosales.com/vehicle/1947/",
  "https://connectautosales.com/vehicle/1913/",
  "https://connectautosales.com/vehicle/1974/",
];

async function go() {
  const conn = await mysql.createConnection({host:"localhost",user:"root",password:"",database:"connectautosales"});

  for (const url of vehicleUrls) {
    const stock = (url.match(/\/vehicle\/(\d+)\//)||[])[1];
    console.log("\n=== Stock", stock, "===");

    const page = await scrapePage(url);
    console.log("VIN:", page.vin, "| Price:", page.price, "| Miles:", page.mileage, "| Title:", page.titleType);
    console.log("Car images:", page.images.length);

    // Decode VIN
    let vinData = {};
    if (page.vin) {
      process.stdout.write("Decoding VIN...");
      vinData = await decodeVin(page.vin);
      console.log(" Year:", vinData.year, "Make:", vinData.make, "Model:", vinData.model, "Trim:", vinData.trim);
    }

    // Download images
    const localImages = [];
    for (let i = 0; i < page.images.length; i++) {
      const imgUrl = page.images[i];
      const ext = path.extname(imgUrl.split("?")[0]) || ".jpg";
      const filename = `stock-${stock}-${i+1}${ext}`;
      const dest = path.join(uploadDir, filename);
      try {
        await downloadFile(imgUrl, dest);
        localImages.push(`/uploads/cars/${filename}`);
        process.stdout.write(".");
      } catch(e) {
        console.log(`\n  [fail] ${imgUrl}: ${e.message}`);
      }
    }
    console.log(`\n  Downloaded: ${localImages.length} images`);

    const dbInfo = stockToData[stock];
    if (dbInfo && dbInfo.dbId) {
      // Update existing record
      await conn.execute(
        `UPDATE car SET 
          year=COALESCE(NULLIF(year,''),?), 
          make=COALESCE(NULLIF(make,''),?), 
          model=COALESCE(NULLIF(model,''),?),
          trim=COALESCE(NULLIF(trim,''),?),
          vin=COALESCE(NULLIF(vin,''),?),
          mileage=COALESCE(NULLIF(mileage,0),?),
          titleType=COALESCE(NULLIF(titleType,''),?),
          images=?
        WHERE id=?`,
        [vinData.year||null, vinData.make||null, vinData.model||null, vinData.trim||null,
         page.vin||null, page.mileage||null, page.titleType||null,
         JSON.stringify(localImages), dbInfo.dbId]
      );
      console.log("  DB updated (id:", dbInfo.dbId, ")");
    } else if (dbInfo && dbInfo.dbId === null && vinData.make) {
      // Insert new car (stock 1947)
      const slug = `${vinData.year}-${vinData.make}-${vinData.model}`.toLowerCase().replace(/[^a-z0-9]+/g,"-") + `-${stock}`;
      const [result] = await conn.execute(
        `INSERT INTO car (year,make,model,trim,vin,stock,price,mileage,titleType,images,slug,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,'active',NOW(),NOW())`,
        [vinData.year, vinData.make, vinData.model, vinData.trim||null, page.vin||null, stock, page.price||null, page.mileage||null, page.titleType||'clean', JSON.stringify(localImages), slug]
      );
      console.log("  Inserted new car, id:", result.insertId);
    }
  }

  await conn.end();
  console.log("\n\nAll done!");
}
go().catch(console.error);

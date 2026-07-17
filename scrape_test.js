const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", d => data += d);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) { file.close(); try{fs.unlinkSync(dest);}catch{} return reject(new Error("HTTP " + res.statusCode)); }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    }).on("error", e => { try{fs.unlinkSync(dest);}catch{} reject(e); });
  });
}

function extract(html, pattern, group = 1) {
  const m = html.match(pattern);
  return m ? m[group].trim() : null;
}

function extractAll(html, pattern, group = 1) {
  const results = [];
  let m;
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  while ((m = re.exec(html)) !== null) results.push(m[group]);
  return results;
}

async function scrapeVehicle(url) {
  const html = await fetchUrl(url);
  
  // Extract basic info
  const year  = extract(html, /class="[^"]*year[^"]*"[^>]*>(\d{4})/i) || extract(html, /"year"\s*:\s*"?(\d{4})/);
  const make  = extract(html, /class="[^"]*make[^"]*"[^>]*>([^<]+)</i) || extract(html, /"make"\s*:\s*"([^"]+)"/);
  const model = extract(html, /class="[^"]*model[^"]*"[^>]*>([^<]+)</i) || extract(html, /"model"\s*:\s*"([^"]+)"/);
  const trim  = extract(html, /class="[^"]*trim[^"]*"[^>]*>([^<]+)</i) || extract(html, /"trim"\s*:\s*"([^"]+)"/);
  const vin   = extract(html, /VIN[:\s]+([A-HJ-NPR-Z0-9]{17})/i) || extract(html, /"vin"\s*:\s*"([^"]+)"/i);
  const stock = extract(html, /Stock[:\s#]+([A-Z0-9-]+)/i) || extract(html, /"stock[^"]*"\s*:\s*"([^"]+)"/i);
  const mileage = extract(html, /([\d,]+)\s*(?:mi|miles|mile)/i)?.replace(/,/g,"");
  const price   = extract(html, /\$\s*([\d,]+)/i)?.replace(/,/g,"");

  // Images - look for gallery images
  const imgPatterns = [
    /src="(https:\/\/connectautosales\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi,
    /href="(https:\/\/connectautosales\.com\/wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi,
  ];
  const seen = new Set();
  const images = [];
  for (const p of imgPatterns) {
    const matches = extractAll(html, p);
    for (const img of matches) {
      const clean = img.split("?")[0];
      if (!seen.has(clean) && !clean.includes("-scaled") || !seen.has(clean)) {
        seen.add(clean);
        images.push(clean);
      }
    }
  }

  // Also check JSON-LD / schema
  const schemaMatch = html.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (schemaMatch) {
    try {
      const schema = JSON.parse(schemaMatch[1]);
      const imgs = schema.image || (schema["@graph"] || []).flatMap(g => g.image || []);
      [].concat(imgs).forEach(i => { const u = typeof i === "string" ? i : i.url; if(u && !seen.has(u)){seen.add(u);images.push(u);} });
    } catch {}
  }

  return { year, make, model, trim, vin, stock, mileage, price, images: images.slice(0, 15) };
}

const uploadDir = "D:/Projects/connectautosales-github/public/uploads/cars";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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
  for (const url of vehicleUrls) {
    console.log("\nScraping:", url);
    const data = await scrapeVehicle(url);
    console.log("  Year:", data.year, "Make:", data.make, "Model:", data.model, "Trim:", data.trim);
    console.log("  VIN:", data.vin, "Stock:", data.stock, "Miles:", data.mileage, "Price:", data.price);
    console.log("  Images found:", data.images.length);
    data.images.forEach(i => console.log("   -", i));
  }
}
go().catch(console.error);

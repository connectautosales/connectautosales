const http = require('http');
http.get('http://localhost:3000/api/cars/2019-honda-pilot-lx-12', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const car = JSON.parse(d);
    let imgs = [];
    try { imgs = JSON.parse(car.images || '[]'); } catch {}
    let dmg = [];
    try { dmg = JSON.parse(car.damageImages || '[]'); } catch {}
    console.log('Car:', car.year, car.make, car.model);
    console.log('Images count:', imgs.length);
    console.log('First 3 images:', imgs.slice(0,3));
    console.log('Damage images count:', dmg.length);
    console.log('First damage:', dmg[0]);
  });
});

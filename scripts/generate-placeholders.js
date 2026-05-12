const P = require('pureimage');
const fs = require('fs');
const path = require('path');

// Brand colors
const BG = '#FAFAFB';
const PRIMARY = '#6366F1';

function drawRoundedRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function makeIcon(w,h, outPath){
  const img = P.make(w,h);
  const ctx = img.getContext('2d');
  // background
  ctx.fillStyle = BG;
  ctx.fillRect(0,0,w,h);

  // draw rounded square logo
  const size = Math.round(Math.min(w,h) * 0.45);
  const cx = Math.round(w/2);
  const cy = Math.round(h/2);
  const x = cx - Math.round(size/2);
  const y = cy - Math.round(size/2) - Math.round(h*0.06);
  const r = Math.round(size * 0.18);
  ctx.fillStyle = PRIMARY;
  drawRoundedRect(ctx, x, y, size, size, r);
  ctx.fill();

  // draw simple orbit: ring + dot in white
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = Math.max(6, Math.round(size*0.06));
  ctx.beginPath();
  ctx.arc(cx, y + Math.round(size*0.45), Math.round(size*0.23), 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(cx + Math.round(size*0.28), y + Math.round(size*0.25), Math.max(6, Math.round(size*0.06)), 0, Math.PI * 2);
  ctx.fill();

  // title text below
  const fontPath = path.join(__dirname,'../assets/fonts/Inter-Regular.ttf');
  let font;
  try{ font = P.registerFont(fontPath, 'Inter'); font.loadSync(); ctx.font = Math.round(w*0.06) + 'pt Inter'; }
  catch(e){ ctx.font = Math.round(w*0.06) + 'pt sans-serif'; }
  ctx.fillStyle = PRIMARY;
  const text = 'Orbe';
  const tx = Math.round(w*0.5 - (text.length * (w*0.03)));
  const ty = y + size + Math.round(h*0.12);
  ctx.fillText(text, tx, ty);

  await P.encodePNGToStream(img, fs.createWriteStream(outPath));
}

(async ()=>{
  const outDir = path.join(__dirname,'../assets/images');
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
  console.log('Generating splash.png (2048x2048)...');
  await makeIcon(2048,2048, path.join(outDir,'splash.png'));
  console.log('Done. Replace this with your final splash before release.');
})().catch(e=>{ console.error(e); process.exit(1); });

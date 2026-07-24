// Generate OG image for Facebook preview (1200x630 PNG)
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '..', 'public', 'images', 'logo-d26-horizontal.svg');
const pngPath = path.join(__dirname, '..', 'public', 'images', 'og-image.png');

async function generate() {
  // 1. Resize the SVG logo to fit nicely
  const logoPng = await sharp(svgPath)
    .resize(500, 180, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. Create the OG image with background + logo + text overlay
  const bgSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a5f"/>
          <stop offset="100%" style="stop-color:#0f2440"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#2563eb"/>
          <stop offset="100%" style="stop-color:#7c3aed"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <!-- Decorative circles -->
      <circle cx="1100" cy="100" r="200" fill="rgba(37,99,235,0.08)"/>
      <circle cx="100" cy="500" r="150" fill="rgba(124,58,237,0.06)"/>
      <!-- Bottom accent line -->
      <rect x="0" y="620" width="1200" height="10" fill="url(#accent)"/>
    </svg>
  `);

  const bgPng = await sharp(bgSvg)
    .resize(1200, 630)
    .png()
    .toBuffer();

  // 3. Composite logo onto background
  const result = await sharp(bgPng)
    .composite([
      { input: logoPng, top: 220, left: 350 }, // Center the logo
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(pngPath, result);
  
  const stats = fs.statSync(pngPath);
  console.log('✅ OG image created:', pngPath);
  console.log('   Size:', stats.size, 'bytes');
  console.log('   Dimensions: 1200x630');
}

generate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

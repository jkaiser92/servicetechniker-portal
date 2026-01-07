const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Main app icon SVG - minimalistisches Grid/Portal Symbol
const mainIconSvg = (size, maskable = false) => {
  const padding = maskable ? size * 0.15 : 0;
  const cx = size / 2;
  const cy = size / 2;
  const iconSize = (size - padding * 2) * 0.45;
  
  const background = maskable 
    ? `<rect width="${size}" height="${size}" fill="#455A64"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${size/2}" fill="#455A64"/>`;

  // Einfaches 2x1 Grid (zwei Kacheln nebeneinander)
  const gap = iconSize * 0.1;
  const boxW = (iconSize - gap) / 2;
  const boxH = iconSize * 0.7;
  const startX = cx - iconSize / 2;
  const startY = cy - boxH / 2;
  const radius = iconSize * 0.08;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${background}
  <!-- Linke Kachel -->
  <rect x="${startX}" y="${startY}" width="${boxW}" height="${boxH}" rx="${radius}" fill="white"/>
  <!-- Rechte Kachel -->
  <rect x="${startX + boxW + gap}" y="${startY}" width="${boxW}" height="${boxH}" rx="${radius}" fill="white"/>
</svg>`;
};

// Shortcut icon SVG - schlicht mit externem Link Symbol
const shortcutIconSvg = (type, size) => {
  const color = type === 'kasys' ? '#607D8B' : '#78909C';
  const cx = size / 2;
  const cy = size / 2;
  const iconSize = size * 0.4;
  
  // Externes Link Symbol (Pfeil nach rechts oben)
  const boxSize = iconSize * 0.7;
  const arrowStart = iconSize * 0.3;
  const strokeW = size * 0.06;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${cx}" cy="${cy}" r="${size/2}" fill="${color}"/>
  <g transform="translate(${cx - iconSize/2}, ${cy - iconSize/2})">
    <!-- Box -->
    <rect x="0" y="${arrowStart}" width="${boxSize}" height="${boxSize}" rx="${strokeW}" 
          fill="none" stroke="white" stroke-width="${strokeW}"/>
    <!-- Pfeil -->
    <line x1="${arrowStart}" y1="${iconSize - arrowStart}" x2="${iconSize}" y2="0" 
          stroke="white" stroke-width="${strokeW}" stroke-linecap="round"/>
    <polyline points="${iconSize * 0.5},0 ${iconSize},0 ${iconSize},${iconSize * 0.5}" 
              fill="none" stroke="white" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
};

async function generateIcon(svg, filename) {
  const filepath = path.join(ICONS_DIR, filename);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(filepath);
  console.log(`✓ Generated: ${filename}`);
}

async function main() {
  console.log('🎨 Generating PWA icons...\n');

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  // Regular icons
  for (const size of sizes) {
    await generateIcon(mainIconSvg(size, false), `icon-${size}.png`);
  }

  // Maskable icons (with safe zone padding)
  for (const size of [192, 512]) {
    await generateIcon(mainIconSvg(size, true), `icon-maskable-${size}.png`);
  }

  // Shortcut icons
  await generateIcon(shortcutIconSvg('kasys', 96), 'kasys-shortcut.png');
  await generateIcon(shortcutIconSvg('telekom', 96), 'telekom-shortcut.png');

  console.log('\n✅ All icons generated successfully!');
  console.log(`📁 Location: ${ICONS_DIR}`);
}

main().catch(console.error);

const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\1ba74a26-62d2-4ff5-8764-69f27643d6cb';
const destDir = path.join(__dirname, 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const assets = [
  { src: 'album_art_love_1780530046625.png', dest: 'love.png' },
  { src: 'album_art_energy_1780530062921.png', dest: 'energy.png' },
  { src: 'album_art_chill_1780530078826.png', dest: 'chill.png' },
  { src: 'album_art_folk_1780530097415.png', dest: 'folk.png' }
];

assets.forEach(asset => {
  const srcPath = path.join(srcDir, asset.src);
  const destPath = path.join(destDir, asset.dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${asset.src} -> images/${asset.dest}`);
  } catch (err) {
    console.error(`Failed to copy ${asset.src}:`, err.message);
  }
});

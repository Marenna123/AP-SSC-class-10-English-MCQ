const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = 0 ^ -1;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let curr = i;
    for (let k = 0; k < 8; k++) {
      curr = curr & 1 ? 0xedb88320 ^ (curr >>> 1) : curr >>> 1;
    }
    table[i] = curr;
  }
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generateIcon(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = isMaskable ? width * 0.48 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter none

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient from Indigo (67, 56, 202) to Teal (13, 148, 136)
      const gradT = (x + y) / (width + height);
      let bgR = Math.round(67 + (13 - 67) * gradT);
      let bgG = Math.round(56 + (148 - 56) * gradT);
      let bgB = Math.round(202 + (136 - 202) * gradT);
      let alpha = 255;

      if (!isMaskable) {
        // Rounded squircle / circle mask
        if (dist > outerRadius) {
          const edge = dist - outerRadius;
          if (edge < 1.5) {
            alpha = Math.round(255 * (1 - edge / 1.5));
          } else {
            alpha = 0;
          }
        }
      }

      // Draw stylized Open Book / Academic Emblem in center
      // Center scale
      const scale = width / 192;
      const nx = (x - cx) / scale; // range approx -90 to +90
      const ny = (y - cy) / scale;

      let isFore = false;

      // Book left page: x in [-45, -4], y in [-25, 25] with gentle curve
      if (nx >= -48 && nx <= -6 && ny >= -22 && ny <= 26) {
        const pageCurve = Math.sin(((nx + 48) / 42) * Math.PI) * 4;
        if (ny >= -22 - pageCurve && ny <= 24 - pageCurve) {
          isFore = true;
        }
      }

      // Book right page: x in [4, 45], y in [-25, 25] with gentle curve
      if (nx >= 6 && nx <= 48 && ny >= -22 && ny <= 26) {
        const pageCurve = Math.sin(((48 - nx) / 42) * Math.PI) * 4;
        if (ny >= -22 - pageCurve && ny <= 24 - pageCurve) {
          isFore = true;
        }
      }

      // Central bookmark spine: x in [-3, 3], y in [-26, 32]
      if (Math.abs(nx) <= 3.5 && ny >= -26 && ny <= 30) {
        isFore = true;
      }

      // Star / Golden spark at top: ny in [-42, -28]
      if (Math.abs(nx) + Math.abs(ny + 35) <= 7) {
        isFore = true;
      }

      if (isFore && alpha > 0) {
        // Crisp white / warm golden emblem
        if (Math.abs(nx) + Math.abs(ny + 35) <= 7) {
          // Golden star
          bgR = 251;
          bgG = 191;
          bgB = 36;
        } else {
          bgR = 255;
          bgG = 255;
          bgB = 255;
        }
      }

      rawData[pxOffset] = bgR;
      rawData[pxOffset + 1] = bgG;
      rawData[pxOffset + 2] = bgB;
      rawData[pxOffset + 3] = alpha;
    }
  }

  const idat = zlib.deflateSync(rawData);
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdr = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', idat);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idatChunk, iend]);
}

const pubDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

// 1. 192x192 PNG
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), generateIcon(192, false));

// 2. 512x512 PNG
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), generateIcon(512, false));

// 3. Maskable 512x512 PNG (safe margin)
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), generateIcon(512, true));

// 4. Apple Touch Icon 180x180 PNG
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generateIcon(180, false));

// 5. Favicon 64x64 PNG
fs.writeFileSync(path.join(pubDir, 'favicon.png'), generateIcon(64, false));

console.log('Successfully generated all PWA icons in /public:');
console.log('- pwa-192x192.png');
console.log('- pwa-512x512.png');
console.log('- pwa-maskable-512x512.png');
console.log('- apple-touch-icon.png');
console.log('- favicon.png');

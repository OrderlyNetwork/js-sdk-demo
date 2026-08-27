const fs = require('fs');
const zlib = require('zlib');

const W = 32, H = 32;
const crcTable = Array.from({length: 256}, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type), out = Buffer.alloc(data.length + 12);
  out.writeUInt32BE(data.length, 0); t.copy(out, 4); data.copy(out, 8);
  out.writeUInt32BE(crc(Buffer.concat([t, data])), data.length + 8);
  return out;
}
function png(name, paint, rgba = 0x000000ff) {
  const px = Buffer.alloc(W * H * 4);
  const set = (x, y) => { if (x >= 0 && x < W && y >= 0 && y < H) px.writeUInt32BE(rgba, (y * W + x) * 4); };
  const clear = (x, y) => { if (x >= 0 && x < W && y >= 0 && y < H) px.writeUInt32BE(0, (y * W + x) * 4); };
  const rect = (x, y, w, h) => { for (let yy=y; yy<y+h; yy++) for (let xx=x; xx<x+w; xx++) set(xx, yy); };
  const clearRect = (x, y, w, h) => { for (let yy=y; yy<y+h; yy++) for (let xx=x; xx<x+w; xx++) clear(xx, yy); };
  paint(set, rect, clear, clearRect);
  const raw = Buffer.alloc(H * (1 + W * 4));
  for (let y=0; y<H; y++) px.copy(raw, y*(1+W*4)+1, y*W*4, (y+1)*W*4);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4); ihdr[8]=8; ihdr[9]=6;
  fs.writeFileSync(name, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR',ihdr), chunk('IDAT',zlib.deflateSync(raw)), chunk('IEND',Buffer.alloc(0))]));
}

png('assets/icons/oil-mono-32.png', (set, r) => {
  // Oil barrel: outlined cylinder, two hoops, and a large detached droplet.
  r(7,5,14,2); r(5,7,2,18); r(21,7,2,18); r(7,25,14,2);
  r(7,8,14,2); r(7,15,14,2); r(7,22,14,2);
  r(8,10,2,5); r(18,17,2,5);
  r(26,10,2,2); r(25,12,4,3); r(24,15,6,5); r(25,20,4,2); r(26,22,2,1);
});
png('assets/icons/gold-mono-32.png', (set, r) => {
  // Two isometric gold bars with transparent centers/highlight cuts.
  r(12,5,10,2); r(9,7,3,2); r(22,7,3,2); r(7,9,3,5); r(25,9,3,5);
  r(9,14,16,2); r(12,7,10,2); r(10,9,3,2); r(22,9,3,2);
  r(7,17,14,2); r(4,19,3,2); r(21,19,4,2); r(2,21,3,5); r(25,21,3,5);
  r(4,26,21,2); r(7,19,14,2); r(5,21,3,2); r(21,21,4,2);
  r(9,10,2,2); r(6,22,2,2);
});
png('assets/icons/robot-mono-32.png', (set, r) => {
  // Robot head: antenna, ears, outlined shell, hollow face, eyes and grille.
  r(15,2,2,3); r(13,4,6,2); r(8,6,16,2); r(6,8,2,3); r(24,8,2,3);
  r(4,10,2,5); r(26,10,2,5); r(2,12,2,8); r(28,12,2,8);
  r(4,20,2,5); r(26,20,2,5); r(6,25,2,2); r(24,25,2,2); r(8,27,16,2);
  r(8,8,16,2); r(6,10,2,15); r(24,10,2,15); r(8,24,16,3);
  r(10,13,4,4); r(18,13,4,4); r(11,20,10,2); r(13,22,6,1);
});

png('assets/icons/robot-reference-32.png', (set, r, clear, cut) => {
  // Chunky white robot silhouette matched to the reference's one-cell stair steps.
  r(15,2,2,2); r(14,4,4,2); r(11,6,10,1);
  r(9,7,14,1); r(8,8,16,1); r(7,9,18,2);
  r(6,11,20,11); r(7,22,18,2); r(9,24,14,2); r(12,26,8,2);
  // Stepped side ears, echoing the reference silhouette.
  r(4,12,2,2); r(3,14,3,6); r(4,20,2,2);
  r(26,12,2,2); r(26,14,3,6); r(26,20,2,2);
  r(2,15,2,4); r(29,15,2,4);
  // Transparent facial cutouts keep the icon single-colour.
  cut(9,12,5,5); cut(18,12,5,5);
  cut(11,20,10,2); cut(13,22,6,1);
}, 0xffffffff);

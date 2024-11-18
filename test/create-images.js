const fs = require('fs');
const path = require('path');
const util = require('./util.js');

const pattern = process.argv[2];
const fixtures = path.join(__dirname, 'fixtures');
const images = path.join(__dirname, 'images');

const entries = fs.readdirSync(fixtures);

for (const entry of entries) {
  if (pattern && entry.indexOf(pattern) === -1) {
    continue;
  }
  const factory = require(path.join(fixtures, entry));
  const png = util.createPNG(factory());
  const image = path.join(images, path.basename(entry, '.js') + '.png');
  png.pack().pipe(fs.createWriteStream(image));
}

const fs = require('fs');
const path = require('path');
const util = require('./util');

const fixtures = path.join(__dirname, 'fixtures');
const images = path.join(__dirname, 'images');

const entries = fs.readdirSync(fixtures);

for (let entry of entries) {
  const factory = require(path.join(fixtures, entry));
  const png = util.createPNG(factory());
  const image = path.join(images, path.basename(entry, '.js') + '.png');
  png.pack().pipe(fs.createWriteStream(image));
}

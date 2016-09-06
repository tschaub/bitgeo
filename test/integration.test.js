const PNG = require('pngjs').PNG;
const expect = require('code').expect;
const fs = require('fs');
const lab = exports.lab = require('lab').script();
const match = require('pixelmatch');
const path = require('path');
const util = require('./util');

const fixtures = path.join(__dirname, 'fixtures');
const images = path.join(__dirname, 'images');

const entries = fs.readdirSync(fixtures);

lab.experiment('integration', () => {

  for (let entry of entries) {

    lab.test(entry, done => {
      const factory = require(path.join(fixtures, entry));
      const bits = factory();
      const width = bits.maxI + 1 - bits.minI;
      const height = bits.maxJ + 1 - bits.minJ;

      const image = path.join(images, path.basename(entry, '.js') + '.png');
      const expectedPNG = PNG.sync.read(fs.readFileSync(image));
      expect(width).to.equal(expectedPNG.width);
      expect(height).to.equal(expectedPNG.height);

      const actualPNG = util.createPNG(bits);
      const diffPNG = new PNG({width: width, height: height});
      const mismatch = match(actualPNG, expectedPNG, diffPNG.data, width, height);
      if (mismatch) {
        const diff = path.join(images, path.basename(entry, '.js') + '.diff.png');
        diffPNG.pack().pipe(fs.createWriteStream(diff));
      }
      expect(mismatch).to.equal(0);

      done();
    });
  }

});

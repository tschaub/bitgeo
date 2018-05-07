const PNG = require('pngjs').PNG;
const expect = require('code').expect;
const fs = require('fs');
const lab = (exports.lab = require('lab').script());
const match = require('pixelmatch');
const path = require('path');
const util = require('./util');

const fixtures = path.join(__dirname, 'fixtures');
const images = path.join(__dirname, 'images');

const entries = fs.readdirSync(fixtures);

lab.experiment('integration', () => {
  for (const entry of entries) {
    lab.test(entry, () => {
      const factory = require(path.join(fixtures, entry));
      const bits = factory();
      expect(bits.getArea()).to.be.about(factory.area, 1e-5);

      const width = bits.maxI + 1 - bits.minI;
      const height = bits.maxJ + 1 - bits.minJ;

      const image = path.join(images, path.basename(entry, '.js') + '.png');
      const expectedPNG = PNG.sync.read(fs.readFileSync(image));
      expect(width).to.equal(expectedPNG.width);
      expect(height).to.equal(expectedPNG.height);

      const actualPNG = util.createPNG(bits);
      const diffPNG = new PNG({width: width, height: height});
      const mismatch = match(
        actualPNG.data,
        expectedPNG.data,
        diffPNG.data,
        width,
        height
      );
      if (mismatch) {
        const diff = path.join(
          images,
          path.basename(entry, '.js') + '.diff.png'
        );
        diffPNG.pack().pipe(fs.createWriteStream(diff));
      }
      expect(mismatch).to.equal(0);
    });
  }
});

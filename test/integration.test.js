/* eslint-env jest */

const PNG = require('pngjs').PNG;
const fs = require('fs');
const match = require('pixelmatch');
const path = require('path');
const util = require('./util');

const fixtures = path.join(__dirname, 'fixtures');
const images = path.join(__dirname, 'images');

const entries = fs.readdirSync(fixtures);

describe('integration', () => {
  for (const entry of entries) {
    test(entry, () => {
      const factory = require(path.join(fixtures, entry));
      const bits = factory();
      expect(bits.getArea()).toBeCloseTo(factory.area, 5);

      const width = bits.maxI + 1 - bits.minI;
      const height = bits.maxJ + 1 - bits.minJ;

      const image = path.join(images, path.basename(entry, '.js') + '.png');
      const expectedPNG = PNG.sync.read(fs.readFileSync(image));
      expect(width).toEqual(expectedPNG.width);
      expect(height).toEqual(expectedPNG.height);

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
      expect(mismatch).toEqual(0);
    });
  }
});

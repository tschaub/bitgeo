const PNG = require('pngjs').PNG;

exports.createPNG = function (bitbox) {
  const width = bitbox.maxI + 1 - bitbox.minI;
  const height = bitbox.maxJ + 1 - bitbox.minJ;

  const png = new PNG({
    width: width,
    height: height,
    colorType: 2,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0,
    },
  });

  for (let index = 0, length = png.data.length; index < length; index += 4) {
    png.data[index] = 100;
    png.data[index + 1] = 100;
    png.data[index + 2] = 90;
    png.data[index + 3] = 255;
  }

  bitbox.forEach((i, j) => {
    const col = i - bitbox.minI;
    const row = bitbox.maxJ - j;
    const offset = 4 * (col + row * width);
    png.data[offset] = 255;
    png.data[offset + 1] = 255;
    png.data[offset + 2] = 255;
  });

  return png;
};

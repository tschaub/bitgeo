const PNG = require('pngjs').PNG;

exports.createPNG = function(bitbox) {
  const width = bitbox.maxI + 1 - bitbox.minI;
  const height = bitbox.maxJ + 1 - bitbox.minJ;

  const png = new PNG({
    width: width,
    height: height,
    colorType: 2,
    fill: true,
    bgColor: {
      red: 0,
      green: 0,
      blue: 0
    }
  });

  bitbox.forEach((i, j) => {
    if (bitbox.get(i, j)) {
      var col = i - bitbox.minI;
      var row = bitbox.maxJ - j;
      var offset = 4 * (col + row * width);
      png.data[offset] = 255;
      png.data[offset + 1] = 255;
      png.data[offset + 2] = 255;
      png.data[offset + 3] = 255;
    }
  });

  return png;
};

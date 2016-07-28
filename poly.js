var BitBox = require('./bitbox');
var prepare = require('./util').prepare;

function quantize(segments, extent, resolution) {
  var x0 = Math.floor(extent[0] / resolution);
  var y0 = Math.floor(extent[1] / resolution);
  var values = [];
  while (segments) {
    var segment = segments.segment;
    var low = segment[0];
    var high = segment[1];
    values.push(Math.floor(low[0] / resolution) - x0);
    values.push(Math.floor(low[1] / resolution) - y0);
    values.push(Math.floor(high[0] / resolution) - x0);
    values.push(Math.floor(high[1] / resolution) - y0);
    segments = segments.next;
  }
  return {
    values: values,
    x0: x0,
    y0: y0,
    width: Math.floor(extent[2] / resolution) - x0 + 1,
    height: Math.floor(extent[3] / resolution) - y0 + 1
  };
}

module.exports = function(config) {
  var coordinates = config.coordinates;
  var resolution = config.resolution || 1;
  var data = {extent: config.extent};
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    data = prepare(coordinates[i], data);
  }

  var quantized = quantize(data.segments, data.extent, resolution);
  var values = quantized.values;
  var x0 = quantized.x0;
  var y0 = quantized.y0;
  var width = quantized.width;
  var height = quantized.height;
  var bits = new BitBox({x0: x0, y0: y0, width: width, height: height, resolution: resolution});

  var xs = [];
  var minI = 0;
  for (var y = 0; y < height; ++y) {
    for (var i = minI, ii = values.length; i < ii; i += 4) {
      var lowY = values[i + 1];
      var highY = values[i + 3];
      if (lowY === highY) {
        continue;
      } else if (lowY <= y && highY >= y) {
        var lowX = values[i];
        var highX = values[i + 2];
        xs.push(lowX + ((y - lowY) * (highX - lowX) / (highY - lowY)));
      } else if (lowY >= y) {
        break;
      } else {
        minI = i;
      }
    }
    xs.sort();
    for (var i = 0, ii = xs.length - 1; i < ii; i += 2) {
      var lowX = xs[i];
      var highX = xs[i + 1];
      if (lowX >= width) {
        break;
      } else if (highX < 0) {
        continue;
      } else {
        bits.fill(lowX, y, highX - lowX + 1, 1);
      }
    }
    xs.length = 0;
  }
  return bits;
};

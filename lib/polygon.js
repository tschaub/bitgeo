var BitBox = require('./bitbox');
var sortAndMerge = require('./ranges').sortAndMerge;
var prepare = require('./segments').prepare;
var quantize = require('./segments').quantize;

exports.getBits = function(coordinates, options) {
  options = options || {};
  var resolution = options.resolution || 1;
  var origin = options.origin || [0, 0];
  var segments;
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    segments = prepare(coordinates[i], segments);
  }

  var quantized = quantize(segments, resolution, origin);
  var values = quantized.values;
  var ranges = {};
  var minJ = quantized.minJ;
  var maxJ = quantized.maxJ;
  for (var j = minJ; j <= maxJ; ++j) {
    var intersections = [];
    for (var index = 0, length = values.length; index < length; index += 4) {
      var lowJ = values[index + 1];
      var highJ = values[index + 3];
      if (lowJ === highJ) {
        continue;
      } else if (lowJ <= j && highJ > j) {
        var lowI = values[index];
        var highI = values[index + 2];
        intersections.push(Math.round(lowI + ((j - lowJ) * (highI - lowI) / (highJ - lowJ))));
      } else if (lowJ > j) {
        break;
      }
    }
    if (intersections.length) {
      ranges[j] = sortAndMerge(intersections);
    }
  }
  return new BitBox({
    ranges: ranges,
    minI: quantized.minI,
    maxI: quantized.maxI,
    minJ: minJ,
    maxJ: maxJ,
    resolution: resolution,
    origin: origin
  });
};

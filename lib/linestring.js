var BitBox = require('./bitbox');
var sortAndMerge = require('./ranges').sortAndMerge;
var prepare = require('./segments').prepareLineString;

exports.getBits = function(coordinates, options) {
  options = options || {};
  var resolution = options.resolution || 1;
  var origin = options.origin || [0, 0];
  var quantized = prepare(coordinates, resolution, origin);
  var values = quantized.values;

  var ranges = {};
  var j;
  for (var index = 0, length = values.length; index < length; index += 5) {
    var lowI = values[index];
    var lowJ = values[index + 1];
    var highI = values[index + 2];
    var highJ = values[index + 3];

    var lastIntersection = NaN;
    for (j = lowJ; j <= highJ; ++j) {
      var intersection = Math.round(
        lowI + (j - lowJ) * (highI - lowI) / (highJ - lowJ)
      );
      if (!(j in ranges)) {
        ranges[j] = [];
      }
      if (isNaN(lastIntersection)) {
        ranges[j].push(intersection, intersection);
      } else {
        var delta;
        if (intersection > lastIntersection) {
          delta = 1;
        } else if (intersection < lastIntersection) {
          delta = -1;
        } else {
          delta = 0;
        }
        ranges[j].push(lastIntersection + delta, intersection);
      }
      lastIntersection = intersection;
    }
  }

  for (j in ranges) {
    ranges[j] = sortAndMerge(ranges[j]);
  }

  return new BitBox({
    ranges: ranges,
    minI: quantized.minI,
    maxI: quantized.maxI,
    minJ: quantized.minJ,
    maxJ: quantized.maxJ,
    origin: origin,
    resolution: resolution
  });
};

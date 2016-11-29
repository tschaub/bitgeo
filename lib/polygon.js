var BitBox = require('./bitbox');
var sortAndMerge = require('./ranges').sortAndMerge;
var prepare = require('./segments').preparePolygon;
var instructions = require('./segments').instructions;

function includes(instruction, test) {
  return (instruction & test) === test;
}

exports.getBits = function(coordinates, options) {
  options = options || {};
  var resolution = options.resolution || 1;
  var origin = options.origin || [0, 0];
  var quantized = prepare(coordinates, resolution, origin);
  var values = quantized.values;
  var ranges = {};
  var minJ = quantized.minJ;
  var maxJ = quantized.maxJ;
  for (var j = minJ; j <= maxJ; ++j) {
    var intersections = [];
    for (var index = 0, length = values.length; index < length; index += 5) {
      var lowI = values[index];
      var lowJ = values[index + 1];
      var highI = values[index + 2];
      var highJ = values[index + 3];
      var instruction = values[index + 4];
      if (j === lowJ && lowJ === highJ) {
        if (lowI === highI) {
          intersections.push(lowI, highI);
        } else {
          if (includes(instruction, instructions.USE_LOW_POINT)) {
            intersections.push(lowI);
          }
          if (includes(instruction, instructions.USE_HIGH_POINT)) {
            intersections.push(highI);
          }
        }
      } else if (j === lowJ) {
        if (includes(instruction, instructions.USE_LOW_POINT)) {
          intersections.push(lowI);
        }
      } else if (j === highJ) {
        if (includes(instruction, instructions.USE_HIGH_POINT)) {
          intersections.push(highI);
        }
      } else if (j > lowJ && j < highJ) {
        intersections.push(Math.round(lowI + ((j - lowJ) * (highI - lowI) / (highJ - lowJ))));
      } else if (j < lowJ) {
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

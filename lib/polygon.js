const BitBox = require('./bitbox');
const sortAndMerge = require('./ranges').sortAndMerge;
const prepare = require('./segments').preparePolygon;
const instructions = require('./segments').instructions;

function includes(instruction, test) {
  return (instruction & test) === test;
}

exports.getBits = function(coordinates, options) {
  options = options || {};
  const resolution = options.resolution || 1;
  const origin = options.origin || [0, 0];
  const quantized = prepare(coordinates, resolution, origin);
  const values = quantized.values;
  const ranges = {};
  const minJ = quantized.minJ;
  const maxJ = quantized.maxJ;
  for (let j = minJ; j <= maxJ; ++j) {
    const intersections = [];
    for (let index = 0, length = values.length; index < length; index += 5) {
      const lowI = values[index];
      const lowJ = values[index + 1];
      const highI = values[index + 2];
      const highJ = values[index + 3];
      const instruction = values[index + 4];
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
        intersections.push(
          Math.round(lowI + ((j - lowJ) * (highI - lowI)) / (highJ - lowJ))
        );
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

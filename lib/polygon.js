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
  const segments = quantized.segments;
  const ranges = {};
  const minJ = quantized.minJ;
  const maxJ = quantized.maxJ;
  for (let j = minJ; j <= maxJ; ++j) {
    const intersections = [];
    for (let index = 0, length = segments.length; index < length; ++index) {
      const segment = segments[index];
      const lowI = segment.lowI;
      const lowJ = segment.lowJ;
      const highI = segment.highI;
      const highJ = segment.highJ;
      if (j < lowJ) {
        break;
      }
      if (j > highJ) {
        continue;
      }

      const instruction = segment.instruction;

      // horizontal segment
      if (lowJ === highJ) {
        if (lowI === highI) {
          intersections.push(lowI, highI);
          continue;
        }
        if (includes(instruction, instructions.USE_LOW_POINT)) {
          intersections.push(lowI);
        }
        if (includes(instruction, instructions.USE_HIGH_POINT)) {
          intersections.push(highI);
        }
        continue;
      }

      const deltaX = segment.highX - segment.lowX;
      const lowCrossingY = j;
      const highCrossingY = j + 1;
      const fillLeft = segment.fillLeft;

      // exits above row
      if (j === lowJ) {
        if (includes(instruction, instructions.USE_LOW_POINT)) {
          const along =
            (highCrossingY - segment.lowY) / (segment.highY - segment.lowY);
          const crossingI = Math.floor(segment.lowX + along * deltaX);
          const crossesRight = crossingI > lowI;

          if ((fillLeft && crossesRight) || (!fillLeft && !crossesRight)) {
            intersections.push(crossingI);
          } else {
            intersections.push(lowI);
          }
        }
        continue;
      }

      // exits below row
      if (j === highJ) {
        if (includes(instruction, instructions.USE_HIGH_POINT)) {
          const along =
            (lowCrossingY - segment.lowY) / (segment.highY - segment.lowY);
          const crossingI = Math.floor(segment.lowX + along * deltaX);
          const crossesRight = crossingI > highI;
          if ((fillLeft && crossesRight) || (!fillLeft && !crossesRight)) {
            intersections.push(crossingI);
          } else {
            intersections.push(highI);
          }
        }
        continue;
      }

      // crosses row
      const lowAlong =
        (lowCrossingY - segment.lowY) / (segment.highY - segment.lowY);
      const lowCrossingI = Math.floor(segment.lowX + lowAlong * deltaX);

      const highAlong =
        (highCrossingY - segment.lowY) / (segment.highY - segment.lowY);
      const highCrossingI = Math.floor(segment.lowX + highAlong * deltaX);

      const crossesRight = highCrossingI > lowCrossingI;
      if ((fillLeft && crossesRight) || (!fillLeft && !crossesRight)) {
        intersections.push(highCrossingI);
      } else {
        intersections.push(lowCrossingI);
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

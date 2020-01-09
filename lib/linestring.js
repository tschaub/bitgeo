const BitBox = require('./bitbox');
const sortAndMerge = require('./ranges').sortAndMerge;
const prepare = require('./segments').prepareLineString;

exports.getBits = function(coordinates, options) {
  options = options || {};
  const resolution = options.resolution || 1;
  const origin = options.origin || [0, 0];
  const quantized = prepare(coordinates, resolution, origin);
  const values = quantized.values;

  const ranges = {};
  for (let index = 0, length = values.length; index < length; index += 5) {
    const lowI = values[index];
    const lowJ = values[index + 1];
    const highI = values[index + 2];
    const highJ = values[index + 3];

    let lastIntersection = NaN;
    for (let j = lowJ; j <= highJ; ++j) {
      const intersection = Math.round(
        lowI + ((j - lowJ) * (highI - lowI)) / (highJ - lowJ)
      );
      if (!(j in ranges)) {
        ranges[j] = [];
      }
      if (isNaN(lastIntersection)) {
        ranges[j].push(intersection, intersection);
      } else {
        let delta;
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

  for (const j in ranges) {
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

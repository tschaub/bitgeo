const BitBox = require('./bitbox');
const sortAndMerge = require('./ranges').sortAndMerge;
const prepare = require('./segments').prepareLineString;

exports.getBits = function(coordinates, options) {
  options = options || {};
  const resolution = options.resolution || 1;
  const origin = options.origin || [0, 0];
  const quantized = prepare(coordinates, resolution, origin);
  const segments = quantized.segments;

  const ranges = {};
  for (let index = 0, length = segments.length; index < length; ++index) {
    const segment = segments[index];
    const lowI = segment.lowI;
    const lowJ = segment.lowJ;
    const highI = segment.highI;
    const highJ = segment.highJ;

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

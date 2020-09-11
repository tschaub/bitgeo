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

    // horizontal segment
    if (lowJ === highJ) {
      if (!(lowJ in ranges)) {
        ranges[lowJ] = [];
      }
      ranges[lowJ].push(lowI, highI);
      continue;
    }

    for (let j = lowJ; j <= highJ; ++j) {
      if (!(j in ranges)) {
        ranges[j] = [];
      }

      const deltaX = segment.highX - segment.lowX;
      const lowCrossingY = j;
      const highCrossingY = j + 1;

      // exits above row
      if (j === lowJ) {
        const along =
          (highCrossingY - segment.lowY) / (segment.highY - segment.lowY);
        const crossingI = Math.floor(segment.lowX + along * deltaX);
        ranges[j].push(lowI, crossingI);
        continue;
      }

      // exits below row
      if (j === highJ) {
        const along =
          (lowCrossingY - segment.lowY) / (segment.highY - segment.lowY);
        const crossingI = Math.floor(segment.lowX + along * deltaX);
        ranges[j].push(crossingI, highI);
        continue;
      }

      // crosses row
      const lowAlong =
        (lowCrossingY - segment.lowY) / (segment.highY - segment.lowY);
      const lowCrossingI = Math.floor(segment.lowX + lowAlong * deltaX);

      const highAlong =
        (highCrossingY - segment.lowY) / (segment.highY - segment.lowY);
      const highCrossingI = Math.floor(segment.lowX + highAlong * deltaX);

      ranges[j].push(lowCrossingI, highCrossingI);
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

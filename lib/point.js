const BitBox = require('./bitbox.js');

exports.getBits = function (coordinates, options) {
  options = options || {};
  const resolution = options.resolution || 1;
  const origin = options.origin || [0, 0];
  const i = Math.floor((coordinates[0] - origin[0]) / resolution);
  const j = Math.floor((coordinates[1] - origin[1]) / resolution);
  const ranges = {};
  ranges[j] = [i, i];

  return new BitBox({
    ranges: ranges,
    minI: i,
    maxI: i,
    minJ: j,
    maxJ: j,
    origin: origin,
    resolution: resolution,
  });
};

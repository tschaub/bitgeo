var BitBox = require('./bitbox');

exports.getBits = function(coordinates, options) {
  options = options || {};
  var resolution = options.resolution || 1;
  var i = Math.round(coordinates[0] / resolution);
  var j = Math.round(coordinates[1] / resolution);
  var ranges = {};
  ranges[j] = [i, i];

  return new BitBox({
    ranges: ranges,
    minI: i,
    maxI: i,
    minJ: j,
    maxJ: j,
    resolution: resolution
  });
};

const bitgeo = require('../../lib/index.js');
const data = require('../data/subway.json');

module.exports = function () {
  return bitgeo(data, {resolution: 0.0005});
};

exports = module.exports;
exports.area = 0.00251925;

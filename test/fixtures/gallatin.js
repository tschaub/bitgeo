const bitgeo = require('../../lib/index.js');
const data = require('../data/gallatin.json');

module.exports = function () {
  return bitgeo(data, {resolution: 0.005});
};

exports = module.exports;
exports.area = 0.788575;

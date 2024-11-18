const bitgeo = require('../../lib/index.js');
const data = require('../data/mt.json');

module.exports = function () {
  return bitgeo(data, {resolution: 0.025});
};

exports = module.exports;
exports.area = 45.4875;

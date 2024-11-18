const bitgeo = require('../../lib/index.js');
const data = require('../data/world.json');

module.exports = function () {
  return bitgeo(data, {resolution: 0.5});
};

exports = module.exports;
exports.area = 21023.25;

const bitgeo = require('../../lib/index.js');
const canada = require('../data/canada.json');
const usa = require('../data/usa.json');

module.exports = function () {
  const options = {resolution: 0.25};
  return bitgeo(canada, options).or(bitgeo(usa, options));
};

exports = module.exports;
exports.area = 2979.125;

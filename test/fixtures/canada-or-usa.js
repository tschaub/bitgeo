const bitgeo = require('../../lib/index');
const canada = require('../data/canada.json');
const usa = require('../data/usa.json');

exports = module.exports = function() {
  const options = {resolution: 0.25};
  return bitgeo(canada, options).or(bitgeo(usa, options));
};

exports.area = 2877.625;

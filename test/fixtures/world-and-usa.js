const bitgeo = require('../../lib/index.js');
const usa = require('../data/usa.json');
const world = require('../data/world.json');

module.exports = function () {
  const options = {resolution: 0.25};
  return bitgeo(world, options).and(bitgeo(usa, options));
};

exports = module.exports;
exports.area = 1175.1875;

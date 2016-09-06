const bitgeo = require('../../lib/index');
const world = require('../data/world.json');
const usa = require('../data/usa.json');

module.exports = function() {
  const options = {resolution: 0.25};
  return bitgeo(world, options).and(bitgeo(usa, options));
};

const bitgeo = require('../../lib/index');
const data = require('../data/world.json');

module.exports = function() {
  return bitgeo(data, {resolution: 0.5});
};

const bitgeo = require('../../lib/index');
const data = require('../data/world.json');

exports = module.exports = function() {
  return bitgeo(data, {resolution: 0.5});
};

exports.area = 20620.25;

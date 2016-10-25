const bitgeo = require('../../lib/index');
const data = require('../data/mt.json');

exports = module.exports = function() {
  return bitgeo(data, {resolution: 0.025});
};

exports.area = 45.25;

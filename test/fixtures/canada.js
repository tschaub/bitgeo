const bitgeo = require('../../lib/index');
const data = require('../data/canada.json');

exports = module.exports = function() {
  return bitgeo(data, {resolution: 0.25});
};

exports.area = 1743.9375;

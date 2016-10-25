const bitgeo = require('../../lib/index');
const data = require('../data/gallatin.json');

exports = module.exports = function() {
  return bitgeo(data, {resolution: 0.005});
};

exports.area = 0.7912;

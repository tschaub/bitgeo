const bitgeo = require('../../lib/index');
const data = require('../data/subway.json');

exports = module.exports = function() {
  return bitgeo(data, {resolution: 0.0005});
};

exports.area = 0.00251925;

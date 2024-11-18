const bitgeo = require('../../lib/index.js');
const data = require('../data/usa.json');

module.exports = function () {
  return bitgeo(data, {resolution: 0.25});
};

exports = module.exports;
exports.area = 1175.1875;

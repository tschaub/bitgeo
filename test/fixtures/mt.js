const bitgeo = require('../../lib/index');
const data = require('../data/mt.json');

module.exports = function() {
  return bitgeo(data, {resolution: 0.025});
};

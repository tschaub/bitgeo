const bitgeo = require('../../lib/index');
const data = require('../data/usa.json');

module.exports = function() {
  return bitgeo(data, {resolution: 0.25});
};

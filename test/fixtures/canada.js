const bitgeo = require('../../lib/index');
const data = require('../data/canada.json');

module.exports = function() {
  return bitgeo(data, {resolution: 0.25});
};

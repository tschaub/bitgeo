const bitgeo = require('../../lib/index');
const data = require('../data/gallatin.json');

module.exports = function() {
  return bitgeo(data, {resolution: 0.005});
};

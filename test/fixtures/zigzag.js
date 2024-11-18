const bitgeo = require('../../lib/index.js');

module.exports = function () {
  const ring = [];
  ring.push([0, 0]);
  for (let i = 20; i <= 90; i += 5) {
    ring.push([i, i % 10]);
  }
  ring.push([100, 10]);
  for (let i = 90; i >= 20; i -= 5) {
    ring.push([i, 20 - (i % 10)]);
  }
  ring.push([0, 20]);
  ring.push([10, 10]);
  ring.push([0, 0]);

  return bitgeo(
    {
      type: 'Polygon',
      coordinates: [ring],
    },
    {
      resolution: 0.25,
    },
  );
};

exports = module.exports;
exports.area = 1499.5625;

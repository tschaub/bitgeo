const expect = require('code').expect;
const lab = exports.lab = require('lab').script();
const prepareLineString = require('../../lib/segments').prepareLineString;

lab.experiment('prepareLineString()', () => {

  lab.test('generates flat array of of sorted segments and instructions (bottom to top)', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];

    const flattened = prepareLineString(points, 1, [0, 0]);

    const expected = [
      5, -10, 20, -5, 0,
      5, -10, -5, 30, 0,
      0, 0, 10, 20, 0,
      10, 20, -5, 30, 0
    ];

    expect(flattened.values).to.equal(expected);

    done();
  });

});

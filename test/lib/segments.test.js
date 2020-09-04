/* eslint-env jest */

const prepareLineString = require('../../lib/segments').prepareLineString;

describe('prepareLineString()', () => {
  test('generates flat array of of sorted segments and instructions (bottom to top)', () => {
    const points = [
      [0, 0],
      [10, 20],
      [-5, 30],
      [5, -10],
      [20, -5]
    ];

    const flattened = prepareLineString(points, 1, [0, 0]);

    const expected = [
      5,
      -10,
      20,
      -5,
      0,
      5,
      -10,
      -5,
      30,
      0,
      0,
      0,
      10,
      20,
      0,
      10,
      20,
      -5,
      30,
      0
    ];

    expect(flattened.values).toEqual(expected);
  });
});

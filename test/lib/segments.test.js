/* eslint-env jest */

const prepareLineString = require('../../lib/segments').prepareLineString;
const directions = require('../../lib/segments').directions;

describe('prepareLineString()', () => {
  test('generates flat array of of sorted segments and instructions (bottom to top)', () => {
    const points = [
      [0.1, 0.9],
      [10.1, 20.9],
      [-5.1, 30.9],
      [5.1, -10.9],
      [20.1, -5.9]
    ];

    const flattened = prepareLineString(points, 1, [0, 0]);

    const expected = [
      {
        lowI: 5,
        lowX: 5.1,
        lowJ: -11,
        lowY: -10.9,
        highI: 20,
        highX: 20.1,
        highJ: -6,
        highY: -5.9,
        instruction: 0,
        direction: directions.UP,
        fillLeft: true
      },
      {
        lowI: 5,
        lowX: 5.1,
        lowJ: -11,
        lowY: -10.9,
        highI: -6,
        highX: -5.1,
        highJ: 30,
        highY: 30.9,
        instruction: 0,
        direction: directions.DOWN,
        fillLeft: false
      },
      {
        lowI: 0,
        lowX: 0.1,
        lowJ: 0,
        lowY: 0.9,
        highI: 10,
        highX: 10.1,
        highJ: 20,
        highY: 20.9,
        instruction: 0,
        direction: directions.UP,
        fillLeft: true
      },
      {
        lowI: 10,
        lowX: 10.1,
        lowJ: 20,
        lowY: 20.9,
        highI: -6,
        highX: -5.1,
        highJ: 30,
        highY: 30.9,
        instruction: 0,
        direction: directions.UP,
        fillLeft: true
      }
    ];

    expect(flattened.segments).toEqual(expected);
  });
});

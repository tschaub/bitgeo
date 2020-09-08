/* eslint-env jest */

const prepareLineString = require('../../lib/segments').prepareLineString;
const directions = require('../../lib/segments').directions;

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
      {
        lowI: 5,
        lowJ: -10,
        highI: 20,
        highJ: -5,
        instruction: 0,
        direction: directions.UP
      },
      {
        lowI: 5,
        lowJ: -10,
        highI: -5,
        highJ: 30,
        instruction: 0,
        direction: directions.DOWN
      },
      {
        lowI: 0,
        lowJ: 0,
        highI: 10,
        highJ: 20,
        instruction: 0,
        direction: directions.UP
      },
      {
        lowI: 10,
        lowJ: 20,
        highI: -5,
        highJ: 30,
        instruction: 0,
        direction: directions.UP
      }
    ];

    expect(flattened.segments).toEqual(expected);
  });
});

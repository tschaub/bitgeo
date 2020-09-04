/* eslint-env jest */

const bitgeo = require('../../lib');

const data = {
  world: require('../data/world.json'),
  canada: require('../data/canada.json'),
  usa: require('../data/usa.json'),
  mt: require('../data/mt.json')
};

describe('or()', () => {
  test('creates the union of an array of data', () => {
    const options = {resolution: 0.25};

    const union = bitgeo.or([data.canada, data.usa, data.mt], options);

    let expected = bitgeo(data.canada, options);
    expected = expected.or(bitgeo(data.usa, options));
    expected = expected.or(bitgeo(data.mt, options));

    expect(union.getArea()).toEqual(expected.getArea());
    expect(union.minI).toEqual(expected.minI);
    expect(union.minJ).toEqual(expected.minJ);
    expect(union.maxI).toEqual(expected.maxI);
    expect(union.maxJ).toEqual(expected.maxJ);
  });
});

describe('and()', () => {
  test('creates the intersection of an array of data', () => {
    const options = {resolution: 0.25};

    const intersection = bitgeo.and([data.world, data.usa], options);

    let expected = bitgeo(data.world, options);
    expected = expected.and(bitgeo(data.usa, options));

    expect(intersection.getArea()).toEqual(expected.getArea());
    expect(intersection.minI).toEqual(expected.minI);
    expect(intersection.minJ).toEqual(expected.minJ);
    expect(intersection.maxI).toEqual(expected.maxI);
    expect(intersection.maxJ).toEqual(expected.maxJ);

    expect(intersection.getArea()).toEqual(bitgeo(data.usa, options).getArea());
  });
});

describe('NONE', () => {
  test('is returned from contains for no overlap', () => {
    const options = {resolution: 0.25};

    const world = bitgeo(data.world, options);
    const contains = world.contains(
      world.maxI + 1,
      world.minJ,
      world.maxI + 10,
      world.maxJ
    );

    expect(contains).toEqual(bitgeo.NONE);
  });
});

describe('SOME', () => {
  test('is returned from contains for partial overlap', () => {
    const options = {resolution: 0.25};

    const world = bitgeo(data.world, options);
    const contains = world.contains(
      world.maxI - 1,
      world.minJ,
      world.maxI + 1,
      world.maxJ
    );

    expect(contains).toEqual(bitgeo.SOME);
  });
});

describe('ALL', () => {
  test('is returned from contains for complete overlap', () => {
    const options = {resolution: 0.25};

    const world = bitgeo(data.world, options);
    const mt = bitgeo(data.mt, options);
    const contains = world.contains(mt.minI, mt.minJ, mt.maxI, mt.maxJ);

    expect(contains).toEqual(bitgeo.ALL);
  });
});

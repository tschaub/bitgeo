const bitgeo = require('../../lib');
const expect = require('code').expect;
const lab = exports.lab = require('lab').script();

const data = {
  world: require('../data/world.json'),
  canada: require('../data/canada.json'),
  usa: require('../data/usa.json'),
  mt: require('../data/mt.json')
};

lab.experiment('or()', () => {

  lab.test('creates the union of an array of data', done => {
    const options = {resolution: 0.25};

    const union = bitgeo.or([data.canada, data.usa, data.mt], options);

    let expected = bitgeo(data.canada, options);
    expected = expected.or(bitgeo(data.usa, options));
    expected = expected.or(bitgeo(data.mt, options));

    expect(union.getArea()).to.equal(expected.getArea());
    expect(union.minI).to.equal(expected.minI);
    expect(union.minJ).to.equal(expected.minJ);
    expect(union.maxI).to.equal(expected.maxI);
    expect(union.maxJ).to.equal(expected.maxJ);
    done();
  });

});

lab.experiment('and()', () => {

  lab.test('creates the intersection of an array of data', done => {
    const options = {resolution: 0.25};

    const intersection = bitgeo.and([data.world, data.usa], options);

    let expected = bitgeo(data.world, options);
    expected = expected.and(bitgeo(data.usa, options));

    expect(intersection.getArea()).to.equal(expected.getArea());
    expect(intersection.minI).to.equal(expected.minI);
    expect(intersection.minJ).to.equal(expected.minJ);
    expect(intersection.maxI).to.equal(expected.maxI);
    expect(intersection.maxJ).to.equal(expected.maxJ);

    expect(intersection.getArea()).to.equal(bitgeo(data.usa, options).getArea());
    done();
  });

});

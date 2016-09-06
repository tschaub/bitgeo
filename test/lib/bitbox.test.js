const BitBox = require('../../lib/bitbox');
const expect = require('code').expect;
const lab = exports.lab = require('lab').script();

lab.experiment('constructor', () => {

  lab.test('creates a bitbox', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 1
    });
    expect(bitbox).to.be.an.instanceof(BitBox);
    done();
  });

});

lab.experiment('#minI', () => {

  lab.test('provides access to x0', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 1
    });
    expect(bitbox.minI).to.equal(0);
    done();
  });

});

lab.experiment('#maxI', () => {

  lab.test('provides access to x0', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 1
    });
    expect(bitbox.maxI).to.equal(20);
    done();
  });

});

lab.experiment('#minJ', () => {

  lab.test('provides access to width', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 1
    });
    expect(bitbox.minJ).to.equal(-10);
    done();
  });

});

lab.experiment('#maxJ', () => {

  lab.test('provides access to width', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 1
    });
    expect(bitbox.maxJ).to.equal(10);
    done();
  });

});

lab.experiment('#resolution', () => {

  lab.test('provides access to resolution', done => {
    const bitbox = new BitBox({
      minI: 0, maxI: 20,
      minJ: -10, maxJ: 10,
      ranges: {},
      resolution: 5
    });
    expect(bitbox.resolution).to.equal(5);
    done();
  });

});

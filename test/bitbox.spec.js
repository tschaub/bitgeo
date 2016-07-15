const BitBox = require('../bitbox');
const expect = require('code').expect;
const lab = exports.lab = require('lab').script();

lab.experiment('constructor', () => {

  lab.test('creates a bitbox', done => {
    const bitbox = new BitBox({width: 10, height: 20});
    expect(bitbox).to.be.an.instanceof(BitBox);
    done();
  });

  lab.test('throws if no width', done => {
    expect(() => new BitBox({height: 20})).to.throw(Error, 'Missing "width" in config');
    done();
  });

  lab.test('throws if no height', done => {
    expect(() => new BitBox({width: 20})).to.throw(Error, 'Missing "height" in config');
    done();
  });

});

lab.experiment('#x0', () => {

  lab.test('provides access to x0', done => {
    const bitbox = new BitBox({x0: 1, y0: 2, width: 3, height: 4, resolution: 5});
    expect(bitbox.x0).to.equal(1);
    done();
  });

  lab.test('defaults to 0', done => {
    const bitbox = new BitBox({y0: 2, width: 3, height: 4});
    expect(bitbox.x0).to.equal(0);
    done();
  });

});

lab.experiment('#y0', () => {

  lab.test('provides access to y0', done => {
    const bitbox = new BitBox({x0: 1, y0: 2, width: 3, height: 4, resolution: 5});
    expect(bitbox.y0).to.equal(2);
    done();
  });

  lab.test('defaults to 0', done => {
    const bitbox = new BitBox({x0: 1, width: 3, height: 4});
    expect(bitbox.y0).to.equal(0);
    done();
  });

});

lab.experiment('#width', () => {

  lab.test('provides access to width', done => {
    const bitbox = new BitBox({width: 3, height: 4});
    expect(bitbox.width).to.equal(3);
    done();
  });

});

lab.experiment('#height', () => {

  lab.test('provides access to height', done => {
    const bitbox = new BitBox({width: 3, height: 4});
    expect(bitbox.height).to.equal(4);
    done();
  });

});

lab.experiment('#resolution', () => {

  lab.test('provides access to resolution', done => {
    const bitbox = new BitBox({x0: 1, y0: 2, width: 3, height: 4, resolution: 5});
    expect(bitbox.resolution).to.equal(5);
    done();
  });

});

lab.experiment('#get()', () => {

  lab.test('returns a boolean', done => {
    const bitbox = new BitBox({x0: 1, y0: 2, width: 3, height: 4, resolution: 5});
    expect(bitbox.get(0, 0)).to.be.a.boolean();
    done();
  });

  lab.test('returns false if no bits have been set', done => {
    const bitbox = new BitBox({width: 2, height: 2});
    expect(bitbox.get(0, 0)).to.equal(false);
    expect(bitbox.get(1, 0)).to.equal(false);
    expect(bitbox.get(0, 1)).to.equal(false);
    expect(bitbox.get(1, 1)).to.equal(false);
    done();
  });

});

lab.experiment('#set()', () => {

  lab.test('sets a bit to true', done => {
    const bitbox = new BitBox({width: 2, height: 2});

    bitbox.set(0, 0);
    expect(bitbox.get(0, 0)).to.equal(true);
    expect(bitbox.get(1, 0)).to.equal(false);
    expect(bitbox.get(0, 1)).to.equal(false);
    expect(bitbox.get(1, 1)).to.equal(false);

    bitbox.set(1, 0);
    expect(bitbox.get(0, 0)).to.equal(true);
    expect(bitbox.get(1, 0)).to.equal(true);
    expect(bitbox.get(0, 1)).to.equal(false);
    expect(bitbox.get(1, 1)).to.equal(false);

    bitbox.set(0, 1);
    expect(bitbox.get(0, 0)).to.equal(true);
    expect(bitbox.get(1, 0)).to.equal(true);
    expect(bitbox.get(0, 1)).to.equal(true);
    expect(bitbox.get(1, 1)).to.equal(false);

    bitbox.set(1, 1);
    expect(bitbox.get(0, 0)).to.equal(true);
    expect(bitbox.get(1, 0)).to.equal(true);
    expect(bitbox.get(0, 1)).to.equal(true);
    expect(bitbox.get(1, 1)).to.equal(true);

    done();
  });

});

lab.experiment('#unset()', () => {

  lab.test('sets a bit to false', done => {
    const bitbox = new BitBox({width: 2, height: 2});
    bitbox.set(0, 0);
    bitbox.set(1, 0);
    bitbox.set(0, 1);
    bitbox.set(1, 1);

    bitbox.unset(0, 0);
    expect(bitbox.get(0, 0)).to.equal(false);
    expect(bitbox.get(1, 0)).to.equal(true);
    expect(bitbox.get(0, 1)).to.equal(true);
    expect(bitbox.get(1, 1)).to.equal(true);

    bitbox.unset(1, 0);
    expect(bitbox.get(0, 0)).to.equal(false);
    expect(bitbox.get(1, 0)).to.equal(false);
    expect(bitbox.get(0, 1)).to.equal(true);
    expect(bitbox.get(1, 1)).to.equal(true);

    bitbox.unset(0, 1);
    expect(bitbox.get(0, 0)).to.equal(false);
    expect(bitbox.get(1, 0)).to.equal(false);
    expect(bitbox.get(0, 1)).to.equal(false);
    expect(bitbox.get(1, 1)).to.equal(true);

    bitbox.unset(1, 1);
    expect(bitbox.get(0, 0)).to.equal(false);
    expect(bitbox.get(1, 0)).to.equal(false);
    expect(bitbox.get(0, 1)).to.equal(false);
    expect(bitbox.get(1, 1)).to.equal(false);

    done();
  });

});

lab.experiment('#fill()', () => {

  lab.test('sets a block of bits', done => {
    const width = 100;
    const height = 50;
    const bitbox = new BitBox({width: width, height: height});
    const left = 5;
    const right = 54;
    const bottom = 10;
    const top = 29;
    bitbox.fill(left, bottom, right - left + 1, top - bottom + 1);
    for (let j = 0; j < height; ++j) {
      for (let i = 0; i < width; ++i) {
        const filled = j >= bottom && j <= top && i >= left && i <= right;
        const got = bitbox.get(i, j);
        expect(`i: ${i} j: ${j} ${got}`).to.equal(`i: ${i} j: ${j} ${filled}`);
      }
    }

    done();
  });

});

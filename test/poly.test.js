const poly = require('../poly');
const expect = require('code').expect;
const lab = exports.lab = require('lab').script();

lab.experiment('poly()', () => {

  lab.test('creates a bitbox', done => {

    var bits = poly({
      extent: [0, 0, 3, 3],
      coordinates: [
        [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]
      ]
    });

    expect(bits.width).to.equal(4);
    expect(bits.height).to.equal(4);
    expect(bits.x0).to.equal(0);
    expect(bits.y0).to.equal(0);
    expect(bits.resolution).to.equal(1);

    expect(bits.get(0, 0)).to.be.false();
    expect(bits.get(1, 0)).to.be.false();
    expect(bits.get(2, 0)).to.be.false();
    expect(bits.get(3, 0)).to.be.false();

    expect(bits.get(0, 1)).to.be.false();
    expect(bits.get(1, 1)).to.be.true();
    expect(bits.get(2, 1)).to.be.true();
    expect(bits.get(3, 1)).to.be.false();

    expect(bits.get(0, 2)).to.be.false();
    expect(bits.get(1, 2)).to.be.true();
    expect(bits.get(2, 2)).to.be.true();
    expect(bits.get(3, 2)).to.be.false();

    expect(bits.get(0, 4)).to.be.false();
    expect(bits.get(1, 4)).to.be.false();
    expect(bits.get(2, 4)).to.be.false();
    expect(bits.get(3, 4)).to.be.false();

    done();
  });

});

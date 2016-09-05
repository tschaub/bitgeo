const expect = require('code').expect;
const lab = exports.lab = require('lab').script();
const prepare = require('../lib/segments').prepare;

lab.experiment('prepare()', () => {

  lab.test('generates a tree of sorted segments (bottom to top)', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];

    const segments = prepare(points);

    let node = segments;

    expect(node.segment).to.equal([[5, -10], [20, -5]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[5, -10], [-5, 30]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[0, 0], [10, 20]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[10, 20], [-5, 30]]);
    expect(node.next).to.be.null();

    done();
  });

  lab.test('extends any provided segments', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];

    const segments = {
      segment: [[100, -100], [100, -50]],
      next: {
        segment: [[200, 200], [200, 300]],
        next: null
      }
    };

    prepare(points, segments);

    let node = segments;

    expect(node.segment).to.equal([[100, -100], [100, -50]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[5, -10], [20, -5]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[5, -10], [-5, 30]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[0, 0], [10, 20]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[10, 20], [-5, 30]]);
    expect(node.next).to.be.an.object();

    node = node.next;
    expect(node.segment).to.equal([[200, 200], [200, 300]]);
    expect(node.next).to.be.null();

    done();
  });

});

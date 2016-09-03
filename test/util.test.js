const util = require('../util');
const expect = require('code').expect;
const lab = exports.lab = require('lab').script();

lab.experiment('expand()', () => {

  lab.test('extends a extent to include a point above right', done => {
    const extent = [-10, -20, 10, 20];
    util.expand(extent, [15, 30]);
    expect(extent).to.equal([-10, -20, 15, 30]);
    done();
  });

  lab.test('extends a extent to include a point above left', done => {
    const extent = [-10, -20, 10, 20];
    util.expand(extent, [-15, 30]);
    expect(extent).to.equal([-15, -20, 10, 30]);
    done();
  });

  lab.test('extends a extent to include a point below right', done => {
    const extent = [-10, -20, 10, 20];
    util.expand(extent, [15, -30]);
    expect(extent).to.equal([-10, -30, 15, 20]);
    done();
  });

  lab.test('extends a extent to include a point below left', done => {
    const extent = [-10, -20, 10, 20];
    util.expand(extent, [-15, -30]);
    expect(extent).to.equal([-15, -30, 10, 20]);
    done();
  });

  lab.test('does nothing for point inside', done => {
    const extent = [-10, -20, 10, 20];
    util.expand(extent, [0, 1]);
    expect(extent).to.equal([-10, -20, 10, 20]);
    done();
  });

});

lab.experiment('prepare()', () => {

  lab.test('generates an extent given a list of points', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];
    const data = util.prepare(points);
    expect(data.extent).to.equal([-5, -10, 20, 30]);

    done();
  });

  lab.test('extends any provided extent', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];
    const data = util.prepare(points, {extent: [-10, 0, 0, 50]});
    expect(data.extent).to.equal([-10, -10, 20, 50]);

    done();
  });

  lab.test('works when passed an empty extent', done => {
    const points = [
      [0, 0], [0, 0], [0, 0]
    ];
    const data = util.prepare(points, {extent: [Infinity, Infinity, -Infinity, -Infinity]});
    expect(data.extent).to.equal([0, 0, 0, 0]);

    done();
  });

  lab.test('generates a tree of sorted segments (bottom to top)', done => {
    const points = [
      [0, 0], [10, 20], [-5, 30], [5, -10], [20, -5]
    ];

    const data = util.prepare(points);

    let node = data.segments;

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

    var existing = {
      segment: [[100, -100], [100, -50]],
      next: {
        segment: [[200, 200], [200, 300]],
        next: null
      }
    };

    const data = util.prepare(points, {segments: existing});

    let node = data.segments;

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

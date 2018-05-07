const {sortAndMerge, and, or} = require('../../lib/ranges');
const expect = require('code').expect;
const lab = (exports.lab = require('lab').script());

lab.experiment('sortAndMerge()', () => {
  lab.test('sorts intersections into a flat array of ranges', () => {
    const intersections = [1, 0, -30, 10, 20, 5];
    const ranges = sortAndMerge(intersections);
    expect(ranges).to.equal([-30, 0, 1, 5, 10, 20]);
  });

  lab.test('merges adjacent ranges', () => {
    const intersections = [1, 0, -30, 10, 20, 5, 10, 5];
    const ranges = sortAndMerge(intersections);
    expect(ranges).to.equal([-30, 0, 1, 20]);
  });

  lab.test('works for point ranges', () => {
    const intersections = [0, 10, 20, 20, 30, 30, 20, 30];
    const ranges = sortAndMerge(intersections);
    expect(ranges).to.equal([0, 10, 20, 30]);
  });
});

lab.experiment('or()', () => {
  lab.test('returns the union of distinct range sets', () => {
    const ranges1 = [1, 3, 9, 11, 21, 25];
    const ranges2 = [6, 6, 14, 14, 16, 18];
    const ranges = or(ranges1, ranges2);
    expect(ranges).to.equal([1, 3, 6, 6, 9, 11, 14, 14, 16, 18, 21, 25]);
    expect(or(ranges2, ranges1)).to.equal(ranges);
  });

  lab.test('returns the union of overlapping sets', () => {
    const ranges1 = [1, 9, 11, 25];
    const ranges2 = [6, 6, 14, 14, 16, 18, 30, 32];
    const ranges = or(ranges1, ranges2);
    expect(ranges).to.equal([1, 9, 11, 25, 30, 32]);
    expect(or(ranges2, ranges1)).to.equal(ranges);
  });
});

lab.experiment('and()', () => {
  lab.test('returns the intersection of overlapping range sets', () => {
    const ranges1 = [1, 9, 11, 25];
    const ranges2 = [6, 6, 14, 14, 16, 18, 30, 32];
    const ranges = and(ranges1, ranges2);
    expect(ranges).to.equal([6, 6, 14, 14, 16, 18]);
    expect(and(ranges2, ranges1)).to.equal(ranges);
  });

  lab.test('returns the an empty set for distinct ranges', () => {
    const ranges1 = [1, 3, 10, 12];
    const ranges2 = [6, 6, 16, 18, 30, 32];
    const ranges = and(ranges1, ranges2);
    expect(ranges).to.equal([]);
    expect(and(ranges2, ranges1)).to.equal(ranges);
  });
});

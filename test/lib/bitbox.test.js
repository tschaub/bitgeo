const BitBox = require('../../lib/bitbox');
const expect = require('code').expect;
const lab = (exports.lab = require('lab').script());

lab.experiment('constructor', () => {
  lab.test('creates a bitbox', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox).to.be.an.instanceof(BitBox);
  });
});

lab.experiment('#minI', () => {
  lab.test('provides access to minI', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.minI).to.equal(0);
  });
});

lab.experiment('#maxI', () => {
  lab.test('provides access to maxI', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.maxI).to.equal(20);
  });
});

lab.experiment('#minJ', () => {
  lab.test('provides access to minJ', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.minJ).to.equal(-10);
  });
});

lab.experiment('#maxJ', () => {
  lab.test('provides access to maxJ', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.maxJ).to.equal(10);
  });
});

lab.experiment('#getArea()', () => {
  lab.test('provides access to width', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {
        1: [1, 1, 12, 20], // 10 bits
        3: [2, 10, 15, 15] // 10 bits
      },
      origin: [0, 0],
      resolution: 10
    });
    expect(bitbox.getArea()).to.equal(2000);
  });
});

lab.experiment('#maxJ', () => {
  lab.test('provides access to width', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.maxJ).to.equal(10);
  });
});

lab.experiment('#resolution', () => {
  lab.test('provides access to resolution', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 20,
      minJ: -10,
      maxJ: 10,
      ranges: {},
      origin: [0, 0],
      resolution: 5
    });
    expect(bitbox.resolution).to.equal(5);
  });
});

lab.experiment('#contains()', () => {
  lab.test('determines if none of the bits are true', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 10,
      minJ: 0,
      maxJ: 2,
      ranges: {
        0: [0, 10],
        1: [0, 10],
        2: [0, 10]
      },
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.contains(20, 0, 30, 2)).to.equal(BitBox.NONE);
  });

  lab.test('determines if all of the bits are true', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 10,
      minJ: 0,
      maxJ: 2,
      ranges: {
        0: [0, 10],
        1: [0, 10],
        2: [0, 10]
      },
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.contains(0, 0, 2, 2)).to.equal(BitBox.ALL);
  });

  lab.test('determines if some of the bits are true', () => {
    const bitbox = new BitBox({
      minI: 0,
      maxI: 10,
      minJ: 0,
      maxJ: 2,
      ranges: {
        0: [0, 10],
        1: [0, 10],
        2: [0, 10]
      },
      origin: [0, 0],
      resolution: 1
    });
    expect(bitbox.contains(5, 0, 20, 3)).to.equal(BitBox.SOME);
  });

  lab.test(
    'determines that some of the bits are true even if the bottom ones are all true (a)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 0, 11, 0)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are true even if the bottom ones are all true (b)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, -1, 11, 0)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are true even if the bottom ones are all true (c)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 0, 11, 1)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are true even if the bottom ones are all true (d)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, -1, 11, 1)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are if only the middle ones are true',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 1, 11, 1)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are if only some of the middle ones are true',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 1, 5, 1)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are if only the top ones are true (a)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 2, 11, 2)).to.equal(BitBox.SOME);
    }
  );

  lab.test(
    'determines that some of the bits are if only the top ones are true (b)',
    () => {
      const bitbox = new BitBox({
        minI: 0,
        maxI: 10,
        minJ: 0,
        maxJ: 2,
        ranges: {
          0: [0, 10],
          1: [0, 10],
          2: [0, 10]
        },
        origin: [0, 0],
        resolution: 1
      });
      expect(bitbox.contains(-1, 2, 11, 3)).to.equal(BitBox.SOME);
    }
  );
});

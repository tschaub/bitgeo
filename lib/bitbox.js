const orRanges = require('./ranges.js').or;
const andRanges = require('./ranges.js').and;

/**
 * @typedef {Object} Config
 * @property {number} minI The minI.
 * @property {number} maxI The maxI.
 * @property {number} minJ The minJ.
 * @property {number} maxJ The maxJ.
 * @property {number} resolution The resolution.
 * @property {Array<number>} origin The origin.
 * @property {Array} ranges The ranges.
 */

/**
 * @param {Config} config The config.
 */
function BitBox(config) {
  this.minI = config.minI;
  this.maxI = config.maxI;
  this.minJ = config.minJ;
  this.maxJ = config.maxJ;
  this.resolution = config.resolution;
  this.origin = config.origin;
  this._ranges = config.ranges;
  this._area = NaN;
}

BitBox.prototype.getArea = function () {
  if (isNaN(this._area)) {
    let area = 0;
    const cell = this.resolution * this.resolution;
    for (const j in this._ranges) {
      const range = this._ranges[j];
      for (let index = 0, length = range.length; index < length; index += 2) {
        area += cell * (1 + range[index + 1] - range[index]);
      }
    }
    this._area = area;
  }
  return this._area;
};

BitBox.prototype.get = function (i, j) {
  let set = false;
  if (j in this._ranges && i >= this.minI && i <= this.maxI) {
    const range = this._ranges[j];
    for (let index = 0, length = range.length; index < length; index += 2) {
      const leftI = range[index];
      const rightI = range[index + 1];
      if (leftI <= i && rightI >= i) {
        set = true;
        break;
      } else if (leftI > i) {
        break;
      }
    }
  }
  return set;
};

BitBox.prototype.or = function (bits) {
  if (this.resolution !== bits.resolution) {
    throw new Error('BitBoxes must have the same resolution');
  }
  if (this.origin[0] !== bits.origin[0] || this.origin[1] !== bits.origin[1]) {
    throw new Error('BitBoxes must have the same origin');
  }
  const ranges = {};
  for (const thisJ in this._ranges) {
    ranges[thisJ] = this._ranges[thisJ];
  }
  for (const otherJ in bits._ranges) {
    if (!(otherJ in ranges)) {
      ranges[otherJ] = bits._ranges[otherJ];
    } else {
      ranges[otherJ] = orRanges(this._ranges[otherJ], bits._ranges[otherJ]);
    }
  }
  return new BitBox({
    minI: Math.min(this.minI, bits.minI),
    maxI: Math.max(this.maxI, bits.maxI),
    minJ: Math.min(this.minJ, bits.minJ),
    maxJ: Math.max(this.maxJ, bits.maxJ),
    resolution: this.resolution,
    origin: this.origin,
    ranges: ranges,
  });
};

BitBox.prototype.and = function (bits) {
  if (this.resolution !== bits.resolution) {
    throw new Error('BitBoxes must have the same resolution');
  }
  if (this.origin[0] !== bits.origin[0] || this.origin[1] !== bits.origin[1]) {
    throw new Error('BitBoxes must have the same origin');
  }
  let minI = Infinity;
  let maxI = -Infinity;
  let minJ = Infinity;
  let maxJ = -Infinity;
  const ranges = {};
  for (const j in this._ranges) {
    if (j in bits._ranges) {
      const intersectingRanges = andRanges(this._ranges[j], bits._ranges[j]);
      if (intersectingRanges.length) {
        minJ = Math.min(minJ, j);
        maxJ = Math.max(maxJ, j);
        minI = Math.min(minI, intersectingRanges[0]);
        maxI = Math.max(
          maxI,
          intersectingRanges[intersectingRanges.length - 1],
        );
        ranges[j] = intersectingRanges;
      }
    }
  }
  return new BitBox({
    minI: minI,
    maxI: maxI,
    minJ: minJ,
    maxJ: maxJ,
    resolution: this.resolution,
    origin: this.origin,
    ranges: ranges,
  });
};

BitBox.prototype.forEachRange = function (callback) {
  for (let j in this._ranges) {
    j = Number(j);
    const ranges = this._ranges[j];
    for (let index = 0, length = ranges.length; index < length; index += 2) {
      const more = callback(ranges[index], ranges[index + 1], j);
      if (more === false) {
        return more;
      }
    }
  }
};

BitBox.prototype.forEach = function (callback) {
  this.forEachRange(function (minI, maxI, j) {
    for (let i = minI; i <= maxI; ++i) {
      const more = callback(i, j);
      if (more === false) {
        return more;
      }
    }
  });
};

const portions = {
  NONE: 0,
  SOME: 1,
  ALL: 2,
};

BitBox.prototype.contains = function (minI, minJ, maxI, maxJ) {
  const testRanges = [minI, maxI];
  let portion = portions.NONE;
  for (let j = minJ; j <= maxJ; ++j) {
    const ranges = this._ranges[j];
    if (!ranges) {
      if (portion === portions.ALL) {
        portion = portions.SOME;
        break;
      }
      continue;
    }
    const contained = andRanges(ranges, testRanges);
    if (contained.length === 0) {
      if (portion === portions.ALL) {
        portion = portions.SOME;
        break;
      }
      continue;
    }
    if (contained[0] === minI && contained[1] === maxI) {
      if (j === minJ) {
        portion = portions.ALL;
      } else if (portion === portions.NONE) {
        portion = portions.SOME;
        break;
      }
    } else {
      portion = portions.SOME;
      break;
    }
  }
  return portion;
};

module.exports = BitBox;
exports = module.exports;
exports.ALL = portions.ALL;
exports.NONE = portions.NONE;
exports.SOME = portions.SOME;

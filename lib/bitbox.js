var orRanges = require('./ranges').or;
var andRanges = require('./ranges').and;

function BitBox(config) {
  this.minI = config.minI;
  this.maxI = config.maxI;
  this.minJ = config.minJ;
  this.maxJ = config.maxJ;
  this.resolution = config.resolution;
  this._ranges = config.ranges;
  this._area = NaN;
}

BitBox.prototype.getArea = function() {
  if (isNaN(this._area)) {
    var area = 0;
    var resolution = this.resolution;
    for (var j in this._ranges) {
      var range = this._ranges[j];
      for (var index = 0, length = range.length; index < length; index += 2) {
        area += resolution * (1 + range[index + 1] - range[index]);
      }
    }
    this._area = area;
  }
  return this._area;
};

BitBox.prototype.get = function(i, j) {
  var set = false;
  if (j in this._ranges && i >= this.minI && i <= this.maxI) {
    var range = this._ranges[j];
    for (var index = 0, length = range.length; index < length; index += 2) {
      var leftI = range[index];
      var rightI = range[index + 1];
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

BitBox.prototype.or = function(bits) {
  if (this.resolution !== bits.resolution) {
    throw new Error('BitBoxes must have the same resolution');
  }
  var ranges = {};
  for (var thisJ in this._ranges) {
    ranges[thisJ] = this._ranges[thisJ];
  }
  for (var otherJ in bits._ranges) {
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
    ranges: ranges
  });
};

BitBox.prototype.and = function(bits) {
  if (this.resolution !== bits.resolution) {
    throw new Error('BitBoxes must have the same resolution');
  }
  var minI = Infinity;
  var maxI = -Infinity;
  var minJ = Infinity;
  var maxJ = -Infinity;
  var ranges = {};
  for (var j in this._ranges) {
    if (j in bits._ranges) {
      var intersectingRanges = andRanges(this._ranges[j], bits._ranges[j]);
      if (intersectingRanges.length) {
        minJ = Math.min(minJ, j);
        maxJ = Math.max(maxJ, j);
        minI = Math.min(minI, intersectingRanges[0]);
        maxI = Math.max(maxI, intersectingRanges[intersectingRanges.length - 1]);
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
    ranges: ranges
  });
};

BitBox.prototype.forEachRange = function(callback) {
  for (var j in this._ranges) {
    var ranges = this._ranges[j];
    for (var index = 0, length = ranges.length; index < length; index += 2) {
      var more = callback(ranges[index], ranges[index + 1], j);
      if (more === false) {
        return more;
      }
    }
  }
};

BitBox.prototype.forEach = function(callback) {
  this.forEachRange(function(minI, maxI, j) {
    for (var i = minI; i <= maxI; ++i) {
      var more = callback(i, j);
      if (more === false) {
        return more;
      }
    }
  });
};

module.exports = BitBox;

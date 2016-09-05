var orRanges = require('./ranges').or;


function BitBox(config) {
  this.minI = config.minI;
  this.maxI = config.maxI;
  this.minJ = config.minJ;
  this.maxJ = config.maxJ;
  this.resolution = config.resolution;
  this.ranges = config.ranges;
}

BitBox.prototype.get = function(i, j) {
  var set = false;
  if (j in this.ranges && i >= this.minI && i <= this.maxI) {
    var range = this.ranges[j];
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
  for (var thisJ in this.ranges) {
    ranges[thisJ] = this.ranges[thisJ];
  }
  for (var otherJ in bits.ranges) {
    if (!(otherJ in ranges)) {
      ranges[otherJ] = bits.ranges[otherJ];
    } else {
      ranges[otherJ] = orRanges(this.ranges[otherJ], bits.ranges[otherJ]);
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
  var ranges = {};
  for (var i in this.ranges) {
    if (i in bits.ranges) {
      // ranges[i] = andRanges(this.ranges[i], bits.ranges[i]);
      throw new Error('Not yet implemented (and ranges)');
    }
  }
  return new BitBox({
    minI: Math.max(this.minI, bits.minI),
    maxI: Math.min(this.maxI, bits.maxI),
    minJ: Math.max(this.minJ, bits.minJ),
    maxJ: Math.min(this.maxJ, bits.maxJ),
    resolution: this.resolution,
    ranges: ranges
  });
};

module.exports = BitBox;

function numerically(a, b) {
  return a > b ? 1 : -1;
}

exports.sortAndMerge = function(intersections) {
  var ranges = [];
  intersections.sort(numerically);
  var low = NaN;
  for (var i = 0, ii = intersections.length; i < ii; i += 2) {
    var thisLow = intersections[i];
    var thisHigh = intersections[i + 1];
    var nextLow = intersections[i + 2];
    if (thisHigh !== nextLow) {
      if (isNaN(low)) {
        ranges.push(thisLow, thisHigh);
      } else {
        ranges.push(low, thisHigh);
        low = NaN;
      }
    } else {
      if (isNaN(low)) {
        low = thisLow;
      }
    }
  }
  return ranges;
};

exports.or = function(ranges1, ranges2) {
  var lookup = [{
    ranges: ranges1,
    length: ranges1.length,
    index: 0
  }, {
    ranges: ranges2,
    length: ranges2.length,
    index: 0
  }];

  var ranges = [];
  var low = NaN;
  while (lookup[0].index < lookup[0].length || lookup[1].index < lookup[1].length) {
    if (lookup[0].index >= lookup[0].length || lookup[1].ranges[lookup[1].index] < lookup[0].ranges[lookup[0].index]) {
      lookup.reverse();
    }
    var thisLow = lookup[0].ranges[lookup[0].index];
    var thisHigh = lookup[0].ranges[lookup[0].index + 1];
    var otherLow = lookup[1].ranges[lookup[1].index];
    var otherHigh = lookup[1].ranges[lookup[1].index + 1];
    if (otherLow === undefined || thisHigh < otherLow + 1) {
      if (isNaN(low)) {
        ranges.push(thisLow, thisHigh);
      } else {
        ranges.push(low, thisHigh);
        low = NaN;
      }
      lookup[0].index += 2;
    } else {
      if (isNaN(low)) {
        low = thisLow;
      }
      if (otherHigh <= thisHigh) {
        lookup[1].index += 2;
      } else {
        lookup[0].index += 2;
      }
    }
  }
  return ranges;
};


exports.and = function(ranges1, ranges2) {
  var lookup = [{
    ranges: ranges1,
    length: ranges1.length,
    index: 0
  }, {
    ranges: ranges2,
    length: ranges2.length,
    index: 0
  }];

  var ranges = [];
  while (lookup[0].index < lookup[0].length && lookup[1].index < lookup[1].length) {
    if (lookup[1].ranges[lookup[1].index] < lookup[0].ranges[lookup[0].index]) {
      lookup.reverse();
    }
    var thisLow = lookup[0].ranges[lookup[0].index];
    var thisHigh = lookup[0].ranges[lookup[0].index + 1];
    var otherLow = lookup[1].ranges[lookup[1].index];
    var otherHigh = lookup[1].ranges[lookup[1].index + 1];
    if (thisHigh < otherLow) {
      lookup[0].index += 2;
    } else {
      ranges.push(Math.max(thisLow, otherLow), Math.min(thisHigh, otherHigh));
      if (thisHigh > otherHigh) {
        lookup[1].index += 2;
      } else {
        lookup[0].index += 2;
      }
    }
  }
  return ranges;
};

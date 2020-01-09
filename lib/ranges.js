function numerically(a, b) {
  return a > b ? 1 : -1;
}

exports.sortAndMerge = function(intersections) {
  const ranges = [];
  intersections.sort(numerically);
  let low = NaN;
  for (let i = 0, ii = intersections.length; i < ii; i += 2) {
    const thisLow = intersections[i];
    const thisHigh = intersections[i + 1];
    const nextLow = intersections[i + 2];
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
  const lookup = [
    {
      ranges: ranges1,
      length: ranges1.length,
      index: 0
    },
    {
      ranges: ranges2,
      length: ranges2.length,
      index: 0
    }
  ];

  const ranges = [];
  let low = NaN;
  while (
    lookup[0].index < lookup[0].length ||
    lookup[1].index < lookup[1].length
  ) {
    if (
      lookup[0].index >= lookup[0].length ||
      lookup[1].ranges[lookup[1].index] < lookup[0].ranges[lookup[0].index]
    ) {
      lookup.reverse();
    }
    const thisLow = lookup[0].ranges[lookup[0].index];
    const thisHigh = lookup[0].ranges[lookup[0].index + 1];
    const otherLow = lookup[1].ranges[lookup[1].index];
    const otherHigh = lookup[1].ranges[lookup[1].index + 1];
    if (otherLow === undefined || thisHigh < otherLow) {
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
  const lookup = [
    {
      ranges: ranges1,
      length: ranges1.length,
      index: 0
    },
    {
      ranges: ranges2,
      length: ranges2.length,
      index: 0
    }
  ];

  const ranges = [];
  while (
    lookup[0].index < lookup[0].length &&
    lookup[1].index < lookup[1].length
  ) {
    if (lookup[1].ranges[lookup[1].index] < lookup[0].ranges[lookup[0].index]) {
      lookup.reverse();
    }
    const thisLow = lookup[0].ranges[lookup[0].index];
    const thisHigh = lookup[0].ranges[lookup[0].index + 1];
    const otherLow = lookup[1].ranges[lookup[1].index];
    const otherHigh = lookup[1].ranges[lookup[1].index + 1];
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

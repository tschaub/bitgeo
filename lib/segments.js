
/**
 * Determine if one segment is lower than another.  A segment is lower if
 * its y-values are less than another.
 * @param {Object} test The test segment.
 * @param {Object} comparison The comparison segment.
 * @return {boolean} The test segment is lower than the comparison segment.
 */
var lower = exports.lower = function(test, comparison) {
  return test.low[1] < comparison.low[1] ||
      (test.low[1] === comparison.low[1] && test.high[1] < comparison.high[1]);
};

var directions = {
  UP: 'up',
  DOWN: 'down',
  RIGHT: 'right',
  LEFT: 'left',
  NONE: 'none'
};

function quantizePoint(point, resolution, origin) {
  return [
    Math.floor((point[0] - origin[0]) / resolution),
    Math.floor((point[1] - origin[1]) / resolution)
  ];
}

var instructions = {
  NONE: 0,
  USE_LOW_POINT: 1,
  USE_HIGH_POINT: 2
};

function addInstructions(previousSegment, segment, i) {
  switch (previousSegment.direction) {
    case directions.UP: {
      if (segment.direction === directions.LEFT) {
        previousSegment.instruction |= instructions.USE_HIGH_POINT;
      } else if (segment.direction === directions.DOWN) {
        previousSegment.instruction |= instructions.USE_HIGH_POINT;
        segment.instruction |= instructions.USE_HIGH_POINT;
      } else if (segment.direction === directions.UP) {
        segment.instruction |= instructions.USE_LOW_POINT;
      }
      break;
    }
    case directions.LEFT: {
      if (segment.direction === directions.DOWN) {
        segment.instruction |= instructions.USE_HIGH_POINT;
      } else if (segment.direction === directions.RIGHT) {
        segment.instruction |= instructions.USE_LOW_POINT;
      }
      break;
    }
    case directions.DOWN: {
      if (segment.direction === directions.RIGHT) {
        previousSegment.instruction |= instructions.USE_LOW_POINT;
      } else if (segment.direction === directions.UP) {
        previousSegment.instruction |= instructions.USE_LOW_POINT;
        segment.instruction |= instructions.USE_LOW_POINT;
      } else if (segment.direction === directions.DOWN) {
        segment.instruction |= instructions.USE_HIGH_POINT;
      }
      break;
    }
    case directions.RIGHT: {
      if (segment.direction === directions.UP) {
        segment.instruction |= instructions.USE_LOW_POINT;
      } else if (segment.direction === directions.LEFT) {
        segment.instruction |= instructions.USE_HIGH_POINT;
      }
      break;
    }
    default: {
      // pass
    }
  }
}

function flatten(segments) {
  var values = [];
  var minI = Infinity;
  var maxI = -Infinity;
  var minJ = Infinity;
  var maxJ = -Infinity;
  var segment = segments.first;
  while (segment) {
    var lowI = segment.low[0];
    var lowJ = segment.low[1];
    var highI = segment.high[0];
    var highJ = segment.high[1];
    if (lowI < minI) {
      minI = lowI;
    }
    if (lowI > maxI) {
      maxI = lowI;
    }
    if (highI < minI) {
      minI = highI;
    }
    if (highI > maxI) {
      maxI = highI;
    }
    if (lowJ < minJ) {
      minJ = lowJ;
    }
    if (highJ > maxJ) {
      maxJ = highJ;
    }
    values.push(lowI, lowJ, highI, highJ, segment.instruction);
    segment = segment.next;
  }
  return {
    values: values,
    minI: minI,
    maxI: maxI,
    minJ: minJ,
    maxJ: maxJ
  };
}

function isClockwise(ring) {
  var doubleArea = 0;
  for (var i = 0, ii = ring.length - 1; i < ii; ++i) {
    var point0 = ring[i];
    var point1 = ring[i + 1];
    doubleArea += (point1[0] - point0[0]) * (point1[1] + point0[1]);
  }
  return doubleArea > 0;
}

function preparePolygon(coordinates, resolution, origin) {
  var segments;
  for (var i = 0, ii = coordinates.length; i < ii; ++i) {
    var ring = coordinates[i];
    var clockwise = isClockwise(ring);
    if (i === 0 && clockwise || i > 0 && !clockwise) {
      ring = ring.slice().reverse();
    }
    segments = getSortedSegments(ring, resolution, origin, true, segments);
  }
  return flatten(segments);
}

function prepareLineString(coordinates, resolution, origin) {
  var segments = getSortedSegments(coordinates, resolution, origin);
  return flatten(segments);
}

function getSortedSegments(points, resolution, origin, closed, segments) {
  var previousSegment = null;
  var firstSegment = null;
  for (var i = 0, ii = points.length - 1; i < ii; ++i) {
    var point0 = quantizePoint(points[i], resolution, origin);
    var point1 = quantizePoint(points[i + 1], resolution, origin);
    var direction = null;
    var low, high;
    if (point1[1] > point0[1]) {
      direction = directions.UP;
      low = point0;
      high = point1;
    } else if (point1[1] < point0[1]) {
      direction = directions.DOWN;
      low = point1;
      high = point0;
    } else if (point1[0] > point0[0]) {
      direction = directions.RIGHT;
      low = point0;
      high = point1;
    } else if (point1[0] < point0[0]) {
      direction = directions.LEFT;
      low = point1;
      high = point0;
    } else {
      // ignore all but the first zero length segment
      if (!firstSegment) {
        direction = directions.NONE;
        low = point0;
        high = point1;
      } else {
        continue;
      }
    }

    var segment = {
      direction: direction,
      low: low,
      high: high,
      instruction: instructions.NONE,
      next: null
    };

    if (!firstSegment) {
      firstSegment = segment;
    }
    if (closed && previousSegment) {
      addInstructions(previousSegment, segment, i);
    }

    if (!segments) {
      segments = {
        first: segment
      };
    } else if (lower(segment, segments.first)) {
      segment.next = segments.first;
      segments.first = segment;
    } else {
      var candidate = segments.first;
      while (candidate) {
        if (!candidate.next) {
          candidate.next = segment;
          break;
        } else if (lower(segment, candidate.next)) {
          segment.next = candidate.next;
          candidate.next = segment;
          break;
        } else {
          candidate = candidate.next;
        }
      }
    }
    previousSegment = segment;
  }

  if (closed && previousSegment && firstSegment && previousSegment !== firstSegment) {
    addInstructions(previousSegment, firstSegment);
  }
  return segments;
}

exports.preparePolygon = preparePolygon;
exports.prepareLineString = prepareLineString;
exports.instructions = instructions;

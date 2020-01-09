/**
 * Determine if one segment is lower than another.  A segment is lower if
 * its y-values are less than another.
 * @param {Object} test The test segment.
 * @param {Object} comparison The comparison segment.
 * @return {boolean} The test segment is lower than the comparison segment.
 */
const lower = (exports.lower = function(test, comparison) {
  return (
    test.low[1] < comparison.low[1] ||
    (test.low[1] === comparison.low[1] && test.high[1] < comparison.high[1])
  );
});

const directions = {
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

const instructions = {
  NONE: 0,
  USE_LOW_POINT: 1,
  USE_HIGH_POINT: 2
};

function addInstructions(previousSegment, segment) {
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
  const values = [];
  let minI = Infinity;
  let maxI = -Infinity;
  let minJ = Infinity;
  let maxJ = -Infinity;
  let segment = segments.first;
  while (segment) {
    const lowI = segment.low[0];
    const lowJ = segment.low[1];
    const highI = segment.high[0];
    const highJ = segment.high[1];
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
  let doubleArea = 0;
  for (let i = 0, ii = ring.length - 1; i < ii; ++i) {
    const point0 = ring[i];
    const point1 = ring[i + 1];
    doubleArea += (point1[0] - point0[0]) * (point1[1] + point0[1]);
  }
  return doubleArea > 0;
}

function preparePolygon(coordinates, resolution, origin) {
  let segments;
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    let ring = coordinates[i];
    const clockwise = isClockwise(ring);
    if ((i === 0 && clockwise) || (i > 0 && !clockwise)) {
      ring = ring.slice().reverse();
    }
    segments = getSortedSegments(ring, resolution, origin, true, segments);
  }
  return flatten(segments);
}

function prepareLineString(coordinates, resolution, origin) {
  const segments = getSortedSegments(coordinates, resolution, origin);
  return flatten(segments);
}

function getSortedSegments(points, resolution, origin, closed, segments) {
  let previousSegment = null;
  let firstSegment = null;
  for (let i = 0, ii = points.length - 1; i < ii; ++i) {
    const point0 = quantizePoint(points[i], resolution, origin);
    const point1 = quantizePoint(points[i + 1], resolution, origin);
    let direction = null;
    let low, high;
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
      // ignore all but the last zero length segment
      if (!firstSegment && i === ii - 1) {
        direction = directions.NONE;
        low = point0;
        high = point1;
      } else {
        continue;
      }
    }

    const segment = {
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
      addInstructions(previousSegment, segment);
    }

    if (!segments) {
      segments = {
        first: segment
      };
    } else if (lower(segment, segments.first)) {
      segment.next = segments.first;
      segments.first = segment;
    } else {
      let candidate = segments.first;
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

  if (
    closed &&
    previousSegment &&
    firstSegment &&
    previousSegment !== firstSegment
  ) {
    addInstructions(previousSegment, firstSegment);
  }
  return segments;
}

exports.preparePolygon = preparePolygon;
exports.prepareLineString = prepareLineString;
exports.instructions = instructions;

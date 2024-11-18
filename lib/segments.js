/**
 * Determine if one segment is lower than another.  A segment is lower if
 * its y-values are less than another.
 * @param {Object} test The test segment.
 * @param {Object} comparison The comparison segment.
 * @return {boolean} The test segment is lower than the comparison segment.
 */
function lower(test, comparison) {
  return (
    test.lowJ < comparison.lowJ ||
    (test.lowJ === comparison.lowJ && test.highJ < comparison.highJ)
  );
}

/**
 * @enum {string}
 */
const directions = {
  UP: 'up',
  DOWN: 'down',
  RIGHT: 'right',
  LEFT: 'left',
  NONE: 'none',
};

/**
 * @typedef {Object} Segment
 * @property {number} lowI The lowI.
 * @property {number} lowJ The lowJ.
 * @property {number} lowX The lowX.
 * @property {number} lowY The lowY.
 * @property {number} highI The highI.
 * @property {number} highJ The highJ.
 * @property {number} highX The highX.
 * @property {number} highY The highY.
 * @property {directions} direction The direction.
 * @property {boolean} fillLeft The fillLeft.
 * @property {instructions} instruction The instruction.
 */

/**
 * @typedef {Object} Node
 * @property {Segment} segment The segment.
 * @property {Node} next The next node.
 */

/**
 * @param {Array<number>} point The point.
 * @param {number} resolution The resolution.
 * @param {Array<number>} origin The origin.
 * @return {Array<number>} The transformed point.
 */
function transformPoint(point, resolution, origin) {
  return [
    (point[0] - origin[0]) / resolution,
    (point[1] - origin[1]) / resolution,
  ];
}

/**
 * @enum {number}
 */
const instructions = {
  NONE: 0,
  USE_LOW_POINT: 1,
  USE_HIGH_POINT: 2,
};

/**
 * @param {Segment} previousSegment The previous segment.
 * @param {Segment} segment This segment.
 */
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

/**
 * @typedef {Object} FlattenedSegments
 * @property {Array<Segment>} segments The segments.
 * @property {number} minI The minI.
 * @property {number} maxI The maxI.
 * @property {number} minJ The minJ.
 * @property {number} maxJ The maxJ.
 */

/**
 * @param {Node} root The root node.
 * @return {FlattenedSegments} The flattened segments.
 */
function flatten(root) {
  const segments = [];
  let minI = Infinity;
  let maxI = -Infinity;
  let minJ = Infinity;
  let maxJ = -Infinity;
  let node = root;
  while (node) {
    const segment = node.segment;
    const lowI = segment.lowI;
    const lowJ = segment.lowJ;
    const highI = segment.highI;
    const highJ = segment.highJ;
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
    segments.push(segment);
    node = node.next;
  }
  return {
    segments: segments,
    minI: minI,
    maxI: maxI,
    minJ: minJ,
    maxJ: maxJ,
  };
}

/**
 * @param {Array<Array<number>>} ring The ring.
 * @return {boolean} The ring is clockwise.
 */
function isClockwise(ring) {
  let doubleArea = 0;
  for (let i = 0, ii = ring.length - 1; i < ii; ++i) {
    const point0 = ring[i];
    const point1 = ring[i + 1];
    doubleArea += (point1[0] - point0[0]) * (point1[1] + point0[1]);
  }
  return doubleArea > 0;
}

/**
 * @param {Array<Array<number>>} coordinates The coordinates.
 * @param {number} resolution The resolution.
 * @param {Array<number>} origin The origin.
 * @return {FlattenedSegments} The flattened segments.
 */
function preparePolygon(coordinates, resolution, origin) {
  let root;
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    let ring = coordinates[i];
    const clockwise = isClockwise(ring);
    if ((i === 0 && clockwise) || (i > 0 && !clockwise)) {
      ring = ring.slice().reverse();
    }
    root = getSortedSegments(ring, resolution, origin, true, root);
  }
  return flatten(root);
}

/**
 * @param {Array<Array<number>>} coordinates The coordinates.
 * @param {number} resolution The resolution.
 * @param {Array<number>} origin The origin.
 * @return {FlattenedSegments} The flattened segments.
 */
function prepareLineString(coordinates, resolution, origin) {
  const root = getSortedSegments(coordinates, resolution, origin);
  return flatten(root);
}

/**
 * @param {Array<Array<number>>} points The points.
 * @param {number} resolution The resolution.
 * @param {Array<number>} origin The origin.
 * @param {boolean} closed The ring is closed.
 * @param {Node} root The root node.
 * @return {Node} The sorted segments.
 */
function getSortedSegments(points, resolution, origin, closed, root) {
  let previousNode = null;
  let firstNode = null;
  for (let i = 0, ii = points.length - 1; i < ii; ++i) {
    const point0 = transformPoint(points[i], resolution, origin);
    const i0 = Math.floor(point0[0]);
    const j0 = Math.floor(point0[1]);
    const point1 = transformPoint(points[i + 1], resolution, origin);
    const i1 = Math.floor(point1[0]);
    const j1 = Math.floor(point1[1]);
    let direction = null;
    let lowI, lowJ, lowX, lowY, highI, highJ, highX, highY;
    let fillLeft;
    if (j1 > j0) {
      direction = directions.UP;
      lowI = i0;
      lowJ = j0;
      lowX = point0[0];
      lowY = point0[1];
      highI = i1;
      highJ = j1;
      highX = point1[0];
      highY = point1[1];
      fillLeft = true;
    } else if (j1 < j0) {
      direction = directions.DOWN;
      lowI = i1;
      lowJ = j1;
      lowX = point1[0];
      lowY = point1[1];
      highI = i0;
      highJ = j0;
      highX = point0[0];
      highY = point0[1];
      fillLeft = false;
    } else if (i1 > i0) {
      direction = directions.RIGHT;
      lowI = i0;
      lowJ = j0;
      lowX = point0[0];
      lowY = point0[1];
      highI = i1;
      highJ = j1;
      highX = point1[0];
      highY = point1[1];
      fillLeft = true;
    } else if (i1 < i0) {
      direction = directions.LEFT;
      lowI = i1;
      lowJ = j1;
      lowX = point1[0];
      lowY = point1[1];
      highI = i0;
      highJ = j0;
      highX = point0[0];
      highY = point0[1];
      fillLeft = false;
    } else {
      // ignore all but the last zero length segment
      if (!root && i === ii - 1) {
        direction = directions.NONE;
        lowI = i0;
        lowJ = j0;
        lowX = point0[0];
        lowY = point0[1];
        highI = i1;
        highJ = j1;
        highX = point1[0];
        highY = point1[1];
        fillLeft = true;
      } else {
        continue;
      }
    }

    const node = {
      segment: {
        lowI: lowI,
        lowJ: lowJ,
        lowX: lowX,
        lowY: lowY,
        highI: highI,
        highJ: highJ,
        highX: highX,
        highY: highY,
        direction: direction,
        fillLeft: fillLeft,
        instruction: instructions.NONE,
      },
      next: null,
    };

    if (!firstNode) {
      firstNode = node;
    }
    if (closed && previousNode) {
      addInstructions(previousNode.segment, node.segment);
    }

    if (!root) {
      root = node;
    } else if (lower(node.segment, root.segment)) {
      node.next = root;
      root = node;
    } else {
      let candidate = root;
      while (candidate) {
        if (!candidate.next) {
          candidate.next = node;
          break;
        } else if (lower(node.segment, candidate.next.segment)) {
          node.next = candidate.next;
          candidate.next = node;
          break;
        } else {
          candidate = candidate.next;
        }
      }
    }
    previousNode = node;
  }

  if (closed && previousNode && firstNode && previousNode !== firstNode) {
    addInstructions(previousNode.segment, firstNode.segment);
  }
  return root;
}

exports.directions = directions;
exports.instructions = instructions;
exports.lower = lower;
exports.prepareLineString = prepareLineString;
exports.preparePolygon = preparePolygon;


/**
 * Determine if one segment is lower than another.  A segment is lower if
 * its y-values are less than another.  Segments are pairs of points ordered
 * from low to high (in terms of y value).
 * @param {Array<number>} test The test segment.
 * @param {Array<number>} comparison The comparison segment.
 * @return {boolean} The test segment is lower than the comparison segment.
 */
var lower = exports.lower = function(test, comparison) {
  return test[0][1] < comparison[0][1] ||
      (test[0][1] === comparison[0][1] && test[1][1] < comparison[1][1]);
};

exports.quantize = function(segments, resolution, origin) {
  var values = [];
  var minI = Infinity;
  var maxI = -Infinity;
  var minJ = Infinity;
  var maxJ = -Infinity;
  while (segments) {
    var segment = segments.segment;
    var lowPoint = segment[0];
    var highPoint = segment[1];
    var lowI = Math.floor((lowPoint[0] - origin[0]) / resolution);
    var lowJ = Math.floor((lowPoint[1] - origin[1]) / resolution);
    var highI = Math.floor((highPoint[0] - origin[0]) / resolution);
    var highJ = Math.floor((highPoint[1] - origin[1]) / resolution);
    // TODO: skip zero length segments
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
    values.push(lowI, lowJ, highI, highJ);
    segments = segments.next;
  }
  return {
    values: values,
    minI: minI,
    maxI: maxI,
    minJ: minJ,
    maxJ: maxJ
  };
};

exports.prepare = function(points, segments) {
  for (var i = 0, ii = points.length - 1; i < ii; ++i) {
    var point0 = points[i];
    var point1 = points[i + 1];
    var segment;
    if (point0[1] < point1[1]) {
      segment = [point0, point1];
    } else {
      segment = [point1, point0];
    }

    if (!segments) {
      segments = {
        segment: segment,
        next: null
      };
    } else if (lower(segment, segments.segment)) {
      segments = {
        segment: segment,
        next: segments
      };
    } else {
      var candidate = segments;
      while (candidate) {
        if (!candidate.next) {
          candidate.next = {
            segment: segment,
            next: null
          };
          break;
        } else if (lower(segment, candidate.next.segment)) {
          candidate.next = {
            segment: segment,
            next: candidate.next
          };
          break;
        } else {
          candidate = candidate.next;
        }
      }
    }
  }
  return segments;
};

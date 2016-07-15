var expand = exports.expand = function(box, point) {
  if (point[0] < box[0]) {
    box[0] = point[0];
  }
  if (point[1] < box[1]) {
    box[1] = point[1];
  }
  if (point[0] > box[2]) {
    box[2] = point[0];
  }
  if (point[1] > box[3]) {
    box[3] = point[1];
  }
};

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

var prepare = exports.prepare = function(points, data) {
  data = data || {};
  var segments = data.segments || null;
  var extent = data.extent || [Infinity, Infinity, -Infinity, -Infinity];

  for (var i = 0, ii = points.length - 1; i < ii; ++i) {
    var point0 = points[i];
    var point1 = points[i + 1];
    var segment;
    if (point0[1] < point1[1]) {
      segment = [point0, point1];
    } else {
      segment = [point1, point0];
    }

    expand(extent, segment[0]);
    expand(extent, segment[1]);

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
  data.segments = segments;
  data.extent = extent;
  return data
};

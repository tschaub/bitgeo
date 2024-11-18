const BitBox = require('./bitbox.js');
const linestring = require('./linestring.js');
const point = require('./point.js');
const polygon = require('./polygon.js');

const lookup = {
  MultiLineString: linestring,
  MultiPoint: point,
  MultiPolygon: polygon,
};

/**
 * @param {Object} data The data.
 * @param {Object} options The options.
 * @return {Object} The bits.
 */
function getBits(data, options) {
  let bits, newBits, i, ii;
  switch (data.type) {
    case 'FeatureCollection': {
      const features = data.features;
      for (i = 0, ii = features.length; i < ii; ++i) {
        newBits = getBits(features[i], options);
        if (bits) {
          bits = bits.or(newBits);
        } else {
          bits = newBits;
        }
      }
      break;
    }
    case 'Feature': {
      bits = getBits(data.geometry, options);
      break;
    }
    case 'Point': {
      bits = point.getBits(data.coordinates, options);
      break;
    }
    case 'LineString': {
      bits = linestring.getBits(data.coordinates, options);
      break;
    }
    case 'Polygon': {
      bits = polygon.getBits(data.coordinates, options);
      break;
    }
    case 'MultiPoint':
    case 'MultiLineString':
    case 'MultiPolygon': {
      for (i = 0, ii = data.coordinates.length; i < ii; ++i) {
        newBits = lookup[data.type].getBits(data.coordinates[i], options);
        if (bits) {
          bits = bits.or(newBits);
        } else {
          bits = newBits;
        }
      }
      break;
    }
    case 'GeometryCollection': {
      const geometries = data.geometries;
      for (i = 0, ii = geometries.length; i < ii; ++i) {
        newBits = getBits(geometries[i], options);
        if (bits) {
          bits = bits.or(newBits);
        } else {
          bits = newBits;
        }
      }
      break;
    }
    default: {
      throw new Error('Unsupported data type: ' + data.type);
    }
  }
  return bits;
}

module.exports = getBits;
exports = module.exports;

exports.ALL = BitBox.ALL;
exports.NONE = BitBox.NONE;
exports.SOME = BitBox.SOME;

exports.and = function (datas, options) {
  let intersection = null;
  for (let i = 0, ii = datas.length; i < ii; ++i) {
    const bits = getBits(datas[i], options);
    if (!intersection) {
      intersection = bits;
    } else {
      intersection = intersection.and(bits);
    }
  }
  return intersection;
};

exports.or = function (datas, options) {
  let union = null;
  for (let i = 0, ii = datas.length; i < ii; ++i) {
    const bits = getBits(datas[i], options);
    if (!union) {
      union = bits;
    } else {
      union = union.or(bits);
    }
  }
  return union;
};

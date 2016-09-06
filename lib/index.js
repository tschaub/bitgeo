var linestring = require('./linestring');
var point = require('./point');
var polygon = require('./polygon');

var lookup = {
  MultiLineString: linestring,
  MultiPoint: point,
  MultiPolygon: polygon
};

function getBits(data, options) {
  var bits, newBits, i, ii;
  switch (data.type) {
    case 'FeatureCollection': {
      var features = data.features;
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
      var geometries = data.geometries;
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

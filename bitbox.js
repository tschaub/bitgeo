var BITS_PER_VALUE = 32;

function BitBox(config) {
  if (!('width' in config)) {
    throw new Error('Missing "width" in config');
  }
  if (!('height' in config)) {
    throw new Error('Missing "height" in config');
  }
  this.x0 = config.x0 || 0;
  this.y0 = config.y0 || 0;
  this.width = config.width;
  this.height = config.height;
  this.resolution = config.resolution || 1;
  this._storage = new Uint32Array(Math.ceil(this.width * this.height / BITS_PER_VALUE));
}

BitBox.prototype.get = function(i, j) {
  var offset = j * this.width + i;
  var index = (offset / BITS_PER_VALUE) | 0;
  var bit = offset % BITS_PER_VALUE;
  return (this._storage[index] & (1 << bit)) !== 0;
};

BitBox.prototype.set = function(i, j) {
  var offset = j * this.width + i;
  var index = (offset / BITS_PER_VALUE) | 0;
  var bit = offset % BITS_PER_VALUE;
  this._storage[index] |= 1 << bit;
};

BitBox.prototype.fill = function(i0, j0, width, height) {
  var storage = this._storage;
  i0 = Math.min(Math.max(0, i0), this.width - 1);
  j0 = Math.min(Math.max(0, j0), this.height - 1);
  width = Math.min(width, this.width - i0);
  height = Math.min(height, this.height - j0);
  for (var j = j0, jj = j0 + height; j < jj; ++j) {
    var i = i0;
    var ii = i + width;
    while (i < ii) {
      var offset = j * this.width + i;
      var index = (offset / BITS_PER_VALUE) | 0;
      var bit = offset % BITS_PER_VALUE;
      var fill;
      if (bit === 0) {
        fill = ii - i;
        if (fill >= BITS_PER_VALUE) {
          fill = BITS_PER_VALUE;
          storage[index] = -1;
        } else {
          storage[index] |= (1 << fill) - 1
        }
      } else {
        fill = BITS_PER_VALUE - bit;
        storage[index] |= ((1 << fill) - 1) << bit;
      }
      i += fill;
    }
  }
};

BitBox.prototype.unset = function(i, j) {
  var offset = j * this.width + i;
  var index = (offset / BITS_PER_VALUE) | 0;
  var bit = offset % BITS_PER_VALUE;
  this._storage[index] &= ~(1 << bit);
};

module.exports = BitBox;

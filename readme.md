# `bitgeo`

Transforms any GeoJSON into a data structure that can be efficiently queried to determine (roughly) where data is present or absent.

## API

```js
var bitgeo = require('bitgeo');
```

### `bitgeo(data, options)`

Given any GeoJSON data, generate a `BitBox` with the provided options.

Supported options:

 * `resolution` - The size (width and height) of a "cell" in the same units as the input data.

### `bitgeo.or(datas, options)`

A convenience function for creating a bitbox that is the union of an array of GeoJSON data objects.

### `bitgeo.and(datas, options)`

A convenience function for creating a bitbox that is the intersection of an array of GeoJSON data objects.

### `BitBox`

```js
var bitbox = bitgeo(data, options);
```

A bitbox is a (conceptually) rasterized representation of vector data containing information about where data is present and absent.

#### `bitbox.getArea()`

Returns the area of the bitbox where data is present (this will be an integer multiple of `resolution * resolution`).

#### `bitbox.get(i, j)`

Test if data is present at the provided location.  The `i` and `j` values are offsets from the origin in terms of the bitbox resolution.  For example, if a bitbox is created with `resolution: 10`, then `bitbox.get(1, 2)` would return `true` if there is data between `[10, 20]` and `[20, 30]` (with upper bounds being exclusive).

#### `bitbox.or(other)`

Return a bitbox that is the union of two bitboxes (`bitbox` and `other`).

#### `bitbox.and(other)`

Return a bitbox that is the intersection of two bitboxes (`bitbox` and `other`).

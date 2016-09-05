var bitgeo = require('./lib/index');
var data = require('./data.json');

var bits = bitgeo(data, {resolution: 3});

var BLOCK = '\u2588';
var ABSENT_BG_COLOR = '\u001b[48;5;8m';
var PRESENT_BG_COLOR = '\u001b[48;5;15m';
var ABSENT_FG_COLOR = '\u001b[38;5;8m';
var PRESENT_FG_COLOR = '\u001b[38;5;15m';
var RESET = '\u001b[0m';

function twice(string) {
  return string + string;
}

var ABSENT = twice(ABSENT_BG_COLOR + ABSENT_FG_COLOR + BLOCK);
var PRESENT = twice(PRESENT_BG_COLOR + PRESENT_FG_COLOR + BLOCK);

var s = '';
for (var j = bits.maxJ; j >= bits.minJ; --j) {
  for (var i = bits.minI; i < bits.maxI; ++i) {
    s += bits.get(i, j) ? PRESENT : ABSENT;
  }
  s += RESET + '\n';
}
process.stdout.write(s);

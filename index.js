
//
// the 4 basic operations
//

exports.request = require('./lib/request');
exports.emit    = require('./lib/emit');
exports.send    = require('./lib/send');
exports.join    = require('./lib/join');

//
// make basic operations global
//

exports.global = function() {
  global.request = exports.request;
  global.emit    = exports.emit;
  global.send    = exports.send;
  global.join    = exports.join;
}

//
// built-in streams
// (maybe these should be separate modules down the line)
//

exports.streams = {

  // emitters
  times:          require('./lib/streams/times'),
  perSecond:      require('./lib/streams/per-second'),
  transform:      require('./lib/streams/transform'),

  // stop conditions
  stopTimer:      require('./lib/streams/stop-timer'),

  // reporters
  progressDots:   require('./lib/streams/progress-dots'),
  print:          require('./lib/streams/print'),
  consoleSummary: require('./lib/streams/console-summary'),

};

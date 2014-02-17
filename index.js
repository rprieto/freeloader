
//
// The 4 basic operations
//

exports.request = require('./lib/request');
exports.emit    = require('./lib/emit');
exports.send    = require('./lib/send');
exports.join    = require('./lib/join');

//
// Helper to add them to global scope
//

exports.global = function() {
  global.request = exports.request;
  global.emit    = exports.emit;
  global.send    = exports.send;
  global.join    = exports.join;
}

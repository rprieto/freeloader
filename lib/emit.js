var q = require('q');
var util = require('util');
var Readable = require('stream').Readable;
var Item = require('./item');

util.inherits(Emit, Readable);

function Emit(request) {
  Readable.call(this, {objectMode : true});
  this.sent = false;
  process.on('SIGINT', this.abort.bind(this));
  this.item = new Item(request);
  this.item.response.then(this.end.bind(this));
}

Emit.prototype._read = function(size, callback) {
  if (this.sent) return;
  this.sent = true;
  this.push(this.item);
};

Emit.prototype.abort = function() {
  console.error('\nReceived Ctrl-C, shutting down the test\n')
  this.push(null);
};

module.exports = function(request) {
  return new Emit(request);
};


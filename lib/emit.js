var q = require('q');
var util = require('util');
var Readable = require('stream').Readable;
var Item = require('./item');

util.inherits(Emit, Readable);

function Emit(request) {
  Readable.call(this, {objectMode : true});
  this.sent = false;
  this.item = new Item(request);
  this.item.response.then(this.end.bind(this));
  this.on('terminate', this.terminate.bind(this));
  process.on('SIGINT', this.terminate.bind(this));
}

Emit.prototype._read = function(size, callback) {
  if (this.sent) return;
  this.sent = true;
  this.push(this.item);
};

Emit.prototype.terminate = function() {
  console.log('\nShutting down.');
  console.log('Waiting for pending requests to finish...');
  this.end();
};

Emit.prototype.end = function() {
  if (process.env.DEBUG) {
    console.log('Emit: end');
  }
  this.push(null);
};

module.exports = function(request) {
  return new Emit(request);
};

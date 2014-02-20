var q        = require('q');
var util     = require('util');
var Readable = require('stream').Readable;
var Item     = require('./item');
var log      = require('./log');

util.inherits(Emit, Readable);

function Emit(request) {
  Readable.call(this, {objectMode : true});
  this.sent = false;
  this.item = new Item(request);
  // process.on('SIGINT', this.shutdown.bind(this));
}

Emit.prototype.name = 'Emit';

Emit.prototype._read = function(size, callback) {
  if (this.sent) return;
  log('Emit: push item');
  this.sent = true;
  this.push(this.item);
  this.push(null);
};

// Emit.prototype.shutdown = function() {
//   console.log('\nShutting down...');
//   console.log('Modules might wait for pending requests to finish.');
//   this.emit('close');
// };

module.exports = function(request) {
  return new Emit(request);
};

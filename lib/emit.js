var q = require('q');
var util = require('util');
var Readable = require('stream').Readable;

util.inherits(Emit, Readable);

function Emit(request) {
  Readable.call(this, {objectMode : true});
  this.request = request;
  this.sent = false;
  process.on('SIGINT', this.abort.bind(this));
}

Emit.prototype._read = function(size, callback) {
  if (this.sent) return;
  var request = this.request;
  var response = q.defer();
  response.promise.then(function(res) {
    this.push(null);
  }.bind(this));
  this.sent = true;
  this.push({
    req: request,
    res: response
  });
};

Emit.prototype.abort = function() {
  console.error('\nReceived Ctrl-C, shutting down the test\n')
  this.push(null);
};

module.exports = function(request) {
  return new Emit(request);
};


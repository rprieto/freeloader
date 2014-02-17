var q         = require('q');
var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(FLStream, Transform);

function log() {
  if (process.env.DEBUG) {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(this, args);
  }
}

function FLStream(count) {
  Transform.call(this, {objectMode : true});
  this.finished = false;
  this.on('close', this.end);
  this.on('terminate', this.terminate);
  this.on('pipe', function(s) {
    this.on('terminate', function(err) {
      log(this.name + ': relay terminate');
      s.emit('terminate');
    });
  }.bind(this));
}

FLStream.prototype.name = 'FLStream';

FLStream.prototype._transform = function(chunk, encoding, callback) {
  log(this.name + ': _transform');
};

FLStream.prototype.terminate = function() {
  this.finished = true;
  log(this.name + ': terminate');
};

FLStream.prototype.end = function() {
  log(this.name + ': end');
  this.push(null);
};

module.exports = FLStream;

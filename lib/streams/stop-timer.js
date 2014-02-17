var util      = require('util');
var Transform = require('stream').Transform;
var ms        = require('ms');

util.inherits(StopTimer, Transform);

function StopTimer(duration) {
  Transform.call(this, {objectMode : true});
  this.on('end', this.end);
  this.on('pipe', function(s) {
    this.on('terminate', function(err) {
      s.emit('terminate');
    });
  }.bind(this));
  this.stopped = false;
  var millis = ms(duration);
  setTimeout(function() {
    this.emit('end');
  }.bind(this), millis);
}

StopTimer.prototype._transform = function(chunk, encoding, callback) {
  if (!this.stopped) {
    this.push(chunk);
    callback();
  }
};

StopTimer.prototype.end = function() {
  this.stopped = true;
  this.push(null);
};

module.exports = function(duration) {
  return new StopTimer(duration);
};

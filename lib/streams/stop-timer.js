var util      = require('util');
var ms        = require('ms');
var FLStream  = require('../FLStream');

function StopTimer(duration) {
  FLStream.call(this);
  var millis = ms(duration);
  setTimeout(function() {
    this.emit('terminate');
  }.bind(this), millis);
}

util.inherits(StopTimer, FLStream);
StopTimer.prototype.name = 'StopTimer';

StopTimer.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  if (this.finished) return;
  this.push(chunk);
  callback();
};

module.exports = function(duration) {
  return new StopTimer(duration);
};

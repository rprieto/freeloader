var util      = require('util');
var ms        = require('ms');
var FLStream  = require('../FLStream');

function StopCount(count) {
  FLStream.call(this);
  this.responses = 0;
  this.count = count;
}

util.inherits(StopCount, FLStream);
StopCount.prototype.name = 'StopCount';

StopCount.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  if (this.finished) return;
  this.push(chunk);
  chunk.response.then(function() {
    ++this.responses;
    if (this.responses === this.count && !this.stopping) {
      this.emit('terminate');
    } else {
      callback();
    }
  }.bind(this)).done();
};

module.exports = function(count) {
  return new StopCount(count);
};

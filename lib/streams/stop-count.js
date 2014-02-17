var util      = require('util');
var Transform = require('stream').Transform;
var ms        = require('ms');

util.inherits(StopCount, Transform);

function StopCount(count) {
  Transform.call(this, {objectMode : true});
  this.on('end', this.end);
  this.on('pipe', function(s) {
    this.on('terminate', function(err) {
      s.emit('terminate');
    });
  }.bind(this));
  this.stopping = false;
  this.responses = 0;
  this.count = count;
}

StopCount.prototype._transform = function(chunk, encoding, callback) {
  if (this.stopping) return;
  this.push(chunk);
  chunk.response.then(function() {
    ++this.responses;
    if (this.responses === this.count && !this.stopping) {
      this.stopping = true;
      this.emit('terminate');
    } else {
      callback();
    }
  }.bind(this)).done();
};

StopCount.prototype.end = function() {
  this.push(null);
};

module.exports = function(count) {
  return new StopCount(count);
};

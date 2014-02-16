var util = require('util');
var PassThrough = require('stream').PassThrough;

util.inherits(Join, PassThrough);

function Join(streams) {
  PassThrough.call(this, {objectMode : true});
  this.downstream = [];
  this.inFlight = streams.length;
  streams.forEach(function(stream) {
    stream.pipe(this);
    stream.on('end', this.upstreamEnded.bind(this));
  }.bind(this));
}

Join.prototype.pipe = function(dest, options) {
  // remember who we're piped into
  this.downstream.push(dest);
  return PassThrough.prototype.pipe.call(this, dest, options);
};

Join.prototype.on = function(event) {
  if (event === 'end') {
    // don't propagate 'end' when an upstream ends
    // we need to wait until they all do
  }
};

Join.prototype.upstreamEnded = function() {
  // if this is the last upstream ending
  // then close downstreams
  --this.inFlight;
  if (this.inFlight === 0) {
    this.downstream.forEach(function(s) {
      s.emit('end');
    });
  }
};

module.exports = function(request) {
  var streams = Array.prototype.slice.apply(arguments)
  return new Join(streams);
};


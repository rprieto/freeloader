var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(Times, Transform);

function Times(multiplier) {
  Transform.call(this, {objectMode : true});
  this.multiplier = multiplier;
  this.inFlight = 0;
  this.on('end', this.end);
}

// TODO: this can be triggerd multiple times
// with multiple requests (e.g. join())
// so we should wait for all of them before calling push(null)
Times.prototype._transform = function(chunk, encoding, callback) {
  var promises = [];
  ++this.inFlight;
  for (var i = 0; i < this.multiplier; ++i) {
    var clone = chunk.clone();
    promises.push(clone.response);
    this.push(clone);
  }
  q.all(promises).then(function() {
    --this.inFlight;
    if (this.inFlight === 0) {
      this.push(null);
    }
  }.bind(this)).done();
};

Times.prototype.end = function() {
  this.push(null);
};

module.exports = function(multiplier) {
  return new Times(multiplier);
};

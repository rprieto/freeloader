var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLStream  = require('../FLStream');

function Times(multiplier) {
  FLStream.call(this);
  this.multiplier = multiplier;
  this.inFlight = 0;
}

util.inherits(Times, FLStream);
Times.prototype.name = 'Times';

Times.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);

  // TODO: this can be triggerd multiple times
  // with multiple requests (e.g. join())
  // so we should wait for all of them before calling push(null)

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

module.exports = function(multiplier) {
  return new Times(multiplier);
};

var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(PerSecond, Transform);

function PerSecond(count) {
  Transform.call(this, {objectMode : true});
  this.on('end', this.end);
  this.on('pipe', function(s) {
    this.on('terminate', function(err) {
      s.emit('terminate');
    });
  }.bind(this));
  this.intervals = [];
  this.period = 1000 / count;
}

PerSecond.prototype._transform = function(chunk, encoding, callback) {
  var intervalId = setInterval(function() {
    this.push(chunk.clone());
  }.bind(this), this.period);
  this.intervals.push(intervalId);
  callback();
};

PerSecond.prototype.end = function() {
  this.intervals.forEach(clearInterval);
  this.push(null);
};

module.exports = function(count) {
  return new PerSecond(count);
};

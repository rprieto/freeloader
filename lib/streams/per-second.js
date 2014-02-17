var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLStream  = require('../FLStream');

function PerSecond(count) {
  FLStream.call(this);
  this.intervals = [];
  this.period = 1000 / count;
}

util.inherits(PerSecond, FLStream);
PerSecond.prototype.name = 'PerSecond';

PerSecond.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  var intervalId = setInterval(function() {
    this.push(chunk.clone());
  }.bind(this), this.period);
  this.intervals.push(intervalId);
  callback();
};

PerSecond.prototype.end = function() {
  FLStream.prototype.end.call(this);
  this.intervals.forEach(clearInterval);
};

module.exports = function(count) {
  return new PerSecond(count);
};

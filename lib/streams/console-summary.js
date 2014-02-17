var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLStream  = require('../FLStream');

function ConsoleSummary() {
  FLStream.call(this);
  this.responses = [];
  this.responseTimes = [];
}

util.inherits(ConsoleSummary, FLStream);
ConsoleSummary.prototype.name = 'ConsoleSummary';

ConsoleSummary.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  if (this.finished) return;
  var startTime = new Date();
  this.responses.push(chunk.response);
  chunk.response.then(function(res) {
    this.responseTimes.push(new Date() - startTime);
  }.bind(this)).done();
  this.push(chunk);
  callback();
};

ConsoleSummary.prototype.end = function() {
  FLStream.prototype.end.call(this);
  q.all(this.responses).then(function() {
    console.log('');
    console.log('Response count = ', this.responses.length);
    console.log('Response times');
    console.log('  min = ', millis(_.min(this.responseTimes)));
    console.log('  avg = ', millis(avg(this.responseTimes)));
    console.log('  max = ', millis(_.max(this.responseTimes)));
    console.log('');
  }.bind(this)).done();
};

function millis(val) {
  return Math.floor(val) + 'ms';
}

function avg(list) {
  var sum = _.reduce(list, function(sum, num) { return sum + num; }, 0);
  return sum / list.length;
}

module.exports = function() {
  return new ConsoleSummary();
};

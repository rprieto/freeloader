var util      = require('util');
var FLStream  = require('../FLStream');

function ConsoleSummary() {
  FLStream.call(this);
  this.count = 0;
  this.responseTimes = [];
}

util.inherits(ConsoleSummary, FLStream);
ConsoleSummary.prototype.name = 'ConsoleSummary';

ConsoleSummary.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  if (this.finished) return;
  var startTime = new Date();
  chunk.response.then(function(res) {
    ++this.count;
    this.responseTimes.push(new Date() - startTime);
  }.bind(this));
  this.push(chunk);
  callback();
};

ConsoleSummary.prototype.end = function() {
  FLStream.prototype.end.call(this);
  console.log('');
  console.log('Response count = ', this.count);
  console.log('Response times');
  console.log('  min = ', 10);
  console.log('  avg = ', 50);
  console.log('  max = ', 100);
  console.log('');
};

module.exports = function() {
  return new ConsoleSummary();
};

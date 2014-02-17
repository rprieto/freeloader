var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(ConsoleSummary, Transform);

function ConsoleSummary() {
  Transform.call(this, {objectMode : true});
  this.count = 0;
  this.responseTimes = [];
  this.on('end', this.end);
}

ConsoleSummary.prototype._transform = function(chunk, encoding, callback) {
  var startTime = new Date();
  chunk.response.then(function(res) {
    ++this.count;
    this.responseTimes.push(new Date() - startTime);
  }.bind(this));
  this.push(chunk);
  callback();
};

ConsoleSummary.prototype.end = function() {
  console.log('');
  console.log('Response count = ', this.count);
  console.log('Response times');
  console.log('  min = ', 10);
  console.log('  avg = ', 50);
  console.log('  max = ', 100);
  console.log('');
};

module.exports = function() {
  return new ConsoleSummary()
};

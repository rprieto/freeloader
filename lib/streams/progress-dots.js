var util      = require('util');
var FLStream  = require('../FLStream');

function ProgressDots() {
  FLStream.call(this);
}

util.inherits(ProgressDots, FLStream);
ProgressDots.prototype.name = 'ProgressDots';

ProgressDots.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  process.stdout.write('.');
  this.push(chunk);
  callback();
};

module.exports = function() {
  return new ProgressDots();
};

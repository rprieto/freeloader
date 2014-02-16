var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(ProgressDots, Transform);

function ProgressDots() {
  Transform.call(this, {objectMode : true});
  this.on('end', this.end);
}

ProgressDots.prototype._transform = function(chunk, encoding, callback) {
  process.stdout.write('.');
  this.push(chunk);
  callback();
};

ProgressDots.prototype.end = function() {
  this.push(null);
};

module.exports = function() {
  return new ProgressDots();
};

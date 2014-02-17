var util      = require('util');
var Transform = require('stream').Transform;

util.inherits(Print, Transform);

function Print() {
  Transform.call(this, {objectMode : true});
  this.on('end', this.end);
}

Print.prototype._transform = function(chunk, encoding, callback) {
  console.log('Request ', chunk.request.options.url);
  chunk.response.then(function(res) {
    console.log('Response ', res.body);
  });
  this.push(chunk);
  callback();
};

Print.prototype.end = function() {
  this.push(null);
};

module.exports = function() {
  return new Print();
};

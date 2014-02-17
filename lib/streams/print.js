var util      = require('util');
var FLStream  = require('../FLStream');

function Print() {
  FLStream.call(this);
}

util.inherits(Print, FLStream);
Print.prototype.name = 'Print';

Print.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  console.log('Request ', chunk.request.options.url);
  chunk.response.then(function(res) {
    console.log('Response ', res.body);
  });
  this.push(chunk);
  callback();
};

module.exports = function() {
  return new Print();
};

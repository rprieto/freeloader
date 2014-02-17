var util      = require('util');
var Writable  = require('stream').Writable;

util.inherits(Send, Writable);

function Send() {
  Writable.call(this, {objectMode : true});
}

Send.prototype._write = function (chunk, encoding, callback) {
  chunk.request.end(function(res) {
    chunk.resolve(res);
    callback();
  });
};

module.exports = function() {
  return new Send();
};

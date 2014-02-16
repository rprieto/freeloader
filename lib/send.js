var util      = require('util');
var Writable  = require('stream').Writable;

util.inherits(Send, Writable);

function Send() {
  Writable.call(this, {objectMode : true});
}

Send.prototype._write = function (chunk, encoding, callback) {
  chunk.req.end(function(response) {
    chunk.res.resolve(response);
    callback();
  });
};

module.exports = function() {
  return new Send();
};

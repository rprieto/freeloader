var util      = require('util');
var Writable  = require('stream').Writable;
var log       = require('./log');

util.inherits(Send, Writable);

function Send() {
  Writable.call(this, {objectMode : true});
}

Send.prototype._write = function (chunk, encoding, callback) {
  log('Send: _write');
  chunk.request.end(function(res) {
    log('Send: got response');
    chunk.resolve(res);
  });
  callback();
};

module.exports = function() {
  return new Send();
};

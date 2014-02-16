var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var TransformStream = require('stream').Transform;

util.inherits(Transform, TransformStream);

function Transform(fn) {
  TransformStream.call(this, {objectMode : true});
  this.fn = fn;
  this.on('end', this.end);
}

Transform.prototype._transform = function(chunk, encoding, callback) {
  this.fn(chunk.req);
  this.push(chunk);
  callback();
};

Transform.prototype.end = function() {
  this.push(null);
};

module.exports = function(fn) {
  return new Transform(fn);
};

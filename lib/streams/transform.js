var _         = require('lodash');
var q         = require('q');
var util      = require('util');
var FLStream  = require('../FLStream');

function Transform(fn) {
  FLStream.call(this);
  this.fn = fn;
}

util.inherits(Transform, FLStream);
Transform.prototype.name = 'Transform';

Transform.prototype._transform = function(chunk, encoding, callback) {
  FLStream.prototype._transform.call(this);
  chunk.request = this.fn(_.cloneDeep(chunk.request));
  this.push(chunk);
  callback();
};

module.exports = function(fn) {
  return new Transform(fn);
};

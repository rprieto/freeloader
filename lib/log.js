if (process.env.DEBUG) {

  module.exports = function() {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(this, args);
  };

} else {

  module.exports = function() {
  };

}

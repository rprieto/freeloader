var q = require('q');

function Item(request) {

  var response = q.defer();

  this.request = request;
  this.response = response.promise;

  this.clone = function() {
    return new Item(request);
  };

  this.resolve = function(res) {
    response.resolve(res);
  };

}

module.exports = Item;

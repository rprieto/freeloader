var http = require('http');

var server = http.createServer(function(req, res) {
  console.log('Request: ', req.url, ' time: ', new Date())
  setTimeout(function() {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('such server, many speeds');
    res.end();
  }, 300);
});

server.listen(3000, function() {
  console.log('Started on port 3000');
});

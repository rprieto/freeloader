require('../index').global();

var times     = require('../index').streams.times;
var progress  = require('../index').streams.progressDots;
var summary   = require('../index').streams.consoleSummary;

var r1 = request.get('http://localhost:3000/hello')
                .header('Accept', 'application/json');

var r2 = request.get('http://localhost:3000/world')
                .header('Accept', 'application/json');

join(emit(r1), emit(r2))
.pipe(times(5))
.pipe(progress())
.pipe(summary())
.pipe(send());

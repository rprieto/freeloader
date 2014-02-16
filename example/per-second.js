require('../index').global();

var stopTimer = require('../index').streams.stopTimer;
var perSecond = require('../index').streams.perSecond;
var progress  = require('../index').streams.progressDots;
var summary   = require('../index').streams.consoleSummary;

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(stopTimer('3s'))
.pipe(perSecond(2))
.pipe(progress())
.pipe(summary())
.pipe(send());

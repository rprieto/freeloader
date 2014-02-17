require('../index').global();

var stopCount = require('../index').streams.stopCount;
var perSecond = require('../index').streams.perSecond;
var progress  = require('../index').streams.progressDots;
var summary   = require('../index').streams.consoleSummary;

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(perSecond(2))
.pipe(stopCount(4))
.pipe(progress())
.pipe(summary())
.pipe(send());

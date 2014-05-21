# freeloader

Just a super easy load-testing framework.

![logo](https://raw.github.com/rprieto/freeloader/master/freeloader.jpg)

- no complex GUI to get lost in
- load tests == code, and yes you should check them in :)
- easy to plug-in to your CI server
- get started in seconds

## Getting started

[![NPM](https://nodei.co/npm/freeloader.svg)](http://www.npmjs.org/package/freeloader)

Freeloader uses 4 basic keywords:

- `request` to create an HTTP request using [unirest](https://github.com/mashape/unirest-nodejs)
- `emit` to push the request down the pipeline
- `send` to make the actual HTTP call
- `join` to join 2 streams together

The simplest test looks like:

```js
require('freeloader').global();

// See unirest documentation for all the options (headers, file uploads...)
var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r).pipe(send());
```

That's it! This test sends a single HTTP request, and finishes straight away.
In general, test suites automatically end:

- when every request has been sent
- or when you press `Ctrl-C`
- or when a module adds its own stopping condition

## Building a pipeline

It becomes a lot more interesting when we build a pipeline.

Each step in the pipeline has access to all requests & responses. They can modify payloads, generate more requests, or collect data for reporting.

[freeloader-bundle](http://github.com/rprieto/freeloader-bundle) contains a lot of useful modules to get started. Each module is an instance of a Node.js stream, and you can also easily [create your own](https://github.com/rprieto/freeloader-stream).

```js
require('freeloader').global();
require('freeloader-bundle').global();

var r = request.get('http://localhost:3000/hello')
               .header('Accept', 'application/json');

emit(r)
.pipe(concurrent(50))
.pipe(stopTimer('30s'))
.pipe(requestDots())
.pipe(responseDots())
.pipe(consoleSummary())
.pipe(consoleCharts())
.pipe(send())
```

Which outputs something like:

![screenshot](https://raw.github.com/rprieto/freeloader/master/screenshot.png)

## CI or unit tests

Test pipelines can easily be included in a CI test suite:

```js
it('generates load test reports', function(done) {
  emit(r1)
  .pipe(times(50))
  .pipe(jsonSummary('./report.json'))
  .pipe(callback(done))
  .pipe(send());
});
```

## Joining streams

Streams can also be joined for more complex scenarios.

- Emit 2 different requests with a concurrency of 50 each

```js
join(emit(r1), emit(r2))
.pipe(concurrent(50))
.pipe(summary())
.pipe(send());
```

It's up to each reporter to either give global stats, or group the report by request URL.

## Complex requests

The `request` object is a [unirest](https://github.com/mashape/unirest-nodejs) object, which means you can configure it to set HTTP headers, custom payloads, SSL certificates, etc...

```js
var r = request.post('https://my.api.com/do/the/things')
               .set('Content-Type', 'application/json')
               .send({hello: 'world'})
               .secureProtocol('SSLv3_client_method')
               .strictSSL(false)
```

# freeloader

Just a super easy load-testing framework.

- no complex GUI to get lost in
- load tests == code, and yes you should check them in :)
- easy to plug-in to your CI server
- get started in seconds

[![NPM](https://nodei.co/npm/freeloader.svg?compact=true)](http://www.npmjs.org/package/freeloader)

## Getting started

`freeloader` comes with 4 basic keywords you can use to build your test:

- `request` to create an HTTP request using [unirest](https://github.com/mashape/unirest-nodejs). This supports many options like settings headers, adding a JSON payload, uploading a file, etc...
- `emit` to push the request down the pipeline
- `send` to make the actualy HTTP call
- `join` to join 2 streams together

These keywords are accessible as `require('freeloader').keyword` but you can also use `require('freeloader').global()` which puts all 4 in the global scope.

```js
require('freeloader').global();

var r = request.get('http://localhost:3000/people')
               .header('Accept: application/json');

emit(r).pipe(send());
```

That's it! This test will send a single HTTP request, and finish as soon as the response is received.

## Building a pipeline

It becomes a lot more interesting when we start building a [Stream](http://nodejs.org/api/stream.html) pipeline from all the available modules. For example:

```js
emit(r)
.pipe(stopTimer('30s'))
.pipe(concurrent(50))
.pipe(transform(randomData))
.pipe(consoleSummary())
.pipe(responseTimeGraph('./graph.jpg'))
.pipe(send())
```

Each module in the pipeline has acess to the requests & responses. They can for example modify a request payload, generate more requests, or collect data for reporting.

In this example, the `concurrent` module will keep making requests in parallel. Each request will be slightly modified by the `transform` module. The `consoleSummary` and `responseTimeGraph` will generating nice reports at the end.

## When does a test end?

By default, a test ends when every request has received a response.

Since some modules continuously generate requests, `freeloader` also shuts down the whole pipeline gracefully when you press `Ctrl-C`, so reporters can generate stats with every request/response received up to that point.

Some modules also add their own stopping conditions, like the `stopTimer` module.

## All the modules

`freeloader` comes with a few built-in streams, which can be roughly divided into 3 categories:

**Emitters**, which can generate 1 or more requests from the single `emit()` call. You'll usually use 1 emitter only, but some support being combined together.

- `times(5)` to fire 5 requests instead of a single one
- `perSecond(10)` to generate 10 requests per second
- `concurrent(50)` to always maintain 50 requests in flight
- `transform(fn)` which apply the given function to each request

**Stop conditions**, which force the pipeline to stop. A currently limitation is that these have to be placed just after `emit()` to cut the pipeline at the source.

- `stopTimer('10s')` to stop after 10 seconds

**Reporters**, that analyse requests and responses to generate reports and statistics. You can pipe several reporters one after the other.

- `progressDots()` which prints a dot for each request sent
- `print()` to troubleshoot the request/response flow
- `consoleSummary()` to print general stats in the console

Each module in the pipeline is a Node.js stream, so you can of course create your own.

## Joining streams

Streams can be joined for more complex scenarios. Where you decide to join the streams will affect the exact behaviour. Here are a few examples:

- Emit 2 different requests, and send 50 of each

```js
join(emit(r1), emit(r2))
.pipe(times(50))
.pipe(send());
```

- Emit 2 different requests continuously, with a total concurrency of 50

```js
join(emit(r1), emit(r2))
.pipe(concurrent(50))
.pipe(send());
```

- Emit 2 different requests continuously, with a concurrency of 50 each

```js
var s1 = emit(r1).pipe(concurrent(50));
var s2 = emit(r2).pipe(concurrent(50));
join(s1, s2).pipe(send());
```

- Get the summary for 2 different requests

```js
join(emit(r1), emit(r2))
.pipe(summary())
.pipe(send());
```

Note that the reporters get access to each request/response, including the URL. Some reporters will only report on the total activity (e.g. average response time), but some will group the requests by URL to give more granular graphs or reporting.

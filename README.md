# freeloader

Just a super easy load-testing framework.

- no complex GUI to get lost in
- load tests == code, and yes you should check them in :)
- easy to plug-in to your CI server
- get started in seconds

[![NPM](https://nodei.co/npm/freeloader.svg?compact=true)](http://www.npmjs.org/package/freeloader)

## Getting started

Freeloader comes with 4 basic keywords:

- `request` to create an HTTP request using [unirest](https://github.com/mashape/unirest-nodejs)
- `emit` to push the request down the pipeline
- `send` to make the actual HTTP call
- `join` to join 2 streams together

These keywords are accessible as `require('freeloader').keyword` but you can also use `require('freeloader').global()` which puts all of them in global scope.

```js
require('freeloader').global();

// See unirest documentation for all the options (headers, file uploads...)
var r = request.get('http://localhost:3000/people')
               .header('Accept', 'application/json');

emit(r).pipe(send());
```

That's it! This test sends a single HTTP request, and finishes as soon as the response is received.

## Building a pipeline

It becomes a lot more interesting when we start building a [Stream](http://nodejs.org/api/stream.html) pipeline. For example:

```js
emit(r)
.pipe(stopTimer('30s'))
.pipe(concurrent(50))
.pipe(transform(randomData))
.pipe(consoleSummary())
.pipe(responseTimeGraph('./graph.jpg'))
.pipe(send())
```

Each module in the pipeline has acess to the requests & responses. For example they can modify a request payload, generate more requests, or collect data for reporting.

The test suite will end:

- when every request has received a response
- or when you press `Ctrl-C`
- or when a module adds its own stopping condition

## Joining streams

Streams can also be joined for more complex scenarios. Here are a few examples:

- Emit 2 different requests with a total concurrency of 50

```js
join(emit(r1), emit(r2))
.pipe(concurrent(50))
.pipe(summary())
.pipe(send());
```

- Emit 2 different requests with a concurrency of 50 each

```js
var s1 = emit(r1).pipe(concurrent(50));
var s2 = emit(r2).pipe(concurrent(50));
join(s1, s2)
.pipe(summary())
.pipe(send());
```

Note that reporters get access to each request/response, including the URL. It's up to each reporter to either give global stats, or group the report by request.

## So what modules can I use?

Freeloader has a few modules built-in, accessible as `require('freeloader').streams[name]`. They're roughly divided into 3 categories:

**Emitters**, which generate 1 or more requests from their input. You'll usually use 1 emitter only, but some support being combined together.

- `times(5)` : fire 5 requests instead of a single one
- `perSecond(10)` : generate 10 requests per second
- `concurrent(50)` : always maintain 50 requests in flight
- `transform(fn)` : apply the given function to each request

**Stop conditions**, which force the whole pipeline to stop.

- `stopTimer('10s')` : stop after 10 seconds
- `stopCount(50)` : stop after 50 responses have been received

**Reporters**, that analyse requests and responses to generate reports and statistics. You can pipe several reporters one after the other.

- `progressDots()` : print a dot for each request sent
- `print()` : print every request/response going through
- `consoleSummary()` : print general stats to the console

Each module is an instance of a Node.js [Stream](http://nodejs.org/api/stream.html), so you can also easily create your own.

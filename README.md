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

```js
require('freeloader').global();

// See unirest documentation for all the options (headers, file uploads...)
var r = request.get('http://localhost:3000/people')
               .header('Accept', 'application/json');

emit(r).pipe(send());
```

That's it! This test sends a single HTTP request, and finishes as soon as the response is received.

## Building a pipeline

It becomes a lot more interesting when we start building a pipeline. Each step in the pipeline has access to all requests & responses. For example, they can modify payloads, generate more requests, or collect data for reporting.

[freeloader-bundle](http://github.com/rprieto/freeloader-bundle) contains a lot of useful modules to get started. See the bundle [README](http://github.com/rprieto/freeloader-bundle/blog/master/README) for detailled examples. Each module is an instance of a Node.js [Stream](http://nodejs.org/api/stream.html), so you can also easily create your own.

```js
require('freeloader-bundle').global();

emit(r)
.pipe(stopTimer('30s'))
.pipe(concurrent(50))
.pipe(transform(randomData))
.pipe(progressDots())
.pipe(consoleSummary())
.pipe(responseTimeGraph('./graph.jpg'))
.pipe(send())
```

Which outputs something like:

```bash
..........................................................................................................................

Waiting for pending requests to finish...

Response count =  377
Response times
  min =  16ms
  avg =  44ms
  max =  82ms
```

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

It's up to each reporter to either give global stats, or group the report by request URL.

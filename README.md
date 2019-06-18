# Menja

A game about smashing cubes.



## Development Commands

If cloning repo fresh, first install dev dependencies with:

```
npm install
```

To launch a live reloading dev server, run:

```
npm run start
```

To perform an optimized final build, run:

```
npm run build
```



## Adding New JS files

New JS files must be linked directly in `index.html`. Order matters based on dependencies.

I'm not using a bundler so that I have complete control over all generated code (it's only an IIFE).

However, [microbundle](https://github.com/developit/microbundle) could be worth considering.



## Build optimizations

All JS is:

1. Combined into a single file
2. Stripped of performance monitoring code
3. Wrapped in an IIFE to keep global game vars private and mangle-able
4. Run through a minifier/compiler
5. Inlined directly into `index.html`

All CSS is minified and inlined.

HTML is minified.



## Unit Tests

Test files should be added at the bottom of `index.html` with the other tests.

All tests will be run in the browser during development using a custom test runner. All tests, and the test runner itself are stripped out for final builds.

Assertions make use of [@mjackson](https://twitter.com/mjackson)'s [expect](https://github.com/mjackson/expect) library.



## Performance Monitoring

Included is a system for tracking performance of various subroutines and displaying the data in an on screen overlay. This is very helpful when running on various mobile devices in the wild.


### Enabling & Disabling Performance Monitoring

To enable, set the value of `showPerfMonitor` to `true` in `PERF.js`. To disable, set to `false`.


### Changing What is Monitored

Three functions are exposed by `PERF.js`:

- `PERF_START`
- `PERF_END`
- `PERF_UPDATE`

`PERF_UPDATE` simply displays the performance timing output. It is called automatically in `draw.js`.


To monitor a new subroutine, call:

```
PERF_START('name-of-subroutine');
```

at the start of the subroutine, and at the end call:

```
PERF_END('name-of-subroutine');
```

Always use single quotes for the name string, or the function invokation won't be removed for production build.

Care should also be taken to only use a subroutine name once throughout the entire program. If a name is reused, multiple subroutines will have their run times averaged.

# Menja

A game about smashing cubes.



## Development Commands

If clone repo fresh, first install dev dependencies with:

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
2. Wrapped in an IIFE to keep global game vars private and mangle-able
3. Run through a minifier/compiler
4. Inlined directly into `index.html`

All CSS is minified and inlined.

HTML is minified.



## Unit Tests

Test files should be added at the bottom of `index.html` with the other tests.

All tests will be run in the browser during development using a custom test runner. All tests, and the test runner itself are stripped out for final builds.

Assertions make use of [@mjackson](https://twitter.com/mjackson)'s [expect](https://github.com/mjackson/expect) library.

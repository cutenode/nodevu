---
title: '@nodevu/static'
---

# `@nodevu/static`

<!--source_link=static/index.js-->

The offline version of nodevu: the data [`@nodevu/core`](core.md) returns,
and three subsets of it, shipped as JSON. A scheduled build refreshes the data
and a release publishes it, so it can lag behind Node.js releases. Use
`@nodevu/core` when you need it current.

```bash
npm install @nodevu/static
```

Each export is a plain object, keyed by release line like core's result:

```js
const { default: data, support } = require('@nodevu/static');

console.log(support.v20.codename); // 'Iron'
```

## `static.default`

- Type: {Object} Everything [`nodevu()`](core.md#nodevuoptions) returns.
  The largest export.

## `static.releases`

- Type: {Object} The [`releases`](core.md#linereleases) of each release line,
  such as `releases.v17['v17.6.0']`.

## `static.security`

- Type: {Object} The [`security`](core.md#linesecurity) object of each
  release line.

## `static.support`

- Type: {Object} The [`support`](core.md#linesupport) object of each release
  line. A line the release schedule doesn't list has none.

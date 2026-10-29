---
title: '@nodevu/aliases'
---

# `@nodevu/aliases`

<!--source_link=aliases/index.js-->

The names of the ranges of Node.js release lines that
[`@nodevu/ranges`](ranges.md) works out.

```bash
npm install @nodevu/aliases
```

The module exports an array of them:

```js
const aliases = require('@nodevu/aliases');

aliases.includes('lts/active'); // true
```

## `aliases`

- Type: {string[]}

Every alias, in this order:

- `'alpha'`: the release line in its Alpha phase, if any. Starting with
  Node.js 27, each line gets Alpha releases (`vN.0.0-alpha.X.Y.Z`) before
  its first Current release.
- `'current'`: the Current release line.
- `'lts/latest'`: the LTS release line in its LTS phase, before
  maintenance.
- `'lts/active'`: the LTS release lines in their LTS or maintenance phase,
  so `'lts/latest'` and `'lts/maintenance'` together.
- `'lts/maintenance'`: the LTS release lines in their maintenance phase.
- `'eol'`: the release lines past their end of life.
- `'all'`: every release line.

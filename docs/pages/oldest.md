---
title: '@nodevu/oldest'
---

# `@nodevu/oldest`

<!--source_link=oldest/index.js-->

Finds the oldest LTS or security release of a Node.js release line.

```bash
npm install @nodevu/oldest
```

Pass it the name of a release line:

```js
const { lts, security } = require('@nodevu/oldest');

await lts('v16'); // '16.13.0'
await security('v16'); // '16.4.1'
```

Every function fetches fresh data through [`@nodevu/core`](core.md), and
fulfills with `undefined` when there's no such release: the line has no LTS
releases (like `v25` or `v0.10`), no security releases (like `v5`), or
doesn't exist (like `v999`). [`@nodevu/newest`](newest.md) finds the newest
ones.

## `oldest(name, type[, options])`

- `name` {string} The release line, such as `'v16'` or `'v0.10'`.
- `type` {string} `'lts'` or `'security'`. Any other value fulfills with
  `undefined`.
- `options` {Object} Passed to [`nodevu()`](core.md#nodevuoptions), to set a
  custom `fetch` or `now`.
- Returns: {Promise<string|undefined>} Fulfills with the version, without its
  `v`.

## `lts(name[, options])`

- `name` {string} The release line, such as `'v16'`.
- `options` {Object} Passed to [`nodevu()`](core.md#nodevuoptions).
- Returns: {Promise<string|undefined>} Fulfills with the first release of the
  line flagged as LTS.

Same as `oldest(name, 'lts', options)`.

## `security(name[, options])`

- `name` {string} The release line, such as `'v16'`.
- `options` {Object} Passed to [`nodevu()`](core.md#nodevuoptions).
- Returns: {Promise<string|undefined>} Fulfills with the oldest security
  release of the line.

Same as `oldest(name, 'security', options)`.

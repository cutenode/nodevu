# `@nodevu/newest`

<!--source_link=newest/index.js-->

Finds the newest LTS or security release of a Node.js release line.

```bash
npm install @nodevu/newest
```

Pass it the name of a release line:

```js
const { lts, security } = require('@nodevu/newest');

await lts('v16'); // '16.20.2'
await security('v16'); // '16.20.2'
```

Every function fetches fresh data through [`@nodevu/core`](core.md), and
fulfills with `undefined` when there's no such release: the line has no LTS
releases (like `v25` or `v0.10`), no security releases (like `v5`), or
doesn't exist (like `v999`). [`@nodevu/oldest`](oldest.md) finds the oldest
ones.

## `newest(name, type[, options])`

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
- Returns: {Promise<string|undefined>} Fulfills with the newest LTS release
  of the line.

Same as `newest(name, 'lts', options)`.

## `security(name[, options])`

- `name` {string} The release line, such as `'v16'`.
- `options` {Object} Passed to [`nodevu()`](core.md#nodevuoptions).
- Returns: {Promise<string|undefined>} Fulfills with the newest security
  release of the line.

Same as `newest(name, 'security', options)`.

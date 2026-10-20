# @nodevu/newest

A module that returns newest LTS or Security release of a given Node.js release line.

## Usage

```js
const { newest } = require('@nodevu/newest')

const newestLts = await newest('v16', 'lts')
const newestSecurity = await newest('v16', 'security')
```

```js
const { lts, security } = require('@nodevu/newest')

const newestLts = await lts('v16')
const newestSecurity = await security('v16')
```

## API

This module exports three async functions. Each one resolves to a version string like `16.20.2`, or `undefined` if there isn't one: the release line has no LTS releases (like `v25` or `v0.10`), no security releases (like `v5`), or doesn't exist (like `v999`).

- `newest(name, type, options)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `type` (string): `lts` or `security`.
  - `options` (object, optional): passed straight to [@nodevu/core](../core/), so you can set things like a custom `fetch` or `now`.
- `lts(name, options)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `options` (object, optional): same as above.
- `security(name, options)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `options` (object, optional): same as above.

# @nodevu/newest

A module that returns newest LTS or Security release of a given Node.js release line.

## Usage

```js
const { newest } = require('@nodevu/newest')

const newestLts = newest('v16', 'lts')
const newestSecurity = newest('v16', 'security')
```

```js
const { lts, security } = require('@nodevu/newest')

const newestLts = lts('v16')
const newestSecurity = security('v16')
```

## API

This module exports three functions:

- `newest(name, type)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `type` (string): `lts` or `security`.
- `lts(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
- `security(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
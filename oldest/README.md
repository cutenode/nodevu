# @nodevu/oldest

A module that returns oldest LTS or Security release of a given Node.js release line.

## Usage

```js
const { oldest } = require('@nodevu/oldest')

const oldestLts = oldest('v16', 'lts')
const oldestSecurity = oldest('v16', 'security')
```

```js
const { lts, security } = require('@nodevu/oldest')

const oldestLts = oldest('v16', 'lts')
const oldestSecurity = oldest('v16', 'security')
```

## API

This module exports three functions:

- `oldest(name, type)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `type` (string): `lts` or `security`.
- `lts(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
- `security(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
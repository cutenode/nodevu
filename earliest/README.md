# earliest

A module that returns earliest LTS or Security release of a given Node.js release line.

## Usage

```js
const { earliest } = require('@nodevu/earliest')

const earliestLts = earliest('v16', 'lts')
const earliestSecurity = earliest('v16', 'security')
```

```js
const { lts, security } = require('@nodevu/earliest')

const earliestLts = earliest('v16', 'lts')
const earliestSecurity = earliest('v16', 'security')
```

## API

this module exports three functions

- `earliest(name, type)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
  - `type` (string): `lts` or `security`.
- `lts(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
- `security(name)`
  - `name` (string): Node.js release line name. Examples: `v16`, `v11`, `v8`, `v0.10`.
# @nodevu/aliases

This is a module that provides an array of aliases for ranges of Node.js release lines.

## Usage

```js
const aliases = require('@nodevu/aliases')

for (const alias of aliases) {
  console.log(alias)
}
```

## API

This module returns an `Array` of aliases:

- 'current' - This represents the current Node.js release line.
- 'lts/latest' - This represents the latest LTS release line.
- 'lts/active' - This represents the active LTS release lines.
- 'lts/maintenance' - This represents the maintenance LTS release line, if any.
- 'eol' - This represents the End of Life release lines.
- 'all' - This represents all release lines.
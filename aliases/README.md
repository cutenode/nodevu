# @nodevu/aliases

This is a module that provides an array of aliases for ranges of Node.js release lines.

## Usage

```js
const aliases = require('@nodevu/aliases');

for (const alias of aliases) {
	console.log(alias);
}
```

## API

This module returns an `Array` of aliases:

- 'alpha' - This represents the release line in its Alpha phase, if any. Starting with Node.js 27, each release line gets Alpha releases (`vN.0.0-alpha.X.Y.Z`) before its first Current release.
- 'current' - This represents the current Node.js release line.
- 'lts/latest' - This represents the latest LTS release line.
- 'lts/active' - This represents the active LTS release lines.
- 'lts/maintenance' - This represents the maintenance LTS release line, if any.
- 'eol' - This represents the End of Life release lines.
- 'all' - This represents all release lines.

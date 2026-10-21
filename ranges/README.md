# @nodevu/ranges

a module that provides information about ranges of Node.js versions.

## Usage

```js
const ranges = require('@nodevu/ranges');

async function generateData() {
	const data = await ranges();

	console.log(data); // will be a chunky object!
}
```

## API

### `ranges(filter, options)`

- `filter` (String or Array, optional): one or more aliases from [@nodevu/aliases](../aliases/) to limit the result to. Defaults to `'all'`, which returns every range.
- `options` (Object, optional): passed straight to [@nodevu/core](../core/), so you can set things like a custom `fetch` or `now`.

```js
const data = await ranges('alpha', { now: '2026-12-15' });
```

## Structure

This module will return a medium-sized object with the following structure, with each property being in the context of the range it's under. A field with nothing to point to, like `oldestSecurity` on a release line that hasn't had a security release yet, is `undefined` (and left out of JSON).

- all:
  - versions (Array): An array of versions. Leaves out Alpha releases.
  - newestLts (String): The newest LTS version.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- alpha:
  - versions (Array): An array of the Alpha releases (`vN.0.0-alpha.X.Y.Z`) of the release line in its Alpha phase. Alpha releases only ever show up here, never in the other ranges.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- current:
  - versions (Array): An array of versions.
  - oldestSecurity (String): The oldest security release.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- lts/latest:
  - versions (Array): An array of versions.
  - oldestLts (String): The oldest LTS release.
  - oldestSecurity (String): The oldest security release.
  - newestLts (String): The newest LTS version.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- lts/active:
  - versions (Array): An array of versions.
  - oldestLts (String): The oldest LTS release.
  - oldestSecurity (String): The oldest security release.
  - newestLts (String): The newest LTS version.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- lts/maintenance:
  - versions (Array): An array of versions.
  - oldestLts (String): The oldest LTS release.
  - oldestSecurity (String): The oldest security release.
  - newestLts (String): The newest LTS version.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- eol:
  - versions (Array): An array of versions.
  - newest (String): The newest version.
  - oldest (String): The oldest version.

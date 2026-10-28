# `@nodevu/ranges`

<!--source_link=ranges/index.js-->

Works out ranges of Node.js versions, such as every release of the Current
line or of the active LTS lines, with the newest and oldest releases of each.
The ranges are named by the aliases of [`@nodevu/aliases`](aliases.md).

```bash
npm install @nodevu/ranges
```

Ask for one range, several, or all of them:

```js
const ranges = require('@nodevu/ranges');

const data = await ranges(['current', 'lts/active']);

console.log(data.current.newest);
```

## `ranges([filter[, options]])`

- `filter` {string|string[]} One or more [aliases](aliases.md) to work out.
  **Default:** `'all'`, which works out every range.
- `options` {Object} Passed to [`nodevu()`](core.md#nodevuoptions), to set a
  custom `fetch` or `now`.
- Returns: {Promise<Object>} Fulfills with an object that has a key per
  range, described in [Ranges](#ranges). A range with no releases is left
  out.

Rejects with an {Error} when `filter` holds an unknown alias, or is neither a
string nor an array.

```js
const data = await ranges('alpha', { now: '2026-12-15' });
```

## Ranges

Each range has the versions in it, newest first, and the newest and oldest
of them. A field with nothing to point to, like `oldestSecurity` on a line
that hasn't had a security release, is `undefined`, and left out of JSON.

The releases in `versions`, and `newest`, `oldest`, `newestLts`, and
`newestSecurity` in the `all` range, are versions with a `v`, such as
`'v20.18.0'`. The other LTS and security fields come from
[`@nodevu/core`](core.md#linesupport), without one, such as `'20.9.0'`.

### `data.all`

- Type: {Object}
  - `versions` {string[]} Every release, except Alpha releases.
  - `newestLts` {string} The newest LTS release.
  - `newestSecurity` {string} The newest security release.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data.alpha`

- Type: {Object}
  - `versions` {string[]} The Alpha releases (`vN.0.0-alpha.X.Y.Z`) of the
    line in its Alpha phase. Alpha releases are only ever in this range.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data.current`

- Type: {Object}
  - `versions` {string[]} The releases of the Current line.
  - `oldestSecurity` {string} The oldest security release of the line.
  - `newestSecurity` {string} The newest security release of the line.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data['lts/latest']`

- Type: {Object}
  - `versions` {string[]} The LTS releases of the line in its LTS phase.
  - `oldestLts` {string} The first LTS release of the line.
  - `oldestSecurity` {string} The oldest security release of the line.
  - `newestLts` {string} The newest LTS release of the line.
  - `newestSecurity` {string} The newest security release of the line.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data['lts/active']`

- Type: {Object}
  - `versions` {string[]} The releases of `lts/latest`, then those of
    `lts/maintenance`.
  - `oldestLts` {string} The `oldestLts` of `lts/maintenance`.
  - `oldestSecurity` {string} The `oldestSecurity` of `lts/maintenance`.
  - `newestLts` {string} The `newestLts` of `lts/latest`.
  - `newestSecurity` {string} The `newestSecurity` of `lts/latest`.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data['lts/maintenance']`

- Type: {Object}
  - `versions` {string[]} The LTS releases of the lines in their maintenance
    phase.
  - `oldestLts` {string} The first LTS release of the oldest line.
  - `oldestSecurity` {string} The oldest security release of the oldest line.
  - `newestLts` {string} The newest LTS release of the newest line.
  - `newestSecurity` {string} The newest security release of the newest line.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

### `data.eol`

- Type: {Object}
  - `versions` {string[]} The releases of the lines past their end of life.
  - `newest` {string} The newest release.
  - `oldest` {string} The oldest release.

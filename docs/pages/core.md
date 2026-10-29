# `@nodevu/core`

<!--source_link=core/index.js-->

The core, online-only module of nodevu. It fetches the Node.js release index
and release schedule, then merges them into one object keyed by release line,
adding what it can work out from dates and release flags: the current phase of
each line, its newest and oldest LTS and security releases, and the files each
release ships.

```bash
npm install @nodevu/core
```

Then call it for the data:

```js
const nodevu = require('@nodevu/core');

const data = await nodevu();

console.log(data.v20.support.codename); // 'Iron'
```

## `nodevu([options])`

- `options` {Object}
  - `fetch` {Function} The `fetch` implementation to request the data with.
    **Default:** `globalThis.fetch`.
  - `now` {string} An ISO 8601 date to work out each release line's phase
    against. A Luxon `DateTime` works too. Mostly useful for tests.
    **Default:** `DateTime.now()` from [Luxon](https://moment.github.io/luxon/).
  - `urls` {Object}
    - `index` {string} The full URL of the release index.
      **Default:** `'https://nodejs.org/dist/index.json'`.
    - `schedule` {string} The full URL of the release schedule.
      **Default:** `'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'`.
- Returns: {Promise<Object>} Fulfills with an object that has a key per
  release line, newest first, such as `v22`, or `v0.10` for the `0.x` lines. Each value is
  described in [Release lines](#release-lines).

This is the module's only export. The result is large: every release Node.js
has published, with its dependencies and files. To read it without a network
request, use [`@nodevu/static`](static.md).

## Release lines

Each release line in the result has `releases` and `security`, and `support`
when the release schedule lists the line.

### `line.releases`

- Type: {Object}

Every release in the line, newest first, keyed by version, such as `v17.6.0`.
Each value is described in [Releases](#releases).

### `line.support`

- Type: {Object} Only present when the release schedule has a start date for
  the line.
  - `codename` {string} The LTS codename, such as `'Iron'`. Only present on
    lines that have one.
  - `lts` {Object} Only present when the schedule has an LTS date for the
    line, or the index flags one of its releases as LTS.
    - `newest` {string} The newest LTS release, such as `'20.18.0'`. Usually
      the newest release in the line.
    - `oldest` {string} The first release flagged as LTS.
  - `phases` {Object}
    - `dates` {Object} The start date of each phase, such as `'2021-04-20'`.
      A phase the line doesn't have is left out.
      - `alpha` {string} The Alpha phase, before the first Current release.
      - `start` {string} The Current phase.
      - `lts` {string} The LTS phase.
      - `maintenance` {string} The maintenance phase.
      - `end` {string} The end of support.
    - `current` {string|Object} The phase the line is in on `now`: `'alpha'`,
      `'start'`, `'lts'`, `'maintenance'`, or `'end'`. An empty object when no
      phase has started yet.

### `line.security`

- Type: {Object}
  - `all` {string[]} Every security release in the line, newest first, such
    as `['17.7.2', '17.3.1']`.
  - `newest` {string} The newest security release. Not present when the line
    has none.
  - `oldest` {string} The oldest security release. Not present when the line
    has none.

## Releases

Each release in [`line.releases`](#linereleases) has these properties.

### `release.semver`

- Type: {Object}
  - `raw` {string} The version without its `v`, such as `'17.6.0'`.
  - `major` {number} The major version.
  - `minor` {number} The minor version.
  - `patch` {number} The patch version.
  - `line` {string} The name of the release line, such as `'v17'`.

### `release.releaseDate`

- Type: {string} The release date, such as `'2022-02-22'`.

### `release.modules`

- Type: {Object}
  - `version` {string} The ABI version, which decides whether a compiled
    native addon loads without being rebuilt.

### `release.dependencies`

- Type: {Object} The versions of the dependencies bundled with the release.
  One the index doesn't list is `undefined`.
  - `npm` {string}
  - `v8` {string}
  - `uv` {string} libuv.
  - `zlib` {string}
  - `openssl` {string}

### `release.files`

- Type: {Object}
  - `available` {string[]} The file identifiers the index lists, such as
    `'linux-x64'` or `'win-x64-msi'`.
  - `links` {Object} The files of each identifier, grouped by type: `aix`,
    `headers`, `linux`, `macos`, `source`, `sunos`, and `windows`. Only the
    types the release has are present. Each one is an array of the objects
    [`@nodevu/parsefiles`](parsefiles.md) returns, without their `type`:
    - `id` {string} The identifier, such as `'linux-x64'`.
    - `files` {string[]} The file names for the identifier.
    - `architecture` {string} The architecture, such as `'x64'`.

### `release.lts`

- Type: {Object}
  - `isLts` {boolean} Whether the index flags the release as LTS.

### `release.alpha`

- Type: {Object}
  - `isAlpha` {boolean} Whether the release is an Alpha release, such as
    `v27.0.0-alpha.0.0.0`.

### `release.security`

- Type: {Object}
  - `isSecurity` {boolean} Whether the index flags the release as a security
    release.

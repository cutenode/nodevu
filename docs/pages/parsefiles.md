# `@nodevu/parsefiles`

<!--source_link=parsefiles/index.js-->

Parses an identifier from the `files` of a release in the
[Node.js release index](https://nodejs.org/dist/index.json), such as
`linux-x64` or `osx-arm64-tar`, into the file names it stands for, its
platform, and its architecture. [`@nodevu/core`](core.md) uses it for
[`release.files`](core.md#releasefiles).

```bash
npm install @nodevu/parsefiles
```

Pass it an identifier and the version it belongs to:

```js
const parsefiles = require('@nodevu/parsefiles');

parsefiles('linux-x64', '17.6.0');
// {
//   id: 'linux-x64',
//   files: ['node-v17.6.0-linux-x64.tar.gz', 'node-v17.6.0-linux-x64.tar.xz'],
//   type: 'linux',
//   architecture: 'x64',
// }
```

## `parsefiles(file, version)`

- `file` {string} An identifier from the release's `files`, such as
  `'win-x64-msi'`.
- `version` {string} The release's version, without its `v`, such as
  `'17.6.0'`.
- Returns: {Object}
  - `id` {string} The identifier passed in.
  - `files` {string[]} The file names that should exist for the identifier.
    There's often more than one.
  - `type` {string} The platform, or what kind of files these are: `'aix'`,
    `'headers'`, `'linux'`, `'macos'`, `'source'`, `'sunos'`, or
    `'windows'`.
  - `architecture` {string} The architecture, such as `'x64'`, `'x86'`,
    `'arm64'`, `'armv7l'`, `'armv6l'`, `'power'`, or `'z'`. Not present for
    identifiers without one, like `'src'` and `'headers'`.

The file names follow the patterns nodejs.org has used so far. New kinds of
identifiers can show up in the index before this module knows them.

# nodevu

<!--type=misc-->

nodevu is a Node.js version utility: it collects, merges, and reasons about
Node.js versions in a way that's developer friendly. It's a set of small
modules, so you install only the ones you need.

```bash
npm install @nodevu/core
```

Then ask it about any release line:

```js
const nodevu = require('@nodevu/core');

const data = await nodevu();

console.log(data.v20.support.lts.newest);
```

## Foundational modules

- [`@nodevu/core`](core.md): the online-only core. It fetches the version
  information Node.js publishes and merges it into one object, adding what it
  can work out from dates and release flags.
- [`@nodevu/static`](static.md): the offline version of core. It ships core's
  data, and a few subsets of it, as JSON that's updated on a schedule.

## Utilities

- [`@nodevu/oldest`](oldest.md): the oldest LTS or security release of a
  release line.
- [`@nodevu/newest`](newest.md): the newest LTS or security release of a
  release line.
- [`@nodevu/ranges`](ranges.md): ranges of Node.js versions, such as every
  release of the active LTS lines.
- [`@nodevu/aliases`](aliases.md): the names of those ranges.
- [`@nodevu/translate`](translate.md): translates the terms the Node.js
  project proposed for the `support` property in `package.json` to aliases.

## Helpers

- [`@nodevu/parsefiles`](parsefiles.md): parses the `files` identifiers of a
  release in the [Node.js release index](https://nodejs.org/dist/index.json)
  into file names.
- [`@nodevu/opt`](opt.md): builds the options `@nodevu/core` takes, with
  their defaults.
- [`@nodevu/fetchindex`](fetchindex.md): fetches the Node.js release index.

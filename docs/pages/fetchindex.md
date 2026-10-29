---
title: '@nodevu/fetchindex'
---

# `@nodevu/fetchindex`

<!--source_link=fetchindex/index.js-->

Fetches the [Node.js release index](https://nodejs.org/dist/index.json), the
list of every Node.js release with its date, bundled dependencies, files, and
LTS and security flags.

```bash
npm install @nodevu/fetchindex
```

It has no defaults, so pass the `fetch` to use and the URL:

```js
const fetchindex = require('@nodevu/fetchindex');

const index = await fetchindex({
	fetch: globalThis.fetch,
	urls: { index: 'https://nodejs.org/dist/index.json' },
});
```

## `fetchindex(options)`

- `options` {Object}
  - `fetch` {Function} The `fetch` implementation to use.
  - `urls` {Object}
    - `index` {string} The full URL of the release index.
- Returns: {Promise<Object[]>} Fulfills with the parsed index, newest release
  first.

[`@nodevu/opt`](opt.md) builds options with both set.

# `@nodevu/opt`

<!--source_link=opt/index.js-->

Builds the options [`@nodevu/core`](core.md) takes, filling in a default for
each one you leave out.

> [!NOTE]
> This module isn't published to npm yet.

Call it with the options to override:

```js
const opt = require('@nodevu/opt');

const options = opt({
	urls: { index: 'https://example.com/index.json' },
});
```

## `opt([options])`

- `options` {Object}
  - `fetch` {Function} The `fetch` implementation to use.
    **Default:** `globalThis.fetch`.
  - `now` {string} An ISO 8601 date, or a Luxon `DateTime`.
    **Default:** `DateTime.now()` from [Luxon](https://moment.github.io/luxon/).
  - `urls` {Object}
    - `index` {string} The full URL of the release index.
      **Default:** `'https://nodejs.org/dist/index.json'`.
    - `schedule` {string} The full URL of the release schedule.
      **Default:** `'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'`.
- Returns: {Object} The same shape, with every field set.

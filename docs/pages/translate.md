---
title: '@nodevu/translate'
---

# `@nodevu/translate`

<!--source_link=translate/index.js-->

Translates the terms of the Node.js Package Maintenance working group's
[package support document](https://github.com/nodejs/package-maintenance/blob/main/docs/PACKAGE-SUPPORT.md)
to the aliases [`@nodevu/ranges`](ranges.md) takes.

> [!NOTE]
> This module isn't published to npm yet.

Pass the result straight to `ranges()`:

```js
const ranges = require('@nodevu/ranges');
const translate = require('@nodevu/translate');

const supported = await ranges(await translate('supported'));
```

## `translate(alias)`

- `alias` {string} A package support term.
- Returns: {Promise<string[]>} Fulfills with the aliases it covers.

Rejects with an {Error} for any other term. The terms translate to:

| Term         | Aliases                                               |
| ------------ | ----------------------------------------------------- |
| `current`    | `['current']`                                         |
| `lts_latest` | `['lts/latest']`                                      |
| `lts`        | `['lts/active', 'lts/maintenance']`                   |
| `supported`  | `['current', 'lts/active', 'lts/maintenance']`        |
| `all`        | `['current', 'lts/active', 'lts/maintenance', 'eol']` |

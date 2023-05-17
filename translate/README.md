# @nodevu/translate

A translation layer to use the terms previously defined by the Node.js Package Maintenance WG's [Package Support document](https://github.com/nodejs/package-maintenance/blob/main/docs/PACKAGE-SUPPORT.md) to terms that can easily be used by [@nodevu/ranges](https://npm.im/@nodevu/ranges).


## Usage

```js
const ranges = require('@nodevu/ranges')
const translate = require('@nodevu/translate')

async function getTranslatedData () {
  // translation for the 'current' Package Support term
  const current = await ranges(await translate('current'))
  
  // translation for the 'lts_latest' Package Support term
  const lts_latest = await ranges(await translate('lts_latest'))
  
  // translation for the 'lts' Package Support term
  const lts = await ranges(await translate('lts'))
  
  // translation for the 'supported' Package Support term
  const supported = await ranges(await translate('supported'))

  // translation for the 'all' Package Support term
  const all = await ranges(await translate('all'))

  // return the data in a single object
  return {
    current,
    lts_latest,
    lts,
    supported,
    all
  }
}

getTranslatedData().then(console.log)
```

## API

- `translate(alias)`
  - `alias` (string): A Node.js Package Support Alias.
  
Possible values for `alias`: 
  - `current`: returns `['current']`
  - `lts_latest`: returns `['lts/latest']`
  - `lts`: returns `['lts/active', 'lts/maintenance']`
  - `supported`: returns `['current', 'lts/active', 'lts/maintenance']`
  - `all`: returns `['current', 'lts/active', 'lts/maintenance', 'eol']`





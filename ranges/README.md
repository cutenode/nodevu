# @nodevu/ranges

a module that provides information about ranges of Node.js versions.

## Usage

```js
const ranges = require('@nodevu/ranges')

async function generateData () {
  const data = await ranges()

  console.log(data) // will be a chunky object!
}
```

## Structure

This module will return a medium-sized object with the following structure, with each property being in the context of the range it's under:

- all:
  - versions (Array): An array of versions.
  - newestLts (String): The newest LTS version.
  - newestSecurity (String): The newest possible security release.
  - newest (String): The newest version.
  - oldest (String): The oldest version.
- current: {
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
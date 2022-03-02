# @nvu/static

Static nvu data. Automatically updated on some kind of schedule.


## Usage

```js
const { default, releases, security, support } = require('@nvu/static')

// each of these is a giant JSON blob. default is most giant, followed by releases. Security and support are relatively small.
console.log(default)
console.log(releases)
console.log(security)
console.log(support)
```

## API

This module has four exports:

- `default` (Object) - the default, full set of data returned by [`@nvu/core`](https://github.com/nvu/core)). 
- `releases` (Object) - only the `releases` properties from the default set of data returned by [`@nvu/core`](https://github.com/nvu/core)), following the same heirarchy.
- `security` - only the `security` properties from the default set of data returned by [`@nvu/core`](https://github.com/nvu/core)), following the same heirarchy.
- `support` - only the `support` properties from the default set of data returned by [`@nvu/core`](https://github.com/nvu/core)), following the same heirarchy.
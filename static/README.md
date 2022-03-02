# @nodevu/static

Static nodevu data. Automatically updated on some kind of schedule.


## Usage

```js
const { default, releases, security, support } = require('@nodevu/static')

// each of these is a giant JSON blob. default is most giant, followed by releases. Security and support are relatively small.
console.log(default)
console.log(releases)
console.log(security)
console.log(support)
```

## API

This module has four exports:

- `default` (Object) - the default, full set of data returned by [`@nodevu/core`](https://github.com/nodevu/core)). 
- `releases` (Object) - only the `releases` properties from the default set of data returned by [`@nodevu/core`](https://github.com/nodevu/core)), following the same heirarchy.
- `security` - only the `security` properties from the default set of data returned by [`@nodevu/core`](https://github.com/nodevu/core)), following the same heirarchy.
- `support` - only the `support` properties from the default set of data returned by [`@nodevu/core`](https://github.com/nodevu/core)), following the same heirarchy.
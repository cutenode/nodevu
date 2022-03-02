# @nodevu/parsefiles

a utility to parse Node.js's files information from distribution metadata into something more useful.

## Usage

```js
const parsefiles = require('./index')

const version = '17.6.0'
const files = ["aix-ppc64","headers","linux-arm64","linux-armv7l","linux-ppc64le","linux-s390x","linux-x64","osx-arm64-tar","osx-x64-pkg","osx-x64-tar","src","win-x64-7z","win-x64-exe","win-x64-msi","win-x64-zip","win-x86-7z","win-x86-exe","win-x86-msi","win-x86-zip"]

files.forEach(file => {
  const data = parsefiles(file, version)
  console.log(data)
})
```

## The Data

When run, `@nodevu/parsefiles` will return an object with the following properties:

- `id` (String) - the identifier (file) that was passed in. Examples: `aix-ppc64`, `linux-x64`, `osx-x64-pkg`, `osx-arm64-tar`, `win-x64-zip`, `src`, `headers`.
- `files` (Array) - an array of filenames that _should_ exist for the release. There are often more than one.
- `type` (String) - indicates either the operating system, or that the files are source/headers, parsed out of the `id`. Examples: `linux`, `macos`, `windows`, `aix`, `sunos`, `source`, `headers`.
- `architecture` (String) - a string that represents the architecture of the files. Examples: `x86`, `x64`, `arm64`, `armv7l`, `armv6l`, `power`, `z`
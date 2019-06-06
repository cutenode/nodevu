# nanoprobe: A nice Node.js Version Utility

A CLI to help better understand the massive amount of information that surrounds Node.js versions.

## Usage

```
nanoprobe [command] [args]

Commands:
  nanoprobe deps <version>        Expose the versions of Node.js's dependencies at a
                            specific version. Defaults to the latest version in
                            an incomplete semver string.
  nanoprobe latest [releaseLine]  List the latest versions of Node.js

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Examples

```bash
nanoprobe deps 12.0.0 ## see a fancy output of deps for v12.0.0
nanoprobe deps 10.15.0 --json ## see the information as JSON
nanoprobe deps 6.12.0 --plain ## see a very plain, human-readable output rather than a fancy one
```

## TODOs

- `nanoprobe secure`
  - tells you if your current Node.js version is secure.
  - ci flag that will `process.exit(0)` if you're not secure.
- `nanoprobe lts`
  - expose LTS data
  - expose LTS EOL if possible?
- Tests
- Better README.md
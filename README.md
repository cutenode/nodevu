# nvu: Node.js Version Utility

A CLI to help better understand the massive amount of information that surrounds Node.js versions.

## Usage

```
nvu [command] [args]

Commands:
  nvu deps <version>        Expose the versions of Node.js's dependencies at a
                            specific version. Defaults to the latest version in
                            an incomplete semver string.
  nvu latest [releaseLine]  List the latest versions of Node.js

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Examples

```bash
nvu deps 12.0.0 ## see a fancy output of deps for v12.0.0
nvu deps 10.15.0 --json ## see the information as JSON
nvu deps 6.12.0 --plain ## see a very plain, human-readable output rather than a fancy one
```

## TODOs

- `nvu secure`
  - tells you if your current Node.js version is secure.
  - ci flag that will `process.exit(0)` if you're not secure.
- `nvu lts`
  - expose LTS data
  - expose LTS EOL if possible?
- Tests
- Better README.md
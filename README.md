# nanoprobe: A nice Node.js Version Utility

A CLI to help better understand the massive amount of information that surrounds Node.js versions.

## Usage

```text
nanoprobe [command] [args]

Commands:
  nanoprobe deps <version>        Expose the versions of Node.js's dependencies
                                  at a specific version. Defaults to the latest
                                  version in an incomplete semver string.
  nanoprobe latest [releaseLine]  List the latest versions of Node.js
  nanoprobe safe [version]        Lets  you know whether or not you are running
                                  a version of Node.js with zero known
                                  vulnerabilities

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```

## Examples

### nanoprobe deps

```bash
nanoprobe deps 12.0.0 # see a fancy output of deps for v12.0.0
nanoprobe deps 10.15.0 --json # see the information as JSON
nanoprobe deps 6.12.0 --plain # see a very plain, human-readable output rather than a fancy one
```

### nanoprobe latest

```bash
nanoprobe latest
nanoprobe latest 9
nanoprobe latest --json # see the information as JSON
nanoprobe latest --ci # exits as a 1 or a 0
```

### nanoprobe safe

```bash
nanoprobe safe
nanoprobe safe v9
nanoprobe safe v10.14
nanoprobe safe 12.14.0
nanoprobe safe --json # JSON output of the vulnerability data, if any
nanoprobe safe --ci # exits 0 or 1 depending on if there are or are not vulnerabilities, respectively
nanoprobe safe --plain # plain (rather than formatted) human-readable output
```

## TODOs

- [x] `nanoprobe safe`
  - [x] tells you if your current Node.js version is secure.
  - [x] ci flag that will `process.exit(0)` if you're not secure.
- [ ] `nanoprobe lts`
  - [ ] expose LTS data
  - [ ] expose LTS EOL if possible?
- [ ] Improve consistency
  - [ ] Make version passing consistent (currently `latest` and `safe` have different requirements for version arguments)
- [ ] Tests
- [ ] Better README.md

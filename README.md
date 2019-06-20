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
nanoprobe latest # will return the most recent Currrent release
nanoprobe latest 10 # will return the latest release in the Node.js v10.x release line
nanoprobe latest --json # see the information as JSON
nanoprobe latest --ci # exits as a 1 or a 0
```

### nanoprobe safe

```bash
nanoprobe safe # will tell you if you're currently running a safe version of Node.js or not
nanoprobe safe v9
nanoprobe safe v10.14
nanoprobe safe 10.14.0 ## will tell you if node@10.14.0 is safe
nanoprobe safe --json # JSON output of the vulnerability data, if any
nanoprobe safe --ci # exits 0 or 1 depending on if there are or are not vulnerabilities, respectively
nanoprobe safe --plain # plain (rather than formatted) human-readable output
```

## TODOs

- [x] `nanoprobe safe`
  - [x] tell you if your current Node.js version is secure.
  - [x] add ci flag that will `process.exit(0)` if you're not secure.
  - [ ] add flag that allows you to pass a version or array of security releases to ignore
    - [ ] should only change the exit code, and should still warn that you are running insecure versions.
- [ ] make all data exposed by commands consumable if the module is `require()`'d
  - we will likely want to split out an underlying module and then make the CLI consume the module
- [ ] `nanoprobe lts`
  - [ ] expose LTS data
  - [ ] expose LTS EOL if possible?
- [ ] `nanoprobe update`
  - [ ] print all ways to update to the latest version of the Node.js release line you're using
  - [ ] pass a flag that allows you to filter output
    - for example, `nanoprobe update --type=docker`/`nanoprobe update --type=nvm` or `nanoprobe update --docker`/`nanoprobe update --nvm`
- [ ] crerate helper that parses the version we're checking in various commands
  - returns an object that includes various acceptable inputs (`v12.1.0`, `12.1.0`) as well as all semver ranges that apply and their varients (`v12.1`, `12.1`, `v12`, `12`)
    - this would allow us to remove our `require` of `semver` in both deps and safe, in addition to future commands.
  - could also parse keywords like `latest`, `current`, and possibly `lts`
- [x] Improve consistency
  - [x] Make version passing consistent (currently `latest` and `safe` have different requirements for version arguments)
- [ ] Find a way test every command and every flag by _running_ them as a part of our tests
- [ ] Add `// @ts-check` to all code files and resolve problems if they exist.
- [ ] Tests
- [ ] Better README.md

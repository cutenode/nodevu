# @nvu/core

The core, online-only utility of nvu.

## Usage

```js
const nvu = require('@nvu/core')

async function getData() {
    const data = await nvu() // returns a lot of data!
}
```

## The Data

The data returned by this module follows a pretty specific structure. Here's a detailing of that structure:

- Everything is within a top level Object.
  - Every key in the object is a semver major release line name with a 'v' prefix. Example: `v17`. Every value is an Object with the following properties:
    - `releases` (Object) - an Object that is filled with all releases under the release line:
      - Every key in the object is a full Node.js release name. Example: `v17.6.0`. Every value is an Object with the following properties:
        - `semver` (Object) - a small object that gives semver information:
          - `raw` (String) - the whole, raw version.
          - `major` (String) - the semver major number.
          - `minor` (String) - the semver minor number.
          - `patch` (String) - the semver patch number.
          - `line` (String) - the "name" of the release line.
        - `dependencies` (Object) - the bundled dependencies in this version of Node.js:
          - `npm` (String) - version of the bundled npm. 
          - `v8` (String) - version of the bundled v8.
          - `uv` (String) - version of the bundled libuv.
          - `zlib` (String) - version of the bundled zlib.
          - `openssl` (String) - version of the bundled openssl.
        - `files` (Object) - an Object that provides context on the files available for the given release:
          - `available` (Array) - the available files, as listed by the official [dist file](https://nodejs.org/dist/index.json). Every entry will be a String.
          - `links` (Object) - an object of the different potential links:
            - `aix` (Array) - all AIX links (AIX is an IBM platform) links:
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - an array of associated filenames for the ID.
              - `architecture` (String) - the name of the architecture for the files in `files`.
            - `headers` (Array) - all links to headers for the build:
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - an array of associated filenames for the ID.
              - `architecture` (String) - the name of the architecture for the files in `files`.
            - `linux` (Array) - all the links to Linux distributions for the build:
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - an array of associated filenames for the ID.
              - `architecture` (String) - the name of the architecture for the files in `files`.
            - `macos` (Array):
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - an array of associated filenames for the ID.
              - `architecture` (String) - the name of the architecture for the files in `files`.
            - `source` (Array):
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - an array of associated filenames for the ID.
              - `architecture` (String) - the name of the architecture for the files in `files`.
            - `windows` (Array): 
              - `id` (String) - the initial identifier from `available` that was passed in.
              - `files` (Array) - An array of associated filenames for the ID.
              - `architecture` (String) - The name of the architecture for the files in `files`.
        - `lts` (Object):
          - `isLts`(Boolean) - `true` if the release is an LTS release, `false` if it's not.
        - `security` (Object):
          - `isSecurity` (Boolean) - `true` if the release is a security release, `false` if it's not.
    - `support` (Object) - An Object to provide information about the project's support of the given release line, including dates, status, LTS codename, and LTS version info:
      - `codename` (String) - **Only present if applicable to the given release.** A string of the LTS release line's codename. 
      - `lts` (Object) - **Only present if applicable to the given release.** An object that provides LTS versioning information.
        - `newest` (String) - The newest release in the release line that is LTS. _Usually_, this will be the latest release in the line.
        - `oldest` (String) - **Only present if applicable to the given release.** The oldest (first) release in the release line that was flagged as LTS.
      - `phases` (Object) - Start dates for each phase of a release line's lifecycle:
        - `start` (String) - The start date of the release line (releases in this phase are `current`). Example: `2021-04-20`.
        - `lts` (String) - **Only present if the release line is an LTS release.** The start date of the LTS lifecycle (releases in this phase are `lts`). Example: `2021-10-26`. 
        - `maintenance` (String) - **Only present if the release line is an LTS release.** The start date of the maintenance phase of the lifecycle. Example: `2022-10-18`.
        - `end` (String) - the date the release line is no longer supported. Example: `2024-04-30`.
    - `security` (Object):
      - `all` (Array) - an array of _all_ security releases in the release line.
      - `newest` (String) - the newest (most recent) security release. Example: `17.3.1`.
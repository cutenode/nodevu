const { fetch } = require('undici')
const { DateTime } = require('luxon')
const semver = require('semver')
const parsefiles = require('@nodevu/parsefiles')

async function core () {
  const rawVersions = await fetch('https://nodejs.org/dist/index.json')
  const rawSchedule = await fetch('https://raw.githubusercontent.com/nodejs/Release/master/schedule.json')
  const versions = await rawVersions.json()
  const schedule = await rawSchedule.json()
  const now = DateTime.now()
  const data = {}

  Object.keys(versions).map(async (version) => {
    const versionSemver = semver.coerce(versions[version].version)
    const name = versionSemver.major !== 0 ? `v${versionSemver.major}` : `v${versionSemver.major}.${versionSemver.minor}`

    // define the shape of the object we're going to use
    if (!data[name]) {
      data[name] = {}
    }

    if (!data[name].releases) {
      data[name].releases = {}
    }

    data[name].releases[`v${versionSemver.version}`] = {}

    // define semver object
    const semverToReturn = {
      raw: versionSemver.raw,
      major: versionSemver.major,
      minor: versionSemver.minor,
      patch: versionSemver.patch,
      line: name
    }

    data[name].releases[`v${versionSemver.version}`].semver = semverToReturn

    // define the dependencies object
    data[name].releases[`v${versionSemver.version}`].dependencies = {}

    data[name].releases[`v${versionSemver.version}`].dependencies.npm = versions[version].npm ?? undefined
    data[name].releases[`v${versionSemver.version}`].dependencies.v8 = versions[version].v8 ?? undefined
    data[name].releases[`v${versionSemver.version}`].dependencies.uv = versions[version].uv ?? undefined
    data[name].releases[`v${versionSemver.version}`].dependencies.zlib = versions[version].zlib ?? undefined
    data[name].releases[`v${versionSemver.version}`].dependencies.openssl = versions[version].openssl ?? undefined

    // surface file information
    data[name].releases[`v${versionSemver.version}`].files = {}

    // TODO: parse versions[version].files and convert them to URLs that can be directly accessed
    data[name].releases[`v${versionSemver.version}`].files.available = versions[version].files ?? undefined
    const availableShorthand = data[name].releases[`v${versionSemver.version}`].files.available // since we're going to be writing this a lot for assignments, it's nice to have shorthand for readability

    data[name].releases[`v${versionSemver.version}`].files.links = {}
    const linksShorthand = data[name].releases[`v${versionSemver.version}`].files.links // since we're going to be writing this a lot for assignments, it's nice to have shorthand for readability

    Object.keys(availableShorthand).forEach(filename => {
      const id = data[name].releases[`v${versionSemver.version}`].files.available[filename]
      const parsedFile = parsefiles(id, versionSemver.version)

      if (!linksShorthand[parsedFile.type]) {
        linksShorthand[parsedFile.type] = []
      }

      linksShorthand[parsedFile.type].push({
        id: parsedFile.id,
        files: parsedFile.files,
        architecture: parsedFile.architecture
      })
    })

    // # LTS
    // ## define the release-line specific support objec`t
    if (schedule[name]?.start !== undefined) { // hack-y way to skip this logic on releases that don't have a listed start
      if (!data[name].support) { // check to see if we've already written it. if we have, we don't need to waste time on it.
        data[name].support = {}
        data[name].support.codename = schedule[name]?.codename ?? undefined
        data[name].support.lts = schedule[name]?.lts ? {} : undefined

        // run this the first time we start working on the support object,
        // since that will be the newest version
        if (versions[version].lts) {
          data[name].support.lts.newest = versionSemver.version
        }

        data[name].support.phases = {}
        data[name].support.phases.dates = {}
        data[name].support.phases.dates.start = schedule[name]?.start ?? undefined
        data[name].support.phases.dates.lts = schedule[name]?.lts ?? undefined
        data[name].support.phases.dates.maintenance = schedule[name]?.maintenance ?? undefined
        data[name].support.phases.dates.end = schedule[name]?.end ?? undefined
      }
      data[name].support.phases.current = await determineCurrentReleasePhase(now, data[name].support.phases.dates) ?? {}
    }

    // this is a slightly inefficient way to do this but it's also easy
    //
    // tl;dr we're just assigning this every single iteration and the last
    // iteration will be the oldest version, since we're going from newest
    // to oldest
    if (versions[version].lts) {
      data[name].support.lts.oldest = versionSemver.version
    }

    // ## define the lts object in each specific version
    data[name].releases[`v${versionSemver.version}`].lts = {}

    data[name].releases[`v${versionSemver.version}`].lts.isLts = !!versions[version].lts

    // # Security
    // ## define the release-line specific security object
    if (!data[name].security) { // check to see if we've already written it. if we have, we don't need to waste time on it.
      data[name].security = {}
      data[name].security.all = []
    }

    // the newest security release, which can be populated on the first run
    if (!data[name].security.newest) {
      if (versions[version].security === true) {
        data[name].security.newest = versionSemver.version
      }
    }

    // same inefficient hack as we do in the LTS 'oldest' logic. ineffecient but gets the job done.
    if (versions[version].security === true) {
      data[name].security.oldest = versionSemver.version
    }

    // throw the current loop's iteration into the security.all array if it's a security release
    if (versions[version].security === true) {
      data[name].security.all.push(versionSemver.version)
    }

    // ## define the security object in each specfic version
    data[name].releases[`v${versionSemver.version}`].security = {}

    data[name].releases[`v${versionSemver.version}`].security.isSecurity = versions[version].security ?? false
  })

  return data
}

async function determineCurrentReleasePhase (now, dates = {}) {
  // here we figure out if the dates for each release line passed is in the past or future
  // `true` is in the past
  // `false` is in the future
  const isoified = {
    start: isInPast(DateTime.fromISO(dates.start).diffNow().toMillis()) ?? undefined,
    lts: isInPast(DateTime.fromISO(dates.lts).diffNow().toMillis()) ?? undefined,
    maintenance: isInPast(DateTime.fromISO(dates.maintenance).diffNow().toMillis()) ?? undefined,
    end: isInPast(DateTime.fromISO(dates.end).diffNow().toMillis()) ?? undefined
  }

  // set up our result to return
  let result

  // iterate over the past/future object and set the above variable to whatever the first date is in the future.
  Object.keys(isoified).forEach(async (phase) => {
    // since we're looping, the last true is the current phase
    // since the start date will always be in the past
    if (isoified[phase] === true) {
      result = phase
    }
  })

  return result
}

// super hacky tool to convert our weird DateTime tooling into a boolean
// specifically consumes the following:
//
// DateTime.fromISO(DATE).diffNow().toMillis()
//
// where DATE is your date value
function isInPast (number) {
  const sign = Math.sign(number)
  if (sign === -1 || sign === 0) {
    return true
  } else if (sign === 1) {
    return false
  } else {
    return undefined
  }
}

module.exports = core

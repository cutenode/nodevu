const { fetch } = require('undici')
const { DateTime } = require('luxon')
const semver = require('semver')

async function inver() {
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
    if(!data[name]) { 
      data[name] = {}
    }

    if(!data[name].releases) {
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
    
    // # LTS
    // ## define the release-line specific support object
    if (!data[name].support) { // check to see if we've already written it. if we have, we don't need to waste time on it.
      data[name].support = {}
      data[name].support.codename = schedule[name]?.codename ?? undefined

      data[name].support.phases = {}
      data[name].support.phases.start = schedule[name]?.start ?? undefined
      data[name].support.phases.lts = schedule[name]?.lts ?? undefined
      data[name].support.phases.maintenance = schedule[name]?.maintenance ?? undefined
      data[name].support.phases.end = schedule[name]?.end ?? undefined
      await determineCurrentReleasePhase(data[name].support.phases)
  
      // WIP:
      // - newest
      // - oldest
      // - phase
    }

    // ## define the lts object in each specific version
    data[name].releases[`v${versionSemver.version}`].lts = {}

    data[name].releases[`v${versionSemver.version}`].lts.isLts = versions[version].lts ? true : false

    // # Security
    // define the release-line specific security object
    if (!data[name].security) { // check to see if we've already written it. if we have, we don't need to waste time on it.
      data[name].security = {}
      if(!data[name].security.newest) {
        // the newest security release, which can be populated on the first run
        data[name].security.newest = versionSemver.version
      }

      if(!data[name].security.all) {
        // the newest security release, which can be populated on the first run
        data[name].security.all = []
      }

      data[name].security.all.push(versionSemver.version)
    } else {
      // add every other sevurity release to the 'all' array after the first time we encoutner one
      data[name].security.all.push(versionSemver.version)
    }
    // ## define the security object in each specfic version
    data[name].releases[`v${versionSemver.version}`].security = {}

    data[name].releases[`v${versionSemver.version}`].security.isSecurity = versions[version].security ?? false
    data[name].releases[`v${versionSemver.version}`].security.isLatestSecurityReleaseInLine
  })

  console.log(JSON.stringify(data, null, 2))
}

async function determineCurrentReleasePhase(dates = {}) {
  const isoified = {
    start: await nanCheck(DateTime.fromISO(dates.start)) ?? undefined,
    lts: await nanCheck(DateTime.fromISO(dates.lts)) ?? undefined,
    maintenance: await nanCheck(DateTime.fromISO(dates.maintenance)) ?? undefined,
    end: await nanCheck(DateTime.fromISO(dates.end)) ?? undefined
  }

  return isoified
}

async function nanCheck(DateTimeInstance) {
  if(!isNaN(DateTimeInstance)){
    return DateTimeInstance
  } else {
    return undefined
  }
}
inver()
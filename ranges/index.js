const nodevu = require('@nodevu/core')

// building out the model of what we want to see. not totally necessary,
// but helps reduce the amount of logic that's needed to achieve it dynamically.
// also nice to just be able to see it visually represented :)
const ranges = {
  all: {
    versions: [],
    newestLts: undefined,
    newestSecurity: undefined,
    newest: undefined,
    oldest: undefined
  },
  current: {
    versions: [],
    oldestSecurity: undefined,
    newestSecurity: undefined,
    newest: undefined,
    oldest: undefined
  },
  'lts/latest': {
    versions: [],
    oldestLts: undefined,
    oldestSecurity: undefined,
    newestLts: undefined,
    newestSecurity: undefined,
    newest: undefined,
    oldest: undefined
  },
  'lts/active': {
    versions: [],
    oldestLts: undefined,
    oldestSecurity: undefined,
    newestLts: undefined,
    newestSecurity: undefined,
    newest: undefined,
    oldest: undefined
  },
  'lts/maintenance': {
    versions: [],
    oldestLts: undefined,
    oldestSecurity: undefined,
    newestLts: undefined,
    newestSecurity: undefined,
    newest: undefined,
    oldest: undefined
  },
  eol: {
    versions: [],
    newest: undefined,
    oldest: undefined
  }
}

async function generateRanges () {
  const data = await nodevu()

  for (const line in data) {
    for (const key in data[line].releases) {
      ranges.all.versions.push(key) // put every release into the all array

      if (data[line].releases[key].lts.isLts === true && ranges.all.newestLts === undefined) {
        ranges.all.newestLts = `${key}` // if there's no entries yet and this iteration is an LTS release, push it into the array
      }

      if (data[line].releases[key].security.isSecurity === true && ranges.all.newestSecurity === undefined) {
        ranges.all.newestSecurity = `${key}` // if there's no entries yet and this iteration is an LTS release, push it into the array
      }

      // define current data
      if (data[line].support?.phases.current === 'start') {
        ranges.current.versions.push(key) // add current iteration to the versions array if the phase is `start` which means it'll be current.

        if (ranges.current.oldestSecurity === undefined && ranges.current.newestSecurity === undefined) {
          ranges.current.oldestSecurity = `${data[line].security.oldest}`
          ranges.current.newestSecurity = `${data[line].security.newest}`
        }
      }

      // define lts/latest data
      if (data[line].support?.phases.current === 'lts') {
        // TODO: do we want to include all versions in the release line, even prior to it being minted LTS?
        if (data[line].releases[key].lts.isLts) {
          ranges['lts/latest'].versions.push(key)
        }

        if (ranges['lts/latest'].oldestSecurity === undefined) { // only checking if this one is undefined, since everything else _should_ be undefined if this one is. saves some processing power.
          ranges['lts/latest'].oldestSecurity = `${data[line].security.oldest}`
          ranges['lts/latest'].newestSecurity = `${data[line].security.newest}`
          ranges['lts/latest'].oldestLts = `${data[line].support.lts.oldest}`
          ranges['lts/latest'].newestLts = `${data[line].support.lts.newest}`
        }
      }

      // define lts/maintenance data
      if (data[line].support?.phases.current === 'maintenance') {
        if (data[line].releases[key].lts.isLts) {
          ranges['lts/maintenance'].versions.push(key)
        }

        if (ranges['lts/maintenance'].newestSecurity === undefined && ranges['lts/maintenance'].newestLts === undefined) {
          ranges['lts/maintenance'].newestSecurity = `${data[line].security.newest}`
          ranges['lts/maintenance'].newestLts = `${data[line].support.lts.newest}`
        }

        if (ranges['lts/maintenance'].oldestSecurity !== `${data[line].security.oldest}` || ranges['lts/maintenance'].oldestLts !== `${data[line].support.lts.oldest}`) {
          ranges['lts/maintenance'].oldestSecurity = `${data[line].security.oldest}`
          ranges['lts/maintenance'].oldestLts = `${data[line].support.lts.oldest}`
        }
      }

      if (data[line].support?.phases.current === 'end') {
        ranges.eol.versions.push(key)
      }
    }
  }

  // define lts/active data (doesn't need to be in the loops, since it's basically just a union of lts/latest and lts/maintenance)
  ranges['lts/active'].versions = ranges['lts/latest'].versions.concat(ranges['lts/maintenance'].versions)
  ranges['lts/active'].oldestLts = ranges['lts/maintenance'].oldestLts // the maintenance LTS is the older LTS
  ranges['lts/active'].newestLts = ranges['lts/latest'].newestLts // the latest LTS is the newer LTS
  ranges['lts/active'].oldestSecurity = ranges['lts/maintenance'].oldestSecurity // the maintenance security is the older security
  ranges['lts/active'].newestSecurity = ranges['lts/latest'].newestSecurity // the latest security is the newer security

  // some quick maths for dynamically defining newest and oldest, regardless of what ranges we have.
  for (const alias in ranges) {
    ranges[alias].newest = ranges[alias].versions[0] // set the newest version to the first version in the array
    ranges[alias].oldest = ranges[alias].versions[ranges[alias].versions.length - 1] // set the oldest version to the last version in the array
  }

  return ranges
}

module.exports = generateRanges

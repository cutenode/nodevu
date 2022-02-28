const nvu = require('@nvu/core')
const write = require('../util/writeFile')

async function writeReleases(filename) {
  const data = await nvu()
  releases = {}

  Object.keys(data).forEach(async (version) => {
      releases[version] = data[version].releases
  })
    write('./static/data/releases.json', releases)
}

writeReleases()
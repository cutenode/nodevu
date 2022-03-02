const nodevu = require('@nodevu/core')
const write = require('../util/writeFile')

async function writeReleases (filename) {
  const data = await nodevu()
  const releases = {}

  Object.keys(data).forEach(async (version) => {
    releases[version] = data[version].releases
  })
  write('./static/data/releases.json', releases)
}

writeReleases()

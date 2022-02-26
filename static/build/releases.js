const nvu = require('@nvu/core')
const write = require('../util/writeFile')

async function writeReleases(filename) {
  const data = await nvu()

  Object.keys(data).forEach(async (version) => {
    Object.keys(data[version].releases).forEach(async (release) => {
      write(`./static/data/releases/${release}.json`, data[version].releases[release])
    })
  })
}

writeReleases()
const nvu = require('@nvu/core')
const write = require('../util/writeFile')

async function writeSecurity(filename) {
  const data = await nvu()
  const security = {}

  Object.keys(data).forEach(async (version) => {
      security[version] = data[version].security
  })
  write('./static/data/default.json', security)
}

writeSecurity()
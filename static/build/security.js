const nodevu = require('@nodevu/core')
const write = require('../util/dev/write')

async function writeSecurity (filename) {
  const data = await nodevu()
  const security = {}

  Object.keys(data).forEach(async (version) => {
    security[version] = data[version].security
  })
  write('./static/data/security.json', security)
}

writeSecurity()

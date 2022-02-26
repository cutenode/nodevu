const nvu = require('@nvu/core')
const write = require('../util/writeFile')

async function writeSupport(filename) {
  const data = await nvu()
  const support = {}

  Object.keys(data).forEach(async (version) => {
      support[version] = data[version].support
  })
  write('./static/data/support.json', support)
}

writeSupport()
const nvu = require('@nvu/core')
const write = require('../util/writeFile')

async function writeDefault (filename) {
  const data = await nvu()
  write('./static/data/default.json', data)
}

writeDefault()

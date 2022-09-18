const { writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')

async function write (path, data) {
  const outputJSON = JSON.stringify(data, null, 2)
  const filepath = resolve(path)

  await writeFile(filepath, outputJSON)
}

module.exports = write

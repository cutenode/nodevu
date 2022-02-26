const { writeFile } = require('fs/promises')
const { resolve } = require('path')

async function write(path, data) {
  const outputJSON = JSON.stringify(data, null, 2)
  const filepath = resolve(path)
  
  await writeFile(filepath, outputJSON)
}

module.exports = write
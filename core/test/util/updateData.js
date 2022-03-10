const { fetch } = require('undici')
const { writeFile } = require('fs/promises')
const { resolve } = require('path')

async function update () {
  const rawIndex = await fetch('https://nodejs.org/dist/index.json')
  const rawSchedule = await fetch('https://raw.githubusercontent.com/nodejs/Release/master/schedule.json')
  const index = await rawIndex.json()
  const schedule = await rawSchedule.json()

  write('./test/data/index.json', index)
  write('./test/data/schedule.json', schedule)
}

async function write (path, data) {
  const outputJSON = JSON.stringify(data, null, 2)
  let filepath = resolve(path)
  // hack to let us run this script from the root of the repo as a npm script with workspaces commands
  if (filepath.includes('static/static/')) {
    filepath = filepath.replace('static/static/', 'static/')
  }

  await writeFile(filepath, outputJSON)
}

update()
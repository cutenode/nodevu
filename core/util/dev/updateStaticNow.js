const { DateTime } = require('luxon')
const write = require('./write')

async function updateStaticDateTime () {
  await write('./test/data/static/now.json', JSON.stringify(DateTime.now(), null, 2))
}

updateStaticDateTime()

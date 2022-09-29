const { DateTime } = require('luxon')
const write = require('./write')

async function updateStaticDateTime () {
  write('../../test/data/static/now.json', JSON.stringify(DateTime.now(), null, 2))
}

updateStaticDateTime()
